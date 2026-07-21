# Notifications API

> Base route: `/api/v1/notifications`
> Manage the current user's in-app and push notification preferences. Data sourced from `admin_notifications` for admin users; user notifications are in-app only for MVP.

---

## GET /api/v1/notifications

List the current user's notifications.

**Auth:** JWT required

### Query
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| type | string | — | Filter: `new_order`, `new_payment`, `payment_confirmed`, `shipping_update`, `support_reply`, `system`, `promotion` |
| read | bool | — | Filter by read status |
| page_size | int | 20 | Max 50 |
| cursor | string | — | Pagination cursor |

### Response `200`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "payment_confirmed",
      "title": "Payment Confirmed",
      "message": "Your payment of $50 USDC for Visa Platinum has been confirmed.",
      "related_type": "order",
      "related_id": "uuid",
      "read": false,
      "created_at": "2026-07-21T10:05:00Z"
    }
  ],
  "unread_count": 3,
  "pagination": { "cursor": "...", "has_more": true }
}
```

---

## PATCH /api/v1/notifications/read

Mark one or more notifications as read.

**Auth:** JWT required

### Request
```json
{
  "ids": ["uuid-1", "uuid-2"],
  "all": false
}
```

Use `"all": true` to mark all as read (omit `ids`).

### Response `200`
```json
{
  "success": true,
  "message": "Notifications marked as read",
  "data": { "marked_count": 2 }
}
```

---

## DELETE /api/v1/notifications/{id}

Delete a single notification.

**Auth:** JWT required (must own the notification)

### Response `200`
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

### Errors
| Code | Status | Condition |
|------|--------|-----------|
| NOTIF_001 | 404 | Notification not found |

---

## GET /api/v1/notifications/preferences

Get notification channel preferences.

**Auth:** JWT required

### Response `200`
```json
{
  "success": true,
  "data": {
    "email": {
      "order_confirmed": true,
      "payment_received": true,
      "shipping_update": true,
      "support_reply": true
    },
    "push": {
      "order_status": true,
      "payment_confirmed": true,
      "support_reply": false,
      "promotions": false
    }
  }
}
```

---

## PATCH /api/v1/notifications/preferences

Update notification preferences.

**Auth:** JWT required

### Request
```json
{
  "email": { "shipping_update": false },
  "push": { "promotions": true }
}
```

### Response `200`
```json
{
  "success": true,
  "message": "Preferences updated",
  "data": { ... }
}
```
