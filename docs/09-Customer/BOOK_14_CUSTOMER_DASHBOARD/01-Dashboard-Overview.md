# 01 — Dashboard Overview

> Component ID: DB-001 | Status: Approved
> The main dashboard page composing all widgets in a 12-column grid.

## Purpose

The dashboard is the user's command center. Every important action should be accessible within two clicks. It provides an at-a-glance view of everything happening in the user's account.

## Route

`/app` — Server Component shell + Client islands for interactive widgets

## Page Composition (Top to Bottom)

| Section | Columns | Component Type | File |
|---------|---------|---------------|------|
| Welcome Banner | 12 | RSC | 03-Welcome-Banner.md |
| Statistics (4 cards) | 3+3+3+3 | RSC + Client (count-up) | 04-Statistics.md |
| Quick Actions | 12 | RSC | 05-Quick-Actions.md |
| Wallet Overview | 8 | RSC + Client | 06-Wallet-Overview.md |
| Notifications | 4 | RSC + Client (Realtime) | 11-Notifications.md |
| Recent Orders | 8 | RSC | 09-Order-Management.md |
| Recent Transactions | 4 | RSC | 10-Transaction-History.md |
| Activity Timeline | 12 | RSC | 15-Activity-Timeline.md |

## Grid Layout (Desktop)

```
┌────────────────────────────────────────────────────┐
│  Welcome Banner (12 cols)                          │
├────────────────────────────────────────────────────┤
│  [Stat 1] [Stat 2] [Stat 3] [Stat 4]  (3+3+3+3)   │
├────────────────────────────────────────────────────┤
│  Quick Actions (12 cols)                           │
├──────────────────────────┬─────────────────────────┤
│  Wallet Overview (8)     │  Notifications (4)      │
├──────────────────────────┬─────────────────────────┤
│  Recent Orders (8)       │  Recent Transactions(4) │
├──────────────────────────┴─────────────────────────┤
│  Activity Timeline (12 cols)                       │
└────────────────────────────────────────────────────┘
```

## Theme

| Property | Value |
|----------|-------|
| Background | `--color-bg` (#F8FAFC) |
| Cards | `--color-surface` (#FFFFFF) |
| Radius | 24px (per user spec) |
| Gap | 32px (`--space-8`) |
| Shadow | `--shadow-md` (soft) |

## Component Tree

```
DashboardOverview (Server Component)
├── AppLayout (sidebar + topbar)
│   ├── Sidebar (nav: Overview, Cards, Orders, Transactions, Wallet, Profile, Security, Settings)
│   └── TopBar (search, notifications, profile menu)
└── DashboardContent
    ├── WelcomeBanner
    ├── StatsGrid
    │   ├── StatsCard (Wallets Connected)
    │   ├── StatsCard (Active Orders)
    │   ├── StatsCard (Transactions)
    │   └── StatsCard (Notifications)
    ├── QuickActions
    ├── DashboardGrid (12 cols)
    │   ├── WalletOverview (8 cols)
    │   └── NotificationPanel (4 cols)
    ├── DashboardGrid (12 cols)
    │   ├── RecentOrders (8 cols)
    │   └── RecentTransactions (4 cols)
    └── ActivityTimeline (12 cols)
```

## Supabase Queries (Server-Side Data Fetching)

```ts
// Fetch all dashboard data in parallel
const [wallet, orders, transactions, notifications, stats] = await Promise.all([
  supabase.from('wallets').select('*').eq('profile_id', userId).is('deleted_at', null).single(),
  supabase.from('card_orders').select('*, card_products(*)').eq('profile_id', userId).order('created_at', { ascending: false }).limit(5),
  supabase.from('payment_transactions').select('*, supported_networks(*)').eq('profile_id', userId).order('created_at', { ascending: false }).limit(5),
  supabase.from('notifications').select('*').eq('profile_id', userId).eq('read', false).order('created_at', { ascending: false }).limit(5),
  supabase.from('activity_logs').select('*').eq('profile_id', userId).order('created_at', { ascending: false }).limit(10),
]);
```

## Performance

- Parallel data fetching (Promise.all)
- RSC for initial render (SEO not needed but fast first paint)
- Client islands for interactive widgets (wallet, notifications)
- Skeletons during load (no CLS)
- Keyset pagination for lists (if needed)

## Accessibility

- `<main>` landmark with `aria-label="Dashboard"`
- Skip-to-content link
- Heading hierarchy: h1 "Dashboard" (visually hidden or in welcome banner), h2 per section
- All widgets have `aria-label`
