# Book 07 — Database Architecture

> **TWallet Services · TWallet Card**
> The foundational database document. Defines the database philosophy, naming conventions, UUID strategy, audit field strategy, soft-delete strategy, the complete table inventory grouped by domain, high-level entity relationships, indexing strategy, RLS strategy overview, performance considerations, and migration strategy. This is the "read this first" document for the 6-book database suite (Books 07–12). Detailed column definitions live in Book 08; the ERD lives in Book 09; RLS policies live in Book 10; functions/triggers/views live in Book 11; seed data and migrations live in Book 12.

---

## Document Control

| Field           | Value                              |
| --------------- | ---------------------------------- |
| Book            | 07 — Database Architecture         |
| Project         | TWallet Services                   |
| Product         | TWallet Card                       |
| Version         | 1.0.0                              |
| Database Engine | PostgreSQL 15 (Supabase)           |
| Status          | Approved                           |
| Architecture    | Enterprise                         |
| Domain          | twalletservices.com                |
| Owner           | TWallet Services Team              |
| Created         | 2026-07-21                         |
| Last Updated    | 2026-07-21                         |

### Revision History

| Version | Date       | Author                  | Notes                                                                    |
| ------- | ---------- | ----------------------- | ------------------------------------------------------------------------ |
| 0.1.0   | 2026-07-21 | TWallet Services Team   | Initial draft (philosophy, naming, core tables, relationships, indexes)  |
| 1.0.0   | 2026-07-21 | TWallet Services Team   | Approved: enterprise expansion — full table inventory (19 tables), domain grouping, UUID/audit/soft-delete strategies, RLS overview, performance considerations, migration strategy, 6-book database suite structure |

### Database Documentation Suite (Books 07–12)

| Book | Title                                  | Scope                                                        |
| ---- | -------------------------------------- | ------------------------------------------------------------ |
| 07   | Database Architecture (this book)      | Philosophy, conventions, strategies, table inventory, relationships, indexing, RLS overview, migration strategy. |
| 08   | Database Schema                         | Every table with every column, type, constraint, default, FK. The complete DDL reference. |
| 09   | Entity Relationship Diagram (ERD)       | Visual entity relationships, cardinality, data flow diagrams. |
| 10   | Supabase Row Level Security (RLS)      | Every policy per table, per role, per operation.            |
| 11   | Database Functions, Triggers & Views    | Stored functions, triggers, views, materialized views.       |
| 12   | Seed Data & Migrations                  | Seed data, migration strategy, version history.             |

---

## Table of Contents

