# Database Schema — TWallet Services

> Engine: PostgreSQL 16 · Host: Supabase

## Schemas

| Schema | Usage |
|--------|-------|
| `public` | Application tables (19 tables, 11 enums) |
| `auth` | Supabase Auth (users, sessions, etc.) — managed by Supabase |
| `storage` | Supabase Storage (objects, buckets) — managed by Supabase |
| `realtime` | Supabase Realtime (subscriptions) — managed by Supabase |
| `extensions` | PostgreSQL extensions (pgcrypto, pg_cron) |

## Extensions

| Extension | Purpose |
|-----------|---------|
| `pgcrypto` | `gen_random_uuid()`, cryptographic functions |
| `pg_cron` | Scheduled cleanup jobs (expired payments, stale tickets) |

## Naming Conventions

| Object | Prefix | Example |
|--------|--------|---------|
| Tables | `snake_case` | `card_orders`, `payment_transactions` |
| Enums | `snake_case` | `order_status`, `payment_status` |
| Indexes | `idx_<table>_<column>` | `idx_card_orders_status` |
| Functions | `snake_case` | `generate_order_number()` |
| Triggers | `snake_case` | `on_auth_user_created` |
| Policies | Descriptive | `"Users can view own orders"` |

## Soft Deletes

Tables that support soft deletes use a `deleted_at TIMESTAMPTZ` column:

- `profiles`, `wallets`, `card_orders`, `payment_transactions`, `support_tickets`, `notifications`

All queries should include `WHERE deleted_at IS NULL` unless explicitly including soft-deleted records.

## Audit Fields

Every core table includes:

| Field | Type | Purpose |
|-------|------|---------|
| `created_at` | `timestamptz` | Row creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp (auto via trigger) |
| `deleted_at` | `timestamptz` | Soft delete timestamp (optional) |

## Row Level Security

RLS is enabled on ALL 19 tables. See `docs/database/Tables.md` for per-table policies or refer to `supabase/migrations/202607200002_rls.sql`.

## TypeScript Integration

Types are generated from the live schema:

```bash
supabase gen types typescript --local > src/types/supabase.ts
```

This produces strongly typed `Database` interfaces covering all tables, columns, and enums.
