# Tables — TWallet Services Database

## 1. `profiles`

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | UUID | — | PK → auth.users(id) ON DELETE CASCADE |
| email | TEXT | — | NOT NULL |
| full_name | TEXT | — | NOT NULL |
| avatar_url | TEXT | — | — |
| phone | TEXT | — | — |
| country | TEXT | 'US' | NOT NULL |
| status | user_status | 'active' | NOT NULL |
| kyc_tier | TEXT | 'none' | NOT NULL |
| last_login | TIMESTAMPTZ | — | — |
| created_at | TIMESTAMPTZ | now() | NOT NULL |
| updated_at | TIMESTAMPTZ | now() | NOT NULL |
| deleted_at | TIMESTAMPTZ | — | — |

**RLS:** Users view/update own; Admins CRUD all

## 2. `user_roles`

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | UUID | gen_random_uuid() | PK |
| user_id | UUID | — | NOT NULL, UNIQUE → profiles(id) ON DELETE CASCADE |
| role | TEXT | 'user' | NOT NULL, CHECK IN ('user', 'admin') |
| created_at | TIMESTAMPTZ | now() | NOT NULL |

## 3. `admins`

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | UUID | gen_random_uuid() | PK |
| profile_id | UUID | — | NOT NULL, UNIQUE → profiles(id) ON DELETE CASCADE |
| role | admin_role | 'viewer' | NOT NULL |
| created_at | TIMESTAMPTZ | now() | NOT NULL |
| updated_at | TIMESTAMPTZ | now() | NOT NULL |

## 4. `wallets`

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | UUID | gen_random_uuid() | PK |
| user_id | UUID | — | NOT NULL → profiles(id) ON DELETE CASCADE |
| address | TEXT | — | NOT NULL |
| network | TEXT | — | NOT NULL |
| network_id | INTEGER | — | NOT NULL |
| label | TEXT | — | — |
| is_default | BOOLEAN | false | NOT NULL |
| signature | TEXT | — | NOT NULL |
| message | TEXT | — | NOT NULL |
| connected_at | TIMESTAMPTZ | now() | NOT NULL |
| last_used_at | TIMESTAMPTZ | — | — |
| created_at | TIMESTAMPTZ | now() | NOT NULL |
| updated_at | TIMESTAMPTZ | now() | NOT NULL |
| deleted_at | TIMESTAMPTZ | — | — |

**UNIQUE:** (address, network_id)

## 5. `supported_networks`

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | TEXT | — | PK |
| name | TEXT | — | NOT NULL |
| chain_id | INTEGER | — | NOT NULL, UNIQUE |
| currency | TEXT | — | NOT NULL |
| explorer_url | TEXT | — | NOT NULL |
| rpc_url | TEXT | — | NOT NULL |
| icon_url | TEXT | — | — |
| active | BOOLEAN | true | NOT NULL |
| created_at | TIMESTAMPTZ | now() | NOT NULL |

## 6. `supported_tokens`

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | UUID | gen_random_uuid() | PK |
| network_id | TEXT | — | NOT NULL → supported_networks(id) ON DELETE CASCADE |
| symbol | TEXT | — | NOT NULL |
| name | TEXT | — | NOT NULL |
| contract_address | TEXT | — | NOT NULL |
| decimals | INTEGER | 6 | NOT NULL |
| icon_url | TEXT | — | — |
| active | BOOLEAN | true | NOT NULL |
| created_at | TIMESTAMPTZ | now() | NOT NULL |

**UNIQUE:** (symbol, network_id)

## 7. `supported_wallet_addresses`

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | UUID | gen_random_uuid() | PK |
| network_id | TEXT | — | NOT NULL → supported_networks(id) ON DELETE CASCADE |
| address | TEXT | — | NOT NULL |
| label | TEXT | — | — |
| active | BOOLEAN | true | NOT NULL |
| rotated_from | UUID | — | → supported_wallet_addresses(id) (self-ref) |
| total_received | NUMERIC(20,2) | 0 | NOT NULL |
| tx_count | INTEGER | 0 | NOT NULL |
| last_used_at | TIMESTAMPTZ | — | — |
| created_at | TIMESTAMPTZ | now() | NOT NULL |
| updated_at | TIMESTAMPTZ | now() | NOT NULL |

