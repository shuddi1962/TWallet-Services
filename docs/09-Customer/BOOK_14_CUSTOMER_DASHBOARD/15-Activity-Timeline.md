# 15 — Activity Timeline

> Component ID: DB-016 | Status: Approved
> Chronological list of user activities with color-coded event types.

## Purpose

Provide transparency by showing all user activities in one chronological feed. Builds trust through visibility.

## Dashboard Widget (on /app)

Shows 10 most recent activities in a vertical timeline.

## Full Page (`/app/activity` — optional)

### Page Header
- Heading: "Activity" (h1, 32px, 700)
- Subtext: "Your recent account activity." (14px, `--color-body`)

## Timeline Events (Color-Coded)

| Event | Icon | Color |
|-------|------|-------|
| Account Created | UserPlus | `--color-primary` |
| Wallet Connected | Wallet | `--color-primary` |
| Wallet Disconnected | Wallet | `--color-muted` |
| Payment Completed | CheckCircle | `--color-success` |
| Payment Failed | XCircle | `--color-danger` |
| Card Ordered | ShoppingBag | `--color-info` |
| Order Shipped | Package | `--color-info` |
| Order Delivered | PackageCheck | `--color-success` |
| Support Ticket Created | LifeBuoy | `--color-info` |
| Password Changed | Key | `--color-warning` |
| Profile Updated | User | `--color-muted` |
| Login | LogIn | `--color-success` |
| Logout | LogOut | `--color-muted` |
| Email Verified | MailCheck | `--color-success` |

## Display

- Vertical timeline, newest first
- Each item: icon (24px, color-coded) + action label (14px, 600) + optional details (14px, body) + timestamp (12px, muted, relative)
- Timeline line connects items (left-aligned, 2px, `--color-border`)
- Infinite scroll or "Load More" button for pagination

## Component Tree

```
ActivityTimeline (RSC)
├── SectionHeader
│   └── Heading ("Activity Timeline")
└── TimelineList
    └── ActivityItem[]
        ├── TimelineIcon (color by event type)
        ├── TimelineContent
        │   ├── ActionLabel (14px, 600, `--color-heading`)
        │   ├── Details (14px, body — optional metadata)
        │   └── Timestamp (12px, muted, relative: "2 hours ago")
        └── [optional] IPAddress (12px, muted — for security events)
```

## Database

- `activity_logs` — id, profile_id, action, ip_address, device, browser, location, metadata, created_at

## Supabase Query

```ts
const { data: activities } = await supabase
  .from('activity_logs')
  .select('*')
  .eq('profile_id', userId)
  .order('created_at', { ascending: false })
  .limit(20);
```

## States

| State | UI |
|------|-----|
| Loading | Skeleton timeline (5-10 gray rows) |
| Activities present | Timeline with icons + labels + timestamps |
| No activities | "No recent activity" (muted text) |
| Error | Error card + retry |
| Loading more | Spinner at bottom of list |

## Animations

| Animation | Element | Duration |
|-----------|---------|----------|
| Stagger fade-in | Items | 50ms each (max 10) |
| Icon scale-in | Icons | 200ms |
| Load more | Spinner | — |

## Accessibility

- `<section aria-label="Activity Timeline">`
- Timeline: semantic `<ol>` (ordered by time)
- Each item: `aria-label="[Action] at [timestamp]"`
- Icons: `aria-hidden="true"` (label conveys meaning)
- Timestamp: `aria-label` with full date/time
