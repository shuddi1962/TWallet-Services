# Book 15 — Admin Dashboard

> **TWallet Services · TWallet Card**
> The operations control center for the entire platform. 18 files covering every admin page, management table, and operational tool. Designed for data density, speed, and enterprise security (RBAC).

---

## Document Control

| Field        | Value                                |
| ------------ | ------------------------------------ |
| Book         | 15 — Admin Dashboard                 |
| Version      | 1.0.0                                |
| Status       | Approved                             |
| Priority     | Critical                             |
| Route        | `/admin/*`                           |
| Type         | Modular folder (18 files)            |
| Created      | 2026-07-21                           |

---

## Overview

The Admin Dashboard provides complete operational control over the TWallet Services platform. Administrators can:

- Manage Users
- Manage Orders
- Monitor Payments
- Manage Card Products
- Configure Wallet Addresses
- Review Support Tickets
- View Analytics
- Configure Platform Settings
- Monitor Security
- View Audit Logs

---

## Design Philosophy

### Inspired By
- Stripe Admin
- Shopify Admin
- Vercel Dashboard
- Supabase Studio
- Linear

### Priorities
- ✓ Speed — fast data loading, instant filters
- ✓ Clarity — clear data presentation, no clutter
- ✓ Data Density — more info per screen than customer dashboard
- ✓ Ease of Navigation — searchable sidebar, breadcrumbs
- ✓ Enterprise Security — RBAC on every action, full audit trail

---

## Routes

| Route | Page | File |
|-------|------|------|
| `/admin` | Dashboard Overview | 01-Overview.md |
| `/admin/users` | User Management | 05-User-Management.md |
| `/admin/roles` | Roles & Permissions | 06-Role-Permissions.md |
| `/admin/cards` | Card Products | 07-Card-Products.md |
| `/admin/orders` | Order Management | 08-Order-Management.md |
| `/admin/payments` | Payment Monitoring | 09-Payment-Monitoring.md |
| `/admin/wallets` | Wallet Management | 10-Wallet-Management.md |
| `/admin/support` | Support Center | 11-Support-Center.md |
| `/admin/notifications` | Admin Notifications | 12-Notifications.md |
| `/admin/reports` | Reports | 13-Reports.md |
| `/admin/settings` | System Settings | 14-System-Settings.md |
| `/admin/audit` | Audit Logs | 15-Audit-Logs.md |
| `/admin/health` | System Health | 16-System-Health.md |

---

## Layout

### Desktop (1024px+)
```
┌──────────────────────────────────────────────────────┐
│  Top Header (72px, sticky)                            │
├──────────┬───────────────────────────────────────────┤
│          │                                            │
│ Sidebar  │  Main Content Area                         │
│ 240px    │                                            │
│          │  Page Header (title + actions)             │
│ Collap-  │  Filters / Tabs                            │
│ sible    │  Dashboard Widgets or Table                │
│          │  Pagination                               │
│          │                                            │
├──────────┴───────────────────────────────────────────┤
│  (No footer — admin shell)                            │
└──────────────────────────────────────────────────────┘
```

### Mobile (< 1024px)
- Sidebar → hamburger drawer
- Tables → card lists
- All actions in dropdown menus per item

---

## RBAC Overview

| Role | Access Level |
|------|-------------|
| Super Admin | Full access — all pages, all actions, manage admins |
| Operations | Orders, cards, users, support — no settings |
| Finance | Payments, reports, revenue — no user management |
| Support | Support tickets only — no other management |
| Viewer | Read-only access to dashboard + reports |

> Detailed permission matrix in 06-Role-Permissions.md

---

## File Index

| File | Section | Key Features |
|------|---------|-------------|
| `README.md` | This file | Index, philosophy, routes, RBAC, ACs |
| `01-Overview.md` | Dashboard Overview | 8 stat cards, 6 widgets, activity feed |
| `02-Sidebar.md` | Sidebar | 13 nav items, collapsible, permission-based |
| `03-Top-Header.md` | Top Header | Search, notifications, quick actions, env badge |
| `04-Dashboard-Widgets.md` | Widgets + Charts | 6 stats, 5 charts (Recharts) |
| `05-User-Management.md` | User Management | Search, filter, suspend, delete, view details |
| `06-Role-Permissions.md` | Roles & Permissions | 5 roles, permission matrix, RBAC enforcement |
| `07-Card-Products.md` | Card Products | CRUD, archive, duplicate, preview |
| `08-Order-Management.md` | Order Management | 10 filters, status transitions, tracking, invoice |
| `09-Payment-Monitoring.md` | Payment Monitoring | Tx hash, verify, flag, export, confirmations |
| `10-Wallet-Management.md` | Wallet Management | Receiving addresses, add, rotate, disable |
| `11-Support-Center.md` | Support Center | Ticket queue, assign, reply, escalate, internal notes |
| `12-Notifications.md` | Admin Notifications | 7 alert types, real-time, mark read |
| `13-Reports.md` | Reports | 7 report types, CSV/Excel/PDF export |
| `14-System-Settings.md` | System Settings | General, payments, security config |
| `15-Audit-Logs.md` | Audit Logs | All admin actions, append-only, filterable |
| `16-System-Health.md` | System Health | 9 monitors, status indicators, alerts |
| `17-Mobile-Admin.md` | Mobile Admin | Priority features, non-essential features |
| `18-OpenCode.md` | OpenCode Prompt | Complete build directive |

---

## Acceptance Criteria

| AC ID | Criterion |
|-------|-----------|
| AC-AD-01 | Given an admin, when they navigate to /admin, then the dashboard overview loads with all widgets in under 2s. |
| AC-AD-02 | Given a non-admin user, when they access /admin, then they are redirected to /app or receive 403. |
| AC-AD-03 | Given the sidebar, then nav items are filtered by the admin's role permissions. |
| AC-AD-04 | Given the user management page, then the admin can search, filter, sort, suspend, reactivate, and soft-delete users. |
| AC-AD-05 | Given an order, then the admin can transition status, assign tracking, generate invoice, and contact customer. |
| AC-AD-06 | Given a payment, then the admin can view tx hash, verify, flag, and export. |
| AC-AD-07 | Given the wallet management page, then only Super Admin can add, edit, rotate, and disable receiving wallets. |
| AC-AD-08 | Given the support center, then agents can assign, reply, attach, close, and escalate tickets. |
| AC-AD-09 | Given any admin action, then it is logged to audit_logs (append-only). |
| AC-AD-10 | Given the system settings page, then only Super Admin can modify settings. |
| AC-AD-11 | Given the reports page, then the admin can export reports as CSV, Excel, or PDF. |
| AC-AD-12 | Given the system health page, then all 9 monitors show current status. |
| AC-AD-13 | Given the admin dashboard, then all pages are noindex. |
| AC-AD-14 | Given the admin dashboard, then all tables have search, filter, sort, and pagination. |
| AC-AD-15 | Given the admin dashboard on mobile, then priority features (dashboard, orders, support, notifications) are accessible. |

---

## References

- Book 03 — Information Architecture (admin routes, access control)
- Book 04 — Design System (tokens, components)
- Book 08 — Database Schema (all tables, audit_logs, admins, system_settings)
- Book 09 — Authentication System (middleware, RBAC, route guard)
- Book 12 — System Architecture (RSC, Server Actions, Supabase patterns)
- Book 14 — Customer Dashboard (shared patterns, component library)
