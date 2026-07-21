# 02 — Top Navigation

> Component ID: DB-002 | Status: Approved
> Sticky 72px top navigation with search, notifications, and profile menu. Shared across all dashboard pages.

## Purpose

Provide persistent navigation, global search, notifications access, and account actions within the dashboard.

## Layout

### Desktop (1024px+)
```
┌──────────────────────────────────────────────────────┐
│  [Logo] [Search]          [Breadcrumb]  [🔔] [Wallet] [Avatar ▾] │
└──────────────────────────────────────────────────────┘
```
72px height, sticky, white bg, 1px bottom border, `--shadow-xs`

### Left
| Element | Spec |
|---------|------|
| Logo | TWallet logo (dark version, 28px height) → click goes to `/app` |
| Search | Global search input (see below) |

### Center
| Element | Spec |
|---------|------|
| Breadcrumb | Current page name (e.g., "Dashboard", "Orders", "Wallet") |

### Right
| Element | Spec |
|---------|------|
| Notifications | Bell icon (24px) + unread count badge (primary, pill) |
| Wallet Status | Mini wallet indicator (address truncated + network badge) — if connected |
| Profile | Avatar (32px) + name (14px) + dropdown chevron |

### Profile Dropdown
| Item | Route |
|------|-------|
| Profile | `/app/profile` |
| Security | `/app/security` |
| Settings | `/app/settings` |
| Logout | Server action (clears session, redirects to `/`) |

## Search

Global search with dropdown results:

| Category | Searchable Fields |
|----------|------------------|
| Orders | Order ID, status, card product name |
| Transactions | Tx hash, amount, currency, status |
| Support | Ticket subject, ticket number |
| Cards | Card type, status |

- **Trigger:** Click search input or press `/` (keyboard shortcut)
- **Behavior:** Debounced (300ms); shows dropdown with results grouped by category
- **Result click:** Navigates to the item's detail page
- **No results:** "No results found for '[query]'"
- **Placeholder:** "Search orders, transactions, support..."

## Sidebar Navigation

### Desktop (1024px+)
Fixed left sidebar, 260px wide, white bg, 1px right border:

| Nav Item | Icon | Route |
|----------|------|-------|
| Overview | LayoutDashboard | `/app` |
| Cards | CreditCard | `/app/cards` |
| Orders | ShoppingBag | `/app/orders` |
| Transactions | ArrowLeftRight | `/app/transactions` |
| Wallet | Wallet | `/app/wallet` |
| Profile | User | `/app/profile` |
| Security | Shield | `/app/security` |
| Settings | Settings | `/app/settings` |

- Active item: `--color-primary-light` bg, `--color-primary` text, 3px left primary bar
- Inactive: `--color-body` text, hover → `--color-heading` + `--color-bg` bg
- Icons: 24px (Lucide outline)
- Labels: 14px, 500

### Mobile (< 1024px)
Bottom tab bar + drawer:
- Bottom bar: Overview, Cards, Orders, Wallet + "More" button
- "More" opens drawer with: Profile, Security, Settings, Logout

## Component Tree

```
DashboardLayout
├── TopNavigation (Client — sticky, search, dropdowns)
│   ├── NavLeft
│   │   ├── Logo (→ /app)
│   │   └── SearchBar (global search with dropdown)
│   ├── NavCenter
│   │   └── Breadcrumb (current page)
│   └── NavRight
│       ├── NotificationBell (icon + unread badge → /app/notifications)
│       ├── WalletStatus (mini indicator if connected)
│       └── ProfileMenu
│           ├── Avatar (32px)
│           ├── ProfileName (14px)
│           └── ProfileDropdown
│               ├── MenuItem ("Profile" → /app/profile)
│               ├── MenuItem ("Security" → /app/security)
│               ├── MenuItem ("Settings" → /app/settings)
│               └── MenuItem ("Logout" → server action)
├── Sidebar (desktop — fixed left)
│   └── NavItems (8 items with icons + labels)
├── BottomTabBar (mobile — fixed bottom)
│   ├── TabItem (Overview → /app)
│   ├── TabItem (Cards → /app/cards)
│   ├── TabItem (Orders → /app/orders)
│   ├── TabItem (Wallet → /app/wallet)
│   └── MoreButton (opens drawer)
└── MoreDrawer (mobile — Profile, Security, Settings, Logout)
```

## Component Props

```ts
interface DashboardHeaderProps {
  user: { firstName: string; avatarUrl: string | null };
  notificationsCount: number;
  wallet?: { address: string; network: string } | null;
  breadcrumb: string;
  onLogout: () => Promise<void>;
}

interface SidebarProps {
  navItems: { label: string; icon: LucideIcon; route: string }[];
  activeRoute: string;
}
```

## States

| State | Behavior |
|-------|----------|
| Loading | Skeleton nav items; avatar placeholder |
| Authed | Full nav, profile menu, notifications |
| Unauthed | Redirect to /auth/login (middleware) |
| No wallet | Wallet status shows "Connect Wallet" mini CTA |
| No notifications | Bell shows no badge |

## Animations

| Animation | Element | Duration |
|-----------|---------|----------|
| Dropdown open | Profile menu | 150ms (fade + slide-down) |
| Search dropdown | Results | 150ms (fade + slide-down) |
| Sidebar active bar | Left border | 200ms (height 0→100%) |
| Nav hover | Bg color | 150ms |
| Notification badge | Pulse (if new) | 600ms x2 |

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Landmark | `<header>` for top nav, `<nav>` for sidebar |
| Search | `aria-label="Search dashboard"`, results in `role="listbox"` |
| Notifications | `aria-label="Notifications, [N] unread"` |
| Profile dropdown | ARIA menu, keyboard navigable, Esc closes |
| Sidebar | `<nav aria-label="Dashboard navigation">` |
| Active item | `aria-current="page"` |
| Keyboard | Tab through all items; `/` focuses search; Esc closes dropdowns |
| Logout | `aria-label="Log out"` |
