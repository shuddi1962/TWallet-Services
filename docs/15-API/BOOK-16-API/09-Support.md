# Support API

> Base route: `/api/v1/support`
> Customer-facing support ticket management. Admin ticket management is at `/api/v1/admin/support`.

---

## GET /api/v1/support/tickets

List the current user's support tickets.

**Auth:** JWT required

### Query
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| status | string | — | `open`, `pending`, `resolved`, `closed` |
| page_size | int | 20 | Max 50 |
| cursor | string | — | Pagination cursor |

### Response `200`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "ticket_number": "TKT-20260721-001",
      "subject": "Where is my card?",
      "category": "shipping",
      "priority": "medium",
      "status": "open",
      "last_reply_at": "2026-07-21T14:00:00Z",
      "last_reply_from": "admin",
      "message_count": 3,
      "created_at": "2026-07-20T10:00:00Z"
    }
  ],
  "pagination": { "cursor": "...", "has_more": false }
}
```

---

## POST /api/v1/support/tickets

Create a new support ticket.

**Auth:** JWT required

### Request
```json
{
  "subject": "Where is my card?",
  "message": "I ordered my Visa Platinum on July 15 but haven't received shipping information.",
  "category": "shipping",
  "priority": "medium",
  "order_id": "uuid",
  "attachments": [
    { "url": "https://...", "name": "screenshot.png", "mime_type": "image/png" }
  ]
}
```

### Validation
```ts
const createTicketSchema = z.object({
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(5000),
  category: z.enum(['shipping', 'payment', 'card', 'account', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  order_id: z.string().uuid().optional(),
  attachments: z.array(z.object({
    url: z.string().url(),
    name: z.string().max(255),
    mime_type: z.string().max(100),
  })).max(5).optional(),
});
```

### Response `201`
```json
{
  "success": true,
  "message": "Ticket created. We'll respond within 24 hours.",
  "data": {
    "id": "uuid",
    "ticket_number": "TKT-20260721-001",
    "status": "open",
    "created_at": "2026-07-21T15:00:00Z"
  }
}
```

---

## GET /api/v1/support/tickets/{id}

Get ticket details with full message history.

**Auth:** JWT required (ticket owner or admin)

### Response `200`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "ticket_number": "TKT-20260721-001",
    "subject": "Where is my card?",
    "category": "shipping",
    "priority": "medium",
    "status": "open",
    "order_id": "uuid",
    "created_at": "2026-07-20T10:00:00Z",
    "messages": [
      {
        "id": "uuid",
        "author": "customer",
        "author_name": "John Doe",
        "message": "I ordered my Visa Platinum on July 15...",
        "attachments": [{ "url": "...", "name": "screenshot.png", "mime_type": "image/png" }],
        "created_at": "2026-07-20T10:00:00Z"
      },
      {
        "id": "uuid",
        "author": "admin",
        "author_name": "Sarah (Support)",
        "message": "Hi John, let me check the status of your order.",
        "created_at": "2026-07-20T14:00:00Z"
      }
    ]
  }
}
```

---

## PATCH /api/v1/support/tickets/{id}

Update ticket properties (close, reopen, change priority).

**Auth:** JWT required (ticket owner)

### Request
```json
{
  "status": "closed"
}
```

### Response `200`
```json
{
  "success": true,
  "message": "Ticket closed",
  "data": { "id": "uuid", "status": "closed" }
}
```

---

## POST /api/v1/support/tickets/{id}/reply

Reply to a support ticket.

**Auth:** JWT required (ticket owner)

### Request
```json
{
  "message": "Thank you for looking into this!",
  "attachments": []
}
```

### Response `201`
```json
{
  "success": true,
  "message": "Reply sent",
  "data": {
    "id": "uuid",
    "author": "customer",
    "message": "Thank you for looking into this!",
    "created_at": "2026-07-21T15:30:00Z",
    "ticket_status": "pending"
  }
}
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| TICKET_001 | 404 | Ticket not found |
| TICKET_002 | 400 | Cannot reply to a closed ticket |
