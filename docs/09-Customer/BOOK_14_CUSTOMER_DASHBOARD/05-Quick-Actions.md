# 05 — Quick Actions

> Component ID: DB-005 | Status: Approved
> Row of 6 action buttons for the most common dashboard tasks.

## Purpose

Provide one-click access to the most common actions a user needs to perform.

## Layout

- **Full width** (12 columns)
- **Layout:** Horizontal row of 6 buttons (desktop) / 3x2 grid (tablet) / 2x3 grid (mobile)
- **Gap:** `--space-4` (16px)

## Quick Actions (6)

| Action | Icon | Route | Variant |
|--------|------|-------|---------|
| Connect Wallet | Wallet | `/app/wallet` | Primary (if not connected) / Ghost (if connected) |
| Order Card | CreditCard | `/app/order` | Primary |
| Track Order | Package | `/app/orders` | Secondary |
| View Transactions | ArrowLeftRight | `/app/transactions` | Secondary |
| Support | LifeBuoy | `/app/support` | Ghost |
| Settings | Settings | `/app/settings` | Ghost |

## Button Design

| Property | Value |
|----------|-------|
| Layout | Icon (20px) + label (14px, 500), horizontal |
| Height | 48px |
| Padding | 12px / 20px |
| Radius | `--radius-button` (14px) |
| Full width | No (auto width, centered in grid cell) |

## Component Tree

```
QuickActions (RSC)
├── SectionLabel ("Quick Actions" — 14px, 600, `--color-heading`, uppercase)
└── ActionGrid (6 columns / 3x2 / 2x3)
    ├── ActionButton (Wallet, "Connect Wallet", → /app/wallet, primary)
    ├── ActionButton (CreditCard, "Order Card", → /app/order, primary)
    ├── ActionButton (Package, "Track Order", → /app/orders, secondary)
    ├── ActionButton (ArrowLeftRight, "View Transactions", → /app/transactions, secondary)
    ├── ActionButton (LifeBuoy, "Support", → /app/support, ghost)
    └── ActionButton (Settings, "Settings", → /app/settings, ghost)
```

## Component Props

```ts
interface QuickActionsProps {
  walletConnected: boolean;
}

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  route: string;
  variant: 'primary' | 'secondary' | 'ghost';
}
```

## Conditional Behavior

| Condition | Behavior |
|-----------|----------|
| Wallet not connected | "Connect Wallet" = primary variant (emphasized) |
| Wallet connected | "Connect Wallet" = ghost variant (de-emphasized); label changes to "Manage Wallet" |
| No orders | "Track Order" still visible (leads to empty state) |

## States

| State | Behavior |
|-------|----------|
| Loading | Skeleton buttons (gray blocks) |
| Ready | Full buttons with icons + labels |

## Animations

| Animation | Element | Duration |
|-----------|---------|----------|
| Stagger fade-in | Buttons | 100ms each (max 6) |
| Hover | Button bg color | 150ms |
| Hover | Icon scale(1.1) | 200ms |

### prefers-reduced-motion
- Disable: stagger (show all at once), icon scale
- Keep: hover color (essential feedback)

## Accessibility

- `<section aria-label="Quick Actions">`
- Each button: `aria-label="[Action label]"`
- Keyboard: Tab through buttons, Enter to navigate
- Icons: `aria-hidden="true"` (label conveys meaning)
