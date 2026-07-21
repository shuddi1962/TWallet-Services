# 09 — Order Management

> Component ID: DB-009 | Status: Approved
> Full order management with filters, search, order details drawer, receipt download, and shipment tracking.

## Purpose

Allow customers to manage every card order from one location. View, filter, search, track, and download receipts.

## Route

`/app/orders` — Server Component + Client islands for filtering, search, and drawer

## Layout

```
Page Header
  ↓
Search + Filters
  ↓
Order Cards / Table
  ↓
Order Details Drawer (slide-in from right)
  ↓
Pagination
```

## Page Header
- Heading: "My Orders" (h1, 32px, 700)
- Subtext: "Track your card orders from payment to delivery." (14px, `--color-body`)

## Search

Global order search with debounced input (300ms):
| Searchable Field | Column |
|-----------------|--------|
| Order Number | `id` (truncated: ORD-550e...) |
| Tracking Number | `tracking_number` |
| Transaction Hash | `payment_transactions.tx_hash` |

- Placeholder: "Search by order number, tracking, or tx hash..."
- Results filter in real-time as user types
- Clear button (X) to reset search

## Filters

### Status Filter Tabs (scrollable horizontal on mobile)

| Tab | Filter |
|-----|--------|
| All Orders | No filter |
| Pending | status = 'pending' |
| Awaiting Payment | status = 'pending' (subset — no payment yet) |
| Paid | status = 'paid' |
| Processing | status = 'processing' |
| Printing | status = 'printing' |
| Packaging | status = 'packaging' |
| Shipped | status = 'shipped' |
| Delivered | status = 'delivered' |
| Cancelled | status = 'cancelled' |
| Refunded | status = 'refunded' |

- Active tab: `--color-primary` text + 2px bottom border
- Count badge per tab: "Pending (2)"
- Scrollable on mobile (overflow-x-auto with hidden scrollbar)

## Order Card (Each Order)

| Element | Spec |
|---------|------|
| Order Number | "ORD-550e8400" (monospace, 16px, 600) |
| Card Type | Badge: "Virtual" (info) or "Physical" (primary) |
| Order Date | "Jul 21, 2026" (14px, `--color-muted`) |
| Status Badge | Color-coded: Pending (warning), Paid (success), Processing (info), Shipped (info), Delivered (success), Cancelled (danger), Refunded (danger) |
| Estimated Delivery | "Est. Jul 25, 2026" (14px, `--color-muted`) — if applicable |
| Amount Paid | "50.00 USDC" (monospace, 14px, tabular-nums) |
| Network | NetworkBadge (mini — name + logo) |
| Actions | See below |

### Card Actions
| Action | Type | Behavior |
|--------|------|----------|
| View Details | Button (ghost) | Opens order details drawer (slide-in from right) |
| Download Receipt | Icon button | Downloads PDF receipt (or opens print dialog) |
| Track Shipment | Button (secondary) | Visible if shipped — links to carrier tracking page |

## Order Details Drawer

Slide-in panel from right (500px desktop / full-width mobile):

| Section | Content |
|---------|---------|
| Header | Order number, status badge, close button |
| Customer Information | Name, email, phone |
| Shipping Address | (Physical only) Full address with recipient |
| Payment Information | Tx hash (truncated + copy + explorer), amount, currency, network, verified date |
| Timeline | Visual tracking timeline: Ordered → Paid → Processing → Shipped → Delivered |
| Courier Information | Carrier name (if available) |
| Tracking Number | Carrier tracking number + external link to carrier site |
| Blockchain Transaction | Full tx hash + explorer link + block number + confirmations |
| Download Receipt | Button — downloads PDF receipt |
| Contact Support | Link — opens support with order context pre-filled |

### Tracking Timeline Design
```
●───────●───────●───────○───────○
Ordered  Paid    Shipped  Delivered
Jul 21   Jul 21  Jul 23   Pending
```
- Completed: filled circle (`--color-primary`) + label + date
- Current: filled circle (pulsing animation)
- Pending: empty circle (`--color-border`) + label (muted)

## Empty State

- Illustration: Package icon (64px, `--color-muted`)
- Message: "No orders found." (16px, `--color-body`)
- CTA: "Order Your First Card" (primary button, → `/app/order`)

## Component Tree