## 8. `card_products`

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | UUID | gen_random_uuid() | PK |
| slug | TEXT | — | NOT NULL, UNIQUE |
| name | TEXT | — | NOT NULL |
| type | card_type | — | NOT NULL |
| description | TEXT | — | NOT NULL |
| price_usdc | NUMERIC(20,2) | — | NOT NULL, CHECK > 0 |
| annual_fee_usdc | NUMERIC(20,2) | 0 | NOT NULL |
| networks | TEXT[] | '{}' | NOT NULL |
| tokens | TEXT[] | '{}' | NOT NULL |
| currency | TEXT | 'USD' | NOT NULL |
| card_art_url | TEXT | — | — |
| features | JSONB | '[]' | — |
| terms_url | TEXT | — | — |
| active | BOOLEAN | true | NOT NULL |
| created_at | TIMESTAMPTZ | now() | NOT NULL |
| updated_at | TIMESTAMPTZ | now() | NOT NULL |

## 9. `card_orders`

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | UUID | gen_random_uuid() | PK |
| order_number | TEXT | — | NOT NULL, UNIQUE |
| user_id | UUID | — | NOT NULL → profiles(id) ON DELETE CASCADE |
| product_id | UUID | — | NOT NULL → card_products(id) ON DELETE RESTRICT |
| status | order_status | 'pending' | NOT NULL |
| amount_usdc | NUMERIC(20,2) | — | NOT NULL |
| paid_usdc | NUMERIC(20,2) | 0 | NOT NULL |
| balance_usdc | NUMERIC(20,2) | 0 | NOT NULL |
| network | TEXT | — | — |
| token | TEXT | — | — |
| tx_hash | TEXT | — | — |
| shipping_status | shipping_status | 'not_shipped' | NOT NULL |
| tracking_number | TEXT | — | — |
| carrier | TEXT | — | — |
| flagged | BOOLEAN | false | NOT NULL |
| admin_note | TEXT | — | — |
| created_at | TIMESTAMPTZ | now() | NOT NULL |
| paid_at | TIMESTAMPTZ | — | — |
| updated_at | TIMESTAMPTZ | now() | NOT NULL |
| deleted_at | TIMESTAMPTZ | — | — |

## 10. `shipping_addresses`

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | UUID | gen_random_uuid() | PK |
| order_id | UUID | — | NOT NULL, UNIQUE → card_orders(id) ON DELETE CASCADE |
| full_name | TEXT | — | NOT NULL |
| line1 | TEXT | — | NOT NULL |
| line2 | TEXT | — | — |
| city | TEXT | — | NOT NULL |
| state | TEXT | — | — |
| postal_code | TEXT | '' | NOT NULL |
| country | TEXT | — | NOT NULL |
| created_at | TIMESTAMPTZ | now() | NOT NULL |

## 11. `payment_transactions`

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | UUID | gen_random_uuid() | PK |
| order_id | UUID | — | NOT NULL → card_orders(id) ON DELETE CASCADE |
| user_id | UUID | — | NOT NULL → profiles(id) ON DELETE CASCADE |
| amount | NUMERIC(20,2) | — | NOT NULL |
| network_id | TEXT | — | NOT NULL → supported_networks(id) ON DELETE RESTRICT |
| token_id | UUID | — | NOT NULL → supported_tokens(id) ON DELETE RESTRICT |
| receiving_wallet_id | UUID | — | → supported_wallet_addresses(id) ON DELETE RESTRICT |
| tx_hash | TEXT | — | UNIQUE |
| status | payment_status | 'pending' | NOT NULL |
| confirmations | INTEGER | 0 | — |
| min_confirmations | INTEGER | 12 | NOT NULL |
| block_number | INTEGER | — | — |
| from_address | TEXT | — | — |
| to_address | TEXT | — | — |
| network_fee | NUMERIC(20,8) | — | — |
| verified_at | TIMESTAMPTZ | — | — |
| expires_at | TIMESTAMPTZ | now()+48h | NOT NULL |
| created_at | TIMESTAMPTZ | now() | NOT NULL |
| updated_at | TIMESTAMPTZ | now() | NOT NULL |
| deleted_at | TIMESTAMPTZ | — | — |

