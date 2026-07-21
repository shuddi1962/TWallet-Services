# Authorization

## Model

Role-Based Access Control (RBAC) enforced at three layers:

1. **Next.js Middleware** — route-level access
2. **Server Actions / Route Handlers** — permission checks
3. **Supabase RLS** — row-level enforcement

## Roles

| Role | Scope | Permissions |
|------|-------|-------------|
| `customer` | Own data only | View/create own orders, wallets, tickets |
| `support_agent` | All support tickets | Read/write tickets, internal notes |
| `operations` | Orders + shipping | Update order status, assign tracking |
| `finance` | Payments + refunds | Verify payments, process refunds |
| `administrator` | Most admin functions | User management, role assignment |
| `super_administrator` | Full system access | Wallet management, system settings, admin CRUD |

## Database Enforcement

RLS policies on all 19 tables enforce row-level access. See `supabase/migrations/202607200002_rls.sql`.

## Server-Side Permission Check Pattern

```ts
// lib/permissions.ts
export async function requireRole(userId: string, roles: AdminRole[]) {
  const { data: admin } = await supabase
    .from("admins")
    .select("role")
    .eq("profile_id", userId)
    .single()
  
  if (!admin || !roles.includes(admin.role)) {
    throw new AppError("FORBIDDEN", "Insufficient permissions")
  }
}
```

## Rules

| Rule | Description |
|------|-------------|
| Least Privilege | Every actor gets minimum access needed |
| Deny by Default | All access blocked unless explicitly permitted |
| Server-side Only | Permission checks never rely on client data |
| RLS Required | Every table has RLS — no exceptions |
| Audit | All permission changes logged in `audit_logs` |
