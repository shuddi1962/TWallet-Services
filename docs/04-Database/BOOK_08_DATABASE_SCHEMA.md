# Book 08 — Database Schema

> **TWallet Services · TWallet Card**
> The complete DDL reference for every production database table. Every column, type, constraint, default, foreign key, index, and enum is defined here in implementation-ready SQL. OpenCode uses this document to generate Supabase migrations and TypeScript types. This is the authoritative schema — Books 07 (Architecture), 09 (ERD), 10 (RLS), 11 (Functions/Triggers/Views), and 12 (Seed Data & Migrations) all derive from it.

---

## Document Control

| Field           | Value                              |
| --------------- | ---------------------------------- |
| Book            | 08 — Database Schema               |
| Project         | TWallet Services                   |
| Product         | TWallet Card                       |
| Version         | 1.0.0                              |
| Status          | Approved                           |
| Database        | Supabase PostgreSQL 15             |
| Schema          | `public`                           |
| Owner           | TWallet Services Team              |
| Created         | 2026-07-21                         |
| Last Updated    | 2026-07-21                         |
| Implements      | Book 07 — Database Architecture    |

### Revision History

| Version | Date       | Author                  | Notes                                                                    |
| ------- | ---------- | ----------------------- | ------------------------------------------------------------------------ |
| 0.1.0   | 2026-07-21 | TWallet Services Team   | Initial draft (table list, columns, relationships, supported networks)   |
| 1.0.0   | 2026-07-21 | TWallet Services Team   | Approved: full DDL for all 19 tables, enums, constraints, FKs, indexes, defaults, implementation-ready SQL |

---

## Table of Contents

