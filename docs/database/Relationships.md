# Relationships — TWallet Services Database

> 41 foreign keys across 19 tables. Generated from `supabase/migrations/202607200001_initial_schema.sql`.

## Foreign Key Reference

| From Table | Column | To Table | Column | Delete Rule |
|------------|--------|----------|--------|-------------|
| profiles | id | auth.users | id | CASCADE |
| user_roles | user_id | profiles | id | CASCADE |
| admins | profile_id | profiles | id | CASCADE |
| wallets | user_id | profiles | id | CASCADE |
| card_orders | user_id | profiles | id | CASCADE |
| card_orders | product_id | card_products | id | RESTRICT |
| payment_transactions | user_id | profiles | id | CASCADE |
| payment_transactions | order_id | card_orders | id | CASCADE |
| payment_transactions | network_id | supported_networks | id | RESTRICT |
| payment_transactions | token_id | supported_tokens | id | RESTRICT |
| payment_transactions | receiving_wallet_id | supported_wallet_addresses | id | RESTRICT |
| shipping_addresses | order_id | card_orders | id | CASCADE |
| support_tickets | user_id | profiles | id | CASCADE |
| support_tickets | order_id | card_orders | id | SET NULL |
| support_tickets | assigned_to | admins | id | SET NULL |
| ticket_messages | ticket_id | support_tickets | id | CASCADE |
| ticket_messages | admin_id | admins | id | SET NULL |
| ticket_attachments | message_id | ticket_messages | id | CASCADE |
| notifications | user_id | profiles | id | CASCADE |
| admin_notifications | admin_id | admins | id | CASCADE |
| system_settings | updated_by | admins | id | SET NULL |
| user_preferences | user_id | profiles | id | CASCADE |
| supported_tokens | network_id | supported_networks | id | CASCADE |
| supported_wallet_addresses | network_id | supported_networks | id | CASCADE |
| supported_wallet_addresses | rotated_from | supported_wallet_addresses | id | — (self-ref) |

## Relationship Summary

| Type | Count | Examples |
|------|-------|---------|
| One-to-One | 4 | profiles→auth.users, shipping_addresses→card_orders, user_roles→profiles, user_preferences→profiles |
| One-to-Many | 15 | profiles→wallets, profiles→card_orders, card_orders→payment_transactions, etc. |
| Many-to-Many | 0 | (resolved via join on app layer) |
| Self-referencing | 1 | supported_wallet_addresses.rotated_from |

## Cascade Behavior

| Rule | Frequency | Usage |
|------|-----------|-------|
| CASCADE | 16 | Core child records (cascade from profiles) |
| RESTRICT | 3 | Business-critical (card_products, supported_networks, supported_tokens) |
| SET NULL | 3 | Optional references (admin_id, order_id on tickets) |

## Key Hierarchies

```
auth.users → profiles → wallets (user's crypto wallets)
auth.users → profiles → card_orders → shipping_addresses (orders)
auth.users → profiles → card_orders → payment_transactions (payments)
auth.users → profiles → support_tickets → ticket_messages → ticket_attachments (support)
admins → audit_logs (admin activity)
admins → admin_notifications (admin alerts)
supported_networks → supported_tokens (network's tokens)
supported_networks → supported_wallet_addresses (receiving addresses)
```
