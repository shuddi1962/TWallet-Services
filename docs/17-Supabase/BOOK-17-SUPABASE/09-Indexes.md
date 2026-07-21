# Indexes

> Performance indexes for the TWallet Services database. Every index is justified by the queries it serves.

---

## Index Strategy

| Type | Quantity | Purpose |
|------|----------|---------|
| Primary Key (auto) | 19 | All UUID PKs auto-indexed |
| Foreign Key | ~20 | Join performance |
| Unique | 5 | Data integrity constraints |
| Functional | 3 | Partial indexes for soft deletes, JSONB lookups |
| Composite | 8 | Multi-column query patterns |

---

## Index Inventory

### profiles

| Index | Columns | Unique | Type | Query Pattern |
|-------|---------|--------|------|---------------|
| `idx_profiles_email` | email | Yes | B-tree | Login, search by email |
| `idx_profiles_country` | country | No | B-tree | Admin user filtering |
| `idx_profiles_created_at` | created_at | No | B-tree | User growth analytics |
| `idx_profiles_status` | status | No | Partial (deleted_at IS NULL) | Active user queries |

### wallets

| Index | Columns | Unique | Type | Query Pattern |
|-------|---------|--------|------|---------------|
| `idx_wallets_user_id` | user_id | No | B-tree | User's wallets |
| `idx_wallets_address_network` | address, network_id | Yes | B-tree | Find wallet by address + prevent duplicates |
| `idx_wallets_default` | user_id, is_default | No | Partial (is_default = true) | Default wallet lookup |

### card_products

| Index | Columns | Unique | Type | Query Pattern |
|-------|---------|--------|------|---------------|
| `idx_card_products_slug` | slug | Yes | B-tree | Card lookup by slug |
| `idx_card_products_type` | type | No | B-tree | Filter by physical/virtual |
| `idx_card_products_active` | active | No | Partial (active = true) | Only active cards |

### card_orders

| Index | Columns | Unique | Type | Query Pattern |
|-------|---------|--------|------|---------------|
| `idx_card_orders_user_id` | user_id | No | B-tree | User's orders |
| `idx_card_orders_status` | status | No | B-tree | Filter by status |
| `idx_card_orders_created_at` | created_at | No | B-tree | Sort + pagination (cursor) |
| `idx_card_orders_user_status` | user_id, status | No | Composite | Filter user's orders by status |
| `idx_card_orders_tx_hash` | tx_hash | No | B-tree | Lookup by transaction |
| `idx_card_orders_tracking` | tracking_number | No | B-tree | Tracking lookup (public) |
| `idx_card_orders_flagged` | flagged | No | Partial (flagged = true) | Admin flagged orders |

### payment_transactions

| Index | Columns | Unique | Type | Query Pattern |
|-------|---------|--------|------|---------------|
| `idx_payments_user_id` | user_id | No | B-tree | User's payment history |
| `idx_payments_order_id` | order_id | No | B-tree | Payments for an order |
| `idx_payments_tx_hash` | tx_hash | Yes | B-tree | Replay protection + lookup |
| `idx_payments_status` | status | No | B-tree | Filter by status |
| `idx_payments_created_at` | created_at | No | B-tree | Sort + pagination |
| `idx_payments_network_token` | network_id, token_id | No | Composite | Analytics by network/token |
| `idx_payments_receiving_wallet` | receiving_wallet_id | No | B-tree | Wallet reconciliation |

### notifications

| Index | Columns | Unique | Type | Query Pattern |
|-------|---------|--------|------|---------------|
| `idx_notifications_user_id` | user_id | No | B-tree | User's notifications |
| `idx_notifications_user_read` | user_id, read | No | Composite | Unread notification count |
| `idx_notifications_created_at` | created_at | No | B-tree | Sort descending |

### support_tickets

| Index | Columns | Unique | Type | Query Pattern |
|-------|---------|--------|------|---------------|
| `idx_tickets_user_id` | user_id | No | B-tree | User's tickets |
| `idx_tickets_status` | status | No | B-tree | Admin queue by status |
| `idx_tickets_assigned_to` | assigned_to | No | B-tree | Admin's assigned tickets |
| `idx_tickets_priority` | priority | No | B-tree | Sort by urgency |
| `idx_tickets_created_at` | created_at | No | B-tree | Sort |

### audit_logs

| Index | Columns | Unique | Type | Query Pattern |
|-------|---------|--------|------|---------------|
| `idx_audit_admin_id` | admin_id | No | B-tree | Filter by admin |
| `idx_audit_action` | action | No | B-tree | Filter by action type |
| `idx_audit_target` | target_type, target_id | No | Composite | Find actions on an entity |
| `idx_audit_created_at` | created_at | No | B-tree | Sort + pagination |

### supported_networks

| Index | Columns | Unique | Type | Query Pattern |
|-------|---------|--------|------|---------------|
| `idx_networks_chain_id` | chain_id | Yes | B-tree | Lookup by chain ID |

### supported_tokens

| Index | Columns | Unique | Type | Query Pattern |
|-------|---------|--------|------|---------------|
| `idx_tokens_symbol_network` | symbol, network_id | Yes | Composite | Find token on network |

### supported_wallet_addresses

| Index | Columns | Unique | Type | Query Pattern |
|-------|---------|--------|------|---------------|
| `idx_wallet_addresses_network` | network_id | No | B-tree | Addresses for a network |
| `idx_wallet_addresses_address` | address | Yes | B-tree | Verify receiving address |

---

## Partial Index for Soft Deletes

```sql
-- Most queries filter: deleted_at IS NULL
-- Partial index excludes soft-deleted rows
CREATE INDEX idx_profiles_active ON profiles (id)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_card_orders_active ON card_orders (id, user_id, status)
  WHERE deleted_at IS NULL;
```

---

## Migration SQL

All indexes are defined in the Book 08 schema. Migration file:

```bash
supabase migration new add_indexes
```

```sql
-- Add all indexes from this document
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles (email);
CREATE INDEX IF NOT EXISTS idx_wallets_address_network ON wallets (address, network_id);
-- ... repeat for all indexes listed above
```
