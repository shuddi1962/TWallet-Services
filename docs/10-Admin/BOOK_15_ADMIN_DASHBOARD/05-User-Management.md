# 05 — User Management

> Component ID: ADM-005 | Status: Approved
> Complete user lifecycle management — search, filter, view, edit, suspend, soft-delete.

## Route

`/admin/users` — Server Component + Client for interactivity

## Access

- Super Admin: all actions
- Operations: view, suspend, reactivate (no delete)
- Finance, Support, Viewer: read-only

## Features

### Table (Client)

| Column | Type | Sortable | Filterable |
|--------|------|----------|------------|
| User | Avatar + name + email | Name A-Z | Search |
| Status | Badge (Active/Suspended/Deleted) | Yes | Active, Suspended, Deleted |
| Role | Badge (User/Admin) | Yes | User, Admin |
| Country | Flag + name | Yes | Country dropdown |
| Wallet | Connected/Not connected | Yes | Connected, Not |
| Orders | Count badge | Yes | — |
| Created | Date | Yes | Date range |
| Actions | Dropdown menu | — | — |

- 50 per page, cursor-based or offset pagination
- Bulk select: checkbox column (select all show 50)

### Actions (Dropdown per row)

| Action | Behavior | Role |
|--------|----------|------|
| View Profile | Opens `/admin/users/[id]` | All admin roles |
| Edit | Opens inline edit drawer | Super Admin, Operations |
| Send Email | Opens email modal (Resend) | Super Admin, Operations |
| Suspend | Confirmation dialog → update `profiles.status` | Super Admin, Operations |
| Reactivate | Confirmation → update `profiles.status` | Super Admin, Operations |
| Delete | Confirmation → soft delete (set `deleted_at`) | Super Admin |

### Filters

| Filter | Type |
|--------|------|
| Search (name, email, ID) | Text input, debounced 300ms |
| Status | Dropdown: All, Active, Suspended, Deleted |
| Role | Dropdown: All, User, Admin |
| Country | Select with search (country list) |
| Wallet Connected | Toggle: All, Connected, Not Connected |
| Date Range | Date picker (from, to) |
| Reset All | Button — clears all filters |

### User Detail Page (`/admin/users/[id]`)

| Section | Data |
|---------|------|
| Profile | Avatar, name, email, phone, country, created, last login |
| Status | Current status, badge, history, suspend/reactivate buttons |
| KYC Status | Tier (0/1/2), documents (if any), verification status |
| Wallet | Connected wallet address, network, since date |
| Orders | Table of user's orders (link to `/admin/orders?user_id=`) |
| Activity Log | Recent admin actions on this user (from audit_logs) |
| Admin Notes | Internal notes (plain text, only Super Admin/Operations) |

## Component Tree

```
AdminUsersPage (Server Component)
├── PageHeader ("Users")
│   ├── Heading + Count
│   └── ActionBar
│       ├── SearchInput
│       ├── FilterDropdowns (status, role, country, wallet, date)
│       ├── ResetFiltersButton
│       └── BulkActionDropdown (Export Selected)
├── UsersTable (Client Component — DataTable)
│   ├── TableHeader
│   │   └── ColumnHeaders (User, Status, Role, Country, Wallet, Orders, Created, Actions)
│   └── TableBody
│       └── UserRow (per user)
│           ├── UserCell (avatar + name + email)
│           ├── StatusBadge (Active/Suspended/Deleted — color-coded)
│           ├── RoleBadge (User/Admin)
│           ├── CountryCell (flag + name)
│           ├── WalletStatus (connected dot + address truncated)
│           ├── OrdersCount (badge)
│           ├── DateCell (formatted)
│           └── ActionsDropdown
│               ├── ViewProfile
│               ├── Edit
│               ├── SendEmail
│               ├── Suspend / Reactivate
│               └── Delete (Super Admin only)
├── Pagination (prev, next, page info, per-page selector)
└── UserDetailPanel (optional drawer — shown on row click)
```

## Supabase Queries

```ts
// List users (admin view — includes admin role check)
const { data: users, count } = await supabase
  .from('profiles')
  .select('*, user_roles(role), wallets(address, network_id)', { count: 'exact' })
  .is('deleted_at', filters.showDeleted ? null : null)
  // Add .not('deleted_at', 'is', null) when filtering deleted
  .ilike('full_name', `%${search}%`)
  .eq('status', filters.status || undefined)
  .eq('country', filters.country || undefined)
  .range(page * pageSize, (page + 1) * pageSize - 1)
  .order('created_at', { ascending: false });

// Get single user
const { data: user } = await supabase
  .from('profiles')
  .select('*, user_roles(role), wallets(*), card_orders(*, card_products(name)), kyc_verifications(*)')
  .eq('id', userId)
  .single();

// Get user activity
const { data: auditLogs } = await supabase
  .from('audit_logs')
  .select('*, admins(profile_id, profiles(full_name))')
  .contains('details', { target_user_id: userId })
  .order('created_at', { ascending: false })
  .limit(50);
```

## Server Actions

```ts
suspendUser(userId: string): Promise<ActionResult>
reactivateUser(userId: string): Promise<ActionResult>
softDeleteUser(userId: string): Promise<ActionResult>
updateUserProfile(userId: string, data: UpdateUserInput): Promise<ActionResult>
sendUserEmail(userId: string, subject: string, body: string): Promise<ActionResult>
```

## States

| State | UI |
|-------|-----|
| Loading | Skeleton table (10 rows) |
| Empty | Illustration + "No users found" + Reset Filters button |
| Filtered empty | "No users match your filters" + Reset Filters button |
| Error | "Failed to load users" + Retry button |
| Suspended user | Row dimmed, status badge = danger |
| Deleted user | Row dimmed, "Deleted [date]" badge |

## Accessibility

- Table: `<th scope="col">` on headers, `<th scope="row">` on user name
- Sorting: `aria-sort="ascending"|"descending"` on active column
- Search: `aria-label="Search users by name, email, or ID"`
- Bulk select: checkbox visible + keyboard focusable
- Actions dropdown: ARIA menu pattern, keyboard navigable
- Status badges: text + icon (not color alone): "Suspended (eye off icon)"