```
OrderManagement (Server Component + Client islands)
├── PageHeader
│   ├── Heading ("My Orders")
│   └── Subtext ("Track your card orders from payment to delivery.")
├── SearchBar (Client — debounced search)
│   ├── Input (placeholder="Search by order number, tracking, or tx hash...")
│   └── ClearButton (X)
├── FilterTabs (Client — scrollable tabs)
│   ├── Tab ("All Orders", count)
│   ├── Tab ("Pending", count)
│   ├── Tab ("Awaiting Payment", count)
│   ├── Tab ("Paid", count)
│   ├── Tab ("Processing", count)
│   ├── Tab ("Printing", count)
│   ├── Tab ("Packaging", count)
│   ├── Tab ("Shipped", count)
│   ├── Tab ("Delivered", count)
│   ├── Tab ("Cancelled", count)
│   └── Tab ("Refunded", count)
├── OrderList
│   └── OrderCard[]
│       ├── OrderHeader (order # + card type badge + status badge)
│       ├── OrderMeta (date + est. delivery + amount + network)
│       └── OrderActions
│           ├── Button ("View Details" → opens drawer)
│           ├── IconButton ("Download Receipt" → PDF)
│           └── Button ("Track Shipment" → external, if shipped)
├── OrderDetailsDrawer (slide-in panel)
│   ├── DrawerHeader (order # + status + close)
│   ├── CustomerInfo
│   ├── ShippingAddress
│   ├── PaymentInfo (tx hash + amount + network + verified date)
│   ├── TrackingTimeline (5-step visual)
│   ├── CourierInfo (carrier + tracking # + external link)
│   ├── BlockchainTransaction (full tx hash + explorer + block + confirmations)
│   ├── Button ("Download Receipt" → PDF)
│   └── Link ("Contact Support" → /app/support?order=[id])
├── Pagination (page numbers + prev/next)
└── EmptyState (if no orders)
    ├── PackageIcon (64px, muted)
    ├── Text ("No orders found.")
    └── Button ("Order Your First Card" → /app/order, primary)
```

## Database Tables

- `card_orders` — orders with status, tracking
- `card_products` — card info (name, type, price)
- `payment_transactions` — payment info (tx hash, amount, network)
- `shipping_addresses` — shipping info
- `card_status_history` — timeline data
- `supported_networks` — network info

## Supabase Query

```ts
// List with search + filter
let query = supabase
  .from('card_orders')
  .select(`
    id, status, tracking_number, estimated_delivery, created_at,
    card_products (name, type, price, currency),
    payment_transactions (tx_hash, amount, currency, status, confirmed_at, supported_networks(name, logo))
  `)
  .eq('profile_id', userId);

if (activeTab !== 'all') query = query.eq('status', activeTab);
if (search) {
  query = query.or(`id.ilike.%${search}%,tracking_number.ilike.%${search}%`);
  // For tx hash search, need a separate approach (join filter)
}

const { data: orders } = await query.order('created_at', { ascending: false }).limit(20);

// Order details with timeline
const { data: order } = await supabase
  .from('card_orders')
  .select(`
    *,
    card_products (*),
    payment_transactions (*, supported_networks (*)),
    shipping_addresses (*),
    card_status_history (*)
  `)
  .eq('id', orderId)
  .eq('profile_id', userId)
  .single();
```

## Receipt Download

- Generate a PDF receipt client-side or server-side
- Include: order number, date, card product, amount, currency, network, tx hash, status, verified date
- Use `react-to-pdf` or generate via Edge Function with a PDF library
- Filename: `TWallet-Receipt-[order-id-prefix].pdf`

## States

| State | UI |
|------|-----|
| Loading | Skeleton order cards (3-5 gray blocks) |
| Orders present | Card list with filters + search |
| No orders | Empty state + "Order Your First Card" CTA |
| No orders in filter | "No [status] orders found" (muted) |
| Search no results | "No orders match '[query]'" + clear search button |
| Drawer loading | Skeleton drawer content |
| Error | Error card + retry |

## Animations

| Animation | Element | Duration |
|-----------|---------|----------|
| Tab switch | Underline slide | 200ms |
| Card hover | Bg highlight | 150ms |
| Drawer slide-in | Panel from right | 300ms easeOut |
| Drawer slide-out | Panel to right | 200ms easeIn |
| Timeline fill | Line draw | 400ms per segment |
| Current step pulse | Circle | 2s infinite |

## Accessibility

- `<section aria-label="Order Management">`
- Search: `aria-label="Search orders"`, results announced
- Filter tabs: ARIA tabs (`role="tablist"`, `role="tab"`)
- Table/cards: each has `aria-label="Order [number], status: [status]"`
- Drawer: `role="dialog"`, `aria-modal="true"`, focus trapped, Esc closes
- Status badges: text + icon (not color alone)
- "Download Receipt": `aria-label="Download receipt for order [number]"`
- "Track Shipment": `aria-label="Track shipment for order [number]"`, `rel="noopener noreferrer"`
- Pagination: `aria-label="Pagination"`, current page `aria-current="page"`

## Acceptance Criteria

- ✓ Filter orders by status (11 filter tabs)
- ✓ Search orders by order number, tracking number, or tx hash
- ✓ View order details in slide-in drawer
- ✓ Track shipment via external carrier link
- ✓ Download receipt as PDF
- ✓ Contact support with order context
- ✓ Empty state with "Order Your First Card" CTA
- ✓ Responsive (cards on mobile, table on desktop)
- ✓ Loading skeleton states
- ✓ Accessible (ARIA, keyboard, drawer focus trap)
