# 08 — Card Management

> Component ID: DB-008 | Status: Approved
> View and manage user's cards (virtual + physical), status, and order new cards.

## Purpose

Show all cards the user owns, their status, and provide a path to order new ones.

## Route

`/app/cards` — Server Component

## Layout

- Full page within app layout
- Card grid: 2 columns (desktop), 1 column (mobile)

## Page Content

### Page Header
- Heading: "My Cards" (h1, 32px, 700)
- Subtext: "View and manage your TWallet cards." (14px, `--color-body`)
- "Order New Card" button (primary, → `/app/order`)

### Card Display (Each Card)

| Element | Spec |
|---------|------|
| Card image | CSS-built card visual (from Book 13 §06 design) or image, 320x200px |
| Card type badge | "Virtual" (info) or "Physical" (primary) |
| Card status | Badge: Active (success), Pending (warning), Expired (danger), Frozen (info, future) |
| Card name | "TWallet Virtual Card" or "TWallet Physical Card" (18px, 600) |
| Last 4 | "•••• 1234" (monospace, 14px, `--color-muted`) |
| Expiry | "Expires 12/30" (14px, `--color-muted`) |
| Order date | "Ordered Jul 21, 2026" (14px, `--color-muted`) |
| Actions | "View Details" (→ `/app/cards/[id]`), "Freeze" (future), "Order Replacement" (future) |

### Empty State (No Cards)
- Illustration: CreditCard icon (64px, `--color-muted`)
- Message: "You don't have any cards yet" (16px, `--color-body`)
- CTA: "Order Your First Card" (primary button, → `/app/order`)

## Component Tree

```
CardManagement (Server Component)
├── PageHeader
│   ├── Heading ("My Cards")
│   ├── Subtext ("View and manage your TWallet cards.")
│   └── Button ("Order New Card" → /app/order, primary)
├── CardGrid (2 columns / 1 column)
│   ├── UserCard (virtual card with details)
│   ├── UserCard (physical card with details)
│   └── ...
└── [if no cards]
    └── EmptyState
        ├── CreditCardIcon (64px, muted)
        ├── Text ("You don't have any cards yet")
        └── Button ("Order Your First Card" → /app/order, primary)
```

## Component Props

```ts
interface UserCardProps {
  card: {
    id: string;
    type: 'virtual' | 'physical';
    status: 'active' | 'pending' | 'expired' | 'frozen';
    card_product: { name: string; image_url: string };
    last_four: string;
    expiry: string;
    order_date: string;
  };
}
```

## Database Tables

- `card_orders` — orders with card details
- `card_products` — card catalog (name, type, image)

## Supabase Query

```ts
const { data: cards } = await supabase
  .from('card_orders')
  .select(`
    id, status, tracking_number, estimated_delivery, created_at,
    card_products (id, name, type, image_url, price, currency)
  `)
  .eq('profile_id', userId)
  .in('status', ['paid', 'processing', 'printing', 'packaging', 'shipped', 'delivered', 'completed'])
  .order('created_at', { ascending: false });
```

## States

| State | UI |
|------|-----|
| Loading | Skeleton card grid (2 gray blocks) |
| Cards present | Grid of UserCard components |
| No cards | Empty state with "Order Your First Card" CTA |
| Error | Error card: "Failed to load cards" + retry |

## Animations

| Animation | Element | Duration |
|-----------|---------|----------|
| Stagger fade-in | Cards | 100ms each |
| Hover lift | Cards | 150ms (translateY -2px + shadow-lg) |
| Card image | Subtle tilt on hover (2deg rotateY, desktop) | 200ms |

## Accessibility

- `<section aria-label="Card Management">`
- Each card: `aria-label="[Card type] card, status: [status], last 4 digits: [last_four]"`
- Status badges: text + icon (not color alone)
- "Order New Card": `aria-label="Order a new card"`
- Card images: `alt="[Card name] card"` or `aria-hidden` if CSS-only
