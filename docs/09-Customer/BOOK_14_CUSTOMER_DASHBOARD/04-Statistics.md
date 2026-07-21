# 04 — Statistics

> Component ID: DB-004 | Status: Approved
> 4 stat cards with animated counters and hover lift.

## Purpose

Give users an at-a-glance view of their account activity and status.

## Layout

| Breakpoint | Layout |
|------------|--------|
| Desktop | 4 columns (3+3+3+3) |
| Tablet | 2x2 grid |
| Mobile | 2x2 grid or stacked |

## Stat Cards (4)

| Stat | Value Source | Icon | Color |
|------|-------------|------|-------|
| Wallets Connected | COUNT wallets WHERE deleted_at IS NULL | Wallet | `--color-primary` |
| Active Orders | COUNT card_orders WHERE status IN ('pending','paid','processing','shipped') | ShoppingBag | `--color-warning` |
| Transactions | COUNT payment_transactions WHERE status = 'confirmed' | ArrowLeftRight | `--color-success` |
| Notifications | COUNT notifications WHERE read = false | Bell | `--color-info` |

## Card Design

| Property | Value |
|----------|-------|
| Background | `--color-surface` (#FFFFFF) |
| Border | 1px `--color-border` |
| Radius | 24px |
| Shadow (resting) | `--shadow-md` |
| Shadow (hover) | `--shadow-lg` + translateY(-2px) |
| Padding | `--space-6` (24px) |

### Card Content
- **Icon:** 24px, in 48px circle (color-tinted bg at 10% opacity)
- **Label:** 14px, 500, `--color-body` (uppercase, letter-spacing 0.04em)
- **Value:** 32px, 700, `--color-heading`, tabular-nums

## Counter Animation

```
0 → Real Number
```

- **Trigger:** When card scrolls into view (or on page load)
- **Duration:** 800ms, easeOut
- **Stagger:** 100ms between cards
- **Implementation:** `useCountUp` hook

## Component Tree

```
StatsGrid (RSC + Client count-up)
├── StatsCard (icon=Wallet, label="WALLETS CONNECTED", value={walletCount})
├── StatsCard (icon=ShoppingBag, label="ACTIVE ORDERS", value={orderCount})
├── StatsCard (icon=ArrowLeftRight, label="TRANSACTIONS", value={txCount})
└── StatsCard (icon=Bell, label="NOTIFICATIONS", value={notifCount})
```

## Component Props

```ts
interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  color?: string;  // default: --color-primary
  isLoading?: boolean;
}
```

## States

| State | Behavior |
|-------|----------|
| Loading | Skeleton card (gray block, shimmer, same shape) |
| Loaded | Stat with count-up animation |
| Error | Error card: "Failed to load" + retry |
| Zero | Show "0" (no special empty state for stats) |

## Supabase Queries

```ts
const [wallets, orders, transactions, notifications] = await Promise.all([
  supabase.from('wallets').select('*', { count: 'exact', head: true }).eq('profile_id', userId).is('deleted_at', null),
  supabase.from('card_orders').select('*', { count: 'exact', head: true }).eq('profile_id', userId).in('status', ['pending','paid','processing','shipped']),
  supabase.from('payment_transactions').select('*', { count: 'exact', head: true }).eq('profile_id', userId).eq('status', 'confirmed'),
  supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('profile_id', userId).eq('read', false),
]);
```

## Animations

| Animation | Element | Duration |
|-----------|---------|----------|
| Count-up | Value numbers | 800ms easeOut |
| Stagger | Cards | 100ms each |
| Hover lift | Cards | 150ms (translateY -2px) |
| Icon scale-in | Icon circles | 200ms |

### prefers-reduced-motion
- Disable: count-up (show final value), hover lift
- Keep: simple fade-in

## Accessibility

- `<section aria-label="Dashboard Statistics">`
- Each card: `aria-label="[label]: [value]"`
- Values: tabular-nums
- Icons: `aria-hidden="true"`
