# Indexes — TWallet Services Database

> 65 indexes across 19 tables. See `supabase/migrations/202607200003_indexes.sql`.

## Index Catalog

| # | Table | Index Name | Columns | Type |
|---|-------|------------|---------|------|
| 1 | profiles | idx_profiles_email | LOWER(email) | UNIQUE |
| 2 | profiles | idx_profiles_status | status | |
| 3 | profiles | idx_profiles_country | country | |
| 4 | profiles | idx_profiles_created_at | created_at | |
| 5 | profiles | idx_profiles_deleted_at | deleted_at | |
| 6 | profiles | idx_profiles_kyc_tier | kyc_tier | |
| 7 | user_roles | idx_user_roles_role | role | |
| 8 | admins | idx_admins_role | role | |
| 9 | admins | idx_admins_profile_id | profile_id | |
| 10 | wallets | idx_wallets_user_id | user_id | |
| 11 | wallets | idx_wallets_address | address | |
| 12 | wallets | idx_wallets_network | network | |
| 13 | wallets | idx_wallets_is_default | is_default | |
| 14 | wallets | idx_wallets_deleted_at | deleted_at | |
| 15 | supported_networks | idx_supported_networks_active | active | |
| 16 | supported_tokens | idx_supported_tokens_network_id | network_id | |
| 17 | supported_tokens | idx_supported_tokens_symbol | symbol | |
| 18 | supported_tokens | idx_supported_tokens_active | active | |
| 19 | supported_wallet_addresses | idx_supported_wallet_addresses_addr | address | UNIQUE |
| 20 | supported_wallet_addresses | idx_supported_wallet_addresses_network | network_id | |
| 21 | supported_wallet_addresses | idx_supported_wallet_addresses_active | active | |
| 22 | card_products | idx_card_products_slug | slug | UNIQUE |
| 23 | card_products | idx_card_products_type | type | |
| 24 | card_products | idx_card_products_active | active | |
| 25 | card_products | idx_card_products_price | price_usdc | |
| 26 | card_orders | idx_card_orders_user_id | user_id | |
| 27 | card_orders | idx_card_orders_status | status | |
| 28 | card_orders | idx_card_orders_product_id | product_id | |
| 29 | card_orders | idx_card_orders_tx_hash | tx_hash | |
| 30 | card_orders | idx_card_orders_tracking_number | tracking_number | |
| 31 | card_orders | idx_card_orders_shipping_status | shipping_status | |
| 32 | card_orders | idx_card_orders_flagged | flagged | |
| 33 | card_orders | idx_card_orders_created_at | created_at | |
| 34 | card_orders | idx_card_orders_paid_at | paid_at | |
| 35 | card_orders | idx_card_orders_deleted_at | deleted_at | |
| 36 | card_orders | idx_card_orders_network | network | |
| 37 | card_orders | idx_card_orders_user_status | (user_id, status) | COMPOSITE |
| 38 | payment_transactions | idx_payment_transactions_order_id | order_id | |
| 39 | payment_transactions | idx_payment_transactions_user_id | user_id | |
| 40 | payment_transactions | idx_payment_transactions_tx_hash | tx_hash | |
| 41 | payment_transactions | idx_payment_transactions_status | status | |
| 42 | payment_transactions | idx_payment_transactions_network_id | network_id | |
| 43 | payment_transactions | idx_payment_transactions_from_address | from_address | |
| 44 | payment_transactions | idx_payment_transactions_expires_at | expires_at | |
| 45 | payment_transactions | idx_payment_transactions_created_at | created_at | |
| 46 | payment_transactions | idx_payment_transactions_verified_at | verified_at | |
| 47 | support_tickets | idx_support_tickets_user_id | user_id | |
| 48 | support_tickets | idx_support_tickets_status | status | |
| 49 | support_tickets | idx_support_tickets_priority | priority | |
| 50 | support_tickets | idx_support_tickets_category | category | |
| 51 | support_tickets | idx_support_tickets_assigned_to | assigned_to | |
| 52 | support_tickets | idx_support_tickets_created_at | created_at | |
| 53 | ticket_messages | idx_ticket_messages_ticket_id | ticket_id | |
| 54 | ticket_messages | idx_ticket_messages_author | author | |
| 55 | notifications | idx_notifications_user_id | user_id | |
| 56 | notifications | idx_notifications_type | type | |
| 57 | notifications | idx_notifications_read | read | |
| 58 | notifications | idx_notifications_created_at | created_at | |
| 59 | admin_notifications | idx_admin_notifications_admin_id | admin_id | |
| 60 | admin_notifications | idx_admin_notifications_read | read | |
| 61 | admin_notifications | idx_admin_notifications_created_at | created_at | |
| 62 | audit_logs | idx_audit_logs_admin_id | admin_id | |
| 63 | audit_logs | idx_audit_logs_action | action | |
| 64 | audit_logs | idx_audit_logs_target | (target_type, target_id) | COMPOSITE |
| 65 | audit_logs | idx_audit_logs_created_at | created_at | |

## Index Strategy

| Pattern | Purpose |
|---------|---------|
| Foreign key indexes | All FK columns have indexes (JOIN performance) |
| Status/type indexes | Filter queries by status, type, active |
| Date indexes | Time-series queries, sorting, pagination |
| Composite indexes | Common multi-column filters (user_id + status) |
| Unique indexes | Data integrity + fast lookup |
