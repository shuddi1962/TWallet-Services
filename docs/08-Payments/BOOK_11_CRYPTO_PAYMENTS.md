# Book 11 — Crypto Payments

> **TWallet Services · TWallet Card**
> The complete, implementation-ready specification for the Crypto Payment System — the most critical financial logic in the platform. Covers the full checkout flow, on-chain transaction verification via Supabase Edge Functions, payment state machine, order state transitions, receipt generation, and payment history. The platform never holds customer funds; payments flow directly from the customer's wallet to the configured receiving wallet. The platform verifies; it does not escrow.

---

## Document Control

| Field        | Value                              |
| ------------ | ---------------------------------- |
| Book         | 11 — Crypto Payments               |
| Project      | TWallet Services                   |
| Product      | TWallet Card                       |
| Version      | 1.0.0                              |
| Status       | Approved                           |
| Module       | Crypto Payment System              |
| Architecture | Enterprise                         |
| Domain       | twalletservices.com                |
| Owner        | TWallet Services Team              |
| Created      | 2026-07-21                         |
| Last Updated | 2026-07-21                         |
| Implements   | Book 02 FR-05-001..009, Book 05 SFR-05-001..008, Book 06 §13 |

### Revision History

| Version | Date       | Author                | Notes                                                                    |
| ------- | ---------- | --------------------- | ------------------------------------------------------------------------ |
| 0.1.0   | 2026-07-21 | Engineering Team      | Initial draft (overview, flow, verification, states, OpenCode prompt)    |
| 1.0.0   | 2026-07-21 | Engineering Team      | Approved: implementation-ready spec — Edge Function verification code, payment state machine, Supabase queries, server actions, Zod validation, component tree, edge cases, testing checklist, full OpenCode prompt |

---

## Table of Contents

