# 11 — Notifications

> Component ID: DB-011 | Status: Approved
> In-app notifications with 7 types, real-time updates, and full management actions.

## Purpose

Keep users informed about important events: payments, orders, wallet changes, security, system, promotions, and support.

## Route

`/app/notifications` — RSC + Client (Realtime)

## Notification Types (7)

| Type | Icon | Color | Trigger Examples |
|------|------|-------|-----------------|
| Payment | Coins | `--color-success` | Payment confirmed, payment failed |
| Order | Package | `--color-info` | Order shipped, order delivered, order processing |
| Wallet | Wallet | `--color-primary` | Wallet connected, wallet disconnected |
| Security | Shield | `--color-warning` | New login, password changed, session revoked |
| System | Settings | `--color-muted` | Maintenance, new features, updates |
| Promotions | Gift | `--color-info` | Special offers, discounts |
| Support | LifeBuoy | `--color-info` | Support reply, ticket resolved |

## Page Header
- Heading: "Notifications" (h1, 32px, 700)
- "Mark All as Read" button (ghost, right side)

## Filter
- Tabs: Unread / All

## Notification Card

| Element | Spec |
|---------|------|
| Icon | 24px, in 40px circle (type-colored bg at 10%) |
| Unread indicator | 8px primary dot (left of title) |
| Title | 16px, 600, `--color-heading` |
| Message | 14px, `--color-body`, truncated to 2 lines |
| Timestamp | 12px, `--color-muted` (relative: "2 hours ago") |
| Action Button | If `action_url` exists: "View" button → navigates + marks read |
| Delete | X icon button (right) → soft-delete |

## Actions

| Action | Implementation |
|--------|---------------|
| Mark Read | Click on notification → sets `read = true` + navigates to `action_url` |
| Mark All Read | Button → `UPDATE notifications SET read = true WHERE profile_id = userId AND read = false` |
| Delete | X button → `UPDATE notifications SET deleted_at = now() WHERE id = notifId` |
| Open Related Page | Click → navigate to `action_url` (e.g., `/app/orders/[id]`) |

## Real-Time

Powered by Supabase Realtime:

```ts
useEffect(() => {
  const channel = supabase
    .channel('notifications')
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications', filter: `profile_id=eq.${userId}` },
      (payload) => {
        addNotification(payload.new);
        // Update bell badge count in topbar
      }
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
}, [userId]);
```

- New notifications appear at top of list with slide-in animation
- Bell badge in topbar updates in real-time
- No page refresh needed

## Empty State

- Illustration: Bell icon (64px, `--color-muted`)
- Message: "You're all caught up!" (16px, `--color-body`)
- Subtext: "New notifications will appear here." (14px, `--color-muted`)

## Component Tree

```
NotificationPanel (RSC + Client Realtime)
├── PageHeader
│   ├── Heading ("Notifications")
│   └── Button ("Mark All as Read" — ghost)
├── FilterTabs (Unread / All)
├── NotificationList
│   └── NotificationItem[]
│       ├── TypeIcon (color by type)
│       ├── UnreadDot (8px primary — if unread)
│       ├── Title (16px, 600)
│       ├── Message (14px, body, truncated)
│       ├── Timestamp (12px, muted, relative)
│       ├── ActionButton ("View" → action_url + mark read)
│       └── DeleteButton (X — soft delete)
└── EmptyState
    ├── BellIcon (64px, muted)
    ├── Text ("You're all caught up!")
    └── Text ("New notifications will appear here.")
```

## States

| State | UI |
|------|-----|
| Loading | Skeleton list (3-5 gray rows) |
| Notifications present | List with items |
| No notifications | "You're all caught up!" empty state |
| No unread | "You're all caught up!" (in Unread tab) |
| New (Realtime) | Slide-in at top of list |
| Error | Error card + retry |

## Accessibility

- `<section aria-label="Notifications">`
- Each notification: `aria-label="[Title]: [Message]"`
- Unread indicator: `aria-label="Unread"`
- "Mark All as Read": `aria-label="Mark all notifications as read"`
- Delete: `aria-label="Delete notification"`
- New notifications: `aria-live="polite"` (announced to screen readers)
- Keyboard: Tab through notifications, Enter to open, Delete key to dismiss
