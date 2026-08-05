"use server";

import { createServerSupabaseClient } from "@/lib";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getSystemSettings } from "@/lib/settings";
import { headers } from "next/headers";

export async function getPaymentDetails(orderId: string) {
  try {
    return await getPaymentDetailsInner(orderId);
  } catch (e) {
    console.error("[getPaymentDetails] Unexpected error:", e);
    return {
      error: e instanceof Error ? e.message : "Could not load payment details",
      data: null,
    };
  }
}

async function getPaymentDetailsInner(orderId: string) {
  const supabase = await createServerSupabaseClient() as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };

  const { data: order, error: orderError } = await supabase
    .from("card_orders")
    .select("id, order_number, amount_usdc, status, network, token")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (orderError || !order) {
    return { error: "Order not found", data: null };
  }

  const { data: networks } = await supabase
    .from("supported_networks")
    .select("*")
    .eq("active", true);

  const { data: receivingWallets } = await supabase
    .from("supported_wallet_addresses")
    .select("*")
    .eq("active", true);

  const { data: tokens } = await supabase
    .from("supported_tokens")
    .select("*")
    .eq("active", true);

  const { data: paymentTx } = await supabase
    .from("payment_transactions")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const settings = await getSystemSettings();
  const payment = settings.payment ?? {};
  const kyc = settings.kyc ?? {};

  return {
    data: {
      order,
      networks: networks ?? [],
      receivingWallets: receivingWallets ?? [],
      tokens: tokens ?? [],
      paymentTx: paymentTx ?? null,
      settings: {
        minAmount: Number(payment.min_payment_amount ?? 10),
        maxAmount: Number(payment.max_payment_amount ?? 100000),
        feePercent: Number(payment.platform_fee_percent ?? 2.5),
        defaultNetwork: String(payment.default_network ?? "polygon"),
        requireKyc: Boolean(kyc.require_kyc),
        tier1Limit: Number(kyc.tier1_limit_usdc ?? 1000),
        tier2Limit: Number(kyc.tier2_limit_usdc ?? 100000),
      },
    },
    error: null,
  };
}

export async function submitPaymentTx(_prev: unknown, formData: FormData) {
  // Never let an unexpected server error surface as a 500 page — always
  // return a structured error the client renders inline.
  try {
    return await submitPaymentTxInner(formData);
  } catch (e) {
    console.error("[submitPaymentTx] Unexpected error:", e);
    return {
      error: e instanceof Error ? e.message : "Something went wrong while submitting your payment. Please try again.",
    };
  }
}

async function submitPaymentTxInner(formData: FormData) {
  let ip = "unknown";
  try {
    ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  } catch {
    // headers unavailable — proceed without rate limiting
  }
  try {
    const { allowed } = await checkRateLimit(ip, "paymentVerify", RATE_LIMITS.paymentVerify);
    if (!allowed) return { error: "Too many requests. Please try again later." };
  } catch {
    // rate limiter unavailable — fail open, never block payments
  }

  const orderId = String(formData.get("orderId") ?? "");
  const txHash = String(formData.get("txHash") ?? "");
  const fromAddress = String(formData.get("fromAddress") ?? "");

  if (!orderId) return { error: "Order ID is required" };
  if (!txHash) return { error: "Transaction hash is required" };

  const supabase = await createServerSupabaseClient() as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: order } = await supabase
    .from("card_orders")
    .select("id, order_number, amount_usdc, user_id, network, token")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (!order) return { error: "Order not found" };

  // Enforce admin-configured payment bounds server-side (ground truth from
  // system_settings, never from the client).
  const settings = await getSystemSettings();
  const payment = settings.payment ?? {};
  const minAmount = Number(payment.min_payment_amount ?? 10);
  const maxAmount = Number(payment.max_payment_amount ?? 100000);
  const amount = Number(order.amount_usdc);
  if (!Number.isFinite(amount) || amount < minAmount) {
    return { error: `This order is below the minimum payment amount (${minAmount} USDC).` };
  }
  if (amount > maxAmount) {
    return { error: `This order exceeds the maximum payment amount (${maxAmount} USDC).` };
  }

  // Resolve the payment configuration (network, token, receiving wallet) so
  // the transaction record is complete for real-time tracking and on-chain
  // verification by the verify-payment edge function.
  const [networkRes, tokenRes, walletRes] = await Promise.all([
    supabase
      .from("supported_networks")
      .select("id")
      .eq("id", order.network)
      .maybeSingle(),
    supabase
      .from("supported_tokens")
      .select("id")
      .eq("symbol", order.token)
      .eq("network_id", order.network)
      .maybeSingle(),
    supabase
      .from("supported_wallet_addresses")
      .select("id")
      .eq("network_id", order.network)
      .eq("active", true)
      .limit(1)
      .maybeSingle(),
  ]);

  if (tokenRes.error) return { error: tokenRes.error.message };
  if (!tokenRes.data?.id) return { error: "Payment token is not configured" };

  // One payment transaction per order (unique on order_id). Re-submitting a
  // transaction hash updates the pending record in place.
  const { error } = await supabase
    .from("payment_transactions")
    .upsert(
      {
        order_id: order.id,
        user_id: order.user_id,
        amount: order.amount_usdc,
        network_id: networkRes.data?.id ?? order.network,
        token_id: tokenRes.data.id,
        receiving_wallet_id: walletRes.data?.id ?? null,
        tx_hash: txHash,
        from_address: fromAddress || null,
        status: "pending",
        confirmations: 0,
      },
      { onConflict: "order_id" },
    );

  if (error) return { error: error.message };

  await supabase
    .from("card_orders")
    .update({ tx_hash: txHash })
    .eq("id", orderId);

  return { success: true, message: "Payment submitted for verification" };
}
