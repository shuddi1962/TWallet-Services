# 10 — Transaction History

> Component ID: DB-010 | Status: Approved
> Full transaction history with date range filters, explorer links, and export capability.

## Purpose

Display every crypto payment made by the customer. Let users verify their payment history and download receipts.

## Route

`/app/transactions` — Server Component + Client islands for filtering

## Layout

```
Page Header
  ↓
Date Range Filters + Status Tabs
  ↓
Transaction Table (desktop) / Cards (mobile)
  ↓
Pagination
```

## Page Header
- Heading: "Transactions" (h1, 32px, 700)
- Subtext: "Your verified crypto payment history." (14px, `--color-body`)

## Filters

### Date Range Filter (Dropdown)
| Option | Filter |
|--------|--------|
| Today | created_at >= today |
| 7 Days | created_at >= now - 7 days |
| 30 Days | created_at >= now - 30 days |
| Custom Range | Date picker (from / to) |
| All Time | No date filter (default) |

### Status Filter Tabs
| Tab | Filter |
|-----|--------|
| All | No status filter |
| Pending | status = 'pending' |
| Confirming | status = 'confirming' |
| Confirmed | status = 'confirmed' |
| Failed | status = 'failed' |
| Expired | status = 'expired' |
| Refunded | status = 'refunded' |

## Transaction Table (Desktop)

| Column | Content |
|--------|---------|
| Transaction Hash | Truncated (0x1234...5678) + copy button |
| Order Number | Link to order (ORD-550e...) |
| Amount | Formatted + currency (50.00 USDC) — monospace, tabular-nums, right-aligned |
| Currency | Badge (USDC, USDT, ETH, etc.) |
| Network | NetworkBadge (name + logo, mini) |
| Status | Status badge (see below) |
| Date | Formatted (Jul 21, 2026 10:30 AM) |
| Explorer | External link icon → block explorer |
| Actions | See below |

### Status Badges
| Status | Color | Icon |
|--------|-------|------|
| Pending | `--color-warning` | Clock |
| Confirming | `--color-info` | Loader |
| Confirmed | `--color-success` | CheckCircle |
| Failed | `--color-danger` | XCircle |
| Expired | `--color-muted` | Clock (strikethrough) |
| Refunded | `--color-danger` | RotateCcw |

## Actions (Per Transaction)

| Action | Type | Behavior |
|--------|------|----------|
| Copy Hash | Icon button | Copies tx hash to clipboard; "Copied!" tooltip |
| Open Explorer | Icon button (external) | Opens block explorer in new tab |
| Download Receipt | Icon button | Downloads PDF receipt |
| View Details | Button (ghost) | → `/app/transactions/[id]` |

## Transaction Details Page (`/app/transactions/[id]`)

| Field | Content |
|-------|---------|
| Transaction hash | Full hash (monospace, 16px) + copy |
| Order | Link to related order |
| Amount | Formatted + currency |
| Token | Currency badge |
| Network | NetworkBadge |
| From wallet | User's wallet address (truncated + copy + explorer) |
| To wallet | Receiving address (truncated + copy + explorer) |
| Gas fee | Formatted (0.0023 ETH) |
| Block number | Block of confirmation |
| Confirmations | "12 confirmations" |
| Status | Status badge |
| Verified at | Date + time |
| Explorer | "View on [Explorer]" (external) |
| Reference ID | Payment ID |
| Download Receipt | Button (PDF) |

## Empty State

- Illustration: Receipt icon (64px, `--color-muted`)
- Message: "No transactions found." (16px, `--color-body`)
- Subtext: "Your payment history will appear here after your first order." (14px, `--color-muted`)

## Future Features

- Export CSV — download all transactions as CSV
- Export PDF — download statement as PDF
- Advanced Filters — filter by network, amount range, wallet

## Component Tree

```
TransactionHistory (Server Component + Client islands)
├── PageHeader
│   ├── Heading ("Transactions")
│   └── Subtext ("Your verified crypto payment history.")
├── FilterBar (Client Component)
│   ├── DateRangeDropdown (Today / 7 Days / 30 Days / Custom / All Time)
│   ├── StatusTabs (All / Pending / Confirming / Confirmed / Failed / Expired / Refunded)
│   └── ExportButton ("Export CSV" — future)
├── TransactionList
│   └── TransactionRow[] (table / cards)
│       ├── TxHash (truncated + copy)
│       ├── OrderLink (→ /app/orders/[id])
│       ├── Amount (monospace, right-aligned)
│       ├── CurrencyBadge
│       ├── NetworkBadge
│       ├── StatusBadge
│       ├── Date
│       ├── ExplorerLink (external)
│       └── Actions (copy + explorer + receipt + view)
├── Pagination
└── EmptyState (if no transactions)
    ├── ReceiptIcon (64px, muted)
    ├── Text ("No transactions found.")
    └── Text ("Your payment history will appear here after your first order.")
```

## Database Tables

- `payment_transactions` — all payment records
- `supported_networks` — network info
- `wallets` — user's wallet
- `card_orders` — related order

## Supabase Query

```ts
let query = supabase
  .from('payment_transactions')
  .select(`
    id, amount, currency, tx_hash, status, confirmed_at, created_at, block_number, gas_fee,
    supported_networks (name, symbol, chain_id, explorer_url, logo),
    wallets (wallet_address, wallet_provider),
    card_orders (id, status)
  `)
  .eq('profile_id', userId);

// Date range filter
if (dateRange === 'today') query = query.gte('created_at', new Date().toISOString().split('T')[0]);
if (dateRange === '7days') query = query.gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString());
if (dateRange === '30days') query = query.gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString());

// Status filter
if (statusTab !== 'all') query = query.eq('status', statusTab);

const { data: transactions } = await query.order('created_at', { ascending: false }).limit(20);
```

## States

| State | UI |
|------|-----|
| Loading | Skeleton table rows |
| Transactions present | Table with filters |
| No transactions | Empty state |
| No transactions in filter | "No transactions found for this filter" (muted) |
| Error | Error card + retry |

## Animations

| Animation | Element | Duration |
|-----------|---------|----------|
| Tab switch | Underline slide | 200ms |
| Dropdown open | Slide-down + fade | 150ms |
| Row hover | Bg highlight | 150ms |
| Copy success | Icon swap (copy → check) | 200ms |

## Accessibility

- `<section aria-label="Transaction History">`
- Table: `<th scope>` on headers
- Tx hash: `aria-label="Transaction hash: [full hash]"`
- Copy: `aria-label="Copy transaction hash"`, announces "Copied"
- Explorer: `rel="noopener noreferrer"`, `aria-label="View on [explorer]"`
- Status badges: text + icon (not color alone)
- Amount: right-aligned, tabular-nums
- Date range dropdown: `aria-label="Filter by date range"`
