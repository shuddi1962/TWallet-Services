# 07 — Card Products

> Component ID: ADM-007 | Status: Approved
> Manage card product catalog — create, edit, archive, duplicate, preview.

## Route

`/admin/cards` — Server Component + Client for editing

## Access

- Super Admin, Operations: CRUD
- Finance, Support, Viewer: read-only

## Features

### Table

| Column | Type | Sortable | Filterable |
|--------|------|----------|------------|
| Name | Text + thumbnail | Yes | Search |
| Type | Physical/Virtual | Yes | Dropdown |
| Network | Network name | Yes | Dropdown |
| Price | USDC amount | Yes | Min/Max |
| Status | Active/Archived | Yes | Dropdown |
| Orders | Count badge | Yes | — |
| Created | Date | Yes | — |
| Actions | Dropdown menu | — | — |

### Card Detail / Edit (Drawer or page)

| Field | Type | Validation |
|-------|------|------------|
| Name | Text input | Required, 3-50 chars |
| Type | Select (Physical/Virtual) | Required |
| Description | Textarea | Required, max 500 |
| Price | Number input (USDC) | Required, > 0 |
| Annual Fee | Number input (USDC) | Optional, ≥ 0 |
| Network(s) | Multi-select | Required, at least 1 |
| Token(s) | Multi-select | Required, at least 1 |
| Currency | Select (USD/EUR/GBP) | Required |
| Card Art | Image upload | Optional, 2MB max, PNG/JPG |
| Active | Toggle | — |

### Actions (Dropdown per row)

| Action | Behavior |
|--------|----------|
| Edit | Opens edit drawer |
| Duplicate | Pre-fills new card form with existing data |
| Archive | Confirmation → sets `archived_at` |
| Activate | If archived, sets `archived_at = null` |
| Preview | Opens card preview (CSS 3D card mockup) |
| View Orders | Filters orders by `product_id` |

### Card Preview

- Visual card mockup matching Customer Dashboard (`/app/cards` concept)
- Chip, name, type, network, brand colors
- CSS 3D tilt effect (on desktop hover)

## Component Tree

```
AdminCardsPage (Server Component)
├── PageHeader ("Cards")
│   ├── Heading + Count
│   ├── SearchInput
│   ├── Filters (type, status, network, price range)
│   └── CreateCardButton (Super Admin, Operations)
├── CardsTable (Client — DataTable)
│   ├── TableHeader
│   └── CardRow (per card product)
│       ├── NameCell (thumbnail + name)
│       ├── TypeBadge (Physical/Virtual)
│       ├── NetworkBadges
│       ├── PriceCell ($X USDC)
│       ├── StatusBadge (Active/Archived)
│       ├── OrdersCount
│       ├── DateCell
│       └── ActionsDropdown
└── CardDrawer (Sliding drawer for view/edit)
    ├── FormFields (name, type, description, price, annual fee, networks, tokens, currency, art)
    ├── CardPreview (side panel — CSS 3D card)
    └── SaveButton / CancelButton
```

## Server Actions

```ts
createCardProduct(data: CreateCardInput, image?: File): Promise<ActionResult>
updateCardProduct(id: string, data: UpdateCardInput, image?: File): Promise<ActionResult>
archiveCardProduct(id: string): Promise<ActionResult>
activateCardProduct(id: string): Promise<ActionResult>
duplicateCardProduct(id: string): Promise<ActionResult>
```

## States

| State | UI |
|-------|-----|
| Loading | Skeleton table |
| Empty | "No card products yet" + Create Card button |
| Filtered empty | "No cards match your filters" |
| Archived card | Row dimmed, "Archived" badge, muted name |
| Error | "Failed to load cards" + Retry |