## 12. `support_tickets`

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | UUID | gen_random_uuid() | PK |
| ticket_number | TEXT | — | NOT NULL, UNIQUE |
| user_id | UUID | — | NOT NULL → profiles(id) ON DELETE CASCADE |
| order_id | UUID | — | → card_orders(id) ON DELETE SET NULL |
| subject | TEXT | — | NOT NULL |
| category | ticket_category | — | NOT NULL |
| priority | ticket_priority | 'medium' | NOT NULL |
| status | ticket_status | 'open' | NOT NULL |
| assigned_to | UUID | — | → admins(id) ON DELETE SET NULL |
| created_at | TIMESTAMPTZ | now() | NOT NULL |
| updated_at | TIMESTAMPTZ | now() | NOT NULL |
| deleted_at | TIMESTAMPTZ | — | — |

## 13. `ticket_messages`

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | UUID | gen_random_uuid() | PK |
| ticket_id | UUID | — | NOT NULL → support_tickets(id) ON DELETE CASCADE |
| author | TEXT | — | NOT NULL, CHECK IN ('customer', 'admin') |
| admin_id | UUID | — | → admins(id) ON DELETE SET NULL |
| message | TEXT | — | NOT NULL |
| internal | BOOLEAN | false | NOT NULL |
| created_at | TIMESTAMPTZ | now() | NOT NULL |

## 14. `ticket_attachments`

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | UUID | gen_random_uuid() | PK |
| message_id | UUID | — | NOT NULL → ticket_messages(id) ON DELETE CASCADE |
| url | TEXT | — | NOT NULL |
| name | TEXT | — | NOT NULL |
| mime_type | TEXT | — | NOT NULL |
| size_bytes | INTEGER | — | — |
| created_at | TIMESTAMPTZ | now() | NOT NULL |

## 15. `notifications`

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | UUID | gen_random_uuid() | PK |
| user_id | UUID | — | NOT NULL → profiles(id) ON DELETE CASCADE |
| type | notification_type | — | NOT NULL |
| title | TEXT | — | NOT NULL |
| message | TEXT | — | — |
| related_type | TEXT | — | — |
| related_id | UUID | — | — |
| read | BOOLEAN | false | NOT NULL |
| created_at | TIMESTAMPTZ | now() | NOT NULL |
| updated_at | TIMESTAMPTZ | now() | NOT NULL |

## 16. `admin_notifications`

Identical structure to `notifications` but keyed to `admins(id)`.

## 17. `audit_logs`

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | UUID | gen_random_uuid() | PK |
| admin_id | UUID | — | → admins(id) ON DELETE SET NULL |
| action | audit_action | — | NOT NULL |
| target_type | TEXT | — | — |
| target_id | UUID | — | — |
| details | JSONB | '{}' | — |
| ip_address | TEXT | — | — |
| created_at | TIMESTAMPTZ | now() | NOT NULL |

**Append-only:** No UPDATE or DELETE allowed (enforced by trigger).

## 18. `system_settings`

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | UUID | gen_random_uuid() | PK |
| category | TEXT | — | NOT NULL, UNIQUE |
| settings | JSONB | '{}' | NOT NULL |
| updated_by | UUID | — | → admins(id) ON DELETE SET NULL |
| created_at | TIMESTAMPTZ | now() | NOT NULL |
| updated_at | TIMESTAMPTZ | now() | NOT NULL |

## 19. `user_preferences`

| Column | Type | Default | Constraints |
|--------|------|---------|-------------|
| id | UUID | gen_random_uuid() | PK |
| user_id | UUID | — | NOT NULL, UNIQUE → profiles(id) ON DELETE CASCADE |
| preferences | JSONB | — | NOT NULL |
| created_at | TIMESTAMPTZ | now() | NOT NULL |
| updated_at | TIMESTAMPTZ | now() | NOT NULL |
