-- =============================================================================
-- TWallet Services — Rollback Script
-- Version: 1.0.0
-- Description: Drops all tables/enums created by schema.sql in reverse order.
-- WARNING: This DESTROYS ALL DATA. Use only for clean rebuilds.
-- =============================================================================

DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS admin_notifications CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS ticket_attachments CASCADE;
DROP TABLE IF EXISTS ticket_messages CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS shipping_addresses CASCADE;
DROP TABLE IF EXISTS card_orders CASCADE;
DROP TABLE IF EXISTS card_products CASCADE;
DROP TABLE IF EXISTS supported_wallet_addresses CASCADE;
DROP TABLE IF EXISTS supported_tokens CASCADE;
DROP TABLE IF EXISTS supported_networks CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP TYPE IF EXISTS audit_action CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;
DROP TYPE IF EXISTS admin_role CASCADE;
DROP TYPE IF EXISTS ticket_category CASCADE;
DROP TYPE IF EXISTS ticket_priority CASCADE;
DROP TYPE IF EXISTS ticket_status CASCADE;
DROP TYPE IF EXISTS shipping_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS card_type CASCADE;

DROP FUNCTION IF EXISTS fn_is_admin CASCADE;
DROP FUNCTION IF EXISTS fn_is_super_admin CASCADE;
DROP FUNCTION IF EXISTS fn_admin_role CASCADE;
DROP FUNCTION IF EXISTS fn_get_user_orders CASCADE;
DROP FUNCTION IF EXISTS fn_get_dashboard_stats CASCADE;
DROP FUNCTION IF EXISTS fn_get_revenue_report CASCADE;
DROP FUNCTION IF EXISTS fn_create_notification CASCADE;
DROP FUNCTION IF EXISTS fn_next_order_number CASCADE;
DROP FUNCTION IF EXISTS fn_next_ticket_number CASCADE;
DROP FUNCTION IF EXISTS fn_set_updated_at CASCADE;
DROP FUNCTION IF EXISTS fn_handle_new_user CASCADE;
DROP FUNCTION IF EXISTS fn_on_payment_confirmed CASCADE;
DROP FUNCTION IF EXISTS fn_on_order_shipped CASCADE;
