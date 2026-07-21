# 18 — OpenCode Prompt

> Build directive for implementing the Admin Dashboard with OpenCode.

---

You are building the full Admin Dashboard for TWallet Services, a non-custodial crypto-funded card platform. This is the operations control center for platform administrators.

## Source Documents

Read all 17 files in `10-Admin/BOOK_15_ADMIN_DASHBOARD/` before writing any code. Every implementation decision is specified there.

## Routes

```
/admin                     → AdminOverview (dashboard with stats + charts + widgets)
/admin/users               → AdminUsersPage (user management table)
/admin/roles               → AdminRolesPage (RBAC roles + permissions)
/admin/cards               → AdminCardsPage (card product CRUD)
/admin/orders              → AdminOrdersPage (order lifecycle management)
/admin/payments            → AdminPaymentsPage (payment monitoring + verification)
/admin/wallets             → AdminWalletsPage (receiving wallet management)
/admin/support             → AdminSupportPage (ticket queue + replies)
/admin/notifications       → AdminNotificationsPage (notification history)
/admin/reports             → AdminReportsPage (generate + export reports)
/admin/settings            → AdminSettingsPage (platform configuration)
/admin/audit               → AdminAuditLogsPage (immutable admin action log)
/admin/health              → AdminHealthPage (system monitoring)
```

## Layout

- Desktop: `AdminShell` with fixed sidebar (240px, collapsible to 72px) + sticky top header (72px) + main content area
- Mobile (< 768px): hamburger sidebar drawer + bottom tab bar (Dashboard, Orders, Support, Notifications, Menu)
- Sidebar filtered by admin's role; 13 nav items with permission-based visibility
- Top header: global search, notification bell, quick actions dropdown, admin profile, environment badge

## Admin Auth Guard

- Use `createClient()` from `@/lib/supabase/server`
- Middleware: redirect `/admin/*` to `/auth/login` if no session
- Server Component guard: check `user_roles` table; show 403 if not admin
- Client guard: `useAdminGuard()` hook wrapping protected client components
- All `/admin/*` pages: `rel="noindex"` meta tag, `X-Robots-Tag: noindex` header

## Shared Components

Import from `@/components/ui/`:
- Button, Input, Select, Badge, Card, Tabs, DropdownMenu, Dialog, Sheet (drawer), Popover, Command (search), Table, Pagination, Avatar, Toast, Skeleton, Tooltip, Separator, Accordion, Breadcrumb, Switch, Checkbox, Textarea, Calendar, DatePickerWithRange

Custom admin components (in `@/components/admin/`):
- `AdminShell` — layout wrapper with sidebar + header
- `AdminSidebar` — collapsible, permission-filtered nav
- `AdminHeader` — sticky top bar with search + notifications
- `DataTable` — sortable, filterable, paginated table with checkbox selection
- `StatsCard` — icon + label + value + trend badge
- `FilterBar` — configurable filter group with search + dropdowns + date range
- `BulkActionBar` — appears when rows selected
- `StatusBadge` — color-coded per domain (order, ticket, payment, etc.)
- `DetailDrawer` — right-side sliding panel for item detail

## Admin Profile

- `admins` table (references `profiles`): `id, profile_id, role (super_admin|operations|finance|support|viewer), created_at, updated_at`
- Admin profile loaded in `AdminShell` via `getAdminProfile()` server function
- Used in sidebar footer, top header profile dropdown, permission checks

## Common DataTable Pattern

Every admin table follows this pattern:

```tsx
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSort: (column: string, direction: 'asc' | 'desc') => void;
  filters: FilterConfig[];
  onFilter: (key: string, value: any) => void;
  isLoading: boolean;
  onRowClick?: (row: T) => void;
  selectedRows?: string[];
  onSelectionChange?: (ids: string[]) => void;
}
```

## Server Actions