1. [Database Philosophy](#1-database-philosophy)
2. [Database Principles](#2-database-principles)
3. [Naming Conventions](#3-naming-conventions)
4. [UUID Strategy](#4-uuid-strategy)
5. [Audit Fields Strategy](#5-audit-fields-strategy)
6. [Soft Delete Strategy](#6-soft-delete-strategy)
7. [Table Inventory](#7-table-inventory)
8. [High-Level Entity Relationships](#8-high-level-entity-relationships)
9. [Indexing Strategy](#9-indexing-strategy)
10. [Row Level Security Overview](#10-row-level-security-overview)
11. [Performance Considerations](#11-performance-considerations)
12. [Data Integrity Rules](#12-data-integrity-rules)
13. [Migration Strategy](#13-migration-strategy)
14. [Supabase Integration Notes](#14-supabase-integration-notes)
15. [Future Tables](#15-future-tables)
16. [Glossary](#16-glossary)
17. [References](#17-references)

---

## 1. Database Philosophy

The database must be:

| Attribute        | Definition                                                              |
| ---------------- | ----------------------------------------------------------------------- |
| Secure           | RLS on every table; no unauthorized data access; no service-role key in client. |
| Scalable         | Handles 10x MVP volume without schema redesign; indexed queries; partitioning-ready. |
| Normalized       | Third Normal Form (3NF) for transactional tables; controlled denormalization for analytics. |
| Fast             | Sub-500ms query response for dashboard; indexed lookups; no N+1 patterns. |
| Easy to maintain | Clear naming; documented schema; versioned migrations; no ad-hoc DDL.   |
| Enterprise Ready | Audit trail; soft deletes; RBAC; data integrity constraints; backup strategy. |

### 1.1 Non-Negotiable Database Rules

1. **RLS on every table** — no exceptions. Tables without RLS are a security vulnerability.
2. **UUIDs for all primary keys** — never integer IDs (prevents enumeration, safe to expose).
3. **No service-role key in client bundles** — server-side only (Edge Functions, Server Components).
4. **All schema changes via migrations** — never ad-hoc DDL on production.
5. **No `down` migrations on production** — forward-only; rollback via new migration.
6. **Audit trail for all sensitive operations** — admin actions, state transitions, payment verification.
7. **No private keys or seed phrases stored** — wallet addresses are read-only public data.
8. **Run security advisors after every DDL change** — `supabase_get_advisors` type=security.

---

## 2. Database Principles

| ID    | Principle                  | Rule                                                                    |
| ----- | -------------------------- | ----------------------------------------------------------------------- |
| DB-01 | UUID Primary Keys          | Every table uses `UUID PRIMARY KEY DEFAULT gen_random_uuid()`.          |
| DB-02 | Audit Fields               | Every table has `created_at` and `updated_at` (timestamptz). Sensitive tables add `created_by`, `updated_by`. |
| DB-03 | Soft Deletes               | Use `deleted_at` (timestamptz, nullable) for user-removable data. Never hard-delete without policy. |
| DB-04 | Foreign Keys               | All relationships enforced with FK constraints + `ON DELETE` policy.    |
| DB-05 | Indexes                    | Indexes on all FKs, frequently filtered columns, and unique constraints. |
| DB-06 | RLS Enabled                | `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` on every table.             |
| DB-07 | Timestamps in UTC          | All timestamps are `timestamptz` (UTC with timezone).                   |
| DB-08 | snake_case Everywhere      | Tables, columns, functions, indexes — all snake_case.                  |
| DB-09 | Enums for Status           | Use Postgres `ENUM` or `CHECK` constraints for status fields.           |
| DB-10 | JSONB for Flexible Data    | Use `jsonb` for metadata/optional structured data; never for core fields. |
| DB-11 | No ORM Magic               | Use typed query helpers (Supabase client); no implicit joins or magic.  |
| DB-12 | Forward-Only Migrations    | Migrations are append-only; rollback via new compensating migration.     |

---

## 3. Naming Conventions

### 3.1 Table Naming

| Rule                  | Example              | Rationale                                     |
| --------------------- | -------------------- | --------------------------------------------- |
| snake_case            | `card_orders`        | PostgreSQL convention.                        |
| Plural                | `card_orders`        | A table holds multiple rows.                  |
| Domain prefix         | `payment_` prefix    | Groups related tables in editors.             |
| No abbreviations      | `payment_transactions` not `pay_tx` | Clarity over brevity.              |
| Junction tables       | `user_roles`         | `singular_singular` for junction tables.      |

### 3.2 Column Naming

| Rule                  | Example              | Rationale                                     |
| --------------------- | -------------------- | --------------------------------------------- |
| snake_case            | `wallet_address`     | PostgreSQL convention.                        |
| Primary key           | `id`                 | Universal; every table.                       |
| Foreign key           | `profile_id`         | `{singular_table_name}_id`.                   |
| Timestamps            | `created_at`, `updated_at` | Universal audit fields.                |
| Booleans              | `is_active`, `is_primary` | `is_` prefix for booleans.              |
| Status                | `status`             | Reserved for state machine columns.           |
| No reserved words     | `order_status` not `order` | Avoid PostgreSQL reserved words.        |

### 3.3 Index Naming

| Rule                          | Example                                    |
| ----------------------------- | ------------------------------------------ |
| Single column                 | `idx_{table}_{column}` → `idx_wallets_address` |
| Multi-column                  | `idx_{table}_{col1}_{col2}` → `idx_card_orders_profile_id_status` |
| Unique                        | `uniq_{table}_{column}` → `uniq_payment_transactions_tx_hash` |
| Foreign key                   | `fk_{table}_{column}` → `fk_wallets_profile_id` |

### 3.4 Function Naming

| Rule                          | Example                                    |
| ----------------------------- | ------------------------------------------ |
| snake_case verb_noun          | `update_updated_at()`                      |
| Trigger functions             | `trg_{table}_{action}` → `trg_profiles_set_updated_at` |
| RPC functions                 | `rpc_{action}_{entity}` → `rpc_verify_payment` |

---

## 4. UUID Strategy

### 4.1 Policy

| Rule                  | Detail                                              |
| --------------------- | --------------------------------------------------- |
| UUID version          | UUID v4 (random) via `gen_random_uuid()`.           |
| Primary keys          | `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`.    |
| Foreign keys          | `UUID` type matching the referenced PK.             |
| Never integer IDs     | Prevents enumeration attacks; safe to expose in URLs. |
| Never expose sequence | No auto-increment integer columns for user-facing IDs. |

### 4.2 Rationale

- **Security:** UUIDs are unguessable; users can't enumerate other users' orders by incrementing an ID.
- **Distribution:** UUIDs distribute inserts across the B-tree, reducing hot spots.
- **URL-safe:** UUIDs are safe to use in URLs (`/app/orders/550e8400-e29b-41d4-a716-446655440000`).
- **Merge-ready:** UUIDs avoid collisions when merging data from different environments.

### 4.3 Storage

- UUIDs are stored as `UUID` type (16 bytes), not as text (36 bytes).
- Supabase/PostgreSQL natively supports `UUID` with the `pgcrypto` extension (`gen_random_uuid()`).

---

## 5. Audit Fields Strategy

### 5.1 Standard Audit Fields

Every table includes these fields:

| Field         | Type          | Default                        | Purpose                              |
| ------------- | ------------- | ------------------------------ | ------------------------------------ |
| `created_at`  | `timestamptz` | `now()`                        | When the row was created.            |
| `updated_at`  | `timestamptz` | `now()`                        | When the row was last updated. Auto-updated via trigger. |

### 5.2 Extended Audit Fields (Sensitive Tables)

Tables handling payments, orders, admin actions, or user data include:

| Field         | Type          | Default    | Purpose                              |
| ------------- | ------------- | ---------- | ------------------------------------ |
| `created_by`  | `UUID`        | `NULL`     | The user who created the row.        |
| `updated_by`  | `UUID`        | `NULL`     | The user who last updated the row.   |
| `deleted_at`  | `timestamptz` | `NULL`     | Soft delete timestamp (if applicable). |

### 5.3 Updated_at Trigger

Every table has a trigger that automatically sets `updated_at = now()` on `UPDATE`:

```sql
-- Trigger function (defined once, reused on all tables)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Applied per table:
CREATE TRIGGER trg_{table}_set_updated_at
  BEFORE UPDATE ON public.{table}
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
```

> Detailed trigger definitions live in Book 11.

### 5.4 Tables with Extended Audit Fields

| Table                   | `created_by` | `updated_by` | `deleted_at` | Rationale                        |
| ----------------------- | ------------ | ------------ | ------------ | -------------------------------- |
| `profiles`              | ✓            | ✓            | ✓            | User data; soft delete for GDPR. |
| `wallets`               | ✓            | —            | ✓            | User wallet connections.         |
| `card_orders`           | ✓            | ✓            | —            | Orders are never deleted; cancelled via status. |
| `payment_transactions`  | ✓            | —            | —            | Payments are immutable after verification. |
| `shipping_addresses`    | ✓            | ✓            | ✓            | User data; soft delete.          |
| `support_tickets`       | ✓            | ✓            | ✓            | User data; soft delete after retention. |
| `admins`                | ✓            | ✓            | ✓            | Admin accounts.                  |
| `audit_logs`            | ✓            | —            | —            | Append-only; no update/delete.   |
| `system_settings`       | ✓            | ✓            | —            | Config history retained.         |

---

## 6. Soft Delete Strategy

### 6.1 Policy

| Rule                  | Detail                                              |
| --------------------- | --------------------------------------------------- |
| Soft delete column    | `deleted_at TIMESTAMPTZ DEFAULT NULL`.              |
| Soft-deleted rows     | `deleted_at IS NOT NULL` means the row is "deleted". |
| Application queries   | Always filter `WHERE deleted_at IS NULL` for active data. |
| Hard delete           | Only via scheduled cleanup after retention period (e.g., 90 days). |
| Never soft-delete     | `card_orders`, `payment_transactions`, `audit_logs` — these are immutable records. |

### 6.2 Tables with Soft Delete

| Table                   | Soft Delete? | Rationale                                      |
| ----------------------- | ------------ | ---------------------------------------------- |
| `profiles`              | ✓            | GDPR right to erasure; retain order history.   |
| `wallets`               | ✓            | User can disconnect; retain for audit.         |
| `shipping_addresses`    | ✓            | User can delete addresses; retain for order history. |
| `notifications`         | ✓            | User can dismiss; auto-clean after 30 days.    |
| `support_tickets`       | ✓            | Resolved tickets cleaned after retention.      |
| `admins`                | ✓            | Deactivate, don't delete; retain audit trail.  |
| `card_orders`           | ✗            | Orders are permanent records (cancel via status). |
| `payment_transactions`  | ✗            | Payments are immutable (financial audit).      |
| `audit_logs`            | ✗            | Append-only; never update or delete.           |
| `card_products`         | ✓            | Deactivate via `active = false`; soft delete for removal. |
| `payment_addresses`     | ✓            | Deactivate; retain for payment history.        |

### 6.3 Soft Delete and RLS

RLS policies must account for soft deletes:

```sql
-- Example: users can only see their non-deleted profiles
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id AND deleted_at IS NULL);
```

> Full RLS policies including soft-delete filters live in Book 10.

---

## 7. Table Inventory

19 tables across 5 domains for the MVP.

### 7.1 Authentication & Identity (3 tables)

| Table          | Purpose                                              | PK  | Soft Delete | RLS  |
| -------------- | ---------------------------------------------------- | --- | ----------- | ---- |
| `profiles`     | Customer profile data (linked to `auth.users`).      | id  | ✓           | ✓    |
| `roles`        | Role definitions (customer, admin, super_admin).     | id  | —           | ✓    |
| `user_roles`   | Junction: users ↔ roles (many-to-many).              | id  | —           | ✓    |

### 7.2 Wallet (2 tables)

| Table                 | Purpose                                              | PK  | Soft Delete | RLS  |
| --------------------- | ---------------------------------------------------- | --- | ----------- | ---- |
| `wallets`             | User's connected wallets (read-only address).        | id  | ✓           | ✓    |
| `wallet_connections`  | Connection history/events (connect, disconnect).     | id  | —           | ✓    |

### 7.3 Cards (3 tables)

| Table                  | Purpose                                              | PK  | Soft Delete | RLS  |
| ---------------------- | ---------------------------------------------------- | --- | ----------- | ---- |
| `card_products`        | Catalog of available cards (physical/virtual).       | id  | ✓           | ✓    |
| `card_orders`          | Customer orders with state machine.                  | id  | —           | ✓    |
| `card_status_history`  | Order status change log (audit trail per order).     | id  | —           | ✓    |

### 7.4 Payments (3 tables)

| Table                   | Purpose                                              | PK  | Soft Delete | RLS  |
| ----------------------- | ---------------------------------------------------- | --- | ----------- | ---- |
| `supported_networks`    | Blockchain networks (Ethereum, Polygon, etc.).       | id  | —           | ✓    |
| `payment_addresses`     | Platform's receiving wallet addresses per network.   | id  | ✓           | ✓    |
| `payment_transactions`  | Verified crypto payment records (tx hash, amount).   | id  | —           | ✓    |

### 7.5 Customer (4 tables)

| Table                 | Purpose                                              | PK  | Soft Delete | RLS  |
| --------------------- | ---------------------------------------------------- | --- | ----------- | ---- |
| `shipping_addresses`  | Delivery addresses for physical cards.               | id  | ✓           | ✓    |
| `notifications`       | In-app notifications per user.                       | id  | ✓           | ✓    |
| `support_tickets`     | Customer support tickets.                            | id  | ✓           | ✓    |
| `ticket_messages`     | Messages within support tickets.                     | id  | —           | ✓    |

### 7.6 Administration (4 tables)

| Table              | Purpose                                              | PK  | Soft Delete | RLS  |
| ------------------ | ---------------------------------------------------- | --- | ----------- | ---- |
| `admins`           | Admin profiles (linked to `auth.users`).             | id  | ✓           | ✓    |
| `activity_logs`    | User activity tracking (login, wallet, order).       | id  | —           | ✓    |
| `audit_logs`       | Admin action audit trail (append-only).              | id  | —           | ✓    |
| `system_settings`  | Platform configuration (key-value).                  | id  | —           | ✓    |

### 7.7 Summary

| Domain               | Tables | Count |
| -------------------- | ------- | ----- |
| Authentication       | profiles, roles, user_roles | 3 |
| Wallet               | wallets, wallet_connections | 2 |
| Cards                | card_products, card_orders, card_status_history | 3 |
| Payments             | supported_networks, payment_addresses, payment_transactions | 3 |
| Customer             | shipping_addresses, notifications, support_tickets, ticket_messages | 4 |
| Administration       | admins, activity_logs, audit_logs, system_settings | 4 |
| **Total**            |         | **19** |

---

## 8. High-Level Entity Relationships

### 8.1 Relationship Map

```text
AUTHENTICATION & IDENTITY
=========================
auth.users (Supabase) ──1:1── profiles
profiles               ──1:N── user_roles
roles                  ──1:N── user_roles

WALLET
======
profiles               ──1:N── wallets
wallets                ──1:N── wallet_connections

CARDS
=====
card_products          ──1:N── card_orders
profiles               ──1:N── card_orders
card_orders            ──1:N── card_status_history
shipping_addresses     ──1:N── card_orders (optional, physical only)

PAYMENTS
========
supported_networks     ──1:N── payment_addresses
supported_networks     ──1:N── payment_transactions
payment_addresses      ──1:N── payment_transactions
profiles               ──1:N── payment_transactions
wallets                ──1:N── payment_transactions
payment_transactions   ──1:1── card_orders (one payment per order; tx hash unique)

CUSTOMER
========
profiles               ──1:N── shipping_addresses
profiles               ──1:N── notifications
profiles               ──1:N── support_tickets
support_tickets        ──1:N── ticket_messages

ADMINISTRATION
==============
auth.users (Supabase) ──1:1── admins
admins                ──1:N── audit_logs
admins                ──1:N── activity_logs
system_settings        (standalone key-value)
```

### 8.2 Key Relationship Rules

| Rule                  | Detail                                              |
| --------------------- | --------------------------------------------------- |
| profiles ↔ auth.users | 1:1. `profiles.id` = `auth.users.id` (shared PK).   |
| profiles ↔ wallets    | 1:N. A user can have multiple wallets over time (but one active at a time in MVP). |
| profiles ↔ card_orders| 1:N. A user can place multiple orders.              |
| card_orders ↔ payment_transactions | 1:1. One verified payment per order. tx_hash is UNIQUE. |
| card_orders ↔ card_status_history | 1:N. Every state transition creates a history row. |
| card_orders ↔ shipping_addresses | N:1 (optional). Physical orders reference a shipping address; virtual orders don't. |
| support_tickets ↔ ticket_messages | 1:N. A ticket has many messages. |
| profiles ↔ user_roles | 1:N via junction. A user can have multiple roles (e.g., customer + admin). |
| admins ↔ audit_logs   | 1:N. Every admin action is logged.                  |

### 8.3 Cardinality Summary

| From                  | To                    | Cardinality | FK Column              |
| --------------------- | --------------------- | ----------- | ---------------------- |
| profiles              | wallets               | 1:N         | wallets.profile_id     |
| profiles              | card_orders           | 1:N         | card_orders.profile_id |
| profiles              | payment_transactions  | 1:N         | payment_transactions.profile_id |
| profiles              | shipping_addresses    | 1:N         | shipping_addresses.profile_id |
| profiles              | notifications         | 1:N         | notifications.profile_id |
| profiles              | support_tickets       | 1:N         | support_tickets.profile_id |
| card_products         | card_orders           | 1:N         | card_orders.card_product_id |
| card_orders           | card_status_history   | 1:N         | card_status_history.card_order_id |
| payment_transactions  | card_orders           | 1:1         | card_orders.payment_transaction_id |
| shipping_addresses    | card_orders           | 1:N         | card_orders.shipping_address_id (nullable) |
| supported_networks    | payment_addresses     | 1:N         | payment_addresses.network_id |
| supported_networks    | payment_transactions  | 1:N         | payment_transactions.network_id |
| payment_addresses     | payment_transactions  | 1:N         | payment_transactions.payment_address_id |
| wallets               | payment_transactions  | 1:N         | payment_transactions.wallet_id |
| support_tickets       | ticket_messages       | 1:N         | ticket_messages.ticket_id |
| user_roles            | profiles              | N:1         | user_roles.profile_id  |
| user_roles            | roles                 | N:1         | user_roles.role_id     |

> Detailed ERD with crow's-foot notation and full column mapping lives in Book 09.

---

## 9. Indexing Strategy

### 9.1 Indexing Rules

| Rule                  | Detail                                              |
| --------------------- | --------------------------------------------------- |
| All foreign keys      | Automatically indexed (Postgres creates index for FK). |
| Frequently filtered   | Index columns used in WHERE clauses (status, created_at, profile_id). |
| Unique constraints    | Enforced via UNIQUE indexes (tx_hash, wallet_address, email). |
| Composite indexes     | For multi-column filter patterns (e.g., profile_id + status). |
| Partial indexes       | For soft-delete filtering (`WHERE deleted_at IS NULL`). |
| No over-indexing      | Each index has a documented query that uses it.     |

### 9.2 Required Indexes

| Table                   | Index Name                              | Columns                    | Type     | Rationale                        |
| ----------------------- | --------------------------------------- | -------------------------- | -------- | -------------------------------- |
| `profiles`              | `uniq_profiles_email`                   | email                      | UNIQUE   | Email lookup, no duplicates.     |
| `wallets`               | `uniq_wallets_address`                  | wallet_address             | UNIQUE   | One connection per address.      |
| `wallets`               | `idx_wallets_profile_id`                | profile_id                 | BTREE    | User's wallet lookup.            |
| `card_orders`           | `idx_card_orders_profile_id_status`     | profile_id, status         | BTREE    | User's orders filtered by status.|
| `card_orders`           | `idx_card_orders_status_created_at`     | status, created_at         | BTREE    | Admin: filter by status + date.  |
| `card_status_history`   | `idx_card_status_history_order_id`      | card_order_id              | BTREE    | Order timeline lookup.           |
| `payment_transactions`  | `uniq_payment_transactions_tx_hash`     | tx_hash                    | UNIQUE   | Replay protection; one tx per order. |
| `payment_transactions`  | `idx_payment_transactions_profile_id`   | profile_id                 | BTREE    | User's transaction history.      |
| `payment_transactions`  | `idx_payment_transactions_order_id`     | card_order_id              | BTREE    | Payment lookup per order.        |
| `shipping_addresses`    | `idx_shipping_addresses_profile_id`     | profile_id                 | BTREE    | User's addresses.                |
| `notifications`         | `idx_notifications_profile_id_read`     | profile_id, read           | BTREE    | Unread notifications per user.   |
| `support_tickets`       | `idx_support_tickets_profile_id_status` | profile_id, status         | BTREE    | User's tickets by status.        |
| `support_tickets`       | `idx_support_tickets_status_priority`   | status, priority           | BTREE    | Admin: ticket queue.             |
| `ticket_messages`       | `idx_ticket_messages_ticket_id`         | ticket_id                  | BTREE    | Messages per ticket.             |
| `audit_logs`            | `idx_audit_logs_admin_id_created_at`    | admin_id, created_at       | BTREE    | Admin action history.            |
| `audit_logs`            | `idx_audit_logs_entity_type_entity_id`  | entity_type, entity_id     | BTREE    | Entity-level audit lookup.       |

### 9.3 Partial Indexes (Soft Delete)

For tables with soft deletes, create partial indexes to optimize active-data queries:

```sql
CREATE INDEX idx_profiles_active ON public.profiles (id) WHERE deleted_at IS NULL;
CREATE INDEX idx_wallets_active ON public.wallets (profile_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_shipping_addresses_active ON public.shipping_addresses (profile_id) WHERE deleted_at IS NULL;
```

> Full index DDL lives in Book 08 (Schema).

---

## 10. Row Level Security Overview

### 10.1 Strategy

RLS is enabled on **every table**. The strategy is:

| Layer              | Enforcement                                          |
| ------------------ | ---------------------------------------------------- |
| Middleware         | Route-level access control (fast, edge).             |
| Edge Functions     | Action-level checks (sensitive operations).          |
| RLS                | Row-level data access (the final authority).         |

The client is **never** trusted for authorization. RLS is the last line of defense.

### 10.2 Policy Pattern by Role

| Role             | SELECT                          | INSERT                         | UPDATE                         | DELETE                         |
| ---------------- | ------------------------------- | ------------------------------ | ------------------------------ | ------------------------------ |
| Customer         | Own rows only (`auth.uid() = profile_id`) | Own rows only | Own profile/settings only | Soft-delete own non-critical data |
| Admin            | All rows in their scope          | —                              | Order state transitions, ticket responses | — (no hard delete) |
| Super Admin      | All rows                         | Config, admins                 | Config, admins, settings       | Soft-delete with audit         |
| System (service-role) | All (Edge Functions only)    | All (Edge Functions only)      | All (Edge Functions only)      | All (Edge Functions only)      |
| Anonymous        | Public tables only (card_products active, supported_networks active) | — | — | — |

### 10.3 Key Policy Rules

| Rule                  | Detail                                              |
| --------------------- | --------------------------------------------------- |
| `auth.uid()`          | Maps to `profiles.id` (shared PK with `auth.users`). |
| Own data only         | Customer: `auth.uid() = profile_id` on all customer tables. |
| Soft delete filter    | Policies include `deleted_at IS NULL` where applicable. |
| Append-only           | `audit_logs`: no UPDATE or DELETE policy (only INSERT from service-role). |
| Payment immutability  | `payment_transactions`: no UPDATE after `status = 'confirmed'`. |
| Public read           | `card_products` (active only) and `supported_networks` (active only) are publicly readable. |
| Admin RBAC            | Admins access via role check in `user_roles` or `admins` table. |

> Full policy DDL per table lives in Book 10.

---

## 11. Performance Considerations

### 11.1 Query Performance Targets

| Query Type              | Target          | Strategy                              |
| ----------------------- | --------------- | ------------------------------------ |
| User dashboard data     | < 500ms (p95)  | Indexed profile_id lookups; RLS filter uses index. |
| Admin list views        | < 500ms (p95)  | Indexed status + created_at; cursor pagination. |
| Payment verification    | < 10s (incl RPC)| Indexed tx_hash lookup; RPC round-trip dominates. |
| Order tracking          | < 200ms        | Indexed card_order_id on status_history. |

### 11.2 Pagination Strategy

- Use **keyset (cursor) pagination** on large tables, not `OFFSET`.
- Cursor: `(created_at, id)` tuple for stable ordering.
- Page size: 20 (default), 50 (admin), 100 (max).

```sql
-- Example: keyset pagination on card_orders
SELECT * FROM card_orders
WHERE profile_id = $1
  AND (created_at, id) < ($2, $3)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

### 11.3 Connection Pooling

- Supabase manages connection pooling (PgBiter) — no app-level pool needed.
- Server Components and Edge Functions use the Supabase client (connection-pooled).
- Avoid long-running transactions; keep queries short.

### 11.4 N+1 Prevention

- Use Supabase's embedded select (joins) for related data:
  ```ts
  supabase.from('card_orders')
    .select('*, card_products(*), payment_transactions(*)')
    .eq('profile_id', userId);
  ```
- Never fetch a list and then loop-query related data.
- Review query plans for N+1 patterns during development.

### 11.5 Analytics Considerations

- MVP analytics: aggregate queries on existing tables (no separate analytics DB).
- Post-MVP: materialized views for analytics (Book 11).
- Never run heavy analytics queries on the primary DB during peak hours (post-MVP: read replica).

---

## 12. Data Integrity Rules

| ID    | Rule                                                              | Enforcement                     |
| ----- | ----------------------------------------------------------------- | ------------------------------- |
| DI-01 | Every user has exactly one auth identity (Supabase Auth).         | Supabase Auth.                  |
| DI-02 | An order must reference a valid card_product.                     | FK constraint.                  |
| DI-03 | A payment must reference exactly one order.                       | FK + UNIQUE on tx_hash.         |
| DI-04 | A tx_hash may only be linked to one order (replay protection).    | UNIQUE(tx_hash).                |
| DI-05 | Order state transitions must follow the state machine.            | Edge Function logic + trigger.  |
| DI-06 | Wallet addresses are stored read-only; no private keys anywhere.  | Schema (no key column) + lint.  |
| DI-07 | Every table has RLS policies.                                     | Migration + advisors check.     |
| DI-08 | Audit logs are append-only.                                       | No UPDATE/DELETE policy + trigger. |
| DI-09 | Payment amount must be positive.                                  | CHECK (amount > 0).             |
| DI-10 | Order status must be a valid enum value.                          | ENUM or CHECK constraint.       |
| DI-11 | A confirmed payment cannot be modified.                           | RLS + trigger guard.            |
| DI-12 | Soft-deleted rows are excluded from active queries.               | RLS + app query filter.         |

> Detailed constraint DDL per table lives in Book 08.

---

## 13. Migration Strategy

### 13.1 Principles

| Rule                  | Detail                                              |
| --------------------- | --------------------------------------------------- |
| Versioned migrations  | Each migration is numbered and timestamped.         |
| Forward-only          | No `down` migrations on production.                 |
| Append-only           | Migrations are never modified after being applied.  |
| Atomic                | Each migration is wrapped in a transaction.         |
| Tested locally        | Run against `supabase start` (local) before remote. |
| Advisors after DDL    | Run `supabase_get_advisors` (security) after every migration. |
| Types after schema    | Generate TypeScript types after schema changes.     |

### 13.2 Migration File Naming

```text
supabase/migrations/
├── 20260721000001_create_profiles.sql
├── 20260721000002_create_roles.sql
├── 20260721000003_create_user_roles.sql
├── 20260721000004_create_wallets.sql
├── 20260721000005_create_wallet_connections.sql
├── 20260721000006_create_card_products.sql
├── 20260721000007_create_card_orders.sql
├── 20260721000008_create_card_status_history.sql
├── 20260721000009_create_supported_networks.sql
├── 20260721000010_create_payment_addresses.sql
├── 20260721000011_create_payment_transactions.sql
├── 20260721000012_create_shipping_addresses.sql
├── 20260721000013_create_notifications.sql
├── 20260721000014_create_support_tickets.sql
├── 20260721000015_create_ticket_messages.sql
├── 20260721000016_create_admins.sql
├── 20260721000017_create_activity_logs.sql
├── 20260721000018_create_audit_logs.sql
├── 20260721000019_create_system_settings.sql
├── 20260721000020_create_indexes.sql
├── 20260721000021_create_rls_policies.sql
├── 20260721000022_create_functions_triggers.sql
├── 20260721000023_create_seed_data.sql
```

### 13.3 Migration Order

1. **Tables** (in dependency order: independent tables first, dependent tables after).
2. **Indexes** (after tables).
3. **RLS policies** (after tables).
4. **Functions and triggers** (after tables and policies).
5. **Seed data** (after all schema is in place).

### 13.4 Branch Workflow (Supabase Branches)

```text
1. Create a Supabase branch (copies schema, not data).
2. Apply new migrations on the branch.
3. Test locally and on the branch.
4. Run security advisors on the branch.
5. Merge branch to production (applies migrations to prod).
6. Run security advisors on production.
7. Generate TypeScript types.
```

> Detailed migration files and seed data live in Book 12.

---

## 14. Supabase Integration Notes

### 14.1 Supabase Auth Integration

- `auth.users` is managed by Supabase Auth (not directly in our schema).
- `profiles.id` = `auth.users.id` (shared UUID PK).
- A trigger on `auth.users` INSERT creates the corresponding `profiles` row.
- Auth events (login, logout, register) are logged by Supabase Auth.

### 14.2 Storage Integration

- User avatars stored in Supabase Storage bucket `avatars`.
- Card product images stored in bucket `card-images`.
- Storage buckets have their own RLS policies (separate from database RLS).
- Document uploads (future KYC) stored in bucket `kyc-documents` (encrypted, post-MVP).

### 14.3 Realtime Integration

- `card_orders` status changes broadcast via Supabase Realtime.
- `notifications` inserts broadcast via Realtime.
- `support_tickets` message inserts broadcast via Realtime.
- Realtime respects RLS (users only see their own changes).

### 14.4 Edge Functions Integration

- Payment verification: `supabase/functions/verify-payment/`
- Order state transitions: `supabase/functions/transition-order/`
- Admin actions: `supabase/functions/admin-action/`
- Edge Functions use the service-role key (server-side only) and enforce RBAC.

### 14.5 Extensions Required

| Extension     | Purpose                              |
| ------------- | ------------------------------------ |
| `pgcrypto`    | `gen_random_uuid()` for UUID PKs.    |
| `uuid-ossp`   | Alternative UUID generation (if needed). |
| `pgjwt`       | JWT handling (Supabase Auth uses this). |

---

## 15. Future Tables

Reserved for post-MVP features (do not create in MVP migrations):

| Table                  | Purpose                              | Version |
| ---------------------- | ------------------------------------ | ------- |
| `kyc_requests`         | KYC verification requests.           | v2      |
| `kyc_documents`        | KYC document uploads.                | v2      |
| `referrals`            | Referral codes and links.            | v2      |
| `reward_points`        | Card spend rewards.                  | v2      |
| `merchant_accounts`    | Merchant portal accounts.            | v2      |
| `business_profiles`    | Business account profiles.           | v3      |
| `exchange_rates`       | Crypto-to-fiat exchange rates.       | v2      |
| `api_keys`             | Developer API keys.                  | v3      |
| `webhooks`             | Webhook endpoint configurations.     | v3      |
| `email_logs`           | Transactional email delivery log.    | v2      |
| `sms_logs`             | SMS delivery log.                    | v3      |
| `activity_events`      | Detailed user activity events.       | v2      |
| `card_shipments`       | Detailed shipment tracking.          | v2      |
| `countries`            | Country reference data.              | v2      |
| `currencies`           | Currency reference data.             | v2      |
| `languages`            | Language reference data.             | v3      |
| `subscription_plans`   | Subscription tiers (if applicable).  | v3      |
| `card_transactions`    | Card spend transactions.             | v2      |

> Future tables are designed to be additive (no rework to existing schema).

---

## 16. Glossary

| Term                | Definition                                                        |
| ------------------- | ----------------------------------------------------------------- |
| RLS                 | Row Level Security (Postgres) — per-row access control.           |
| UUID                | Universally Unique Identifier (128-bit, v4 random).               |
| Soft delete         | Marking a row as deleted via `deleted_at` without removing it.    |
| Audit fields        | `created_at`, `updated_at`, `created_by`, `updated_by`.           |
| Migration           | A versioned SQL file that changes the database schema.            |
| Keyset pagination   | Cursor-based pagination using a sorted column tuple.              |
| ENUM                | A Postgres type with a fixed set of values.                       |
| JSONB               | Binary JSON type for flexible structured data.                    |
| Junction table      | A table that implements a many-to-many relationship.              |
| Append-only         | A table where rows can be added but never modified or deleted.    |
| `auth.uid()`        | Supabase function returning the current user's UUID.              |
| Service-role key    | Supabase server-side key bypassing RLS; server-only.              |

---

## 17. References

- Book 01 — Project Foundation (architecture, §10; constraints, §13)
- Book 02 — Business Requirements (user roles, §7; business rules, §13)
- Book 05 — Software Requirements Specification (data requirements, §7; data integrity, §7.2; security, §10)
- `00-Project/TECH_STACK.md`
- `00-Project/CHANGELOG.md`

### Downstream Books (Database Suite)

| Book | Title                                  | Consumes Book 07 as...                |
| ---- | -------------------------------------- | ------------------------------------- |
| 08   | Database Schema                         | Implements the table inventory with full DDL. |
| 09   | Entity Relationship Diagram (ERD)       | Visualizes the relationships defined in §8. |
| 10   | Supabase Row Level Security (RLS)      | Implements the RLS strategy defined in §10. |
| 11   | Database Functions, Triggers & Views    | Implements the audit trigger strategy (§5.3) and integrity rules (§12). |
| 12   | Seed Data & Migrations                  | Implements the migration strategy (§13) and seeds initial data. |

### Other Downstream Books

| Book | Title              | Consumes Book 07 as...                |
| ---- | ------------------ | ------------------------------------- |
| 13+  | Feature books      | Reference table inventory and relationships for data access. |
| 22   | API Specifications | References tables and RLS for endpoint design. |
| 23   | Security           | References RLS strategy and audit trail. |
| 26   | Testing            | Tests RLS policies and data integrity rules. |

---

## Next Book

**Book 08 — Database Schema** (`04-Database/BOOK_08_DATABASE_SCHEMA.md`): every table with every column, type, constraint, default, and foreign key in implementation-ready SQL. The complete DDL reference that OpenCode uses to generate migrations and TypeScript types. Implements the 19-table inventory defined here.

---

> End of Book 07 — Database Architecture. This document is the foundational database architecture for the platform. Any change to table inventory, naming conventions, UUID strategy, audit strategy, or RLS strategy requires a version bump in this book and a `00-Project/CHANGELOG.md` entry.
