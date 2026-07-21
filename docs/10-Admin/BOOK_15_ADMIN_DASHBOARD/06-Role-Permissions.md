# 06 — Roles & Permissions

> Component ID: ADM-006 | Status: Approved
> RBAC management — define roles, assign permissions, assign admins.

## Route

`/admin/roles` — Server Component + Client for editing

## Access

- Super Admin only (view + edit)
- All other roles: read-only view

## Role Definitions

| Role | Slug | Description |
|------|------|-------------|
| Super Admin | `super_admin` | Full platform access |
| Operations | `operations` | User orders, cards, users, support |
| Finance | `finance` | Payments, reports, revenue |
| Support | `support` | Support tickets only |
| Viewer | `viewer` | Dashboard + reports (read-only) |

## Pages & Permissions Matrix

| Page | Super Admin | Operations | Finance | Support | Viewer |
|------|:-----------:|:----------:|:-------:|:-------:|:------:|
| Dashboard | R | R | R | R | R |
| Users | CRUD | R | — | — | — |
| Orders | CRUD | CRUD | R | — | — |
| Cards | CRUD | CRUD | — | — | — |
| Payments | CRUD | R | CRUD | — | — |
| Wallets | CRUD | — | — | — | — |
| Support | CRUD | CRUD | — | CRUD | — |
| Reports | R | — | CRUD | — | R |
| Analytics | R | — | R | — | R |
| Settings | CRUD | — | — | — | — |
| Audit Logs | R | — | — | — | — |
| Health | R | — | — | — | — |
| Roles | CRUD | — | — | — | — |
| Admins | CRUD | — | — | — | — |

## Features

### Roles Table

| Column | Description |
|--------|-------------|
| Role | Role name + description |
| Admins | Count of admins with this role |
| Created | Date role was created |
| Actions | Edit (Super Admin only) |

### Admin Assignment

| Column | Description |
|--------|-------------|
| Admin | Name + email |
| Role | Current role badge |
| Last Active | Date |
| Status | Active/Inactive |
| Actions | Edit role, Remove admin (Super Admin only) |

### Edit Role (Modal)

- Role name (read-only, except Super Admin)
- Permission checkboxes grouped by section
- Save/Cancel buttons

## Component Tree

```
AdminRolesPage (Server Component)
├── PageHeader ("Roles & Permissions")
├── RolesGrid
│   ├── RoleCard (Super Admin)
│   │   ├── RoleHeader (name, description, admin count)
│   │   ├── PermissionSummary (comma-separated; expand for full list)
│   │   └── RoleActions (Edit — Super Admin only)
│   ├── RoleCard (Operations)
│   ├── RoleCard (Finance)
│   ├── RoleCard (Support)
│   └── RoleCard (Viewer)
├── AdminsSection
│   ├── SectionHeader ("Admins" + Add Admin button — Super Admin only)
│   └── AdminsTable
│       ├── TableHeader (Admin, Role, Last Active, Status, Actions)
│       └── AdminRow (per admin)
└── EditRoleModal (Super Admin only — permission checkboxes)
```

## Server Actions

```ts
assignAdminRole(adminId: string, role: admin_role): Promise<ActionResult>
removeAdminAccess(adminId: string): Promise<ActionResult>
updateRolePermissions(role: admin_role, permissions: string[]): Promise<ActionResult>
```

## States

- Loading: skeleton cards + table
- Empty (no admins): "No admins assigned" + Add Admin button
- Error: "Failed to load roles" + Retry
- Super Admin cannot be demoted below Super Admin

## Accessibility

- Permission checkboxes: `<fieldset>` + `<legend>` per section
- Role cards: `aria-label="[Role] — [N] admins"`
- Error/success toasts on role changes
