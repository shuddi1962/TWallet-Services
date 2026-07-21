# 02 — Sidebar

> Component ID: ADM-002 | Status: Approved
> Collapsible, persistent, permission-based navigation sidebar.

## Purpose

Provide quick navigation to all admin sections, filtered by the admin's role permissions.

## Design

- **Width:** 240px expanded, 72px collapsed (icons only)
- **Background:** `--color-surface` (#FFFFFF)
- **Border:** 1px right `--color-border`
- **Position:** Fixed left, full height
- **Collapsible:** Toggle button at top; state persisted in localStorage

## Sections (13 items)

| # | Item | Icon | Route | Roles |
|---|------|------|-------|-------|
| 1 | Dashboard | LayoutDashboard | `/admin` | All |
| 2 | Users | Users | `/admin/users` | Super Admin, Operations |
| 3 | Orders | ShoppingBag | `/admin/orders` | Super Admin, Operations, Finance |
| 4 | Cards | CreditCard | `/admin/cards` | Super Admin, Operations |
| 5 | Payments | Coins | `/admin/payments` | Super Admin, Finance |
| 6 | Wallet Addresses | Wallet | `/admin/wallets` | Super Admin |
| 7 | Support | LifeBuoy | `/admin/support` | Super Admin, Support, Operations |
| 8 | Reports | FileBarChart | `/admin/reports` | Super Admin, Finance, Viewer |
| 9 | Analytics | BarChart3 | `/admin/analytics` | Super Admin, Finance, Viewer |
| 10 | Settings | Settings | `/admin/settings` | Super Admin |
| 11 | Audit Logs | ScrollText | `/admin/audit` | Super Admin |
| 12 | System Health | Activity | `/admin/health` | Super Admin |
| 13 | Logout | LogOut | Server action | All |

## Behavior

| Feature | Implementation |
|---------|---------------|
| Collapsible | Toggle button (chevron) at top; collapses to 72px icons-only |
| Persistent | Collapse state in localStorage (`admin-sidebar-collapsed`) |
| Responsive | Desktop: fixed sidebar; Mobile: hamburger → drawer |
| Searchable | Search input at top filters nav items by label |
| Permission-based | Items filtered by admin's role (from user_roles + admins tables) |
| Active item | `--color-primary-light` bg, `--color-primary` text, 3px left bar |
| Inactive | `--color-body` text, hover → `--color-heading` + `--color-bg` bg |
| Tooltips | When collapsed: tooltip on hover showing full label |

## Top Section

- Logo (TWallet, 28px) — expanded; icon only when collapsed
- Collapse toggle button (chevron left/right)
- Search input (expanded only): "Search navigation..."

## Bottom Section

- Admin profile mini-card: avatar (32px) + name + role badge
- Logout button

## Component Tree

```
AdminSidebar (Client — collapse, search, permission filter)
├── SidebarTop
│   ├── Logo (expanded: full / collapsed: icon)
│   ├── CollapseButton (chevron toggle)
│   └── SearchInput (expanded only — filters nav items)
├── NavItems (filtered by role)
│   ├── NavItem (Dashboard, LayoutDashboard, /admin)
│   ├── NavItem (Users, Users, /admin/users)
│   ├── NavItem (Orders, ShoppingBag, /admin/orders)
│   ├── NavItem (Cards, CreditCard, /admin/cards)
│   ├── NavItem (Payments, Coins, /admin/payments)
│   ├── NavItem (Wallet Addresses, Wallet, /admin/wallets)
│   ├── NavItem (Support, LifeBuoy, /admin/support)
│   ├── NavItem (Reports, FileBarChart, /admin/reports)
│   ├── NavItem (Analytics, BarChart3, /admin/analytics)
│   ├── NavItem (Settings, Settings, /admin/settings)
│   ├── NavItem (Audit Logs, ScrollText, /admin/audit)
│   └── NavItem (System Health, Activity, /admin/health)
└── SidebarBottom
    ├── AdminProfile (avatar + name + role badge)
    └── LogoutButton (LogOut icon → server action)
```

## Component Props

```ts
interface AdminSidebarProps {
  navItems: NavItem[];
  activeRoute: string;
  adminRole: admin_role;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  label: string;
  icon: LucideIcon;
  route: string;
  roles: admin_role[];  // which roles can see this item
  badge?: number;       // optional count badge (e.g., pending orders)
}
```

## Accessibility

- `<nav aria-label="Admin navigation">`
- Active item: `aria-current="page"`
- Collapse button: `aria-label="Collapse sidebar"` / `"Expand sidebar"`
- Search: `aria-label="Search navigation"`
- Tooltips (collapsed): `aria-label` on icon buttons
- Logout: `aria-label="Log out"`
- Keyboard: Tab through items, Enter to navigate
