# Edge Functions

> Supabase Edge Functions (Deno) for sensitive server-side logic that must not run in the Next.js server or browser.

---

## Function Inventory

| Function | Purpose | Trigger | Runtime | Verify JWT |
|----------|---------|---------|---------|------------|
| `verify-payment` | On-chain payment verification | API call | Deno | Yes |
| `send-email` | Transactional email dispatch | API call | Deno | Yes |
| `generate-receipt` | PDF receipt generation | API call | Deno | Yes |
| `health-check` | System monitor checks | API call / Cron | Deno | No |
| `cleanup-expired` | Cancel expired pending orders | Cron (future) | Deno | N/A |
| `sync-wallet-status` | Check wallet connection status | Cron (future) | Deno | N/A |

---

## verify-payment

> The most critical function. Verifies on-chain transactions before marking orders as paid.

**File:** `supabase/functions/verify-payment/index.ts`

```ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { createPublicClient, http, parseUnits, formatUnits } from "npm:viem";
import { mainnet, polygon, arbitrum } from "npm:viem/chains";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const ALCHEMY_API_KEY = Deno.env.get("ALCHEMY_API_KEY")!;

interface VerifyRequest {
  payment_id: string;
  tx_hash: string;
}

Deno.serve(async (req: Request) => {
  const { payment_id, tx_hash }: VerifyRequest = await req.json();

  // 1. Get payment record
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data: payment } = await supabase
    .from("payment_transactions")
    .select("*, supported_networks!inner(*), supported_tokens!inner(*)")
    .eq("id", payment_id)
    .single();
  if (!payment) return error("PAYMENT_NOT_FOUND", 404);

  // 2. Get receiving wallet
  const { data: wallet } = await supabase
    .from("supported_wallet_addresses")
    .select("*")
    .eq("id", payment.receiving_wallet_id)
    .single();

  // 3. Check tx_hash not already used (replay protection)
  const { data: existing } = await supabase
    .from("payment_transactions")
    .select("id")
    .eq("tx_hash", tx_hash)
    .neq("id", payment_id);
  if (existing && existing.length > 0) return error("TX_HASH_ALREADY_USED", 409);

  // 4. Get chain and RPC URL
  const transport = http(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`);
  const publicClient = createPublicClient({ chain: mainnet, transport });

  // 5. Get transaction receipt
  const receipt = await publicClient.getTransactionReceipt({ hash: tx_hash as `0x${string}` });
  if (!receipt) return error("TX_NOT_FOUND", 400);

  // 6. Verify confirmations
  const currentBlock = await publicClient.getBlockNumber();
  const confirmations = Number(currentBlock) - Number(receipt.blockNumber);
  if (confirmations < (payment.min_confirmations || 12)) {
    return success("PENDING_CONFIRMATIONS", { confirmations, required: payment.min_confirmations || 12 });
  }

  // 7. Verify token transfer (ERC-20 Transfer log)
  const transferLog = receipt.logs.find(log =>
    log.address.toLowerCase() === payment.supported_tokens.contract_address.toLowerCase()
  );
  if (!transferLog) return error("NO_TRANSFER_EVENT", 400);

  // 8. Decode transfer event
  const from = `0x${transferLog.topics[1].slice(26)}`;
  const to = `0x${transferLog.topics[2].slice(26)}`;
  const value = Number(transferLog.data) / 10 ** payment.supported_tokens.decimals;

  // 9. Verify receiving address and amount
  if (to.toLowerCase() !== wallet!.address.toLowerCase()) return error("WRONG_ADDRESS", 400);
  if (Math.abs(value - Number(payment.amount)) > 0.001) return error("WRONG_AMOUNT", 400);

  // 10. Update payment as confirmed
  await supabase
    .from("payment_transactions")
    .update({
      status: "confirmed",
      tx_hash,
      confirmations,
      block_number: Number(receipt.blockNumber),
      from_address: from,
      to_address: to,
      verified_at: new Date().toISOString(),
    })
    .eq("id", payment_id);

  // 11. Update order to paid
  await supabase
    .from("card_orders")
    .update({ status: "paid", paid_at: new Date().toISOString(), tx_hash })
    .eq("id", payment.order_id);

  // 12. Create notification
  await supabase.from("notifications").insert({
    user_id: payment.user_id,
    type: "payment_confirmed",
    title: "Payment Confirmed",
    message: `Your payment of ${value} ${payment.supported_tokens.symbol} has been confirmed.`,
    related_type: "order",
    related_id: payment.order_id,
  });

  // 13. Audit log
  await supabase.from("audit_logs").insert({
    action: "payment_confirmed",
    target_type: "payment",
    target_id: payment_id,
    details: { tx_hash, confirmations, block_number: Number(receipt.blockNumber) },
  });

  return success("PAYMENT_CONFIRMED", { status: "confirmed", confirmations });
});

function success(message: string, data: any) {
  return new Response(JSON.stringify({ success: true, message, data }), {
    headers: { "Content-Type": "application/json" },
  });
}

function error(message: string, status: number) {
  return new Response(JSON.stringify({ success: false, message }), {
    status, headers: { "Content-Type": "application/json" },
  });
}
```

---

## send-email

> Transactional email via Resend API.

```ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Resend } from "npm:resend";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const resend = new Resend(RESEND_API_KEY);

Deno.serve(async (req) => {
  const { to, subject, template, data } = await req.json();
  const email = await resend.emails.send({
    from: "TWallet Card <noreply@twalletservices.com>",
    to,
    subject,
    template,  // Resend template ID
    data,
  });
  return new Response(JSON.stringify({ success: true, data: email }));
});
```

---

## health-check

> System health monitoring — checks all 9 monitors.

```ts
Deno.serve(async () => {
  const checks = await Promise.all([
    checkApi(),
    checkDatabase(),
    checkAuth(),
    checkStorage(),
    checkBlockchainRPC(),
    checkEmail(),
    checkRealtime(),
  ]);
  const overall = checks.every(c => c.status === "healthy") ? "healthy" : "degraded";
  return new Response(JSON.stringify({ success: true, data: { overall, checks, checked_at: new Date() } }));
});
```

---

## Deployment

```bash
# Deploy all functions
supabase functions deploy verify-payment --no-verify-jwt
supabase functions deploy send-email --no-verify-jwt
supabase functions deploy health-check --no-verify-jwt

# Set secrets
supabase secrets set ALCHEMY_API_KEY=xxx
supabase secrets set RESEND_API_KEY=xxx
supabase secrets set SERVICE_ROLE_KEY=xxx
```

---

## Secrets

| Secret | Used By |
|--------|---------|
| `ALCHEMY_API_KEY` | verify-payment |
| `RESEND_API_KEY` | send-email |
| `SERVICE_ROLE_KEY` | All functions needing Supabase admin |
| `SUPABASE_URL` | All functions |
| `WALLETCONNECT_PROJECT_ID` | verify-wallet (future) |
