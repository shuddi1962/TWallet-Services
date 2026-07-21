# Constraints — TWallet Services Database

> Including PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, NOT NULL constraints.

## Primary Keys

All tables use UUID v4 primary keys generated via `gen_random_uuid()` with these exceptions:

| Table | PK Strategy |
|-------|-------------|
| `profiles` | UUID (matches `auth.users.id`) |
| `supported_networks` | TEXT (mnemonic id) |
| `user_roles` | UUID (gen_random_uuid) |
| All others | UUID (gen_random_uuid) |

## Unique Constraints

| Table | Columns | Purpose |
|-------|---------|---------|
| `profiles` | `LOWER(email)` (unique index) | No duplicate emails |
| `user_roles` | `user_id` | One role per user |
| `admins` | `profile_id` | One admin record per user |
| `wallets` | `(address, network_id)` | One wallet per address per network |
| `supported_networks` | `chain_id` | No duplicate chain IDs |
| `supported_tokens` | `(symbol, network_id)` | No duplicate token symbols per network |
| `supported_wallet_addresses` | `address` | No duplicate receiving addresses |
| `card_products` | `slug` | Unique product slugs |
| `card_orders` | `order_number` | Unique generated order numbers |
| `shipping_addresses` | `order_id` | One shipping address per order |
| `payment_transactions` | `tx_hash` | Replay protection |
| `support_tickets` | `ticket_number` | Unique generated ticket numbers |
| `system_settings` | `category` | One settings document per category |
| `user_preferences` | `user_id` | One preferences doc per user |

## Check Constraints

| Table | Column | Constraint |
|-------|--------|------------|
| `user_roles` | `role` | `IN ('user', 'admin')` |
| `admins` | `role` | Enum `admin_role` |
| `card_products` | `price_usdc` | `> 0` |
| `card_orders` | `status` | Enum `order_status` |
| `card_orders` | `shipping_status` | Enum `shipping_status` |
| `payment_transactions` | `status` | Enum `payment_status` |
| `support_tickets` | `status` | Enum `ticket_status` |
| `support_tickets` | `priority` | Enum `ticket_priority` |
| `support_tickets` | `category` | Enum `ticket_category` |
| `ticket_messages` | `author` | `IN ('customer', 'admin')` |
| `notifications` | `type` | Enum `notification_type` |
| `audit_logs` | `action` | Enum `audit_action` |

## NOT NULL Constraints

Every table has `created_at` and `updated_at` (where applicable) as NOT NULL with defaults. Key NOT NULL columns enforced at schema level:

| Table | NOT NULL Columns |
|-------|------------------|
| `profiles` | id, email, full_name, country, status, kyc_tier, created_at, updated_at |
| `wallets` | user_id, address, network, network_id, is_default, signature, message, connected_at |
| `card_orders` | order_number, user_id, product_id, status, amount_usdc, paid_usdc, balance_usdc, shipping_status, flagged |
| `payment_transactions` | order_id, user_id, amount, network_id, token_id, status, min_confirmations, expires_at |
| `support_tickets` | ticket_number, user_id, subject, category, priority, status |
| `ticket_messages` | ticket_id, author, message, internal |
