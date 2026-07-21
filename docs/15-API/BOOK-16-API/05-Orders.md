# Orders API

> Base route: `/api/v1/orders`
> All endpoints require JWT auth. Users access their own orders; admins access all orders via `/api/v1/admin/orders`.

---

## GET /api/v1/orders

List the current user's orders with optional filters.

**Auth:** JWT required

### Query
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| status | string | — | Comma-separated statuses |
| card_slug | string | — | Filter by card |
| date_from | ISO 8601 | — | Start date |
| date_to | ISO 8601 | — | End date |
| page_size | int | 20 | Results per page |
| cursor | string | — | Pagination cursor |

### Response `200`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "order_number": "ORD-20260721-XXXX",
      "card": {
        "name": "Visa Platinum",
        "slug": "visa-platinum",
        "type": "physical",
        "card_art_url": "https://..."
      },
      "status": "paid",
      "amount_usdc": "50.00",
      "paid_usdc": "50.00",
      "balance_usdc": "0.00",
      "network": "ethereum",
      "token": "USDC",
      "tx_hash": "0x...",
      "shipping_status": "processing",
      "tracking_number": null,
      "carrier": null,
      "created_at": "2026-07-21T10:00:00Z",
      "paid_at": "2026-07-21T10:05:00Z",
      "estimated_delivery": "2026-07-28"
    }
  ],
  "pagination": { "cursor": "...", "has_more": false }
}
```

---

## GET /api/v1/orders/{id}

Get full order details.

**Auth:** JWT required (order owner or admin)

### Response `200`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_number": "ORD-20260721-XXXX",
    "status": "paid",
    "card": { "name": "Visa Platinum", "type": "physical" },
    "amount_usdc": "50.00",
    "paid_usdc": "50.00",
    "balance_usdc": "0.00",
    "network": "ethereum",
    "token": "USDC",
    "tx_hash": "0x...",
    "receiving_address": "0x...",
    "shipping_address": {
      "full_name": "John Doe",
      "line1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "US"
    },
    "shipping_status": "processing",
    "tracking_number": null,
    "carrier": null,
    "admin_note": null,
    "timeline": [
      { "status": "pending", "timestamp": "2026-07-21T10:00:00Z" },
      { "status": "paid", "timestamp": "2026-07-21T10:05:00Z" },
      { "status": "processing", "timestamp": "2026-07-21T11:00:00Z" }
    ],
    "created_at": "2026-07-21T10:00:00Z",
    "paid_at": "2026-07-21T10:05:00Z",
    "updated_at": "2026-07-21T11:00:00Z"
  }
}
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| ORDER_001 | 404 | Order not found |
| ORDER_004 | 403 | Not authorized to view this order |

---

## PATCH /api/v1/orders/{id}/cancel

Cancel an order (only if status is `pending`).

**Auth:** JWT required (order owner)

### Response `200`
```json
{
  "success": true,
  "message": "Order cancelled",
  "data": { "id": "uuid", "status": "cancelled" }
}
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| ORDER_005 | 409 | Order cannot be cancelled in current status |
| ORDER_001 | 404 | Order not found |

---

## GET /api/v1/orders/tracking/{tracking_number}

Look up an order by tracking number (no auth required — printed on shipping label).

**Auth:** None

### Response `200`
```json
{
  "success": true,
  "data": {
    "order_number": "ORD-20260721-XXXX",
    "status": "shipped",
    "carrier": "UPS",
    "tracking_number": "1Z999AA10123456784",
    "estimated_delivery": "2026-07-28",
    "events": [
      { "location": "New York, NY", "status": "Picked up", "timestamp": "2026-07-22T14:00:00Z" },
      { "location": "Newark, NJ", "status": "In transit", "timestamp": "2026-07-22T18:00:00Z" }
    ]
  }
}
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| ORDER_001 | 404 | No order found with this tracking number |

---

## GET /api/v1/orders/{id}/invoice

Download order invoice as PDF.

**Auth:** JWT required (order owner)

### Response `200`
Content-Type: `application/pdf`
Body: PDF file bytes

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| ORDER_001 | 404 | Order not found |
