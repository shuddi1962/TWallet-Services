# 09 — Payment Monitoring

> Component ID: ADM-009 | Status: Approved
> Real-time payment verification, monitoring, and reconciliation.

## Route

`/admin/payments` — Server Component + Client

## Access

- Super Admin, Finance: full access (verify, flag, export, manual confirm)
- Operations: read-only + export

## Features

### Table

| Column | Filterable | Sortable |
|--------|-----------|----------|
| Tx Hash | Search | — |
| Customer | Search (name/email) | Yes |
| Order ID | Search | Yes |
| Amount (USDC) | Min/Max | Yes |
| Network | Dropdown | Yes |
| Token | Dropdown | Yes |
| From Address | Search | Yes |
| Confirmations | Min count | Yes |
| Status | Multi-select | Yes |
| Method | FIAT / Crypto | Yes |
| Verified | Toggle | Yes |
| Flagged | Flagged/Clean | Yes |
| Created | Date range | Yes |

### Payment Statuses

`pending` → `confirmed` | `failed` | `flagged` | `refunded`

### Actions (Dropdown per row)

| Action | Behavior | Role |
|--------|----------|------|
| View | Opens payment detail drawer | All |
| Verify | Re-runs on-chain verification | Super Admin, Finance |
| Mark Confirmed | Manual override (with reason) | Super Admin |
| Flag | Sets `flagged = true`, requires reason | Super Admin, Finance |
| Unflag | Removes flag | Super Admin, Finance |
| View on Explorer | Opens block explorer link | All |
| View Order | Links to `/admin/orders/[id]` | All |
| Export | Export to CSV/Excel | Super Admin, Finance |

### Payment Detail (Drawer)

| Section | Data |
|---------|------|
| Payment Info | Tx hash (full), order ID, status, verified at, method |
| Amounts | Amount, currency, network fee, platform fee |
| Customer | Name, email |
| Blockchain | Network name, token, from address, to address, confirmations, block number, block explorer link |
| Verification | Last verified at, verification attempts, response data |
| Timeline | Status changes with timestamps |
| Admin Notes | Internal notes |

### Filters

| Filter | Type |
|--------|------|
| Search (tx hash, customer, order ID) | Text, debounced 300ms |
| Status | Multi-select badges |
| Network | Dropdown |
| Token | Dropdown |
| Amount Range | Min/Max inputs |
| Date Range | Date pickers |
| Verified | Toggle: All, Verified, Not Verified |
| Flagged | Toggle |
| Method | FIAT/Crypto dropdown |

### Mass Actions

| Action | Description |
|--------|-------------|
| Export Selected | CSV/Excel/PDF |
| Export All (filtered) | Entire filtered results |

## Component Tree

```
AdminPaymentsPage (Server Component)
├── PageHeader ("Payments" + total revenue summary)
├── FilterBar
├── BulkActionBar
├── PaymentsTable (Client)
│   ├── TableHeader
│   └── PaymentRow
│       ├── TxHashCell (truncated, clickable → explorer)
│       ├── CustomerCell
│       ├── OrderIDCell
│       ├── AmountCell (USDC)
│       ├── NetworkCell (icon + name)
│       ├── TokenCell
│       ├── FromAddressCell (truncated)
│       ├── ConfirmationsCell
│       ├── StatusBadge (color-coded)
│       ├── MethodBadge (FIAT/Crypto)
│       ├── VerifiedIcon (checkmark / X)
│       ├── FlaggedIcon (if flagged)
│       ├── DateCell
│       └── ActionsDropdown
├── Pagination
└── PaymentDetailDrawer
    ├── PaymentInfoSection
    ├── BlockchainSection
    ├── CustomerSection
    ├── VerificationSection
    ├── TimelineSection
    └── AdminNotesSection
```

## Server Actions

```ts
verifyPayment(paymentId: string): Promise<VerificationResult>
markPaymentConfirmed(paymentId: string, reason: string): Promise<ActionResult>
flagPayment(paymentId: string, reason: string): Promise<ActionResult>
unflagPayment(paymentId: string): Promise<ActionResult>
exportPayments(paymentIds: string[], format: 'csv' | 'excel' | 'pdf'): Promise<{ url: string }>
```

## Edge Function

```
verify-payment (Edge Function — Deno)
  → Calls Alchemy API to verify tx on-chain
  → Checks: correct address, amount, chain, confirmations, not already used
  → Updates payment_transactions.status
  → Creates audit_log entry
  → Returns verification result
```

## States

| State | UI |
|-------|-----|
| Loading | Skeleton table + stat cards |
| Empty | "No payments yet" |
| Unverified | "Not verified" label + "Verify" button |
| Flagged | Row highlighted (amber/red) with flag icon |
| Error | "Failed to load payments" + Retry |

## Accessibility

- Tx hash: link with `aria-label="View transaction [hash] on [explorer]"`
- Block explorer links: open in new tab, `rel="noopener noreferrer"`
- Status badges: text + icon