1. [Overview](#1-overview)
2. [Schema Conventions](#2-schema-conventions)
3. [Custom Enums (Types)](#3-custom-enums-types)
4. [Table DDL — Authentication & Identity](#4-table-ddl--authentication--identity)
5. [Table DDL — Wallet](#5-table-ddl--wallet)
6. [Table DDL — Cards](#6-table-ddl--cards)
7. [Table DDL — Payments](#7-table-ddl--payments)
8. [Table DDL — Customer](#8-table-ddl--customer)
9. [Table DDL — Administration](#9-table-ddl--administration)
10. [Indexes (All Tables)](#10-indexes-all-tables)
11. [Foreign Key Summary](#11-foreign-key-summary)
12. [Constraint Summary](#12-constraint-summary)
13. [Supabase Auth Integration](#13-supabase-auth-integration)
14. [Extensions Required](#14-extensions-required)
15. [TypeScript Types (Preview)](#15-typescript-types-preview)
16. [Schema Validation Checklist](#16-schema-validation-checklist)
17. [Glossary](#17-glossary)
18. [References](#18-references)

---

## 1. Overview

This document defines every production database table required for the MVP.

### 1.1 Database Design Goals

| Goal              | How Achieved                                          |
| ----------------- | ----------------------------------------------------- |
| Enterprise Ready  | RLS, audit fields, soft deletes, normalized (3NF).    |
| Highly Scalable   | UUIDs, indexed FKs, keyset pagination-ready.          |
| Secure            | RLS on every table; no private keys stored.           |
| UUID Based        | `gen_random_uuid()` on every PK.                      |
| Optimized         | Indexes on all FKs + frequently filtered columns.     |
| Fully Indexed     | 16+ indexes defined in §10.                           |
| RLS Enabled       | `ENABLE ROW LEVEL SECURITY` on every table (Book 10). |

### 1.2 Table Count

19 tables across 6 domains:

| Domain             | Tables | Count |
| ------------------ | ------- | ----- |
| Authentication     | profiles, roles, user_roles | 3 |
| Wallet             | wallets, wallet_connections | 2 |
| Cards              | card_products, card_orders, card_status_history | 3 |
| Payments           | supported_networks, payment_addresses, payment_transactions | 3 |
| Customer           | shipping_addresses, notifications, support_tickets, ticket_messages | 4 |
| Administration     | admins, activity_logs, audit_logs, system_settings | 4 |
| **Total**          |         | **19** |

### 1.3 Implementation Note

The SQL in this document is **copy-paste ready** for Supabase migrations. Each `CREATE TABLE` block is wrapped in a transaction with `IF NOT EXISTS` guards where appropriate. OpenCode should generate one migration file per table (in dependency order) following the naming convention in Book 07 §13.2.

---

## 2. Schema Conventions

### 2.1 Column Type Mapping

| Concept              | Postgres Type          | Notes                                  |
| -------------------- | ---------------------- | -------------------------------------- |
| Primary key          | `UUID`                 | `DEFAULT gen_random_uuid()`            |
| Foreign key          | `UUID`                 | Matches referenced PK                  |
| Text (short)         | `TEXT`                 | No `VARCHAR(n)` unless max-length needed |
| Text (long)          | `TEXT`                 | No length limit on `TEXT`              |
| Boolean              | `BOOLEAN`              | `DEFAULT true` or `DEFAULT false`      |
| Timestamp            | `TIMESTAMPTZ`          | UTC; `DEFAULT now()`                   |
| Money/amount         | `NUMERIC(20,8)`        | 8 decimals for crypto precision        |
| Integer (chain id)   | `INTEGER`              | EVM chain IDs                          |
| JSONB (metadata)     | `JSONB`                | `DEFAULT '{}'::jsonb`                  |
| Status               | Custom `ENUM`          | See §3                                 |
| IP address           | `INET`                 | Postgres native type                   |

### 2.2 Defaults

| Field         | Default                        |
| ------------- | ------------------------------ |
| `id`          | `gen_random_uuid()`            |
| `created_at`  | `now()`                        |
| `updated_at`  | `now()`                        |
| `is_*`        | `false` (unless specified)     |
| `status`      | Enum default per table         |
| `metadata`    | `'{}'::jsonb`                  |

### 2.3 Nullable Policy

- Required fields: `NOT NULL`
- Optional fields: nullable (no `NOT NULL`)
- FKs to optional relationships: nullable (e.g., `shipping_address_id` on virtual card orders)
- `deleted_at`: nullable (NULL = not deleted)

---

## 3. Custom Enums (Types)

Custom enums enforce valid status values at the database level. Created before tables.

```sql
-- ============================================================
-- CUSTOM ENUMS
-- ============================================================

-- Profile status
CREATE TYPE public.profile_status AS ENUM ('active', 'suspended', 'deleted');

-- Wallet provider
CREATE TYPE public.wallet_provider AS ENUM ('metamask', 'coinbase', 'trust', 'walletconnect');

-- Card product type
CREATE TYPE public.card_type AS ENUM ('physical', 'virtual');

-- Order status (state machine — see Book 05 §6.2)
CREATE TYPE public.order_status AS ENUM (
  'pending',       -- Order created, awaiting payment
  'paid',          -- Payment verified
  'processing',    -- Card being prepared
  'printing',      -- Physical card printing
  'packaging',     -- Card packaging
  'shipped',       -- Card shipped
  'delivered',     -- Card delivered
  'cancelled',     -- Order cancelled
  'refunded'       -- Order refunded (SA only)
);

-- Payment status
CREATE TYPE public.payment_status AS ENUM (
  'pending',       -- Tx hash submitted, verification pending
  'broadcasted',   -- Tx seen on-chain (not yet confirmed)
  'confirming',    -- Awaiting N confirmations
  'confirmed',     -- Verified successfully
  'failed',        -- Verification failed
  'expired'        -- Tx not seen within timeout
);

-- Payment address status
CREATE TYPE public.payment_address_status AS ENUM ('active', 'inactive', 'rotated');

-- Notification type
CREATE TYPE public.notification_type AS ENUM ('info', 'success', 'warning', 'error', 'promotion', 'system');

-- Support ticket priority
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Support ticket status
CREATE TYPE public.ticket_status AS ENUM ('open', 'pending', 'resolved', 'closed');

-- Ticket message sender
CREATE TYPE public.ticket_sender AS ENUM ('customer', 'admin', 'system');

-- Admin role
CREATE TYPE public.admin_role AS ENUM ('support', 'manager', 'finance', 'operations', 'super_admin');

-- Activity log action (extensible — use TEXT if actions grow beyond this list)
CREATE TYPE public.activity_action AS ENUM (
  'login', 'logout', 'register', 'password_reset', 'email_verify',
  'wallet_connect', 'wallet_disconnect',
  'order_create', 'order_cancel',
  'payment_submit', 'payment_verify',
  'profile_update', 'settings_update',
  'ticket_create', 'ticket_reply'
);

-- Audit log action (admin-only)
CREATE TYPE public.audit_action AS ENUM (
  'admin_login', 'admin_logout',
  'user_suspend', 'user_reactivate', 'user_delete',
  'order_transition', 'order_cancel',
  'payment_mark_verified', 'payment_mark_failed',
  'settings_update', 'wallet_address_add', 'wallet_address_rotate',
  'admin_create', 'admin_update', 'admin_deactivate'
);
```

---

## 4. Table DDL — Authentication & Identity

### 4.1 `profiles`

**Purpose:** Stores customer profile information. 1:1 with `auth.users` (Supabase Auth).

```sql
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id  UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL,
  username      TEXT UNIQUE,
  email         TEXT NOT NULL UNIQUE,
  phone         TEXT,
  avatar_url    TEXT,
  country       TEXT,
  state         TEXT,
  city          TEXT,
  timezone      TEXT DEFAULT 'UTC',
  language      TEXT DEFAULT 'en',
  status        public.profile_status NOT NULL DEFAULT 'active',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by    UUID REFERENCES public.profiles(id),
  updated_by    UUID REFERENCES public.profiles(id),
  deleted_at    TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_profiles_email ON public.profiles (email) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_username ON public.profiles (username) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_auth_user_id ON public.profiles (auth_user_id);
CREATE INDEX idx_profiles_active ON public.profiles (id) WHERE deleted_at IS NULL;

-- Comment
COMMENT ON TABLE public.profiles IS 'Customer profile data. 1:1 with auth.users. Soft-deletable for GDPR.';
COMMENT ON COLUMN public.profiles.auth_user_id IS 'References Supabase auth.users.id. ON DELETE CASCADE removes profile when auth user is deleted.';
```

| Column         | Type                    | Nullable | Default             | Notes                              |
| -------------- | ----------------------- | -------- | ------------------- | ---------------------------------- |
| id             | UUID                    | NO       | `gen_random_uuid()` | PK; shared with auth.users in some flows |
| auth_user_id   | UUID                    | NO       | —                   | FK → auth.users(id); UNIQUE        |
| full_name      | TEXT                    | NO       | —                   | User's full name                   |
| username       | TEXT                    | YES      | —                   | Optional public username; UNIQUE   |
| email          | TEXT                    | NO       | —                   | UNIQUE; matches auth.users email   |
| phone          | TEXT                    | YES      | —                   | Optional phone                     |
| avatar_url     | TEXT                    | YES      | —                   | Supabase Storage URL               |
| country        | TEXT                    | YES      | —                   | Country name                       |
| state          | TEXT                    | YES      | —                   | State/region                       |
| city           | TEXT                    | YES      | —                   | City                               |
| timezone       | TEXT                    | YES      | `'UTC'`             | IANA timezone                      |
| language       | TEXT                    | YES      | `'en'`              | ISO 639-1 language code            |
| status         | profile_status          | NO       | `'active'`          | active/suspended/deleted           |
| created_at     | TIMESTAMPTZ             | NO       | `now()`             | —                                  |
| updated_at     | TIMESTAMPTZ             | NO       | `now()`             | Auto-updated via trigger           |
| created_by     | UUID                    | YES      | —                   | FK → profiles(id)                  |
| updated_by     | UUID                    | YES      | —                   | FK → profiles(id)                  |
| deleted_at     | TIMESTAMPTZ             | YES      | —                   | Soft delete timestamp              |

### 4.2 `roles`

**Purpose:** Role definitions for RBAC.

```sql
CREATE TABLE public.roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_roles_name ON public.roles (name);

COMMENT ON TABLE public.roles IS 'Role definitions for RBAC. Seeded with: customer, support, manager, finance, operations, super_admin.';
```

| Column       | Type        | Nullable | Default             | Notes                              |
| ------------ | ----------- | -------- | ------------------- | ---------------------------------- |
| id           | UUID        | NO       | `gen_random_uuid()` | PK                                 |
| name         | TEXT        | NO       | —                   | UNIQUE; e.g., 'customer', 'super_admin' |
| description  | TEXT        | YES      | —                   | Human-readable description         |
| created_at   | TIMESTAMPTZ | NO       | `now()`             | —                                  |
| updated_at   | TIMESTAMPTZ | NO       | `now()`             | Auto-updated via trigger           |

### 4.3 `user_roles`

**Purpose:** Junction table — many-to-many between profiles and roles.

```sql
CREATE TABLE public.user_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id     UUID NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id, role_id)
);

CREATE INDEX idx_user_roles_profile_id ON public.user_roles (profile_id);
CREATE INDEX idx_user_roles_role_id ON public.user_roles (role_id);

COMMENT ON TABLE public.user_roles IS 'Junction: profiles ↔ roles. A user can have multiple roles (e.g., customer + admin).';
```

| Column       | Type        | Nullable | Default             | Notes                              |
| ------------ | ----------- | -------- | ------------------- | ---------------------------------- |
| id           | UUID        | NO       | `gen_random_uuid()` | PK                                 |
| profile_id   | UUID        | NO       | —                   | FK → profiles(id); CASCADE         |
| role_id      | UUID        | NO       | —                   | FK → roles(id); RESTRICT           |
| created_at   | TIMESTAMPTZ | NO       | `now()`             | —                                  |

---

## 5. Table DDL — Wallet

### 5.1 `wallets`

**Purpose:** Stores wallets connected by customers. Read-only address — no private keys ever stored.

```sql
CREATE TABLE public.wallets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  wallet_provider public.wallet_provider NOT NULL,
  wallet_address  TEXT NOT NULL,
  network         TEXT NOT NULL,
  chain_id        INTEGER NOT NULL,
  wallet_name     TEXT,
  is_primary      BOOLEAN NOT NULL DEFAULT false,
  connected_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID REFERENCES public.profiles(id),
  deleted_at      TIMESTAMPTZ,
  UNIQUE(wallet_address, chain_id)
);

CREATE UNIQUE INDEX uniq_wallets_address_chain ON public.wallets (wallet_address, chain_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_wallets_profile_id ON public.wallets (profile_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_wallets_network ON public.wallets (network);
CREATE INDEX idx_wallets_active ON public.wallets (profile_id) WHERE deleted_at IS NULL;

COMMENT ON TABLE public.wallets IS 'User wallet connections. Stores read-only address. NEVER stores private keys or seed phrases.';
COMMENT ON COLUMN public.wallets.wallet_address IS 'Public wallet address only. No private keys are ever stored.';
```

| Column           | Type             | Nullable | Default             | Notes                              |
| ---------------- | ---------------- | -------- | ------------------- | ---------------------------------- |
| id               | UUID             | NO       | `gen_random_uuid()` | PK                                 |
| profile_id       | UUID             | NO       | —                   | FK → profiles(id); CASCADE         |
| wallet_provider  | wallet_provider  | NO       | —                   | metamask/coinbase/trust/walletconnect |
| wallet_address   | TEXT             | NO       | —                   | Public address; UNIQUE per chain   |
| network          | TEXT             | NO       | —                   | Network name (e.g., 'ethereum')    |
| chain_id         | INTEGER          | NO       | —                   | EVM chain ID                       |
| wallet_name      | TEXT             | YES      | —                   | User's label for the wallet        |
| is_primary       | BOOLEAN          | NO       | `false`             | Primary wallet flag                |
| connected_at     | TIMESTAMPTZ      | NO       | `now()`             | When wallet was connected          |
| last_used_at     | TIMESTAMPTZ      | YES      | —                   | Last time wallet was used          |
| created_at       | TIMESTAMPTZ      | NO       | `now()`             | —                                  |
| updated_at       | TIMESTAMPTZ      | NO       | `now()`             | Auto-updated via trigger           |
| created_by       | UUID             | YES      | —                   | FK → profiles(id)                  |
| deleted_at       | TIMESTAMPTZ      | YES      | —                   | Soft delete (disconnect)           |

### 5.2 `wallet_connections`

**Purpose:** Connection event history (connect/disconnect attempts for audit).

```sql
CREATE TABLE public.wallet_connections (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  wallet_id       UUID REFERENCES public.wallets(id) ON DELETE SET NULL,
  wallet_provider public.wallet_provider NOT NULL,
  wallet_address  TEXT NOT NULL,
  action          TEXT NOT NULL CHECK (action IN ('connect', 'disconnect', 'failed')),
  error_message   TEXT,
  ip_address      INET,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_wallet_connections_profile_id ON public.wallet_connections (profile_id);
CREATE INDEX idx_wallet_connections_wallet_id ON public.wallet_connections (wallet_id);
CREATE INDEX idx_wallet_connections_created_at ON public.wallet_connections (created_at);

COMMENT ON TABLE public.wallet_connections IS 'Wallet connection event log. Append-only.';
```

| Column           | Type             | Nullable | Default             | Notes                              |
| ---------------- | ---------------- | -------- | ------------------- | ---------------------------------- |
| id               | UUID             | NO       | `gen_random_uuid()` | PK                                 |
| profile_id       | UUID             | NO       | —                   | FK → profiles(id); CASCADE         |
| wallet_id        | UUID             | YES      | —                   | FK → wallets(id); SET NULL on delete |
| wallet_provider  | wallet_provider  | NO       | —                   | Provider used                      |
| wallet_address   | TEXT             | NO       | —                   | Address involved                   |
| action           | TEXT             | NO       | —                   | connect/disconnect/failed (CHECK)  |
| error_message    | TEXT             | YES      | —                   | Error if failed                    |
| ip_address       | INET             | YES      | —                   | Connection IP                      |
| user_agent       | TEXT             | YES      | —                   | Browser user agent                 |
| created_at       | TIMESTAMPTZ      | NO       | `now()`             | Event timestamp                    |

---

## 6. Table DDL — Cards

### 6.1 `card_products`

**Purpose:** Catalog of available cards (physical/virtual).

```sql
CREATE TABLE public.card_products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  type        public.card_type NOT NULL,
  price       NUMERIC(20,8) NOT NULL CHECK (price >= 0),
  currency    TEXT NOT NULL DEFAULT 'USDC',
  network     TEXT NOT NULL,
  image_url   TEXT,
  features    JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by  UUID REFERENCES public.profiles(id),
  deleted_at  TIMESTAMPTZ
);

CREATE UNIQUE INDEX uniq_card_products_slug ON public.card_products (slug);
CREATE INDEX idx_card_products_type ON public.card_products (type);
CREATE INDEX idx_card_products_active ON public.card_products (id) WHERE is_active = true AND deleted_at IS NULL;

COMMENT ON TABLE public.card_products IS 'Catalog of available cards. Soft-deletable; deactivate via is_active.';
COMMENT ON COLUMN public.card_products.price IS 'Card price in crypto (8 decimal precision).';
COMMENT ON COLUMN public.card_products.features IS 'JSONB array of feature strings for display.';
```

| Column       | Type        | Nullable | Default             | Notes                              |
| ------------ | ----------- | -------- | ------------------- | ---------------------------------- |
| id           | UUID        | NO       | `gen_random_uuid()` | PK                                 |
| name         | TEXT        | NO       | —                   | Card name (e.g., 'TWallet Physical') |
| slug         | TEXT        | NO       | —                   | UNIQUE; URL slug                   |
| description  | TEXT        | YES      | —                   | Marketing description              |
| type         | card_type   | NO       | —                   | physical/virtual                   |
| price        | NUMERIC(20,8)| NO      | —                   | Card price in crypto; CHECK >= 0   |
| currency     | TEXT        | NO       | `'USDC'`            | Crypto currency code               |
| network      | TEXT        | NO       | —                   | Payment network                    |
| image_url    | TEXT        | YES      | —                   | Card image URL (Storage)           |
| features     | JSONB       | NO       | `'{}'::jsonb`       | Feature list for display            |
| is_active    | BOOLEAN     | NO       | `true`              | Whether the card is orderable      |
| created_at   | TIMESTAMPTZ | NO       | `now()`             | —                                  |
| updated_at   | TIMESTAMPTZ | NO       | `now()`             | Auto-updated via trigger           |
| created_by   | UUID        | YES      | —                   | FK → profiles(id)                  |
| deleted_at   | TIMESTAMPTZ | YES      | —                   | Soft delete                        |

### 6.2 `card_orders`

**Purpose:** Customer orders with state machine. Never soft-deleted (permanent record).

```sql
CREATE TABLE public.card_orders (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id              UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  card_product_id         UUID NOT NULL REFERENCES public.card_products(id) ON DELETE RESTRICT,
  shipping_address_id     UUID REFERENCES public.shipping_addresses(id) ON DELETE SET NULL,
  payment_transaction_id  UUID REFERENCES public.payment_transactions(id) ON DELETE RESTRICT,
  status                  public.order_status NOT NULL DEFAULT 'pending',
  tracking_number         TEXT,
  estimated_delivery      TIMESTAMPTZ,
  ordered_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by              UUID REFERENCES public.profiles(id),
  updated_by              UUID REFERENCES public.profiles(id)
);

CREATE INDEX idx_card_orders_profile_id_status ON public.card_orders (profile_id, status);
CREATE INDEX idx_card_orders_status_created_at ON public.card_orders (status, created_at);
CREATE INDEX idx_card_orders_payment_transaction_id ON public.card_orders (payment_transaction_id);
CREATE INDEX idx_card_orders_shipping_address_id ON public.card_orders (shipping_address_id);

COMMENT ON TABLE public.card_orders IS 'Customer card orders. State machine enforced via Edge Function. Never deleted (cancel via status).';
COMMENT ON COLUMN public.card_orders.shipping_address_id IS 'Nullable for virtual card orders.';
COMMENT ON COLUMN public.card_orders.payment_transaction_id IS 'Nullable until payment is verified. 1:1 with payment_transactions.';
```

| Column                    | Type          | Nullable | Default             | Notes                              |
| ------------------------- | ------------- | -------- | ------------------- | ---------------------------------- |
| id                        | UUID          | NO       | `gen_random_uuid()` | PK                                 |
| profile_id                | UUID          | NO       | —                   | FK → profiles(id); RESTRICT        |
| card_product_id           | UUID          | NO       | —                   | FK → card_products(id); RESTRICT   |
| shipping_address_id       | UUID          | YES      | —                   | FK → shipping_addresses(id); SET NULL; null for virtual |
| payment_transaction_id    | UUID          | YES      | —                   | FK → payment_transactions(id); RESTRICT; null until paid |
| status                    | order_status  | NO       | `'pending'`         | State machine (see Book 05 §6.2)   |
| tracking_number           | TEXT          | YES      | —                   | Carrier tracking number            |
| estimated_delivery        | TIMESTAMPTZ   | YES      | —                   | Estimated delivery date            |
| ordered_at                | TIMESTAMPTZ   | NO       | `now()`             | When order was placed              |
| created_at                | TIMESTAMPTZ   | NO       | `now()`             | —                                  |
| updated_at                | TIMESTAMPTZ   | NO       | `now()`             | Auto-updated via trigger           |
| created_by                | UUID          | YES      | —                   | FK → profiles(id)                  |
| updated_by                | UUID          | YES      | —                   | FK → profiles(id)                  |

### 6.3 `card_status_history`

**Purpose:** Order status change log — every state transition creates a row. Append-only.

```sql
CREATE TABLE public.card_status_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_order_id   UUID NOT NULL REFERENCES public.card_orders(id) ON DELETE CASCADE,
  previous_status public.order_status,
  new_status      public.order_status NOT NULL,
  changed_by      UUID REFERENCES public.profiles(id),
  changed_by_type TEXT NOT NULL CHECK (changed_by_type IN ('customer', 'admin', 'system')),
  reason          TEXT,
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_card_status_history_order_id ON public.card_status_history (card_order_id);
CREATE INDEX idx_card_status_history_created_at ON public.card_status_history (created_at);

COMMENT ON TABLE public.card_status_history IS 'Order status transition log. Append-only. Every state change creates a row.';
```

| Column           | Type          | Nullable | Default             | Notes                              |
| ---------------- | ------------- | -------- | ------------------- | ---------------------------------- |
| id               | UUID          | NO       | `gen_random_uuid()` | PK                                 |
| card_order_id    | UUID          | NO       | —                   | FK → card_orders(id); CASCADE      |
| previous_status  | order_status  | YES      | —                   | NULL for initial state             |
| new_status       | order_status  | NO       | —                   | The new status                     |
| changed_by       | UUID          | YES      | —                   | FK → profiles(id); NULL for system |
| changed_by_type  | TEXT          | NO       | —                   | customer/admin/system (CHECK)      |
| reason           | TEXT          | YES      | —                   | Optional reason for transition     |
| metadata         | JSONB         | NO       | `'{}'::jsonb`       | Additional context                 |
| created_at       | TIMESTAMPTZ   | NO       | `now()`             | Transition timestamp               |

---

## 7. Table DDL — Payments

### 7.1 `supported_networks`

**Purpose:** Supported blockchain networks for payments.

```sql
CREATE TABLE public.supported_networks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  symbol        TEXT NOT NULL,
  chain_id      INTEGER NOT NULL UNIQUE,
  rpc_url       TEXT NOT NULL,
  explorer_url  TEXT NOT NULL,
  logo          TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX uniq_supported_networks_chain_id ON public.supported_networks (chain_id);
CREATE INDEX idx_supported_networks_active ON public.supported_networks (id) WHERE is_active = true;

COMMENT ON TABLE public.supported_networks IS 'Supported blockchain networks. Seeded with: Ethereum, BNB, Polygon, Arbitrum, Optimism, Base, Avalanche.';
```

| Column       | Type        | Nullable | Default             | Notes                              |
| ------------ | ----------- | -------- | ------------------- | ---------------------------------- |
| id           | UUID        | NO       | `gen_random_uuid()` | PK                                 |
| name         | TEXT        | NO       | —                   | Network name (e.g., 'Ethereum')    |
| symbol       | TEXT        | NO       | —                   | Native token symbol (e.g., 'ETH')  |
| chain_id     | INTEGER     | NO       | —                   | UNIQUE; EVM chain ID               |
| rpc_url      | TEXT        | NO       | —                   | Public RPC endpoint                |
| explorer_url | TEXT        | NO       | —                   | Block explorer URL                 |
| logo         | TEXT        | YES      | —                   | Network logo URL                   |
| is_active    | BOOLEAN     | NO       | `true`              | Whether network is enabled         |
| created_at   | TIMESTAMPTZ | NO       | `now()`             | —                                  |
| updated_at   | TIMESTAMPTZ | NO       | `now()`             | Auto-updated via trigger           |

### 7.2 `payment_addresses`

**Purpose:** Wallet addresses owned by TWallet Services for receiving payments.

```sql
CREATE TABLE public.payment_addresses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id    UUID NOT NULL REFERENCES public.supported_networks(id) ON DELETE RESTRICT,
  wallet_address TEXT NOT NULL,
  label         TEXT,
  status        public.payment_address_status NOT NULL DEFAULT 'active',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by    UUID REFERENCES public.profiles(id),
  deleted_at    TIMESTAMPTZ,
  UNIQUE(wallet_address, network_id)
);

CREATE UNIQUE INDEX uniq_payment_addresses_address_network ON public.payment_addresses (wallet_address, network_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_payment_addresses_network_id ON public.payment_addresses (network_id);
CREATE INDEX idx_payment_addresses_active ON public.payment_addresses (id) WHERE status = 'active' AND deleted_at IS NULL;

COMMENT ON TABLE public.payment_addresses IS 'Platform-owned receiving wallet addresses. SA-managed. Soft-deletable.';
```

| Column         | Type                    | Nullable | Default             | Notes                              |
| -------------- | ----------------------- | -------- | ------------------- | ---------------------------------- |
| id             | UUID                    | NO       | `gen_random_uuid()` | PK                                 |
| network_id     | UUID                    | NO       | —                   | FK → supported_networks(id); RESTRICT |
| wallet_address | TEXT                    | NO       | —                   | Receiving address; UNIQUE per network |
| label          | TEXT                    | YES      | —                   | Internal label (e.g., 'Main ETH')  |
| status         | payment_address_status  | NO       | `'active'`          | active/inactive/rotated            |
| created_at     | TIMESTAMPTZ             | NO       | `now()`             | —                                  |
| updated_at     | TIMESTAMPTZ             | NO       | `now()`             | Auto-updated via trigger           |
| created_by     | UUID                    | YES      | —                   | FK → profiles(id)                  |
| deleted_at     | TIMESTAMPTZ             | YES      | —                   | Soft delete                        |

### 7.3 `payment_transactions`

**Purpose:** Verified crypto payment records. Immutable after `status = 'confirmed'`.

```sql
CREATE TABLE public.payment_transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  wallet_id       UUID REFERENCES public.wallets(id) ON DELETE SET NULL,
  network_id      UUID NOT NULL REFERENCES public.supported_networks(id) ON DELETE RESTRICT,
  payment_address_id UUID NOT NULL REFERENCES public.payment_addresses(id) ON DELETE RESTRICT,
  amount          NUMERIC(20,8) NOT NULL CHECK (amount > 0),
  currency        TEXT NOT NULL,
  tx_hash         TEXT NOT NULL,
  receiver_wallet TEXT NOT NULL,
  block_number    BIGINT,
  gas_fee         NUMERIC(20,8),
  status          public.payment_status NOT NULL DEFAULT 'pending',
  confirmed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID REFERENCES public.profiles(id),
  UNIQUE(tx_hash)
);

CREATE UNIQUE INDEX uniq_payment_transactions_tx_hash ON public.payment_transactions (tx_hash);
CREATE INDEX idx_payment_transactions_profile_id ON public.payment_transactions (profile_id);
CREATE INDEX idx_payment_transactions_network_id ON public.payment_transactions (network_id);
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions (status);
CREATE INDEX idx_payment_transactions_payment_address_id ON public.payment_transactions (payment_address_id);

COMMENT ON TABLE public.payment_transactions IS 'Crypto payment records. tx_hash is UNIQUE (replay protection). Immutable after status=confirmed.';
COMMENT ON COLUMN public.payment_transactions.tx_hash IS 'On-chain transaction hash. UNIQUE — one tx per order (replay protection).';
COMMENT ON COLUMN public.payment_transactions.amount IS 'Payment amount in crypto. CHECK > 0.';
```

| Column              | Type            | Nullable | Default             | Notes                              |
| ------------------- | --------------- | -------- | ------------------- | ---------------------------------- |
| id                  | UUID            | NO       | `gen_random_uuid()` | PK                                 |
| profile_id          | UUID            | NO       | —                   | FK → profiles(id); RESTRICT        |
| wallet_id           | UUID            | YES      | —                   | FK → wallets(id); SET NULL         |
| network_id          | UUID            | NO       | —                   | FK → supported_networks(id); RESTRICT |
| payment_address_id  | UUID            | NO       | —                   | FK → payment_addresses(id); RESTRICT |
| amount              | NUMERIC(20,8)   | NO       | —                   | CHECK > 0                          |
| currency            | TEXT            | NO       | —                   | Crypto currency code               |
| tx_hash             | TEXT            | NO       | —                   | UNIQUE; replay protection          |
| receiver_wallet     | TEXT            | NO       | —                   | The receiving address used         |
| block_number        | BIGINT          | YES      | —                   | Block number of confirmation       |
| gas_fee             | NUMERIC(20,8)   | YES      | —                   | Gas fee paid                       |
| status              | payment_status  | NO       | `'pending'`         | pending/broadcasted/confirming/confirmed/failed/expired |
| confirmed_at        | TIMESTAMPTZ     | YES      | —                   | When verification completed        |
| created_at          | TIMESTAMPTZ     | NO       | `now()`             | —                                  |
| updated_at          | TIMESTAMPTZ     | NO       | `now()`             | Auto-updated via trigger           |
| created_by          | UUID            | YES      | —                   | FK → profiles(id)                  |

---

## 8. Table DDL — Customer

### 8.1 `shipping_addresses`

**Purpose:** Delivery addresses for physical card orders.

```sql
CREATE TABLE public.shipping_addresses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_name  TEXT NOT NULL,
  phone           TEXT,
  country         TEXT NOT NULL,
  state           TEXT NOT NULL,
  city            TEXT NOT NULL,
  address_line_1  TEXT NOT NULL,
  address_line_2  TEXT,
  postal_code     TEXT NOT NULL,
  landmark        TEXT,
  is_default      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      UUID REFERENCES public.profiles(id),
  updated_by      UUID REFERENCES public.profiles(id),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_shipping_addresses_profile_id ON public.shipping_addresses (profile_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_shipping_addresses_active ON public.shipping_addresses (profile_id) WHERE deleted_at IS NULL AND is_default = true;

COMMENT ON TABLE public.shipping_addresses IS 'Customer shipping addresses for physical cards. Soft-deletable.';
```

| Column          | Type        | Nullable | Default             | Notes                              |
| --------------- | ----------- | -------- | ------------------- | ---------------------------------- |
| id              | UUID        | NO       | `gen_random_uuid()` | PK                                 |
| profile_id      | UUID        | NO       | —                   | FK → profiles(id); CASCADE         |
| recipient_name  | TEXT        | NO       | —                   | Name on the package                |
| phone           | TEXT        | YES      | —                   | Contact phone for delivery         |
| country         | TEXT        | NO       | —                   | Country                            |
| state           | TEXT        | NO       | —                   | State/region                       |
| city            | TEXT        | NO       | —                   | City                               |
| address_line_1  | TEXT        | NO       | —                   | Street address                     |
| address_line_2  | TEXT        | YES      | —                   | Apartment, suite, etc.             |
| postal_code     | TEXT        | NO       | —                   | ZIP / postal code                  |
| landmark        | TEXT        | YES      | —                   | Optional landmark                  |
| is_default      | BOOLEAN     | NO       | `false`             | Default address flag               |
| created_at      | TIMESTAMPTZ | NO       | `now()`             | —                                  |
| updated_at      | TIMESTAMPTZ | NO       | `now()`             | Auto-updated via trigger           |
| created_by      | UUID        | YES      | —                   | FK → profiles(id)                  |
| updated_by      | UUID        | YES      | —                   | FK → profiles(id)                  |
| deleted_at      | TIMESTAMPTZ | YES      | —                   | Soft delete                        |

### 8.2 `notifications`

**Purpose:** In-app notifications per user.

```sql
CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  type        public.notification_type NOT NULL DEFAULT 'info',
  read        BOOLEAN NOT NULL DEFAULT false,
  action_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ
);

CREATE INDEX idx_notifications_profile_id_read ON public.notifications (profile_id, read) WHERE deleted_at IS NULL;
CREATE INDEX idx_notifications_created_at ON public.notifications (created_at);

COMMENT ON TABLE public.notifications IS 'In-app notifications. Soft-deletable (dismiss). Auto-clean after 30 days.';
```

| Column       | Type               | Nullable | Default             | Notes                              |
| ------------ | ------------------ | -------- | ------------------- | ---------------------------------- |
| id           | UUID               | NO       | `gen_random_uuid()` | PK                                 |
| profile_id   | UUID               | NO       | —                   | FK → profiles(id); CASCADE         |
| title        | TEXT               | NO       | —                   | Notification title                 |
| message      | TEXT               | NO       | —                   | Notification body                  |
| type         | notification_type  | NO       | `'info'`            | info/success/warning/error/promotion/system |
| read         | BOOLEAN            | NO       | `false`             | Read status                        |
| action_url   | TEXT               | YES      | —                   | Optional URL for CTA               |
| created_at   | TIMESTAMPTZ        | NO       | `now()`             | —                                  |
| deleted_at   | TIMESTAMPTZ        | YES      | —                   | Soft delete (dismiss)              |

### 8.3 `support_tickets`

**Purpose:** Customer support tickets.

```sql
CREATE TABLE public.support_tickets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ticket_number TEXT NOT NULL UNIQUE,
  subject       TEXT NOT NULL,
  department    TEXT NOT NULL DEFAULT 'general',
  priority      public.ticket_priority NOT NULL DEFAULT 'medium',
  status        public.ticket_status NOT NULL DEFAULT 'open',
  related_order_id UUID REFERENCES public.card_orders(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by    UUID REFERENCES public.profiles(id),
  updated_by    UUID REFERENCES public.profiles(id),
  deleted_at    TIMESTAMPTZ
);

CREATE UNIQUE INDEX uniq_support_tickets_ticket_number ON public.support_tickets (ticket_number);
CREATE INDEX idx_support_tickets_profile_id_status ON public.support_tickets (profile_id, status);
CREATE INDEX idx_support_tickets_status_priority ON public.support_tickets (status, priority);
CREATE INDEX idx_support_tickets_active ON public.support_tickets (id) WHERE deleted_at IS NULL;

COMMENT ON TABLE public.support_tickets IS 'Customer support tickets. Soft-deletable after retention period.';
```

| Column             | Type             | Nullable | Default             | Notes                              |
| ------------------ | ---------------- | -------- | ------------------- | ---------------------------------- |
| id                 | UUID             | NO       | `gen_random_uuid()` | PK                                 |
| profile_id         | UUID             | NO       | —                   | FK → profiles(id); CASCADE         |
| ticket_number      | TEXT             | NO       | —                   | UNIQUE; human-readable (e.g., 'TKT-00001') |
| subject            | TEXT             | NO       | —                   | Ticket subject                     |
| department         | TEXT             | NO       | `'general'`         | Department/category                |
| priority           | ticket_priority  | NO       | `'medium'`          | low/medium/high/urgent             |
| status             | ticket_status    | NO       | `'open'`            | open/pending/resolved/closed       |
| related_order_id   | UUID             | YES      | —                   | FK → card_orders(id); SET NULL     |
| created_at         | TIMESTAMPTZ      | NO       | `now()`             | —                                  |
| updated_at         | TIMESTAMPTZ      | NO       | `now()`             | Auto-updated via trigger           |
| created_by         | UUID             | YES      | —                   | FK → profiles(id)                  |
| updated_by         | UUID             | YES      | —                   | FK → profiles(id)                  |
| deleted_at         | TIMESTAMPTZ      | YES      | —                   | Soft delete                        |

### 8.4 `ticket_messages`

**Purpose:** Messages within support tickets.

```sql
CREATE TABLE public.ticket_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id   UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender      public.ticket_sender NOT NULL,
  sender_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  message     TEXT NOT NULL,
  attachment  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ticket_messages_ticket_id ON public.ticket_messages (ticket_id);
CREATE INDEX idx_ticket_messages_created_at ON public.ticket_messages (created_at);

COMMENT ON TABLE public.ticket_messages IS 'Messages within support tickets. Append-only.';
```

| Column      | Type           | Nullable | Default             | Notes                              |
| ----------- | -------------- | -------- | ------------------- | ---------------------------------- |
| id          | UUID           | NO       | `gen_random_uuid()` | PK                                 |
| ticket_id   | UUID           | NO       | —                   | FK → support_tickets(id); CASCADE  |
| sender      | ticket_sender  | NO       | —                   | customer/admin/system              |
| sender_id   | UUID           | YES      | —                   | FK → profiles(id); SET NULL        |
| message     | TEXT           | NO       | —                   | Message content                    |
| attachment  | TEXT           | YES      | —                   | Attachment URL (Storage)           |
| created_at  | TIMESTAMPTZ    | NO       | `now()`             | —                                  |

---

## 9. Table DDL — Administration

### 9.1 `admins`

**Purpose:** Admin profiles (linked to profiles via 1:1). Role and permissions.

```sql
CREATE TABLE public.admins (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  role        public.admin_role NOT NULL,
  permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by  UUID REFERENCES public.profiles(id),
  updated_by  UUID REFERENCES public.profiles(id),
  deleted_at  TIMESTAMPTZ
);

CREATE UNIQUE INDEX uniq_admins_profile_id ON public.admins (profile_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_admins_role ON public.admins (role);
CREATE INDEX idx_admins_active ON public.admins (id) WHERE deleted_at IS NULL;

COMMENT ON TABLE public.admins IS 'Admin profiles. 1:1 with profiles. Soft-deletable (deactivate, not delete).';
COMMENT ON COLUMN public.admins.role IS 'support/manager/finance/operations/super_admin';
COMMENT ON COLUMN public.admins.permissions IS 'JSONB of granular permissions for custom RBAC.';
```

| Column       | Type        | Nullable | Default             | Notes                              |
| ------------ | ----------- | -------- | ------------------- | ---------------------------------- |
| id           | UUID        | NO       | `gen_random_uuid()` | PK                                 |
| profile_id   | UUID        | NO       | —                   | FK → profiles(id); CASCADE; UNIQUE |
| role         | admin_role  | NO       | —                   | support/manager/finance/operations/super_admin |
| permissions  | JSONB       | NO       | `'{}'::jsonb`       | Granular permissions for custom RBAC |
| created_at   | TIMESTAMPTZ | NO       | `now()`             | —                                  |
| updated_at   | TIMESTAMPTZ | NO       | `now()`             | Auto-updated via trigger           |
| created_by   | UUID        | YES      | —                   | FK → profiles(id)                  |
| updated_by   | UUID        | YES      | —                   | FK → profiles(id)                  |
| deleted_at   | TIMESTAMPTZ | YES      | —                   | Soft delete (deactivate)           |

### 9.2 `activity_logs`

**Purpose:** User activity tracking (login, wallet, order events).

```sql
CREATE TABLE public.activity_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action      public.activity_action NOT NULL,
  ip_address  INET,
  device      TEXT,
  browser     TEXT,
  location    TEXT,
  metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_logs_profile_id ON public.activity_logs (profile_id);
CREATE INDEX idx_activity_logs_action ON public.activity_logs (action);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs (created_at);

COMMENT ON TABLE public.activity_logs IS 'User activity log. Append-only. Used for user-facing activity history.';
```

| Column       | Type             | Nullable | Default             | Notes                              |
| ------------ | ---------------- | -------- | ------------------- | ---------------------------------- |
| id           | UUID             | NO       | `gen_random_uuid()` | PK                                 |
| profile_id   | UUID             | YES      | —                   | FK → profiles(id); SET NULL        |
| action       | activity_action  | NO       | —                   | login/logout/register/etc.         |
| ip_address   | INET             | YES      | —                   | Request IP                         |
| device       | TEXT             | YES      | —                   | Device type                        |
| browser      | TEXT             | YES      | —                   | Browser                            |
| location     | TEXT             | YES      | —                   | Geolocation (city/country)         |
| metadata     | JSONB            | NO       | `'{}'::jsonb`       | Additional context                 |
| created_at   | TIMESTAMPTZ      | NO       | `now()`             | —                                  |

### 9.3 `audit_logs`

**Purpose:** Admin action audit trail. Append-only — no UPDATE or DELETE.

```sql
CREATE TABLE public.audit_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id     UUID NOT NULL REFERENCES public.admins(id) ON DELETE RESTRICT,
  action       public.audit_action NOT NULL,
  entity_type  TEXT NOT NULL,
  entity_id    UUID,
  metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address   INET,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_admin_id_created_at ON public.audit_logs (admin_id, created_at);
CREATE INDEX idx_audit_logs_entity_type_entity_id ON public.audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs (action);

COMMENT ON TABLE public.audit_logs IS 'Admin action audit trail. APPEND-ONLY. No UPDATE or DELETE policies. Retained 2 years.';
COMMENT ON COLUMN public.audit_logs.entity_type IS 'e.g., order, user, payment, settings';
COMMENT ON COLUMN public.audit_logs.metadata IS 'JSONB with before/after states, reason, etc.';
```

| Column       | Type          | Nullable | Default             | Notes                              |
| ------------ | ------------- | -------- | ------------------- | ---------------------------------- |
| id           | UUID          | NO       | `gen_random_uuid()` | PK                                 |
| admin_id     | UUID          | NO       | —                   | FK → admins(id); RESTRICT          |
| action       | audit_action  | NO       | —                   | admin_login/user_suspend/etc.      |
| entity_type  | TEXT          | NO       | —                   | What was acted on (order/user/...) |
| entity_id    | UUID          | YES      | —                   | ID of the affected entity          |
| metadata     | JSONB         | NO       | `'{}'::jsonb`       | Before/after states, reason        |
| ip_address   | INET          | YES      | —                   | Admin IP                           |
| created_at   | TIMESTAMPTZ   | NO       | `now()`             | —                                  |

### 9.4 `system_settings`

**Purpose:** Platform configuration. Single-row table (enforced by constraint) for MVP simplicity.

```sql
CREATE TABLE public.system_settings (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name                   TEXT NOT NULL DEFAULT 'TWallet Services',
  support_email               TEXT NOT NULL DEFAULT 'support@twalletservices.com',
  maintenance_mode            BOOLEAN NOT NULL DEFAULT false,
  default_language            TEXT NOT NULL DEFAULT 'en',
  theme                       TEXT NOT NULL DEFAULT 'light',
  crypto_confirmation_blocks  JSONB NOT NULL DEFAULT '{"ethereum": 12, "polygon": 128, "arbitrum": 64, "optimism": 64, "base": 64, "bnb": 20, "avalanche": 12}'::jsonb,
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by                  UUID REFERENCES public.profiles(id),
  CONSTRAINT single_row_only CHECK (id = (SELECT id FROM public.system_settings LIMIT 1))
);

-- Alternative: use a key-value structure for extensibility (post-MVP)
-- For MVP, single-row is simpler and type-safe.

COMMENT ON TABLE public.system_settings IS 'Platform configuration. Single-row (enforced). SA-managed. crypto_confirmation_blocks is JSONB per-chain.';
```

| Column                    | Type        | Nullable | Default             | Notes                              |
| ------------------------- | ----------- | -------- | ------------------- | ---------------------------------- |
| id                        | UUID        | NO       | `gen_random_uuid()` | PK                                 |
| site_name                 | TEXT        | NO       | `'TWallet Services'`| Site display name                  |
| support_email             | TEXT        | NO       | `'support@...'`     | Support email                      |
| maintenance_mode          | BOOLEAN     | NO       | `false`             | Maintenance mode flag              |
| default_language          | TEXT        | NO       | `'en'`              | Default language                   |
| theme                     | TEXT        | NO       | `'light'`           | Default theme                      |
| crypto_confirmation_blocks| JSONB       | NO       | per-chain defaults  | Confirmation blocks per chain ID   |
| updated_at                | TIMESTAMPTZ | NO       | `now()`             | Auto-updated via trigger           |
| updated_by                | UUID        | YES      | —                   | FK → profiles(id)                  |

---

## 10. Indexes (All Tables)

Summary of all indexes defined across the schema (created within each table's DDL above):

| Table                   | Index Name                              | Columns                    | Type     |
| ----------------------- | --------------------------------------- | -------------------------- | -------- |
| `profiles`              | `idx_profiles_email`                    | email                      | BTREE (partial) |
| `profiles`              | `idx_profiles_username`                 | username                   | BTREE (partial) |
| `profiles`              | `idx_profiles_auth_user_id`             | auth_user_id               | BTREE    |
| `profiles`              | `idx_profiles_active`                   | id                         | BTREE (partial) |
| `roles`                 | `idx_roles_name`                        | name                       | BTREE    |
| `user_roles`            | `idx_user_roles_profile_id`             | profile_id                 | BTREE    |
| `user_roles`            | `idx_user_roles_role_id`                | role_id                    | BTREE    |
| `wallets`               | `uniq_wallets_address_chain`            | wallet_address, chain_id   | UNIQUE (partial) |
| `wallets`               | `idx_wallets_profile_id`                | profile_id                 | BTREE (partial) |
| `wallets`               | `idx_wallets_network`                   | network                    | BTREE    |
| `wallets`               | `idx_wallets_active`                    | profile_id                 | BTREE (partial) |
| `wallet_connections`    | `idx_wallet_connections_profile_id`     | profile_id                 | BTREE    |
| `wallet_connections`    | `idx_wallet_connections_wallet_id`      | wallet_id                  | BTREE    |
| `wallet_connections`    | `idx_wallet_connections_created_at`     | created_at                 | BTREE    |
| `card_products`         | `uniq_card_products_slug`               | slug                       | UNIQUE   |
| `card_products`         | `idx_card_products_type`                | type                       | BTREE    |
| `card_products`         | `idx_card_products_active`              | id                         | BTREE (partial) |
| `card_orders`           | `idx_card_orders_profile_id_status`     | profile_id, status         | BTREE    |
| `card_orders`           | `idx_card_orders_status_created_at`     | status, created_at         | BTREE    |
| `card_orders`           | `idx_card_orders_payment_transaction_id`| payment_transaction_id     | BTREE    |
| `card_orders`           | `idx_card_orders_shipping_address_id`   | shipping_address_id        | BTREE    |
| `card_status_history`   | `idx_card_status_history_order_id`      | card_order_id              | BTREE    |
| `card_status_history`   | `idx_card_status_history_created_at`    | created_at                 | BTREE    |
| `supported_networks`    | `uniq_supported_networks_chain_id`      | chain_id                   | UNIQUE   |
| `supported_networks`    | `idx_supported_networks_active`         | id                         | BTREE (partial) |
| `payment_addresses`     | `uniq_payment_addresses_address_network`| wallet_address, network_id | UNIQUE (partial) |
| `payment_addresses`     | `idx_payment_addresses_network_id`      | network_id                 | BTREE    |
| `payment_addresses`     | `idx_payment_addresses_active`          | id                         | BTREE (partial) |
| `payment_transactions`  | `uniq_payment_transactions_tx_hash`     | tx_hash                    | UNIQUE   |
| `payment_transactions`  | `idx_payment_transactions_profile_id`   | profile_id                 | BTREE    |
| `payment_transactions`  | `idx_payment_transactions_network_id`   | network_id                 | BTREE    |
| `payment_transactions`  | `idx_payment_transactions_status`       | status                     | BTREE    |
| `payment_transactions`  | `idx_payment_transactions_payment_address_id` | payment_address_id    | BTREE    |
| `shipping_addresses`    | `idx_shipping_addresses_profile_id`     | profile_id                 | BTREE (partial) |
| `shipping_addresses`    | `idx_shipping_addresses_active`         | profile_id                 | BTREE (partial) |
| `notifications`         | `idx_notifications_profile_id_read`     | profile_id, read           | BTREE (partial) |
| `notifications`         | `idx_notifications_created_at`          | created_at                 | BTREE    |
| `support_tickets`       | `uniq_support_tickets_ticket_number`    | ticket_number              | UNIQUE   |
| `support_tickets`       | `idx_support_tickets_profile_id_status` | profile_id, status         | BTREE    |
| `support_tickets`       | `idx_support_tickets_status_priority`   | status, priority           | BTREE    |
| `support_tickets`       | `idx_support_tickets_active`            | id                         | BTREE (partial) |
| `ticket_messages`       | `idx_ticket_messages_ticket_id`         | ticket_id                  | BTREE    |
| `ticket_messages`       | `idx_ticket_messages_created_at`        | created_at                 | BTREE    |
| `admins`                | `uniq_admins_profile_id`                | profile_id                 | UNIQUE (partial) |
| `admins`                | `idx_admins_role`                       | role                       | BTREE    |
| `admins`                | `idx_admins_active`                     | id                         | BTREE (partial) |
| `activity_logs`         | `idx_activity_logs_profile_id`          | profile_id                 | BTREE    |
| `activity_logs`         | `idx_activity_logs_action`              | action                     | BTREE    |
| `activity_logs`         | `idx_activity_logs_created_at`          | created_at                 | BTREE    |
| `audit_logs`            | `idx_audit_logs_admin_id_created_at`    | admin_id, created_at       | BTREE    |
| `audit_logs`            | `idx_audit_logs_entity_type_entity_id`  | entity_type, entity_id     | BTREE    |
| `audit_logs`            | `idx_audit_logs_action`                 | action                     | BTREE    |

**Total: 51 indexes across 19 tables.**

---

## 11. Foreign Key Summary

| From Table              | Column                    | To Table                | On Delete  |
| ----------------------- | ------------------------- | ----------------------- | ---------- |
| `profiles`              | auth_user_id              | `auth.users(id)`        | CASCADE    |
| `profiles`              | created_by                | `profiles(id)`          | (self)     |
| `profiles`              | updated_by                | `profiles(id)`          | (self)     |
| `user_roles`            | profile_id                | `profiles(id)`          | CASCADE    |
| `user_roles`            | role_id                   | `roles(id)`             | RESTRICT   |
| `wallets`               | profile_id                | `profiles(id)`          | CASCADE    |
| `wallets`               | created_by                | `profiles(id)`          | (self-ref) |
| `wallet_connections`    | profile_id                | `profiles(id)`          | CASCADE    |
| `wallet_connections`    | wallet_id                 | `wallets(id)`           | SET NULL   |
| `card_products`         | created_by                | `profiles(id)`          | (self-ref) |
| `card_orders`           | profile_id                | `profiles(id)`          | RESTRICT   |
| `card_orders`           | card_product_id           | `card_products(id)`     | RESTRICT   |
| `card_orders`           | shipping_address_id       | `shipping_addresses(id)`| SET NULL   |
| `card_orders`           | payment_transaction_id    | `payment_transactions(id)` | RESTRICT |
| `card_orders`           | created_by                | `profiles(id)`          | (self-ref) |
| `card_orders`           | updated_by                | `profiles(id)`          | (self-ref) |
| `card_status_history`   | card_order_id             | `card_orders(id)`       | CASCADE    |
| `card_status_history`   | changed_by                | `profiles(id)`          | SET NULL   |
| `payment_addresses`     | network_id                | `supported_networks(id)`| RESTRICT   |
| `payment_addresses`     | created_by                | `profiles(id)`          | (self-ref) |
| `payment_transactions`  | profile_id                | `profiles(id)`          | RESTRICT   |
| `payment_transactions`  | wallet_id                 | `wallets(id)`           | SET NULL   |
| `payment_transactions`  | network_id                | `supported_networks(id)`| RESTRICT   |
| `payment_transactions`  | payment_address_id        | `payment_addresses(id)` | RESTRICT   |
| `payment_transactions`  | created_by                | `profiles(id)`          | (self-ref) |
| `shipping_addresses`    | profile_id                | `profiles(id)`          | CASCADE    |
| `shipping_addresses`    | created_by                | `profiles(id)`          | (self-ref) |
| `shipping_addresses`    | updated_by                | `profiles(id)`          | (self-ref) |
| `notifications`         | profile_id                | `profiles(id)`          | CASCADE    |
| `support_tickets`       | profile_id                | `profiles(id)`          | CASCADE    |
| `support_tickets`       | related_order_id          | `card_orders(id)`       | SET NULL   |
| `support_tickets`       | created_by                | `profiles(id)`          | (self-ref) |
| `support_tickets`       | updated_by                | `profiles(id)`          | (self-ref) |
| `ticket_messages`       | ticket_id                 | `support_tickets(id)`   | CASCADE    |
| `ticket_messages`       | sender_id                 | `profiles(id)`          | SET NULL   |
| `admins`                | profile_id                | `profiles(id)`          | CASCADE    |
| `admins`                | created_by                | `profiles(id)`          | (self-ref) |
| `admins`                | updated_by                | `profiles(id)`          | (self-ref) |
| `activity_logs`         | profile_id                | `profiles(id)`          | SET NULL   |
| `audit_logs`            | admin_id                  | `admins(id)`            | RESTRICT   |
| `system_settings`       | updated_by                | `profiles(id)`          | SET NULL   |

**Total: 41 foreign keys.**

### 11.1 ON DELETE Policy Rationale

| Policy      | When to Use                                              |
| ----------- | -------------------------------------------------------- |
| `CASCADE`   | Child has no meaning without parent (e.g., user_roles without profile). |
| `RESTRICT`  | Child must not be orphaned (e.g., card_orders without profiles — retain order history). |
| `SET NULL`  | Relationship is optional; child can exist without parent (e.g., wallet_connections.wallet_id). |

---

## 12. Constraint Summary

| Table                   | Constraint                              | Type     | Rule                                    |
| ----------------------- | --------------------------------------- | -------- | --------------------------------------- |
| `profiles`              | `auth_user_id`                          | UNIQUE   | One profile per auth user.              |
| `profiles`              | `email`                                 | UNIQUE   | No duplicate emails.                    |
| `profiles`              | `username`                              | UNIQUE   | No duplicate usernames.                 |
| `roles`                 | `name`                                  | UNIQUE   | No duplicate role names.                |
| `user_roles`            | `(profile_id, role_id)`                 | UNIQUE   | No duplicate role assignments.          |
| `wallets`               | `(wallet_address, chain_id)`            | UNIQUE   | One connection per address per chain.   |
| `wallet_connections`    | `action`                                | CHECK    | IN ('connect', 'disconnect', 'failed'). |
| `card_products`         | `slug`                                  | UNIQUE   | URL-safe slug uniqueness.               |
| `card_products`         | `price`                                 | CHECK    | `price >= 0`.                           |
| `card_status_history`   | `changed_by_type`                       | CHECK    | IN ('customer', 'admin', 'system').     |
| `supported_networks`    | `chain_id`                              | UNIQUE   | One entry per chain ID.                 |
| `payment_addresses`     | `(wallet_address, network_id)`          | UNIQUE   | One address per network.                |
| `payment_transactions`  | `tx_hash`                               | UNIQUE   | **Replay protection — one tx per order.** |
| `payment_transactions`  | `amount`                                | CHECK    | `amount > 0`.                           |
| `support_tickets`       | `ticket_number`                         | UNIQUE   | Human-readable ticket number.           |
| `admins`                | `profile_id`                            | UNIQUE   | One admin record per profile.           |
| `system_settings`       | `single_row_only`                       | CHECK    | Enforces single-row configuration.      |

---

## 13. Supabase Auth Integration

### 13.1 Profile Creation Trigger

When a new user registers via Supabase Auth, a corresponding `profiles` row is created automatically:

```sql
-- Trigger function: create profile on auth user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, auth_user_id, full_name, email)
  VALUES (
    NEW.id,
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

> This trigger is defined in Book 11 (Functions, Triggers & Views) and included here for context.

### 13.2 Auth Fields Mapping

| `auth.users` field        | `profiles` field    | Notes                              |
| ------------------------- | ------------------- | ---------------------------------- |
| `id`                      | `auth_user_id`      | UUID; 1:1 relationship.            |
| `email`                   | `email`             | Synced from auth.                  |
| `raw_user_meta_data`      | `full_name`         | Set during registration.           |
| `created_at`              | (not stored)        | Use `profiles.created_at` instead. |

### 13.3 Session Management

- Sessions are managed by Supabase Auth (JWT in HTTP-only cookies).
- No custom session table in MVP (Supabase Auth handles this).
- `activity_logs` records login/logout events for audit.

---

## 14. Extensions Required

```sql
-- Required extensions for the schema
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- Alternative UUID generation (if needed)
CREATE EXTENSION IF NOT EXISTS "pgjwt";      -- JWT handling (used by Supabase Auth)
```

---

## 15. TypeScript Types (Preview)

After running `supabase gen:types`, the generated types will include all tables defined here. Preview of key types:

```ts
// Generated by supabase gen:types --lang typescript

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          auth_user_id: string;
          full_name: string;
          username: string | null;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          country: string | null;
          state: string | null;
          city: string | null;
          timezone: string;
          language: string;
          status: 'active' | 'suspended' | 'deleted';
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          auth_user_id: string;
          full_name: string;
          username?: string | null;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          country?: string | null;
          state?: string | null;
          city?: string | null;
          timezone?: string;
          language?: string;
          status?: 'active' | 'suspended' | 'deleted';
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
          deleted_at?: string | null;
        };
        Update: Partial<profiles['Insert']>;
      };
      // ... (all 19 tables typed similarly)
    };
  };
}
```

> Full generated types are produced by running `npm run gen:types` after migrations are applied.

---

## 16. Schema Validation Checklist

Before applying migrations to production, verify:

- [ ] All 19 tables created with correct columns and types.
- [ ] All 11 custom enums created.
- [ ] All 41 foreign keys created with correct ON DELETE policies.
- [ ] All 51 indexes created (including partial indexes for soft deletes).
- [ ] All 17 constraints (UNIQUE, CHECK) in place.
- [ ] `pgcrypto` extension enabled.
- [ ] `handle_new_user()` trigger created on `auth.users`.
- [ ] `set_updated_at()` trigger created on all tables with `updated_at`.
- [ ] RLS enabled on all 19 tables (Book 10).
- [ ] RLS policies created per table (Book 10).
- [ ] Seed data inserted (Book 12).
- [ ] `supabase_get_advisors` (security) run with no findings.
- [ ] TypeScript types generated via `supabase gen:types`.

---

## 17. Glossary

| Term                | Definition                                                        |
| ------------------- | ----------------------------------------------------------------- |
| DDL                 | Data Definition Language (SQL for creating tables, indexes, etc.).|
| ENUM                | A Postgres type with a fixed set of values.                       |
| FK                  | Foreign Key — references another table's PK.                      |
| PK                  | Primary Key — unique row identifier.                              |
| UNIQUE              | Constraint ensuring no duplicate values in a column.              |
| CHECK               | Constraint enforcing a boolean condition.                         |
| ON DELETE CASCADE   | Delete child rows when parent is deleted.                         |
| ON DELETE RESTRICT  | Prevent parent deletion if children exist.                        |
| ON DELETE SET NULL  | Set child FK to NULL when parent is deleted.                      |
| Partial index       | An index on a subset of rows (e.g., `WHERE deleted_at IS NULL`).  |
| TIMESTAMPTZ         | Timestamp with timezone (UTC).                                    |
| JSONB               | Binary JSON type for flexible structured data.                    |
| `gen_random_uuid()` | Postgres function generating a UUID v4.                           |

---

## 18. References

- Book 07 — Database Architecture (strategies, inventory, naming conventions)
- Book 05 — Software Requirements Specification (data requirements, §7; data integrity, §7.2)
- Book 02 — Business Requirements (user roles, §7; business rules, §13)
- `00-Project/TECH_STACK.md`
- `00-Project/CHANGELOG.md`

### Downstream Books (Database Suite)

| Book | Title                                  | Consumes Book 08 as...                |
| ---- | -------------------------------------- | ------------------------------------- |
| 09   | Entity Relationship Diagram (ERD)       | Visualizes the tables and FKs defined here. |
| 10   | Supabase Row Level Security (RLS)      | Applies RLS policies to all 19 tables. |
| 11   | Database Functions, Triggers & Views    | Implements `handle_new_user()`, `set_updated_at()`, and other logic on these tables. |
| 12   | Seed Data & Migrations                  | Generates migration files from this DDL and seeds initial data. |

### Other Downstream Books

| Book | Title              | Consumes Book 08 as...                |
| ---- | ------------------ | ------------------------------------- |
| 13+  | Feature books      | Reference tables and columns for Supabase queries. |
| 22   | API Specifications | References tables for endpoint design. |
| 26   | Testing            | Tests schema constraints and FK integrity. |

---

## Next Book

**Book 09 — Authentication System** (`05-Authentication/BOOK_09_AUTHENTICATION_SYSTEM.md`): the complete, implementation-ready specification for the authentication module — registration, login, email verification, password reset, session management, route protection, and logout. Uses Supabase Auth with `@supabase/ssr`, Zod validation, react-hook-form, and the Book 04 design system. Includes Supabase queries, server actions, middleware, and a full OpenCode prompt.

---

> End of Book 08 — Database Schema. This document is the authoritative DDL reference. Any change to table structure, columns, constraints, FKs, or indexes requires a version bump in this book, a corresponding migration in Book 12, and a `00-Project/CHANGELOG.md` entry.
