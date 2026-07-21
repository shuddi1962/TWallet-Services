# 15 — Audit Logs

> Component ID: ADM-015 | Status: Approved
> Append-only log of all admin actions — immutable, searchable, filterable.

## Route

`/admin/audit` — Server Component

## Access

- Super Admin only

## Audit Log Schema

Reference: `audit_logs` table from Book 08.

Each log entry records:

| Field | Description |
|-------|-------------|
| ID | UUID |
| Admin ID | Who performed the action |
| Action | `audit_action` enum (user_suspended, user_reactivated, user_deleted, order_status_changed, order_tracking_assigned, order_refunded, payment_confirmed, payment_flagged, card_created, card_archived, wallet_added, wallet_rotated, wallet_disabled, ticket_assigned, ticket_escalated, settings_updated, admin_created, admin_role_changed, login, logout, export_generated, system_setting_changed) |
| Target Type | `order`, `user`, `payment`, `card_product`, `wallet`, `ticket`, `setting`, `admin` |
| Target ID | UUID of affected entity |
| Details | JSONB (includes before/after values, reason, IP) |
| IP Address | Admin's IP |
| Created At | Immutable timestamp |

## Features

### Table

| Column | Filterable | Sortable |
|--------|-----------|----------|
| Timestamp | Date range | Yes |
| Admin | Avatar + name | Yes (admin select) |
| Action | Badge + label | Yes (enum filter) |
| Target | Type + ID/name link | Yes (type filter) |
| Details | Tooltip on hover | — |
| IP | Text search | Yes |

### Filters

| Filter | Type |
|--------|------|
| Date Range | Date picker (from, to) + presets (1h, 24h, 7d, 30d) |
| Admin | Multi-select (admin list) |
| Action | Multi-select (grouped by domain) |
| Target Type | Multi-select |
| Search (target ID, IP) | Text, debounced |

### Detail Drawer (per entry)

| Section | Data |
|---------|------|
| Overview | Action, admin, target, timestamp |
| Target Details | Name, link to affected item |
| Changes | Before/after (diff-style, if available) |
| Metadata | IP address, User-Agent |
| Raw JSON | Expandable JSON viewer |

### Export

- Export filtered results to CSV
- Export single entry as JSON

## Component Tree

```
AdminAuditLogsPage (Server Component)
├── PageHeader ("Audit Logs" + entry count)
├── FilterBar (date range, admin, action, target type, search)
├── AuditLogsTable (Client)
│   ├── TableHeader
│   └── AuditLogRow
│       ├── TimestampCell (relative + absolute on hover)
│       ├── AdminCell (avatar + name)
│       ├── ActionBadge (color-coded per action type)
│       ├── TargetCell (type icon + name/link)
│       ├── DetailCell (tooltip with summary)
│       ├── IPCell (masked: 192.168.xxx.xxx)
│       └── ExpandButton (opens drawer)
├── Pagination
└── AuditDetailDrawer
    ├── OverviewSection
    ├── ChangesSection (diff display)
    ├── MetadataSection (IP, User-Agent)
    └── RawJSONSection (collapsible JSON viewer)
```

## Supabase Query

```ts
const { data: logs, count } = await supabase
  .from('audit_logs')
  .select('*, admins(profile_id, profiles(full_name, avatar_url))', { count: 'exact' })
  .gte('created_at', dateFrom)
  .lte('created_at', dateTo)
  .in('admin_id', selectedAdmins || undefined)
  .in('action', selectedActions || undefined)
  .in('target_type', selectedTargets || undefined)
  .ilike('details->target_name', `%${search}%`)
  .range(page * pageSize, (page + 1) * pageSize - 1)
  .order('created_at', { ascending: false });
```

## Immutability Guarantee

- `audit_logs` table has no UPDATE policy (only INSERT)
- Row-level security: `CREATE POLICY "audit_logs_immutable" ON audit_logs FOR ALL USING (false) WITH CHECK (true)`
- Admin cannot delete or modify audit logs
- Database-level: `REVOKE UPDATE, DELETE ON audit_logs FROM authenticated;`

## States

| State | UI |
|-------|-----|
| Loading | Skeleton table (20 rows) |
| Empty | "No audit logs found" |
| Filtered empty | "No logs match your filters" + Reset |
| Error | "Failed to load audit logs" + Retry |
| Export | Toast: "Export started" → download link |

## Accessibility

- Audit log is append-only and immutable
- Action badges: `aria-label="Action: [action]"`
- Timestamps: `<time datetime="...">` tag
- Detail drawer: focus trap + Esc to close
