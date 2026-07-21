# Database

> The Supabase PostgreSQL schema for TWallet Services. Full DDL is in Book 08; this is the architectural reference.

---

## Schema

| Item | Value |
|------|-------|
| Schema | `public` |
| Extensions | `pgcrypto` (gen_random_uuid), `pg_graphql` (dev), `pg_cron` (future) |
| Naming | snake_case, singular nouns for tables, `idx_` for indexes, `fn_` for functions |

---

## Core Tables (19)

### Users & Auth
| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `profiles` | User profile data | id (FK auth.users), full_name, email, phone, country, avatar_url, status, kyc_tier |
| `user_roles` | Role assignments | user_id (FK profiles), role (enum: user, admin) |
| `admins` | Admin accounts | id, profile_id (FK profiles), role (admin_role enum) |

### Wallets
| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `wallets` | Connected user wallets | id, user_id, address, network_id, is_default, signature, connected_at |
| `supported_networks` | Available blockchains | id, name, chain_id, currency, rpc_url, explorer_url, active |
| `supported_tokens` | Accepted payment tokens | id, network_id, symbol, name, contract_address, decimals, active |
| `supported_wallet_addresses` | Platform receiving wallets | id, network_id, address, label, active, rotated_at |

### Cards & Orders
| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `card_products` | Card catalog | id, slug, name, type (physical/virtual), price_usdc, networks, tokens, active |
| `card_orders` | Customer orders | id, user_id, product_id, status (order_status enum), amount_usdc, paid_usdc, network, tx_hash |
| `shipping_addresses` | Delivery addresses | id, order_id, full_name, line1, city, postal_code, country |

### Payments
| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `payment_transactions` | On-chain payments | id, order_id, user_id, amount, network_id, token_id, tx_hash, status (payment_status enum), confirmations, from_address, to_address |

### Support
| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `support_tickets` | Support requests | id, user_id, subject, category, priority, status (ticket_status enum) |
| `ticket_messages` | Ticket replies | id, ticket_id, author (customer/admin), message, internal |
| `ticket_attachments` | File attachments | id, message_id, url, name, mime_type |

### Notifications & Audit
| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `notifications` | User notifications | id, user_id, type, title, message, read |
| `admin_notifications` | Admin alerts | id, admin_id, type, title, message, read |
| `audit_logs` | Admin action log (append-only) | id, admin_id, action, target_type, target_id, details (jsonb), ip_address |

### System
| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `system_settings` | Platform configuration | id, category, settings (jsonb), updated_by |
| `user_preferences` | User settings | id, user_id, preferences (jsonb) |

---

## Entity Relationships

```
auth.users (Supabase managed)
  └── profiles (1:1, FK on id)
       ├── user_roles (1:1)
       ├── admins (1:1, optional)
       ├── wallets (1:N)
       ├── card_orders (1:N)
       ├── payment_transactions (1:N)
       ├── notifications (1:N)
       └── support_tickets (1:N)

card_orders
  ├── card_products (N:1)
  ├── shipping_addresses (1:1)
  └── payment_transactions (1:N)

payment_transactions
  ├── supported_networks (N:1)
  ├── supported_tokens (N:1)
  └── supported_wallet_addresses (N:1)
```

---

## Foreign Key Policies

| FK | ON DELETE | Rationale |
|----|-----------|-----------|
| profiles.id → auth.users.id | CASCADE | Delete user → delete profile |
| wallets.user_id → profiles.id | CASCADE | Delete user → remove wallets |
| card_orders.user_id → profiles.id | CASCADE | Delete user → remove orders |
| payment_transactions.user_id → profiles.id | CASCADE | Delete user → remove payments |
| support_tickets.user_id → profiles.id | CASCADE | Delete user → remove tickets |
| notifications.user_id → profiles.id | CASCADE | Delete user → remove notifications |
| card_orders.product_id → card_products.id | RESTRICT | Prevent deleting card with orders |
| payment_transactions.order_id → card_orders.id | CASCADE | Delete order → remove payment records (except audit) |

---

## Audit Fields

Every table includes:

```sql
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
deleted_at TIMESTAMPTZ DEFAULT NULL  -- soft delete
```

The `updated_at` column is managed by a trigger:

```sql
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

Applied to every table via a migration helper.

---

## TypeScript Types

Generated via `supabase gen types typescript --local > src/types/supabase.ts`

```ts
export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: InsertProfile; Update: UpdateProfile };
      wallets: { Row: Wallet; Insert: InsertWallet; Update: UpdateWallet };
      // ... all 19 tables
    };
    Enums: {
      order_status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
      payment_status: 'pending' | 'confirmed' | 'failed' | 'flagged' | 'refunded';
      ticket_status: 'open' | 'pending' | 'resolved' | 'closed' | 'escalated';
      admin_role: 'super_admin' | 'operations' | 'finance' | 'support' | 'viewer';
      // ... all 11 enums
    };
  };
};
```