All admin actions go in `@/lib/actions/admin/`:
```
admin-users.ts        → suspendUser, reactivateUser, softDeleteUser, updateUserProfile
admin-roles.ts        → assignAdminRole, removeAdminAccess, updateRolePermissions
admin-cards.ts        → createCardProduct, updateCardProduct, archiveCardProduct, activateCardProduct
admin-orders.ts       → updateOrderStatus, assignTracking, flagOrder, refundOrder, addOrderNote, exportOrders
admin-payments.ts     → verifyPayment, flagPayment, unflagPayment, exportPayments
admin-wallets.ts      → addWalletAddress, rotateWalletAddress, disableWalletAddress
admin-support.ts      → assignTicket, replyToTicket, escalateTicket, closeTicket
admin-notifications.ts → markNotificationRead, markAllNotificationsRead
admin-reports.ts      → generateReport, downloadReport, deleteReport
admin-settings.ts     → updateSettings, batchUpdateSettings
admin-health.ts       → checkHealth, getIncidents
```

## Edge Function

```
supabase/functions/health-check/index.ts
  → Checks 9 monitors: API, Database, Auth, Storage, Edge Functions, Blockchain RPC, Email, Redis, Realtime
  → Returns { status, latency, error? } for each
  → Logs incidents on transition to degraded/down
```

## Audit Logging

Every admin action must log to `audit_logs`:
```ts
await supabase.from('audit_logs').insert({
  admin_id: adminId,
  action: auditAction,
  target_type: targetType,
  target_id: targetId,
  details: { before, after, reason, ip },
  ip_address: ip,
});
```

## RBAC Enforcement

```ts
// Permission check utility
function requirePermission(action: string): void {
  const adminRole = getCurrentAdminRole();
  const permissions = PERMISSION_MATRIX[adminRole];
  if (!permissions.includes(action) && !permissions.includes('*')) {
    throw new Error('Forbidden');
  }
}
```

## State Management

- Each admin page is a Server Component that fetches initial data
- Client components handle interactivity (sort, filter, paginate) via URL search params
- Use `useRouter` + `useSearchParams` for filter/sort/page state
- No client-side state management library — URL is source of truth for table state
- Debounce search filters (300ms)
- Poll health page every 30s

## Chart Implementation

- Use Recharts for all 5 dashboard charts
- Chart theme from Book 04 design tokens
- Responsive container with `height={240}` (200 on mobile)
- Dark mode: charts use CSS variables for colors
- Fallback data table below chart (collapsible)

## Mobile Adaptations

- Tables → card list (label: value per row)
- Filters → accordion panel
- Sidebar → hamburger drawer
- Bottom tab bar: Dashboard, Orders, Support, Notifications, Menu
- Charts: 2 most important only, full-width, 200px height

## Accessibility Checklist

- [ ] All tables have `<th scope>` headers
- [ ] Status badges have text + icon (not color alone)
- [ ] Sortable columns: `aria-sort="ascending"|"descending"`
- [ ] Search inputs: `aria-label`
- [ ] Dialogs: `role="dialog"`, `aria-modal`, focus trap
- [ ] Sidebar: `aria-label="Admin navigation"`, `aria-current="page"`
- [ ] Notifications: `aria-label="Notifications, N unread"`
- [ ] Environment badge: `aria-label="Environment: Production"`
- [ ] All interactive elements keyboard-accessible
- [ ] Touch targets ≥ 44x44px on mobile
- [ ] Toast messages: `role="alert"`, `aria-live="polite"`
- [ ] Audit log timestamps: `<time datetime="...">` tag

## Security

- [ ] All admin pages: `X-Robots-Tag: noindex`
- [ ] RBAC enforced on every server action
- [ ] Audit log is append-only (no UPDATE/DELETE)
- [ ] IP address logged on every action
- [ ] Settings: Super Admin only
- [ ] Wallet management: Super Admin only
- [ ] Admin session: 8 hours (vs 24h for customer)
- [ ] Wallet addresses: copyable but private key NEVER stored
- [ ] Payment verification: Edge Function + Alchemy RPC call
- [ ] Bulk actions: limit 100 rows per batch

## Acceptance Criteria

AC-AD-01 → AC-AD-15 from README.md must all pass.
