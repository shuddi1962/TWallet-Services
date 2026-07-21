# 12 — Notifications

> Component ID: ADM-012 | Status: Approved
> Admin notification system — real-time alerts for important events.

## Route

`/admin/notifications` — Server + Client

## Access

- All admin roles (role-filtered content)

## Notification Types (7)

| Type | Icon | Color | Description | Roles |
|------|------|-------|-------------|-------|
| New Order | ShoppingBag | Primary | Customer places new card order | All |
| New Payment | Coins | Success | Payment confirmed on-chain | Finance, Super Admin |
| Failed Payment | XCircle | Danger | Payment verification failed | Finance, Super Admin |
| Flagged Payment | AlertTriangle | Warning | Payment flagged by admin or rules | Finance, Super Admin |
| New Ticket | LifeBuoy | Info | Customer opens support ticket | Support, Super Admin |
| Urgent Ticket | AlertTriangle | Danger | Urgent priority ticket submitted | Support, Super Admin |
| System Alert | Activity | Warning | System health issue (e.g., API down) | Super Admin |

## Notification Center (Dropdown in Top Header)

- Bell icon with unread count badge
- Last 10 notifications listed
- Each: icon + title + timestamp + relative time ("2m ago")
- Click → navigate to relevant section
- "Mark all as read" link
- "View all" → `/admin/notifications`

## Notifications Page

### Table

| Column | Sortable |
|--------|----------|
| Type | Icon + label |
| Message | Text |
| Related To | Link to order/payment/user/ticket |
| Read | Checkmark / Unread dot |
| Created | Relative + absolute time |

### Actions

- Mark as Read (single + bulk)
- Mark all as Read
- Delete (single notification)

### Filters

| Filter | Type |
|--------|------|
| Type | Multi-select badges |
| Read/Unread | Toggle |
| Date Range | Date pickers |

## Real-time

- Supabase Realtime channel on `admin_notifications` table
- Badge updates in real-time
- Toast notification appears (top right) for new notifications
- Toast auto-dismisses after 5 seconds

## Supabase Table

```sql
CREATE TABLE admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  type NOT NULL,  -- new_order | new_payment | failed_payment | flagged_payment | new_ticket | urgent_ticket | system_alert
  title VARCHAR(200) NOT NULL,
  message TEXT,
  related_type VARCHAR(50),  -- 'order' | 'payment' | 'ticket' | 'user'
  related_id UUID,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_notifications_admin_id_read ON admin_notifications(admin_id, read);
```

## Component Tree

```
AdminNotificationsPage (Server Component)
├── PageHeader ("Notifications" + unread count)
├── FilterBar (type, read/unread, date)
├── NotificationsList (Client — realtime)
│   └── NotificationItem
│       ├── TypeIcon (color-coded)
│       ├── Content
│       │   ├── Title (bold if unread)
│       │   ├── Message (truncated)
│       │   └── Timestamp (relative)
│       ├── RelatedLink (if applicable)
│       ├── ReadDot (unread = blue dot)
│       └── ActionsButton (Mark Read, Delete)
└── NotificationBell (Client — top header dropdown)
```

## Server Actions

```ts
markNotificationRead(id: string): Promise<ActionResult>
markAllNotificationsRead(): Promise<ActionResult>
deleteNotification(id: string): Promise<ActionResult>
```

## States

| State | UI |
|-------|-----|
| Loading | Skeleton list |
| Empty (all read) | "All caught up!" + checkmark illustration |
| Empty (no notifs) | "No notifications yet" |
| Unread | Bold title + blue dot |
| Error | "Failed to load notifications" + Retry |
