# 01 — Admin Dashboard Overview

> Component ID: ADM-001 | Status: Approved
> The main admin page with statistics, widgets, and activity feed.

## Purpose

Provide administrators with an overview of platform activity. Everything important at a glance.

## Route

`/admin` — Server Component + Client islands for charts

## Dashboard Cards (8)

| Card | Value Source | Icon | Color |
|------|-------------|------|-------|
| Total Users | COUNT profiles WHERE deleted_at IS NULL | Users | `--color-primary` |
| Active Wallets | COUNT wallets WHERE deleted_at IS NULL | Wallet | `--color-info` |
| Pending Orders | COUNT card_orders WHERE status = 'pending' | Clock | `--color-warning` |
| Completed Orders | COUNT card_orders WHERE status IN ('delivered','completed') | CheckCircle | `--color-success` |
| Revenue | SUM payment_transactions.amount WHERE status = 'confirmed' | DollarSign | `--color-success` |
| Support Tickets | COUNT support_tickets WHERE status IN ('open','pending') | LifeBuoy | `--color-warning` |
| System Health | Status indicator (Healthy/Degraded/Down) | Activity | `--color-success` |
| Today's Transactions | COUNT payment_transactions WHERE created_at = today AND status = 'confirmed' | ArrowLeftRight | `--color-primary` |

- 4-column grid (desktop) / 2x4 (tablet) / 2x4 (mobile)
- Cards: white bg, 20px radius, `--shadow-md`, hover lift
- Values: count-up animation (800ms)

## Widgets (6)

### 1. Recent Orders
- Table: 5 most recent orders
- Columns: Order ID, Customer, Card Type, Status (badge), Amount, Date
- "View All" → `/admin/orders`

### 2. Recent Payments
- Table: 5 most recent verified payments
- Columns: Tx Hash (truncated), Amount, Currency, Network, Status, Date
- "View All" → `/admin/payments`

### 3. Recent Signups
- List: 5 most recent user registrations
- Columns: Name, Email, Country, Joined Date
- "View All" → `/admin/users`

### 4. Recent Support Tickets
- List: 5 most recent open tickets
- Columns: Ticket #, Subject, Priority (badge), Status, Created
- "View All" → `/admin/support`

### 5. System Alerts
- List: recent system warnings/errors
- Color-coded by severity (warning=amber, error=red)
- "View All" → `/admin/health`

### 6. Activity Feed
- Timeline: 10 most recent admin actions
- Columns: Admin, Action, Target, Timestamp
- "View All" → `/admin/audit`

## Component Tree

```
AdminOverview (Server Component + Client charts)
├── AdminLayout (sidebar + topbar)
└── AdminContent
    ├── PageHeader
    │   ├── Heading ("Dashboard")
    │   └── EnvironmentBadge ("Production" — danger color)
    ├── StatsGrid (4 columns)
    │   ├── StatsCard (Total Users)
    │   ├── StatsCard (Active Wallets)
    │   ├── StatsCard (Pending Orders)
    │   ├── StatsCard (Completed Orders)
    │   ├── StatsCard (Revenue)
    │   ├── StatsCard (Support Tickets)
    │   ├── StatsCard (System Health)
    │   └── StatsCard (Today's Transactions)
    ├── WidgetsGrid (3 columns)
    │   ├── RecentOrdersWidget
    │   ├── RecentPaymentsWidget
    │   ├── RecentSignupsWidget
    │   ├── RecentTicketsWidget
    │   ├── SystemAlertsWidget
    │   └── ActivityFeedWidget
    └── ChartsSection (see 04-Dashboard-Widgets.md)
```

## Supabase Queries

```ts
const [stats, recentOrders, recentPayments, recentUsers, recentTickets, alerts, activity] = await Promise.all([
  // Stats counts
  supabase.from('profiles').select('*', { count: 'exact', head: true }).is('deleted_at', null),
  supabase.from('wallets').select('*', { count: 'exact', head: true }).is('deleted_at', null),
  supabase.from('card_orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  supabase.from('card_orders').select('*', { count: 'exact', head: true }).in('status', ['delivered','completed']),
  supabase.from('payment_transactions').select('amount').eq('status', 'confirmed'),
  supabase.from('support_tickets').select('*', { count: 'exact', head: true }).in('status', ['open','pending']),
  // Recent data
  supabase.from('card_orders').select('*, profiles(full_name, email), card_products(name, type)').order('created_at', { ascending: false }).limit(5),
  supabase.from('payment_transactions').select('*, supported_networks(name, logo)').order('created_at', { ascending: false }).limit(5),
  supabase.from('profiles').select('full_name, email, country, created_at').order('created_at', { ascending: false }).limit(5),
  supabase.from('support_tickets').select('*').in('status', ['open','pending']).order('created_at', { ascending: false }).limit(5),
  supabase.from('audit_logs').select('*, admins(profile_id)').order('created_at', { ascending: false }).limit(10),
]);
```

## Accessibility

- `<main aria-label="Admin Dashboard">`
- Each stats card: `aria-label="[label]: [value]"`
- Tables: `<th scope>` on headers
- Environment badge: `aria-label="Environment: Production"`
