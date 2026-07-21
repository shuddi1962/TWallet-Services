# 03 — Top Header

> Component ID: ADM-003 | Status: Approved
> 72px sticky header with global search, notifications, quick actions, admin profile, and environment badge.

## Design

- **Height:** 72px
- **Position:** Sticky top
- **Background:** `--color-surface` (#FFFFFF)
- **Border:** 1px bottom `--color-border`
- **Shadow:** `--shadow-xs` on scroll

## Components

### Left
- Mobile: Hamburger button (opens sidebar drawer)
- Desktop: Breadcrumb (e.g., "Admin / Users / John Doe")

### Center
- **Global Search:** searches across users, orders, payments, tickets
  - Debounced 300ms
  - Dropdown results grouped by category
  - `/` keyboard shortcut to focus

### Right
| Element | Spec |
|---------|------|
| Environment Badge | "Production" (danger color) or "Staging" (warning) — pill badge |
| Quick Actions | Dropdown button with 4 actions (see below) |
| Notifications | Bell icon + unread count badge |
| Admin Profile | Avatar (32px) + name + role + dropdown menu |

### Quick Actions (Dropdown)
| Action | Route/Behavior | Role |
|--------|---------------|------|
| Create Card Product | `/admin/cards?action=new` | Super Admin, Operations |
| Add Wallet Address | `/admin/wallets?action=new` | Super Admin |
| Create Admin | `/admin/users?action=new-admin` | Super Admin |
| Export Reports | `/admin/reports?export=all` | Super Admin, Finance |

### Admin Profile Dropdown
| Item | Route |
|------|-------|
| My Profile | `/admin/profile` (or `/app/profile`) |
| Settings | `/admin/settings` (Super Admin only) |
| Logout | Server action → `/` |

## Component Tree

```
AdminHeader (Client — sticky, search, dropdowns)
├── HeaderLeft
│   ├── HamburgerButton (mobile only — opens sidebar drawer)
│   └── Breadcrumb (current location)
├── HeaderCenter
│   └── GlobalSearch
│       ├── SearchInput (placeholder="Search users, orders, payments...")
│       └── SearchDropdown (grouped results)
├── HeaderRight
│   ├── EnvironmentBadge ("Production" — danger pill)
│   ├── QuickActions (dropdown)
│   │   ├── ActionItem ("Create Card Product")
│   │   ├── ActionItem ("Add Wallet Address")
│   │   ├── ActionItem ("Create Admin")
│   │   └── ActionItem ("Export Reports")
│   ├── NotificationBell (icon + unread badge)
│   └── AdminProfile
│       ├── Avatar (32px) + Name + Role
│       └── ProfileDropdown
│           ├── MenuItem ("My Profile")
│           ├── MenuItem ("Settings" — Super Admin only)
│           └── MenuItem ("Logout")
```

## Accessibility

- `<header>` landmark
- Search: `aria-label="Search admin"`
- Quick actions: `aria-label="Quick actions"`, dropdown is ARIA menu
- Notifications: `aria-label="Notifications, [N] unread"`
- Profile dropdown: ARIA menu, keyboard navigable, Esc closes
- Environment badge: `aria-label="Environment: Production"`
- Keyboard: Tab through, `/` focuses search, Esc closes dropdowns