1. [Business Purpose](#1-business-purpose)
2. [Overview](#2-overview)
3. [Objectives](#3-objectives)
4. [Non-Negotiable Payment Rules](#4-non-negotiable-payment-rules)
5. [Supported Networks (MVP)](#5-supported-networks-mvp)
6. [Supported Tokens](#6-supported-tokens)
7. [Payment Flow](#7-payment-flow)
8. [UI Preview Description](#8-ui-preview-description)
9. [Components Used](#9-components-used)
10. [Component Tree](#10-component-tree)
11. [Database Tables](#11-database-tables)
12. [Supabase Queries](#12-supabase-queries)
13. [Server Actions](#13-server-actions)
14. [Validation Rules](#14-validation-rules)
15. [Checkout Page](#15-checkout-page)
16. [Payment Request](#16-payment-request)
17. [Wallet Approval](#17-wallet-approval)
18. [Blockchain Verification (Edge Function)](#18-blockchain-verification-edge-function)
19. [Order Creation](#19-order-creation)
20. [Transaction Status State Machine](#20-transaction-status-state-machine)
21. [Order Status State Machine](#21-order-status-state-machine)
22. [Payment History](#22-payment-history)
23. [Transaction Details](#23-transaction-details)
24. [Payment Expiration](#24-payment-expiration)
25. [Notifications](#25-notifications)
26. [Admin Features](#26-admin-features)
27. [Security](#27-security)
28. [Edge Cases](#28-edge-cases)
29. [Loading States](#29-loading-states)
30. [Empty States](#30-empty-states)
31. [Error States](#31-error-states)
32. [Success States](#32-success-states)
33. [Accessibility](#33-accessibility)
34. [SEO](#34-seo)
35. [Future Features](#35-future-features)
36. [Acceptance Criteria](#36-acceptance-criteria)
37. [Testing Checklist](#37-testing-checklist)
38. [OpenCode Prompt](#38-opencode-prompt)
39. [Glossary](#39-glossary)
40. [References](#40-references)

---

## 1. Business Purpose

The Crypto Payment System enables customers to securely pay for TWallet Card products using supported cryptocurrencies. This is where revenue starts — every card order is fulfilled only after a verified crypto payment.

### 1.1 Why This Module Exists

- **Revenue collection:** This is the only payment mechanism in the MVP (no fiat rails).
- **Non-custodial by design:** Funds flow directly from the customer's wallet to the platform's configured receiving wallet. The platform never holds, escrows, or touches user funds.
- **Trust through verification:** Every payment is independently verified on-chain before an order is marked paid. No black boxes, no manual confirmation needed.
- **Replay protection:** A transaction can only be used once across all orders (unique constraint on `tx_hash`).

### 1.2 Requirements Tracing

| Book 02 FR    | Description                              | Implemented In |
| ------------- | ---------------------------------------- | -------------- |
| FR-05-001     | Present receiving wallet address + amount per order | §16       |
| FR-05-002     | Accept tx hash submitted by customer     | §13, §15      |
| FR-05-003     | Verify tx on-chain (address, amount, chain, confirmations) | §18 |
| FR-05-004     | Reject already-used transactions (replay protection) | §18, §27 |
| FR-05-005     | Transition order to `paid` only after verification | §18, §19 |
| FR-05-006     | Record payment history per user/order    | §12, §22      |
| FR-05-007     | Support EVM-compatible chains            | §5            |
| FR-05-008     | Never sign or broadcast on behalf of user| §4, §17       |
| FR-05-009     | Require N confirmations before trusting  | §18           |

---

## 2. Overview

The Crypto Payment System enables customers to securely pay for TWallet products using supported cryptocurrencies.

**The platform never holds customer funds.** Funds are transferred directly from the customer's wallet to the configured TWallet Services receiving wallet. The platform:
1. Generates a payment request (receiving address + amount + network).
2. The customer sends the payment from their own wallet.
3. The customer submits the transaction hash.
4. The platform verifies the transaction on-chain.
5. On successful verification, the order transitions to `paid`.

The platform **verifies**; it does not **escrow**. The platform **reads** the blockchain; it does not **sign or broadcast** on behalf of the user.

---

## 3. Objectives

| Objective                          | How Achieved                                              |
| ---------------------------------- | -------------------------------------------------------- |
| Provide secure crypto payments     | On-chain verification via Edge Function (viem + Alchemy).|
| Support multiple blockchain networks | 7 EVM chains (Ethereum, BNB, Polygon, Arbitrum, Optimism, Base, Avalanche). |
| Verify every payment               | Independent on-chain verification (address, amount, chain, confirmations, replay). |
| Prevent duplicate payments         | UNIQUE constraint on tx_hash; replay check in verification. |
| Generate payment receipts          | Payment record with tx hash, amount, chain, verified_at, explorer link. |
| Automatically update order status  | Edge Function transitions order: pending → paid on verification success. |

---

## 4. Non-Negotiable Payment Rules

> These rules are architectural constraints, not preferences. Violating any of them is a critical security incident.

| Rule ID   | Rule                                                              | Enforcement                  |
| --------- | ----------------------------------------------------------------- | ---------------------------- |
| PAY-01    | **Never hold customer funds.** Funds flow directly customer → receiving wallet. | Architecture (no escrow code). |
| PAY-02    | **Never sign or broadcast transactions on behalf of the user.** The user signs in their own wallet. | Architecture (no signing code). |
| PAY-03    | **Never mark an order `paid` without on-chain verification.** Every payment is independently verified. | Edge Function logic. |
| PAY-04    | **Never accept a tx_hash that's already been used.** Replay protection via UNIQUE(tx_hash). | DB constraint + Edge Function check. |
| PAY-05    | **Never store private keys or seed phrases.** Only public addresses are stored. | Schema + lint guard. |
| PAY-06    | **Always verify: correct address, amount, chain, confirmations.** All four checks must pass. | Edge Function logic. |
| PAY-07    | **Always log payment events.** Every verification attempt (success or failure) is logged. | activity_logs + wallet_connections. |
| PAY-08    | **Always require N confirmations.** N is configurable per chain. | Edge Function logic + system_settings. |

---

## 5. Supported Networks (MVP)

| Network           | Chain ID | Symbol | Confirmations (N) | RPC Provider |
| ----------------- | -------- | ------ | ----------------- | ------------ |
| Ethereum          | 1        | ETH    | 12                | Alchemy      |
| BNB Smart Chain   | 56       | BNB    | 20                | Public/Alchemy |
| Polygon           | 137      | MATIC  | 128               | Alchemy      |
| Arbitrum          | 42161    | ETH    | 64                | Alchemy      |
| Optimism          | 10       | ETH    | 64                | Alchemy      |
| Base              | 8453     | ETH    | 64                | Alchemy      |
| Avalanche         | 43114    | AVAX   | 12                | Public/Alchemy |

> Confirmation counts are configurable via `system_settings.crypto_confirmation_blocks` (JSONB per chain).

---

## 6. Supported Tokens

### 6.1 MVP Tokens

| Token | Symbol | Networks                          | Type      |
| ----- | ------ | --------------------------------- | --------- |
| USDC  | USDC   | Ethereum, Polygon, Arbitrum, Optimism, Base, Avalanche | Stablecoin |
| USDT  | USDT   | Ethereum, Polygon, Arbitrum, Optimism, Base, Avalanche | Stablecoin |
| ETH   | ETH    | Ethereum, Arbitrum, Optimism, Base | Native    |
| BNB   | BNB    | BNB Smart Chain                   | Native    |
| MATIC | MATIC  | Polygon                           | Native    |

### 6.2 Future Tokens

| Token | Symbol | Networks    | Version |
| ----- | ------ | ----------- | ------- |
| BTC   | BTC    | (via wrapper)| v2     |
| SOL   | SOL    | Solana      | v3      |
| DAI   | DAI    | EVM chains  | v2      |
| FDUSD | FDUSD  | EVM chains  | v2      |

### 6.3 Token Handling

- **Native tokens (ETH, BNB, MATIC):** Value is in the transaction's `value` field.
- **ERC-20 tokens (USDC, USDT):** Value is in the token transfer event (log); the transaction's `value` is 0.
- The Edge Function must handle both native and ERC-20 transfers (see §18).

---

## 7. Payment Flow

```text
Customer
  ↓
Select Card (/app/order — Book 12)
  ↓
Review Order (/app/order/review)
  ↓
Proceed to Payment (/app/order/payment)
  ↓
Choose Network (from supported_networks)
  ↓
Choose Token (USDC, USDT, ETH, etc.)
  ↓
System generates Payment Request:
  - Order ID
  - Payment amount (in selected token)
  - Receiving wallet address
  - Network / chain ID
  - Expiration time (30 min)
  ↓
Customer sends payment from their wallet (outside platform)
  ↓
Option A: Customer clicks "Pay with [Wallet]" → wallet opens → user signs → tx broadcast
  ↓
Option B: Customer sends manually from any wallet → gets tx hash
  ↓
Customer submits tx hash to platform
  ↓
Backend Verification (Edge Function):
  1. Read tx from blockchain (viem + Alchemy RPC)
  2. Verify tx exists and is confirmed (≥ N confirmations)
  3. Verify recipient == configured receiving address
  4. Verify amount >= order amount
  5. Verify chain_id == expected chain
  6. Verify tx_hash not already linked to another order (replay protection)
  ↓
[if all pass]: Payment Status = Confirmed → Order Status = Paid
  ↓
[if any fail]: Payment Status = Failed → error with reason → retry
  ↓
Order Created → Receipt Generated → Notifications Sent
  ↓
Dashboard Updated → Customer sees success page
```

### 7.1 Key Principle

> The platform **generates a payment request** and **verifies the result**. It does **not** intermediate the payment. The customer's wallet sends directly to the receiving address. The platform is a verifier, not a payment processor.

---

## 8. UI Preview Description

### 8.1 `/app/order/payment` — Payment Page

**Layout (desktop):**
- App layout (sidebar + topbar)
- Centered payment card (max-width 560px)
- Two-column layout on desktop: payment details (left) + wallet/payment action (right)

**Layout (mobile):**
- App layout (bottom tab bar)
- Single column, stacked sections

**Sections:**
1. **Order Summary** — card type, price, network, token
2. **Payment Details** — receiving address (with copy + QR), amount, network badge, expiration timer
3. **Wallet Status** — connected wallet address + network badge (or "Connect Wallet" CTA)
4. **Payment Action** — "Pay with [Wallet]" button OR "I've Sent the Payment" (manual tx hash submission)
5. **Tx Hash Input** — appears after "I've Sent" click; monospace input with paste support
6. **Verification Status** — real-time status while verifying
7. **Terms** — payment terms + trust notice

### 8.2 Trust Elements

- **"Funds go directly to our wallet"** notice — explaining non-custodial flow.
- **"We verify on-chain"** notice — explaining verification process.
- **"Never send to a different address"** warning — preventing phishing.
- **QR code** for the receiving address (easy mobile scanning).

---

## 9. Components Used

| Component              | Source     | Usage in Payment Module                |
| ---------------------- | ---------- | -------------------------------------- |
| `Button`               | Book 04 §11 | Pay, submit tx hash, retry            |
| `Card`                 | Book 04 §13 | Payment details card, order summary   |
| `Input`                | Book 04 §12 | Tx hash input                         |
| `Badge`                | Book 04 §16 | Status badge, network badge, token badge |
| `Alert`                | Book 04 §23 | Error/success/warning messages        |
| `Spinner`              | Book 04 §23 | Verification loading state            |
| `Skeleton`             | Book 04 §23 | Initial page load                     |
| `ProgressBar`          | Book 04 §23 | Confirmation progress (M/N)           |
| `Modal` (Dialog)       | Book 04 §17 | Payment confirmation, error details   |
| `Tooltip`              | Book 04 §17 | Address explanation, gas info         |
| `AddressDisplay`       | Book 10 §8 | Receiving address display             |
| `NetworkBadge`         | Book 10 §8 | Network indicator                     |
| `QRCode`               | Book 10 §8 | Receiving address QR code             |
| `CountdownTimer`       | Custom     | Payment expiration timer              |
| `PaymentSummary`       | Custom     | Order + payment details               |
| `TxHashInput`          | Custom     | Transaction hash input with validation|
| `VerificationStatus`   | Custom     | Real-time verification status         |
| `TrustNotice`          | Book 09 §6 | "We never ask for seed phrase"        |

### 9.1 Custom Components

#### CountdownTimer

```tsx
interface CountdownTimerProps {
  expiresAt: Date;
  onExpire: () => void;
}
// Displays MM:SS countdown
// Turns red when < 5 minutes remaining
// Calls onExpire when timer reaches 0
```

#### PaymentSummary

```tsx
interface PaymentSummaryProps {
  order: { cardProduct: string; cardType: 'physical' | 'virtual'; price: number; currency: string; };
  network: string;
  token: string;
  receivingAddress: string;
  amount: string; // formatted with decimals
  expiresAt: Date;
}
// Displays full payment summary with:
// - Card product + type + price
// - Network badge + token badge
// - Receiving address (AddressDisplay with copy + QR)
// - Amount (monospace, tabular-nums)
// - Expiration countdown
```

#### TxHashInput

```tsx
interface TxHashInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}
// Monospace input for tx hash
// Validates format (0x + 64 hex chars)
// Paste support
// "Submit" button (disabled until valid format)
```

#### VerificationStatus

```tsx
interface VerificationStatusProps {
  status: 'idle' | 'verifying' | 'confirming' | 'confirmed' | 'failed';
  confirmations?: { current: number; required: number };
  error?: { code: string; message: string };
  onRetry?: () => void;
}
// Displays:
// idle: nothing
// verifying: spinner + "Verifying your transaction..."
// confirming: progress bar + "Waiting for confirmations (M/N)..."
// confirmed: green check + "Payment verified!"
// failed: red error + reason + "Submit New Transaction" button
```

---

## 10. Component Tree

### 10.1 Payment Page

```
PaymentPage (Server Component shell)
├── AppLayout
└── PaymentContent (Client Component — uses wagmi + state)
    ├── PageHeader
    │   └── Heading ("Payment")
    ├── PaymentSummary (Card)
    │   ├── OrderSummary
    │   │   ├── CardProductName
    │   │   ├── CardTypeBadge
    │   │   └── Price
    │   ├── NetworkSelector
    │   │   └── NetworkBadge[] (selectable)
    │   ├── TokenSelector
    │   │   └── TokenBadge[] (selectable)
    │   ├── ReceivingAddress
    │   │   ├── AddressDisplay (with copy)
    │   │   └── QRCode
    │   ├── Amount (monospace, large)
    │   └── CountdownTimer
    ├── WalletStatus (Card)
    │   ├── AddressDisplay (user's wallet)
    │   └── NetworkBadge (user's current chain)
    ├── PaymentAction
    │   ├── Button ("Pay with [Wallet]") → triggers wagmi sendTransaction
    │   ├── Divider ("OR")
    │   └── Button ("I've Sent the Payment") → shows TxHashInput
    ├── TxHashInput (conditional)
    │   ├── Input (monospace, tx hash)
    │   └── Button ("Submit for Verification")
    ├── VerificationStatus (conditional)
    │   ├── Spinner / ProgressBar / CheckIcon / ErrorIcon
    │   └── Button ("Submit New Transaction" — on failure)
    ├── TrustNotice
    └── TermsText
```

---

## 11. Database Tables

### 11.1 Tables Used

| Table                   | Purpose in Payment Module              | Book 08 §  |
| ----------------------- | --------------------------------------- | ---------- |
| `payment_transactions`  | Stores verified crypto payment records  | §7.3       |
| `card_orders`           | Orders with state machine; linked to payment | §6.2  |
| `wallets`               | User's connected wallet (for payment)  | §5.1       |
| `payment_addresses`     | Platform's receiving wallet addresses   | §7.2       |
| `supported_networks`    | Network configuration (chain IDs, RPCs) | §7.1       |
| `notifications`         | Payment confirmation/failure notifications | §8.2    |
| `activity_logs`         | Logs payment events                     | §9.2       |
| `card_status_history`   | Order status transition log             | §6.3       |

### 11.2 Key Columns

**payment_transactions** (created when tx hash is submitted, updated on verification):
- `id` = UUID PK
- `profile_id` = FK → profiles
- `wallet_id` = FK → wallets (nullable)
- `network_id` = FK → supported_networks
- `payment_address_id` = FK → payment_addresses
- `amount` = NUMERIC(20,8), CHECK > 0
- `currency` = token symbol (USDC, USDT, ETH, etc.)
- `tx_hash` = TEXT, UNIQUE (replay protection)
- `receiver_wallet` = the receiving address used
- `block_number` = BIGINT (set on confirmation)
- `gas_fee` = NUMERIC(20,8) (set on confirmation)
- `status` = payment_status enum
- `confirmed_at` = TIMESTAMPTZ (set on success)
- `created_at`, `updated_at` = timestamps

**card_orders** (updated on payment success):
- `payment_transaction_id` = FK → payment_transactions (set on verification)
- `status` = order_status (transitions pending → paid)

---

## 12. Supabase Queries

### 12.1 Create Payment Transaction (on tx hash submission)

```ts
async function createPaymentTransaction(
  userId: string,
  orderId: string,
  txHash: string,
  networkId: string,
  walletId: string | null,
  paymentAddressId: string,
  amount: number,
  currency: string
) {
  const supabaseAdmin = createAdminClient();

  // 1. Check tx_hash not already used (replay protection)
  const { data: existing } = await supabaseAdmin
    .from('payment_transactions')
    .select('id, card_order_id')
    .eq('tx_hash', txHash)
    .single();

  if (existing) {
    throw new Error('ALREADY_USED_TX');
  }

  // 2. Create payment transaction (status: pending)
  const { data: payment, error } = await supabaseAdmin
    .from('payment_transactions')
    .insert({
      profile_id: userId,
      wallet_id: walletId,
      network_id: networkId,
      payment_address_id: paymentAddressId,
      amount,
      currency,
      tx_hash: txHash,
      receiver_wallet: receivingAddress,
      status: 'pending',
      created_by: userId,
    })
    .select()
    .single();

  if (error) throw error;

  // 3. Link payment to order
  await supabaseAdmin
    .from('card_orders')
    .update({ payment_transaction_id: payment.id })
    .eq('id', orderId)
    .eq('profile_id', userId);

  return payment;
}
```

### 12.2 Update Payment Status (on verification result)

```ts
async function updatePaymentStatus(
  paymentId: string,
  status: 'confirmed' | 'failed',
  details?: {
    block_number?: bigint;
    gas_fee?: number;
    confirmed_at?: Date;
  }
) {
  const supabaseAdmin = createAdminClient();

  const updateData: any = { status };
  if (status === 'confirmed') {
    updateData.block_number = details?.block_number?.toString();
    updateData.gas_fee = details?.gas_fee;
    updateData.confirmed_at = details?.confirmed_at?.toISOString() || new Date().toISOString();
  }

  const { error } = await supabaseAdmin
    .from('payment_transactions')
    .update(updateData)
    .eq('id', paymentId);

  if (error) throw error;
}
```

### 12.3 Transition Order to Paid (on verification success)

```ts
async function transitionOrderToPaid(orderId: string, paymentId: string, adminId?: string) {
  const supabaseAdmin = createAdminClient();

  // 1. Update order status
  const { error: orderError } = await supabaseAdmin
    .from('card_orders')
    .update({
      status: 'paid',
      updated_by: adminId || null, // null for system-initiated
    })
    .eq('id', orderId)
    .eq('status', 'pending'); // guard: only transition from pending

  if (orderError) throw orderError;

  // 2. Log status history
  await supabaseAdmin
    .from('card_status_history')
    .insert({
      card_order_id: orderId,
      previous_status: 'pending',
      new_status: 'paid',
      changed_by_type: adminId ? 'admin' : 'system',
      changed_by: adminId || null,
      reason: 'Payment verified on-chain',
      metadata: { payment_transaction_id: paymentId },
    });

  // 3. Log activity
  await supabaseAdmin
    .from('activity_logs')
    .insert({
      profile_id: adminId, // null if system
      action: 'payment_verify',
      metadata: { order_id: orderId, payment_id: paymentId },
    });
}
```

### 12.4 Get User's Payment History (Server Component)

```ts
async function getUserPayments(userId: string) {
  const supabase = createClient();

  const { data: payments } = await supabase
    .from('payment_transactions')
    .select(`
      *,
      network:supported_networks(name, symbol, chain_id, explorer_url),
      wallet:wallets(wallet_address, wallet_provider),
      card_orders(id, status)
    `)
    .eq('profile_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  return payments;
}
```

### 12.5 Get Payment Details (Server Component)

```ts
async function getPaymentDetails(userId: string, paymentId: string) {
  const supabase = createClient();

  const { data: payment } = await supabase
    .from('payment_transactions')
    .select(`
      *,
      network:supported_networks(*),
      wallet:wallets(*),
      payment_address:payment_addresses(*),
      profile:profiles(full_name, email)
    `)
    .eq('id', paymentId)
    .eq('profile_id', userId) // RLS enforces this too
    .single();

  return payment;
}
```

### 12.6 Get Receiving Address for Network

```ts
async function getReceivingAddress(networkId: string) {
  const supabase = createClient();

  const { data: address } = await supabase
    .from('payment_addresses')
    .select('*')
    .eq('network_id', networkId)
    .eq('status', 'active')
    .is('deleted_at', null)
    .single();

  return address;
}
```

### 12.7 Create Notification (on payment confirmed)

```ts
async function createPaymentNotification(userId: string, orderId: string, amount: string, currency: string) {
  const supabaseAdmin = createAdminClient();

  await supabaseAdmin
    .from('notifications')
    .insert({
      profile_id: userId,
      title: 'Payment Confirmed',
      message: `Your payment of ${amount} ${currency} has been verified. Order #${orderId.slice(0, 8)} is now being processed.`,
      type: 'success',
      action_url: `/app/orders/${orderId}`,
    });
}
```

---

## 13. Server Actions

### 13.1 Action Inventory

| Action                    | Route              | Input                    | Output                    |
| ------------------------- | ------------------ | ------------------------ | ------------------------- |
| `submitPaymentAction`     | `/app/order/payment` | SubmitPaymentInput     | `{ paymentId } \| { error }` |
| `getPaymentRequestAction` | `/app/order/payment` | `{ orderId, networkId, token }` | `{ receivingAddress, amount, expiresAt } \| { error }` |

### 13.2 Submit Payment Action

```ts
// src/app/app/order/payment/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { submitPaymentSchema } from '@/lib/validations/payment';
import { verifyPayment } from '@/lib/payment/verify';
import { revalidatePath } from 'next/cache';

export async function submitPaymentAction(input: SubmitPaymentInput) {
  // 1. Validate input
  const parsed = submitPaymentSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { orderId, txHash, networkId, walletId, amount, currency } = parsed.data;

  // 2. Get authenticated user
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { _form: ['Not authenticated'] } };

  // 3. Get receiving address for this network
  const { data: address } = await supabase
    .from('payment_addresses')
    .select('*')
    .eq('network_id', networkId)
    .eq('status', 'active')
    .single();

  if (!address) return { error: { _form: ['No receiving address configured for this network'] } };

  // 4. Create payment transaction (with replay check)
  try {
    const payment = await createPaymentTransaction(
      user.id, orderId, txHash, networkId, walletId,
      address.id, amount, currency
    );

    // 5. Run verification (Edge Function or server-side)
    const result = await verifyPayment({
      paymentId: payment.id,
      txHash,
      expectedAddress: address.wallet_address,
      expectedAmount: amount,
      expectedCurrency: currency,
      networkId,
    });

    if (result.verified) {
      // 6. Transition order to paid
      await transitionOrderToPaid(orderId, payment.id);

      // 7. Create notification
      await createPaymentNotification(user.id, orderId, amount.toString(), currency);

      // 8. Revalidate and redirect
      revalidatePath('/app/orders');
      return { success: true, paymentId: payment.id };
    } else {
      return { error: { _form: [result.error || 'Verification failed'] } };
    }
  } catch (error) {
    if (error.message === 'ALREADY_USED_TX') {
      return { error: { _form: ['This transaction has already been used for another order'] } };
    }
    return { error: { _form: ['Payment verification failed. Please try again.'] } };
  }
}
```

---

## 14. Validation Rules

### 14.1 Zod Schemas

```ts
// src/lib/validations/payment.ts
import { z } from 'zod';

export const submitPaymentSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  txHash: z
    .string()
    .min(1, 'Transaction hash is required')
    .regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash format'),
  networkId: z.string().uuid('Invalid network ID'),
  walletId: z.string().uuid().nullable().optional(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().min(1, 'Currency is required'),
});

export type SubmitPaymentInput = z.infer<typeof submitPaymentSchema>;

export const paymentRequestSchema = z.object({
  orderId: z.string().uuid(),
  networkId: z.string().uuid(),
  token: z.string().min(1),
});

export type PaymentRequestInput = z.infer<typeof paymentRequestSchema>;
```

### 14.2 Validation Summary

| Field        | Rules                                                       |
| ------------ | ----------------------------------------------------------- |
| orderId      | Required, valid UUID                                        |
| txHash       | Required, valid EVM tx hash format (0x + 64 hex chars)      |
| networkId    | Required, valid UUID, must be in supported_networks         |
| walletId     | Optional, valid UUID                                        |
| amount       | Required, positive number                                   |
| currency     | Required, must be a supported token                         |

---

## 15. Checkout Page

### 15.1 Route

`/app/order/payment` (Client Component — uses wagmi for wallet interaction)

### 15.2 Sections

| Section              | Description                                              |
| -------------------- | -------------------------------------------------------- |
| Order Summary        | Selected card, price, network, token                    |
| Network Selector     | Dropdown/grid of supported networks                      |
| Token Selector       | Dropdown of supported tokens for selected network        |
| Payment Details      | Receiving address (with copy + QR), amount, expiration   |
| Wallet Status        | Connected wallet address + network badge                 |
| Payment Button       | "Pay with [Wallet]" or "I've Sent the Payment"          |
| Tx Hash Input        | For manual submission (appears on "I've Sent")           |
| Verification Status  | Real-time status while verifying                         |
| Terms                | Payment terms + trust notice                             |

---

## 16. Payment Request

### 16.1 What the System Creates

| Field              | Example                              |
| ------------------ | ------------------------------------ |
| Order ID           | `550e8400-e29b-41d4-a716-446655440000` |
| Payment Amount     | `50.00` (in selected token)          |
| Currency           | `USDC`                               |
| Receiving Wallet   | `0xABC...DEF` (platform's address)   |
| Network            | `Ethereum` (Chain ID: 1)             |
| Expiration Time    | 30 minutes from creation             |
| Reference Number   | Order ID prefix (first 8 chars)      |

### 16.2 Payment Request Generation

```ts
async function generatePaymentRequest(
  orderId: string,
  networkId: string,
  token: string,
  amount: number
) {
  const supabase = createClient();

  // Get receiving address for network
  const { data: address } = await supabase
    .from('payment_addresses')
    .select('wallet_address, supported_networks(name, chain_id, symbol)')
    .eq('network_id', networkId)
    .eq('status', 'active')
    .single();

  if (!address) throw new Error('No receiving address for this network');

  return {
    orderId,
    receivingAddress: address.wallet_address,
    network: address.supported_networks.name,
    chainId: address.supported_networks.chain_id,
    amount,
    currency: token,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    reference: orderId.slice(0, 8),
  };
}
```

---

## 17. Wallet Approval

### 17.1 Flow

```text
User clicks "Pay with [Wallet]"
  ↓
wagmi sendTransaction called:
  - to: receiving address
  - value: amount (in wei for native) or 0 (for ERC-20)
  - (for ERC-20: data = transfer function call)
  ↓
Wallet opens (MetaMask, Coinbase, etc.)
  ↓
Transaction Preview shown to user
  ↓
User reviews: to, value, gas, network
  ↓
[if user approves]:
  ↓
  Transaction broadcast to blockchain
  ↓
  tx hash returned to app
  ↓
  App auto-submits tx hash for verification
  ↓
[if user rejects]:
  ↓
  "Transaction rejected" error
  ↓
  "Try Again" button
```

### 17.2 wagmi sendTransaction (Native Token)

```ts
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

const { sendTransaction, isPending } = useSendTransaction();

const handlePay = async () => {
  await sendTransaction({
    to: receivingAddress as `0x${string}`,
    value: parseEther(amount), // for native tokens (ETH, BNB, MATIC)
  });
};
```

### 17.3 wagmi sendTransaction (ERC-20 Token)

```ts
import { encodeFunctionData, parseUnits } from 'viem';

const ERC_20_TRANSFER_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
] as const;

const handlePayERC20 = async () => {
  await sendTransaction({
    to: tokenContractAddress as `0x${string}`,
    data: encodeFunctionData({
      abi: ERC_20_TRANSFER_ABI,
      functionName: 'transfer',
      args: [
        receivingAddress as `0x${string}`,
        parseUnits(amount, tokenDecimals), // 6 for USDC/USDT
      ],
    }),
  });
};
```

### 17.4 Key Principle

> The platform **initiates** the transaction request via wagmi, but the **user signs and broadcasts** in their own wallet. The platform never has access to the private key. The transaction goes directly from the user's wallet to the receiving address on-chain.

---

## 18. Blockchain Verification (Edge Function)

### 18.1 Verification Algorithm

This is the **most critical logic in the entire platform**. It runs as a Supabase Edge Function (Deno) using viem to read the blockchain via Alchemy RPC.

```ts
// supabase/functions/verify-payment/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createPublicClient, http, parseUnits, formatUnits, getTransaction, getTransactionReceipt, getTransactionConfirmations } from 'https://esm.sh/viem';
import { mainnet, polygon, arbitrum, optimism, base, bnbSmartChain, avalanche } from 'https://esm.sh/viem/chains';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const chains = [mainnet, polygon, arbitrum, optimism, base, bnbSmartChain, avalanche];

const chainMap = Object.fromEntries(chains.map(c => [c.id, c]));

// Token contract addresses (for ERC-20 verification)
const TOKEN_CONTRACTS: Record<string, Record<number, string>> = {
  USDC: {
    1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',   // Ethereum
    137: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',  // Polygon
    42161: '0xaf88d6a3ed3a085e89e66e51a4ea8c44e10ec37b', // Arbitrum
    10: '0x0b2c639c533813f4aa925781659c0f09bb7c9e44',   // Optimism
    8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',  // Base
  },
  USDT: {
    1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',   // Ethereum
    137: '0xc2132D05D31c914a87C6611C10748AEb04B8e2Fb',  // Polygon
  },
};

const TOKEN_DECIMALS: Record<string, number> = {
  USDC: 6,
  USDT: 6,
  ETH: 18,
  BNB: 18,
  MATIC: 18,
};

Deno.serve(async (req) => {
  const { paymentId, txHash, expectedAddress, expectedAmount, expectedCurrency, networkId } = await req.json();

  try {
    // 1. Get network config from database
    const { data: network } = await supabase
      .from('supported_networks')
      .select('*')
      .eq('id', networkId)
      .single();

    if (!network) {
      return errorResponse('NETWORK_NOT_FOUND', 'Network not supported', false);
    }

    // 2. Check tx_hash not already used (replay protection)
    const { data: existingTx } = await supabase
      .from('payment_transactions')
      .select('id, card_order_id')
      .eq('tx_hash', txHash)
      .neq('id', paymentId) // exclude current payment
      .single();

    if (existingTx) {
      return errorResponse('ALREADY_USED_TX', 'This transaction has already been used', false);
    }

    // 3. Create viem public client for this chain
    const chain = chainMap[network.chain_id];
    if (!chain) {
      return errorResponse('UNSUPPORTED_CHAIN', 'Chain not configured', false);
    }

    const client = createPublicClient({
      chain,
      transport: http(Deno.env.get('ALCHEMY_SERVER_RPC_URL')),
    });

    // 4. Get transaction from blockchain
    const tx = await getTransaction(client, { hash: txHash as `0x${string}` });

    if (!tx) {
      return errorResponse('TX_NOT_FOUND', 'Transaction not found on blockchain', true);
    }

    // 5. Get transaction receipt (for confirmation count and status)
    const receipt = await getTransactionReceipt(client, { hash: txHash as `0x${string}` });

    if (!receipt) {
      return errorResponse('TX_NOT_CONFIRMED', 'Transaction not yet confirmed', true);
    }

    // 6. Check transaction status (success on-chain)
    if (receipt.status !== 'success') {
      return errorResponse('TX_FAILED', 'Transaction failed on blockchain', false);
    }

    // 7. Verify chain ID matches
    if (tx.chainId !== BigInt(network.chain_id)) {
      return errorResponse('WRONG_CHAIN', `Transaction is on chain ${tx.chainId}, expected ${network.chain_id}`, false);
    }

    // 8. Verify confirmations
    const confirmations = await getTransactionConfirmations(client, {
      hash: txHash as `0x${string}`,
    });

    const requiredConfirmations = await getRequiredConfirmations(network.chain_id);

    if (confirmations < BigInt(requiredConfirmations)) {
      // Update status to 'confirming' and return retryable error
      await supabase
        .from('payment_transactions')
        .update({ status: 'confirming' })
        .eq('id', paymentId);

      return errorResponse(
        'INSUFFICIENT_CONFIRMATIONS',
        `Waiting for confirmations (${confirmations}/${requiredConfirmations})`,
        true,
        { confirmations: Number(confirmations), required: requiredConfirmations }
      );
    }

    // 9. Verify recipient and amount
    const isNative = ['ETH', 'BNB', 'MATIC'].includes(expectedCurrency);
    let actualRecipient: string;
    let actualAmount: bigint;

    if (isNative) {
      // Native token: value is in tx.value
      actualRecipient = tx.to?.toLowerCase() || '';
      actualAmount = tx.value;
    } else {
      // ERC-20: parse transfer event from receipt logs
      const tokenContract = TOKEN_CONTRACTS[expectedCurrency]?.[network.chain_id];
      if (!tokenContract) {
        return errorResponse('TOKEN_NOT_SUPPORTED', 'Token not supported on this network', false);
      }

      // Find Transfer event log matching our token contract
      const transferLog = receipt.logs.find(log =>
        log.address.toLowerCase() === tokenContract.toLowerCase() &&
        log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' // Transfer event signature
      );

      if (!transferLog) {
        return errorResponse('NO_TRANSFER_EVENT', 'No token transfer found in transaction', false);
      }

      // Parse Transfer event: topic[1] = from, topic[2] = to, data = amount
      actualRecipient = '0x' + (transferLog.topics[2]?.slice(26) || '');
      actualAmount = BigInt(transferLog.data);
    }

    // 10. Verify recipient matches expected address
    if (actualRecipient !== expectedAddress.toLowerCase()) {
      return errorResponse(
        'WRONG_ADDRESS',
        `Payment sent to ${actualRecipient}, expected ${expectedAddress}`,
        false
      );
    }

    // 11. Verify amount matches (>= expected)
    const expectedAmountWei = parseUnits(
      expectedAmount.toString(),
      TOKEN_DECIMALS[expectedCurrency] || 18
    );

    if (actualAmount < expectedAmountWei) {
      return errorResponse(
        'WRONG_AMOUNT',
        `Payment amount ${formatUnits(actualAmount, TOKEN_DECIMALS[expectedCurrency] || 18)} ${expectedCurrency}, expected ${expectedAmount}`,
        false
      );
    }

    // 12. ALL CHECKS PASSED — Update payment and order
    await supabase
      .from('payment_transactions')
      .update({
        status: 'confirmed',
        block_number: Number(receipt.blockNumber),
        gas_fee: formatUnits(receipt.gasUsed * receipt.effectiveGasPrice, 18),
        confirmed_at: new Date().toISOString(),
      })
      .eq('id', paymentId);

    // 13. Transition order to paid
    const { data: payment } = await supabase
      .from('payment_transactions')
      .select('card_order_id')
      .eq('id', paymentId)
      .single();

    if (payment?.card_order_id) {
      await supabase
        .from('card_orders')
        .update({ status: 'paid' })
        .eq('id', payment.card_order_id)
        .eq('status', 'pending'); // guard: only from pending

      // Log status history
      await supabase
        .from('card_status_history')
        .insert({
          card_order_id: payment.card_order_id,
          previous_status: 'pending',
          new_status: 'paid',
          changed_by_type: 'system',
          reason: 'Payment verified on-chain',
          metadata: { payment_id: paymentId, tx_hash: txHash, confirmations: Number(confirmations) },
        });

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          action: 'payment_verify',
          metadata: { order_id: payment.card_order_id, payment_id: paymentId, tx_hash: txHash },
        });
    }

    // 14. Return success
    return jsonResponse({
      verified: true,
      paymentId,
      blockNumber: Number(receipt.blockNumber),
      confirmations: Number(confirmations),
    });

  } catch (error) {
    console.error('Verification error:', error);
    return errorResponse('INTERNAL_ERROR', 'Verification failed due to an internal error', true);
  }
});

async function getRequiredConfirmations(chainId: number): Promise<number> {
  const { data: settings } = await supabase
    .from('system_settings')
    .select('crypto_confirmation_blocks')
    .single();

  const blocks = settings?.crypto_confirmation_blocks || {};
  const chainKey = Object.keys(blocks).find(k => k.toLowerCase().includes(String(chainId)));
  return chainKey ? blocks[chainKey] : 12; // default 12
}

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function errorResponse(code: string, message: string, retryable: boolean, extra?: any) {
  return jsonResponse({
    verified: false,
    error: { code, message, retryable },
    ...extra,
  }, 400);
}
```

### 18.2 Verification Checklist (Summary)

| Step | Check                                      | Error Code                  | Retryable? |
| ---- | ------------------------------------------ | --------------------------- | ---------- |
| 1    | Network exists in supported_networks       | `NETWORK_NOT_FOUND`         | No         |
| 2    | tx_hash not already used (replay)          | `ALREADY_USED_TX`           | No         |
| 3    | Transaction exists on blockchain           | `TX_NOT_FOUND`              | Yes        |
| 4    | Transaction receipt exists (confirmed)     | `TX_NOT_CONFIRMED`          | Yes        |
| 5    | Transaction status is 'success'            | `TX_FAILED`                 | No         |
| 6    | Chain ID matches expected                  | `WRONG_CHAIN`               | No         |
| 7    | Confirmations >= N                         | `INSUFFICIENT_CONFIRMATIONS`| Yes        |
| 8    | Recipient matches expected address         | `WRONG_ADDRESS`             | No         |
| 9    | Amount >= expected amount                  | `WRONG_AMOUNT`              | No         |
| 10   | Token transfer event found (ERC-20)        | `NO_TRANSFER_EVENT`         | No         |

### 18.3 Error Response Contract

```ts
type PaymentErrorCode =
  | 'NETWORK_NOT_FOUND'
  | 'ALREADY_USED_TX'
  | 'TX_NOT_FOUND'
  | 'TX_NOT_CONFIRMED'
  | 'TX_FAILED'
  | 'WRONG_CHAIN'
  | 'INSUFFICIENT_CONFIRMATIONS'
  | 'WRONG_ADDRESS'
  | 'WRONG_AMOUNT'
  | 'NO_TRANSFER_EVENT'
  | 'TOKEN_NOT_SUPPORTED'
  | 'RPC_ERROR'
  | 'INTERNAL_ERROR';

interface VerificationResponse {
  verified: boolean;
  paymentId?: string;
  blockNumber?: number;
  confirmations?: number;
  error?: { code: PaymentErrorCode; message: string; retryable: boolean };
}
```

### 18.4 Server-Side Verification Helper

```ts
// src/lib/payment/verify.ts
import { createAdminClient } from '@/lib/supabase/admin';

export async function verifyPayment(params: {
  paymentId: string;
  txHash: string;
  expectedAddress: string;
  expectedAmount: number;
  expectedCurrency: string;
  networkId: string;
}): Promise<{ verified: boolean; error?: string; confirmations?: { current: number; required: number } }> {
  const supabaseAdmin = createAdminClient();

  // Call the Edge Function
  const { data, error } = await supabaseAdmin.functions.invoke('verify-payment', {
    body: params,
  });

  if (error) {
    return { verified: false, error: 'Verification service unavailable' };
  }

  if (data.verified) {
    return { verified: true };
  }

  // Handle retryable errors (insufficient confirmations)
  if (data.error?.retryable && data.error.code === 'INSUFFICIENT_CONFIRMATIONS') {
    return {
      verified: false,
      error: data.error.message,
      confirmations: { current: data.confirmations, required: data.required },
    };
  }

  return { verified: false, error: data.error?.message || 'Verification failed' };
}
```

---

## 19. Order Creation

### 19.1 Flow (After Payment Confirmed)

```text
Payment Confirmed (verification passed)
  ↓
Order status transitions: pending → paid
  ↓
card_status_history row created (pending → paid, reason: "Payment verified on-chain")
  ↓
activity_logs entry created (action: 'payment_verify')
  ↓
Notification created (type: 'success', "Payment Confirmed")
  ↓
Email sent (order confirmation + payment receipt)
  ↓
Admin notification (new paid order)
  ↓
Customer redirected to /app/order/confirmation
  ↓
Success page shows: order ID, payment details, "Track Order" button
```

### 19.2 Receipt

The "receipt" is the `payment_transactions` record + the `card_orders` record. The customer can view it at:
- `/app/transactions/:id` — payment details
- `/app/orders/:id` — order details with payment link

Receipt includes: order number, wallet used, receiving wallet, token, amount, gas fee, network, confirmation time, explorer URL, reference ID.

---

## 20. Transaction Status State Machine

```text
[pending] ──tx submitted──> [pending] ──verification starts──> [confirming]
                                                                 |
                                                                 | enough confirmations + all checks pass
                                                                 v
                                                            [confirmed]
                                                                 |
                                                                 | verification fails (non-retryable)
                                                                 v
                                                            [failed]

[pending] ──tx not seen in 30 min──> [expired]
[confirming] ──tx not confirmed in 60 min──> [expired]
```

| Transition                | Trigger                    | Guard                        |
| ------------------------- | -------------------------- | ---------------------------- |
| (created) → pending       | Tx hash submitted          | Tx hash not already used.    |
| pending → confirming      | Verification starts, tx found, awaiting confirmations | Tx exists, status success. |
| confirming → confirmed    | N confirmations + all checks pass | All verification checks pass. |
| pending → failed          | Verification fails (non-retryable) | Wrong address/amount/chain. |
| confirming → failed       | Verification fails (non-retryable) | Tx reverted, etc. |
| pending → expired         | 30 min with no tx seen     | Timeout.                     |
| confirming → expired      | 60 min with insufficient confirmations | Timeout.           |

### 20.1 Transaction Statuses

| Status       | Description                                              |
| ------------ | -------------------------------------------------------- |
| pending      | Tx hash submitted, verification not yet started.         |
| broadcasted  | Tx seen on-chain (not yet confirmed).                    |
| confirming   | Tx confirmed, awaiting N confirmations.                  |
| confirmed    | All checks passed; payment verified.                     |
| failed       | Verification failed (non-retryable).                     |
| expired      | Tx not seen or insufficient confirmations within timeout.|

---

## 21. Order Status State Machine

```text
[pending] ──payment verified──> [paid] ──shipped──> [shipped] ──delivered──> [delivered]
    |                              |
    | cancelled by user/admin      | verification failed
    v                              v
[cancelled]                   [pending] (stays, error shown)

[paid] ──admin marks processing──> [processing] ──printing──> [printing]
[printing] ──packaging──> [packaging] ──shipped──> [shipped]
[shipped] ──delivered──> [delivered]
[paid] ──admin refunds──> [refunded] (SA only)
```

### 21.1 Order Statuses

| Status       | Description                                              |
| ------------ | -------------------------------------------------------- |
| pending      | Order created, awaiting payment.                         |
| paid         | Payment verified on-chain.                               |
| processing   | Admin marks card as being processed.                     |
| printing     | Physical card printing.                                  |
| packaging    | Card packaging.                                          |
| shipped      | Card shipped (tracking number added).                    |
| delivered    | Card delivered.                                          |
| completed    | Order fully complete (post-delivery).                    |
| cancelled    | Order cancelled (before payment).                        |
| refunded     | Order refunded (SA only, after payment).                 |

> Only `pending → paid` is automated (by the Edge Function). All other transitions are admin-initiated via the admin portal.

---

## 22. Payment History

### 22.1 Route

`/app/transactions` (Hybrid: RSC shell + client islands for filtering)

### 22.2 Shows

| Field          | Description                                              |
| -------------- | -------------------------------------------------------- |
| Transaction Hash | Truncated (0x1234...5678) with copy + explorer link   |
| Amount         | Formatted with currency (e.g., "50.00 USDC")            |
| Network        | Network badge (Ethereum, Polygon, etc.)                 |
| Date           | Formatted date (e.g., "Jul 21, 2026")                   |
| Status         | Status badge (confirmed=success, failed=danger, etc.)   |
| Order          | Link to order details                                    |

### 22.3 Features

- Filter by status (All / Confirmed / Pending / Failed)
- Filter by network
- Sort by date (newest first)
- Pagination (20 per page, keyset)
- Export CSV (future)

---

## 23. Transaction Details

### 23.1 Route

`/app/transactions/:id` (Server Component)

### 23.2 Shows

| Field              | Description                                              |
| ------------------ | -------------------------------------------------------- |
| Order Number       | Order ID (truncated) + link to order                     |
| Wallet Used        | Customer's wallet address (truncated + copy)             |
| Receiving Wallet   | Platform's receiving address (truncated + copy)          |
| Token              | Currency used (USDC, USDT, ETH, etc.)                    |
| Amount             | Payment amount (formatted)                               |
| Gas Fee            | Gas fee paid (formatted)                                 |
| Network            | Network badge + chain ID                                 |
| Confirmation Time  | When verification completed                              |
| Explorer URL       | External link to block explorer for tx hash              |
| Reference ID       | Payment ID (for support reference)                       |
| Transaction Hash   | Full tx hash (monospace + copy)                          |
| Block Number       | Block number of confirmation                             |

---

## 24. Payment Expiration

### 24.1 Default Expiration

- **30 minutes** from payment request generation.
- Displayed as countdown timer on the payment page.
- Turns red when < 5 minutes remaining.

### 24.2 Expired Orders

- Payment request expires → order stays in `pending` status.
- Customer can regenerate the payment request (same order, new expiration).
- No penalty for expiration; just generates a new request.
- If customer sent funds but didn't submit tx hash in time, they can still submit (verification checks the actual on-chain tx, not the expiration).

### 24.3 Expiration Logic

```ts
// Check if payment request is expired
const isExpired = (expiresAt: Date) => new Date() > expiresAt;

// Regenerate payment request (same order, new 30-min window)
async function regeneratePaymentRequest(orderId: string, networkId: string, token: string, amount: number) {
  return generatePaymentRequest(orderId, networkId, token, amount);
}
```

---

## 25. Notifications

### 25.1 Payment-Related Notifications

| Event                  | Type      | Channel       | Message                                    |
| ---------------------- | --------- | ------------- | ------------------------------------------ |
| Payment Started        | info      | In-app        | "Payment initiated for order #..."         |
| Payment Pending       | warning   | In-app + Email| "Awaiting payment for order #..."          |
| Payment Confirming    | info      | In-app        | "Waiting for blockchain confirmations..."  |
| Payment Confirmed     | success   | In-app + Email| "Payment verified! Order #... is now being processed." |
| Payment Failed        | error     | In-app + Email| "Payment verification failed: [reason]"   |
| Payment Expired       | warning   | In-app        | "Payment request expired. Generate a new one." |
| Order Created         | success   | In-app + Email| "Order #... confirmed"                     |
| Receipt Generated     | info      | Email         | "Your payment receipt" (with details)      |

### 25.2 Admin Notifications

| Event                  | Channel       | Message                                    |
| ---------------------- | ------------- | ------------------------------------------ |
| New Paid Order         | In-app + Email| "New paid order #... — [amount] [currency]"|
| Payment Failed         | In-app        | "Payment verification failed for order #..."|

---

## 26. Admin Features

### 26.1 Admin Payment Management (`/admin/payments`)

| Feature              | Description                                              |
| -------------------- | -------------------------------------------------------- |
| View Payments        | Table of all payment transactions                        |
| Search Transactions  | By tx hash, order ID, wallet address, user email         |
| Filter               | By status, network, date range                           |
| Manual Verification  | Re-trigger verification for a specific payment           |
| View Explorer        | External link to block explorer for tx hash              |
| View Wallet Address  | Show receiving wallet used                               |
| Export CSV           | Download payment history as CSV                          |
| Analytics            | Revenue total, payment count, success rate, avg amount   |
| Payment Logs         | Activity logs filtered to payment events                 |

### 26.2 Admin Analytics

| Metric              | Calculation                              |
| ------------------- | ---------------------------------------- |
| Total Revenue       | SUM(amount) WHERE status = 'confirmed'   |
| Payment Count       | COUNT(*) WHERE status = 'confirmed'      |
| Success Rate        | confirmed / (confirmed + failed) * 100   |
| Average Amount      | AVG(amount) WHERE status = 'confirmed'   |
| Failed Payments     | COUNT(*) WHERE status = 'failed'         |
| Pending Payments    | COUNT(*) WHERE status IN ('pending', 'confirming') |

---

## 27. Security

### 27.1 Security Measures

| Measure                          | Implementation                                       |
| -------------------------------- | ---------------------------------------------------- |
| Validate wallet address          | viem `isAddress()` + check against payment_addresses table. |
| Validate blockchain              | Check chain_id against supported_networks.           |
| Validate amount                  | Check actual amount >= expected amount.              |
| Prevent replay attacks           | UNIQUE(tx_hash) constraint + Edge Function check.    |
| Prevent duplicate confirmations  | Order status guard: `eq('status', 'pending')` on update. |
| Log every payment event          | activity_logs + card_status_history for every transition. |
| Never store private keys         | No key fields in any table; architecture constraint. |
| Never store seed phrases         | No seed fields; trust notice on payment page.        |
| Never sign for user              | Platform only reads blockchain; no signing code.     |
| Rate limit verification          | 10 verification requests / min / user.               |
| HTTPS only                       | All API calls over HTTPS.                            |
| Service-role key server-only     | Edge Function uses service key; never in client.     |

### 27.2 Fund Flow Diagram

```text
Customer's Wallet ──────direct on-chain──────> Receiving Wallet (Platform's)
                          │
                          │ tx hash
                          v
                    TWallet Platform
                          │
                          │ reads blockchain (viem + Alchemy)
                          v
                    Verification
                          │
                          │ all checks pass
                          v
                    Order: pending → paid
```

> The platform is **not** in the fund flow. It reads the blockchain to verify the direct transfer.

---

## 28. Edge Cases

| Edge Case                              | Handling                                              |
| -------------------------------------- | ----------------------------------------------------- |
| Customer sends wrong amount            | `WRONG_AMOUNT` error; order stays pending; customer can submit correct tx. |
| Customer sends to wrong address        | `WRONG_ADDRESS` error; funds lost (customer error); support ticket. |
| Customer sends on wrong network        | `WRONG_CHAIN` error; funds may be recoverable (same address on correct chain); support. |
| Customer uses same tx for two orders   | `ALREADY_USED_TX` error; second order stays pending.  |
| Tx not yet confirmed                   | `INSUFFICIENT_CONFIRMATIONS`; retryable; UI shows progress. |
| Tx reverted on-chain                   | `TX_FAILED`; non-retryable; customer must send new tx. |
| RPC endpoint down                      | `RPC_ERROR`; retryable; "Try again in a moment."      |
| Payment request expired but tx sent    | Still verify (on-chain tx is what matters, not expiration). |
| Customer closes wallet during approval | "Transaction rejected" + "Try Again" button.          |
| ERC-20 transfer with 0 value tx        | Parse Transfer event log for amount (not tx.value).   |
| Native token tx to contract            | Check tx.to matches receiving address (not a contract). |
| Multiple transfers in one tx           | Find the transfer log matching our receiving address. |
| Customer submits fake tx hash          | `TX_NOT_FOUND` (hash not on blockchain); non-retryable. |
| Network congestion (high gas)          | Customer chooses gas; platform doesn't influence.     |
| Double-spend / reorg                   | N confirmations required; reorg risk mitigated.       |
| Payment in wrong token                 | `NO_TRANSFER_EVENT` or `WRONG_AMOUNT`; non-retryable. |

---

## 29. Loading States

| State                | UI                                                        |
| -------------------- | --------------------------------------------------------- |
| Preparing Payment    | Spinner + "Preparing your payment request..."             |
| Opening Wallet       | Spinner + "Opening [wallet name]..."                      |
| Waiting For Approval | Spinner + "Waiting for wallet approval..."                |
| Waiting For Confirmation | ProgressBar + "Waiting for confirmations (M/N)..."    |
| Verifying            | Spinner + "Verifying your transaction..."                 |
| Creating Order       | Spinner + "Confirming your order..."                      |
| Generating Receipt   | Spinner + "Generating receipt..."                         |
| Page Load (initial)  | Skeleton payment card                                     |

---

## 30. Empty States

| State                | UI                                                        |
| -------------------- | --------------------------------------------------------- |
| No Transactions      | Illustration + "Your payment history will appear here" + "Order a Card" CTA. |
| No Payment in Progress | N/A (payment page always has an order context).        |

---

## 31. Error States

### 31.1 Error Messages

| Error                  | Message                                          | Retryable? |
| ---------------------- | ------------------------------------------------ | ---------- |
| Wallet Rejected        | "Transaction rejected by wallet"                 | Yes        |
| Wrong Network          | "Wrong network. Please switch to [network]."     | Yes (switch) |
| Wrong Amount           | "Payment amount doesn't match the order"         | No         |
| Wrong Address          | "Payment sent to wrong address"                  | No         |
| Transaction Failed     | "Transaction failed on blockchain"               | No         |
| Timeout                | "Transaction timed out. Please try again."       | Yes        |
| Network Error          | "Network error. Please try again."               | Yes        |
| Blockchain Error       | "Unable to read blockchain. Please try again."   | Yes        |
| Already Used           | "This transaction has already been used"         | No         |
| Insufficient Confirmations | "Waiting for confirmations (M/N)"            | Yes (auto) |
| Expired                | "Payment request expired. Generate a new one."   | Yes        |

### 31.2 Error Display

- Errors shown in `VerificationStatus` component below the tx hash input.
- Retryable errors show "Submit New Transaction" or "Try Again" button.
- Non-retryable errors show "Contact Support" link.
- All errors are user-friendly; technical details logged server-side.

---

## 32. Success States

| Action              | Success Behavior                                      |
| ------------------- | ----------------------------------------------------- |
| Payment Confirmed   | Green check icon + "Payment verified!" + redirect to confirmation page. |
| Order Created       | Confirmation page shows order ID + "Track Order" button. |
| Receipt Generated   | Email sent + transaction visible in /app/transactions. |
| Dashboard Updated   | Order visible in /app/orders with status "Paid".      |
| Email Sent          | Confirmation email + receipt email sent to customer.  |
| Admin Notified      | Admin sees new paid order in /admin/orders.           |

---

## 33. Accessibility

| Requirement                  | Implementation                                       |
| ---------------------------- | ---------------------------------------------------- |
| Keyboard navigation          | All payment actions reachable via Tab; Enter to submit. |
| Focus indicators             | `:focus-visible` ring on all interactive elements.   |
| ARIA labels                  | Tx hash input has `aria-label="Transaction hash"`.   |
| Status announcements         | Verification status changes via `aria-live="polite"`. |
| Address display              | `aria-label` with full address; copy button announces "Copied". |
| QR code                      | `alt` text: "QR code for [network] receiving address [address]". |
| Countdown timer              | `aria-label` with remaining time; updates announced. |
| Progress bar                 | `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`. |
| Color contrast               | WCAG 2.1 AA (Book 04 §4.5).                          |
| Reduced motion               | Status icon animations respect `prefers-reduced-motion`. |

---

## 34. SEO

Payment pages are **not indexable**.

| Page                    | Meta Robots                    |
| ----------------------- | ------------------------------ |
| `/app/order/payment`    | `noindex, nofollow`            |
| `/app/transactions`     | `noindex, nofollow`            |
| `/app/transactions/:id` | `noindex, nofollow`            |

---

## 35. Future Features

Reserved for post-MVP:

| Feature                    | Version |
| -------------------------- | ------- |
| Recurring payments         | v2      |
| Subscriptions              | v2      |
| Merchant checkout          | v2      |
| QR code payments           | v2      |
| Multi-signature wallets    | v2      |
| Automatic refunds          | v2      |
| Stablecoin auto-detection  | v2      |
| Exchange rate service      | v2      |
| Invoice system             | v2      |
| BTC support (via wrapper)  | v2      |
| SOL support (Solana)       | v3      |

---

## 36. Acceptance Criteria

| AC ID    | Criterion                                                      |
| -------- | -------------------------------------------------------------- |
| AC-PA-01 | Given a valid tx (correct address, amount, chain, confirmations), when verification runs, then order transitions to `paid`. |
| AC-PA-02 | Given a tx with wrong address, when verification runs, then order stays `pending` and error `WRONG_ADDRESS` is returned. |
| AC-PA-03 | Given a tx with wrong amount, when verification runs, then error `WRONG_AMOUNT` is returned. |
| AC-PA-04 | Given a tx on wrong chain, when verification runs, then error `WRONG_CHAIN` is returned. |
| AC-PA-05 | Given a tx with insufficient confirmations, when verification runs, then error `INSUFFICIENT_CONFIRMATIONS` is returned and verification can be retried. |
| AC-PA-06 | Given a tx already linked to another order, when verification runs, then error `ALREADY_USED_TX` is returned. |
| AC-PA-07 | Given a verified payment, then a payment record is created with tx_hash, amount, chain, confirmed_at, block_number. |
| AC-PA-08 | Given a verified payment, then the order transitions from `pending` to `paid`. |
| AC-PA-09 | Given a verified payment, then a card_status_history row is created (pending → paid). |
| AC-PA-10 | Given a verified payment, then an activity_logs entry is created with action='payment_verify'. |
| AC-PA-11 | Given a verified payment, then a notification is created (type: 'success'). |
| AC-PA-12 | Given any payment flow, then the platform never signs or broadcasts a transaction. |
| AC-PA-13 | Given any payment flow, then no private key or seed phrase is ever requested. |
| AC-PA-14 | Given RPC degradation, then verification queues and retries; user sees "pending verification". |
| AC-PA-15 | Given an expired payment request, when customer regenerates, then a new 30-minute window is created. |
| AC-PA-16 | Given an ERC-20 payment (USDC/USDT), then the Transfer event log is parsed for amount verification. |
| AC-PA-17 | Given a native token payment (ETH/BNB/MATIC), then tx.value is used for amount verification. |
| AC-PA-18 | Given a reverted transaction, when verification runs, then error `TX_FAILED` is returned. |
| AC-PA-19 | Given a confirmed payment, then the customer can view it at /app/transactions/:id with explorer link. |
| AC-PA-20 | Given an admin, then they can view all payments at /admin/payments with search and filter. |

---

## 37. Testing Checklist

### 37.1 Unit Tests (Vitest)

- [ ] `submitPaymentSchema` validates tx hash format, order ID, network ID, amount
- [ ] `paymentRequestSchema` validates order ID, network ID, token
- [ ] `createPaymentTransaction` creates record with status='pending'
- [ ] `createPaymentTransaction` throws `ALREADY_USED_TX` for duplicate tx hash
- [ ] `updatePaymentStatus` updates status to 'confirmed' with block_number and gas_fee
- [ ] `transitionOrderToPaid` updates order from 'pending' to 'paid'
- [ ] `transitionOrderToPaid` creates card_status_history row
- [ ] `transitionOrderToPaid` creates activity_logs row
- [ ] `transitionOrderToPaid` guard: only transitions from 'pending' (not from 'paid' or 'cancelled')
- [ ] `generatePaymentRequest` generates correct receiving address + amount + expiration
- [ ] `createPaymentNotification` creates notification with type='success'

### 37.2 Integration Tests (Vitest + Supabase local)

- [ ] Payment transaction created with correct fields
- [ ] UNIQUE(tx_hash) constraint prevents duplicate payments
- [ ] Order transitions from pending to paid on verification success
- [ ] Order does NOT transition if verification fails
- [ ] card_status_history row created on transition
- [ ] activity_logs row created on transition
- [ ] notification created on verification success
- [ ] RLS: user can only see their own payment transactions
- [ ] RLS: admin can see all payment transactions

### 37.3 Edge Function Tests (Vitest + local blockchain fork)

- [ ] Verification passes for correct native token tx (ETH)
- [ ] Verification passes for correct ERC-20 tx (USDC)
- [ ] Verification fails with WRONG_ADDRESS for incorrect recipient
- [ ] Verification fails with WRONG_AMOUNT for insufficient amount
- [ ] Verification fails with WRONG_CHAIN for wrong chain ID
- [ ] Verification fails with ALREADY_USED_TX for duplicate tx hash
- [ ] Verification fails with TX_FAILED for reverted transaction
- [ ] Verification returns INSUFFICIENT_CONFIRMATIONS for < N confirmations
- [ ] Verification handles ERC-20 Transfer event parsing correctly
- [ ] Verification handles native token value correctly
- [ ] Verification handles RPC errors gracefully

### 37.4 E2E Tests (Playwright)

- [ ] Customer can navigate to payment page from order wizard
- [ ] Payment page shows order summary, network selector, token selector
- [ ] Payment page shows receiving address with copy + QR
- [ ] Customer can copy receiving address
- [ ] Customer can submit tx hash
- [ ] Verification status shows while verifying
- [ ] On success: redirect to confirmation page
- [ ] On failure: error message + retry button
- [ ] Customer can view payment in /app/transactions
- [ ] Customer can view payment details at /app/transactions/:id
- [ ] Transaction details show explorer link
- [ ] Countdown timer counts down and turns red < 5 min
- [ ] No field requests seed phrase or private key
- [ ] Trust notice is visible on payment page
- [ ] Payment page is keyboard navigable

### 37.5 Accessibility Tests

- [ ] Axe DevTools passes on payment page
- [ ] Keyboard-only walkthrough: select network, select token, submit tx hash
- [ ] Screen reader announces verification status changes
- [ ] Progress bar has correct ARIA attributes

---

## 38. OpenCode Prompt

```
Build a production-ready Crypto Payment module for TWallet Services using Next.js 15 (App Router), TypeScript (strict), wagmi + viem, Supabase Edge Functions, and Tailwind CSS v4 (Book 04 design tokens).

## Routes to Build

1. /app/order/payment — Payment page (network + token selection, receiving address, tx hash submission, verification status)
2. /app/transactions — Payment history list
3. /app/transactions/[id] — Transaction details
4. /admin/payments — Admin payment management (list, search, filter, view)

## Critical Rules (Non-Negotiable)

- NEVER hold customer funds. Funds flow directly from customer's wallet to the platform's receiving wallet.
- NEVER sign or broadcast transactions on behalf of the user. The user signs in their own wallet.
- NEVER mark an order as 'paid' without on-chain verification (address, amount, chain, confirmations, replay).
- NEVER store private keys or seed phrases.
- NEVER accept a tx_hash that's already been used (UNIQUE constraint + Edge Function check).
- ALWAYS require N confirmations before confirming (N is configurable per chain via system_settings).
- ALWAYS log payment events (activity_logs, card_status_history).

## Architecture

- Payment page: Client Component (uses wagmi sendTransaction, state for tx hash input + verification status)
- Payment history: Server Component (fetches from payment_transactions with RLS)
- Transaction details: Server Component (fetches single payment with RLS)
- Admin payments: Hybrid (RSC shell + client islands for search/filter)
- Verification: Supabase Edge Function (Deno) using viem + Alchemy RPC
- Server Actions: submitPaymentAction, getPaymentRequestAction

## Edge Function (supabase/functions/verify-payment/index.ts)

The verification algorithm (CRITICAL — see Book 11 §18 for full code):
1. Check tx_hash not already used (replay protection)
2. Get tx from blockchain via viem getTransaction
3. Get receipt via getTransactionReceipt
4. Check receipt.status === 'success'
5. Check tx.chainId matches expected chain
6. Check confirmations >= N (from system_settings.crypto_confirmation_blocks)
7. Verify recipient matches expected receiving address
8. Verify amount >= expected amount (parse ERC-20 Transfer event for tokens, tx.value for native)
9. On all checks passing: update payment_transactions to 'confirmed', transition card_orders to 'paid', create card_status_history, create activity_logs, create notification
10. On failure: return error with code (WRONG_ADDRESS, WRONG_AMOUNT, WRONG_CHAIN, ALREADY_USED_TX, INSUFFICIENT_CONFIRMATIONS, TX_FAILED, etc.)

## Supported Networks + Confirmations
- Ethereum (1): 12 confirmations
- BNB Smart Chain (56): 20 confirmations
- Polygon (137): 128 confirmations
- Arbitrum (42161): 64 confirmations
- Optimism (10): 64 confirmations
- Base (8453): 64 confirmations
- Avalanche (43114): 12 confirmations

## Supported Tokens
- Native: ETH (Ethereum, Arbitrum, Optimism, Base), BNB (BNB Chain), MATIC (Polygon)
- ERC-20: USDC (6 decimals), USDT (6 decimals) — parse Transfer event from receipt.logs

## Payment Page UI (/app/order/payment)
- Order Summary: card product, type, price
- Network Selector: dropdown/grid of supported networks (from supported_networks table)
- Token Selector: dropdown of supported tokens for selected network
- Payment Details: receiving address (AddressDisplay with copy + QRCode), amount (monospace), CountdownTimer (30 min)
- Wallet Status: connected wallet address + NetworkBadge (or "Connect Wallet" CTA)
- Payment Action: "Pay with [Wallet]" button (wagmi sendTransaction) OR "I've Sent the Payment" (shows TxHashInput)
- TxHashInput: monospace input, validates 0x + 64 hex chars, paste support, "Submit for Verification" button
- VerificationStatus: idle/verifying/confirming/confirmed/failed states with spinner/progress bar/check/error
- TrustNotice: "We never ask for your recovery phrase or private keys."
- "Funds go directly to our wallet" notice

## wagmi sendTransaction
- Native tokens: sendTransaction({ to: receivingAddress, value: parseEther(amount) })
- ERC-20 tokens: sendTransaction({ to: tokenContract, data: encodeFunctionData(transfer, [receivingAddress, parseUnits(amount, decimals)]) })

## Server Actions (src/app/app/order/payment/actions.ts)
- submitPaymentAction: validate with Zod, get user, get receiving address, create payment_transactions (with replay check), call verifyPayment Edge Function, on success transition order to paid + create notification, return success/error
- getPaymentRequestAction: get receiving address for network, generate payment request with 30-min expiration

## Validation (src/lib/validations/payment.ts)
- submitPaymentSchema: orderId (UUID), txHash (0x + 64 hex), networkId (UUID), walletId (optional UUID), amount (positive), currency (string)
- paymentRequestSchema: orderId (UUID), networkId (UUID), token (string)

## Database (from Book 08)
- payment_transactions: id, profile_id, wallet_id, network_id, payment_address_id, amount, currency, tx_hash (UNIQUE), receiver_wallet, block_number, gas_fee, status, confirmed_at
- card_orders: id, profile_id, card_product_id, payment_transaction_id, status (pending → paid)
- card_status_history: card_order_id, previous_status, new_status, changed_by_type, reason, metadata
- payment_addresses: network_id, wallet_address, status
- supported_networks: name, chain_id, rpc_url, explorer_url
- notifications: profile_id, title, message, type, action_url
- activity_logs: profile_id, action, metadata

## Design System (Book 04)
- Card: --color-surface, --radius-card (20px), --shadow-md
- Button: primary, full-width on mobile
- Badge: success (confirmed), warning (pending/confirming), danger (failed)
- Address: monospace, truncated, copy button
- Amount: monospace, tabular-nums, large size
- NetworkBadge: color-coded per network
- ProgressBar: for confirmation progress (M/N)
- CountdownTimer: MM:SS, turns red < 5 min
- Loading: spinner for verification, progress bar for confirmations
- Trust notice: subtle info badge with shield icon

## Security
- NEVER request/store/transmit private keys or seed phrases
- Read-only blockchain verification (viem getTransaction, getTransactionReceipt)
- UNIQUE(tx_hash) for replay protection
- Order status guard: only transition from 'pending' to 'paid'
- Rate limit: 10 verification requests / min / user
- Service-role key in Edge Function only (never in client)
- All payment events logged (activity_logs, card_status_history)

## Accessibility (WCAG 2.1 AA)
- Tx hash input: aria-label="Transaction hash"
- Verification status: aria-live="polite" for status changes
- Address: aria-label with full address
- QR code: alt text with address
- Progress bar: role="progressbar" with aria-valuenow/min/max
- Countdown timer: aria-label with remaining time

## SEO
- All payment pages: noindex, nofollow

## File Structure
src/
├── app/
│   ├── app/
│   │   ├── order/
│   │   │   └── payment/
│   │   │       ├── page.tsx           (Client Component — payment UI)
│   │   │       └── actions.ts         (Server Actions)
│   │   └── transactions/
│   │       ├── page.tsx               (Server Component — history list)
│   │       └── [id]/page.tsx          (Server Component — details)
│   └── admin/
│       └── payments/
│           ├── page.tsx               (Server Component — admin list)
│           └── [id]/page.tsx          (Server Component — admin details)
├── lib/
│   ├── payment/
│   │   └── verify.ts                  (Server-side verification helper)
│   └── validations/
│       └── payment.ts                 (Zod schemas)
└── components/
    └── payment/
        ├── PaymentSummary.tsx
        ├── NetworkSelector.tsx
        ├── TokenSelector.tsx
        ├── TxHashInput.tsx
        ├── VerificationStatus.tsx
        ├── CountdownTimer.tsx
        └── PaymentHistoryTable.tsx

supabase/
└── functions/
    └── verify-payment/
        └── index.ts                   (Edge Function — verification algorithm)

## Environment Variables
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=... (server-only)
NEXT_PUBLIC_ALCHEMY_RPC_URL=...
ALCHEMY_SERVER_RPC_URL=... (server-only, for Edge Function)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...

Generate all files with full TypeScript types, strict mode, no `any`. Follow the TWallet Services Design System (Book 04) for all visual elements. Implement the full verification algorithm in the Edge Function (see Book 11 §18). Ensure all acceptance criteria (AC-PA-01 through AC-PA-20) are satisfied. NEVER hold customer funds. NEVER sign transactions on behalf of the user. NEVER mark an order paid without on-chain verification.
```

---

## 39. Glossary

| Term                | Definition                                                        |
| ------------------- | ----------------------------------------------------------------- |
| tx_hash             | Unique identifier for a blockchain transaction (0x + 64 hex).     |
| Receiving wallet    | Platform-owned wallet address where customers send payments.      |
| On-chain verification | Reading a transaction from the blockchain to confirm it's real. |
| Replay protection   | Preventing one tx from being used for two orders (UNIQUE tx_hash).|
| Confirmations       | Number of blocks confirmed after a tx block (more = more secure).|
| ERC-20              | Token standard on Ethereum (USDC, USDT are ERC-20).              |
| Native token        | Chain's native currency (ETH on Ethereum, BNB on BNB Chain).     |
| Transfer event      | EVM event emitted when an ERC-20 token is transferred.            |
| Gas fee             | Fee paid to process a transaction on the blockchain.              |
| Block explorer      | Website for viewing blockchain transactions (e.g., Etherscan).    |
| Non-custodial       | Platform never holds user funds; direct wallet-to-wallet.         |
| Edge Function       | Supabase serverless function (Deno) for server-side logic.        |

---

## 40. References

- Book 02 — Business Requirements (FR-05-001..009, §9.5)
- Book 04 — Design System (component APIs, tokens, states)
- Book 05 — Software Requirements Specification (SFR-05-001..008, §8.4; payment state machine, §6.3; acceptance criteria, §23.4)
- Book 06 — User Experience & User Flows (crypto payment flow, §13; page spec, §5.3)
- Book 08 — Database Schema (payment_transactions, §7.3; card_orders, §6.2; payment_addresses, §7.2; supported_networks, §7.1)
- Book 10 — Wallet Integration (wagmi sendTransaction, wallet connection)
- Book 10A — Third-Party Integrations (Alchemy RPC setup, viem configuration)
- `00-Project/TECH_STACK.md`
- `AGENTS.md`

---

## Next Book

**Book 12 — System Architecture** (`01-Foundation/`): documents the Next.js App Router folder structure, Server Components vs. Client Components, Server Actions, Supabase integration patterns, authentication middleware, route protection, environment variables, API/service layer, state management strategy, file upload architecture, error logging, caching and revalidation, and deployment architecture. This gives OpenCode a strong foundation before building the Dashboard and Admin books.

---

> End of Book 11 — Crypto Payments. This document is the complete, implementation-ready specification for the crypto payment module. Any change to the verification algorithm, payment flow, state machines, or security rules requires a version bump in this book and a `00-Project/CHANGELOG.md` entry.
