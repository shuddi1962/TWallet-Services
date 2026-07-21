# 08 — Order Management

> Component ID: ADM-008 | Status: Approved
> Full order lifecycle — search, filter, update status, assign tracking, generate invoices, contact customers.

## Route

`/admin/orders` — Server Component + Client for actions

## Access

- Super Admin, Operations: full CRUD on all order lifecycle actions
- Finance: read-only + export

## Features

### Table (20 columns — scrollable horizontally)

| Column | Filterable | Sortable |
|--------|-----------|----------|
| Order ID | Search | Yes |
| Customer | Search (name/email) | Yes |
| Card Product | Dropdown | Yes |
| Type | Physical/Virtual | Yes |
| Status | Multi-select | Yes |
| Amount | Min/Max | Yes |
| Paid (USDC) | — | Yes |
| Balance | — | Yes |
| Network | Dropdown | Yes |
| Tx Hash | Search | — |
| Shipping Status | Dropdown | Yes |
| Tracking # | Search | Yes |
| Carrier | Dropdown | Yes |
| Country | Dropdown | Yes |
| Admin Note | Has/No note | — |
| Created | Date range | Yes |
| Paid At | Date range | Yes |
| Delivered | Date range | Yes |
| Flagged | Flagged/Clean | Yes |
| Actions | Menu | — |

### Order Statuses

From Book 11 state machine: `pending` → `paid` → `processing` → `shipped` → `delivered` | `cancelled` | `refunded`

### Actions (Dropdown per row)

| Action | Behavior | Role |
|--------|----------|------|
| View | Opens order detail page/drawer | All |
| Update Status | Dropdown with valid transitions (per Book 11 state machine) | Super Admin, Operations |
| Assign Tracking | Modal: carrier + tracking number | Super Admin, Operations |
| Generate Invoice | Creates PDF invoice, downloads | Super Admin, Operations, Finance |
| Contact Customer | Opens email modal | Super Admin, Operations |
| Flag | Sets `flagged = true`, requires reason | Super Admin, Operations |
| Mark Paid | Manual override (only if on-chain failed) | Super Admin |
| Refund | Confirmation → status to `refunded` | Super Admin, Operations |
| Delete | Soft delete | Super Admin |

### Order Detail (`/admin/orders/[id]`)

| Section | Data |
|---------|------|
| Order Info | ID, status (badge), created, paid at, delivered |
| Customer | Name, email, country, wallet address |
| Product | Card name, type, network, tokens |
| Payment | Tx hash, amount, balance, network, from address, confirmations |
| Shipping | Name, address, city, country, tracking, carrier, status |
| Timeline | Status history with timestamps + admin who performed |
| Admin Notes | Add/view internal notes |

### Filters

| Filter | Type |
|--------|------|
| Search (ID, customer, tx hash, tracking) | Text, debounced 300ms |
| Status | Multi-select badges |
| Card Product | Dropdown |
| Type | Physical/Virtual |
| Network | Dropdown |
| Country | Select with search |
| Amount Range | Min/Max inputs |
| Date Range (created, paid) | Date pickers |
| Flagged | Toggle |
| Shipping Status | Dropdown |

### Bulk Actions

| Action | Description |
|--------|-------------|
| Export Selected | CSV of selected rows |
| Update Status | Batch status change (e.g., processing → shipped) |

## Component Tree

```
AdminOrdersPage (Server Component)
├── PageHeader ("Orders" + count)
├── FilterBar (search, status multi-select, card, type, network, country, amount, date range, flagged, shipping)
├── BulkActionBar (shows when rows selected: count, Export, Batch Status)
├── OrdersTable (Client — horizontal scroll DataTable)
│   ├── TableHeader (all 20 columns, sortable)
│   └── OrderRow
│       ├── CheckboxCell
│       ├── OrderIDCell (clickable → detail)
│       ├── CustomerCell
│       ├── ProductCell
│       ├── TypeBadge (Physical/Virtual)
│       ├── StatusBadge (color-coded per status)
│       ├── AmountCell + PaidCell + BalanceCell
│       ├── NetworkCell
│       ├── TxHashCell (truncated, clickable → explorer)
│       ├── ShippingStatusCell
│       ├── TrackingCell
│       ├── CarrierCell
│       ├── CountryCell
│       ├── NoteIndicator (paperclip icon if has note)
│       ├── CreatedCell + PaidCell + DeliveredCell
│       ├── FlaggedBadge
│       └── ActionsDropdown
├── Pagination
└── OrderDetailDrawer (sliding panel)
    ├── OrderInfoSection
    ├── CustomerSection
    ├── ProductSection
    ├── PaymentSection
    ├── ShippingSection
    ├── TimelineSection
    └── AdminNotesSection
```

## Server Actions

```ts
updateOrderStatus(orderId: string, status: OrderStatus): Promise<ActionResult>
assignTracking(orderId: string, carrier: string, trackingNumber: string): Promise<ActionResult>
generateInvoice(orderId: string): Promise<{ url: string }>
flagOrder(orderId: string, reason: string): Promise<ActionResult>
unflagOrder(orderId: string): Promise<ActionResult>
refundOrder(orderId: string, reason: string): Promise<ActionResult>
markOrderPaid(orderId: string, txHash: string): Promise<ActionResult>
addOrderNote(orderId: string, note: string): Promise<ActionResult>
bulkUpdateStatus(orderIds: string[], status: OrderStatus): Promise<ActionResult>
exportOrders(orderIds: string[], format: 'csv' | 'excel'): Promise<{ url: string }>
```

## States

| State | UI |
|-------|-----|
| Loading | Skeleton table |
| Empty | "No orders yet" |
| Filtered empty | "No orders match your filters" + Reset |
| Flagged order | Row highlighted (amber) with flag icon |
| Error | "Failed to load orders" + Retry |
