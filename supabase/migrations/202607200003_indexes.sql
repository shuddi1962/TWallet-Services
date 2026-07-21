-- =============================================================================
-- Migration: 202607200003_indexes.sql
-- Purpose: Create all performance indexes (51 total across 19 tables)
-- Dependencies: 202607200001_initial_schema.sql
-- Rollback: DROP INDEX IF EXISTS ...
-- Verification: EXPLAIN plans use these indexes
-- Author: TWallet Engineering
-- Date: 2026-07-20
-- =============================================================================

BEGIN;

-- PROFILES
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_country ON profiles(country);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON profiles(deleted_at);
CREATE INDEX IF NOT EXISTS idx_profiles_kyc_tier ON profiles(kyc_tier);

-- USER ROLES
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- ADMINS
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);
CREATE INDEX IF NOT EXISTS idx_admins_profile_id ON admins(profile_id);

-- WALLETS
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_address ON wallets(address);
CREATE INDEX IF NOT EXISTS idx_wallets_network ON wallets(network);
CREATE INDEX IF NOT EXISTS idx_wallets_is_default ON wallets(is_default);
CREATE INDEX IF NOT EXISTS idx_wallets_deleted_at ON wallets(deleted_at);

-- SUPPORTED NETWORKS
CREATE INDEX IF NOT EXISTS idx_supported_networks_active ON supported_networks(active);

-- SUPPORTED TOKENS
CREATE INDEX IF NOT EXISTS idx_supported_tokens_network_id ON supported_tokens(network_id);
CREATE INDEX IF NOT EXISTS idx_supported_tokens_symbol ON supported_tokens(symbol);
CREATE INDEX IF NOT EXISTS idx_supported_tokens_active ON supported_tokens(active);

-- SUPPORTED WALLET ADDRESSES
CREATE INDEX IF NOT EXISTS idx_supported_wallet_addresses_network ON supported_wallet_addresses(network_id);
CREATE INDEX IF NOT EXISTS idx_supported_wallet_addresses_active ON supported_wallet_addresses(active);

-- CARD PRODUCTS
CREATE INDEX IF NOT EXISTS idx_card_products_slug ON card_products(slug);
CREATE INDEX IF NOT EXISTS idx_card_products_type ON card_products(type);
CREATE INDEX IF NOT EXISTS idx_card_products_active ON card_products(active);
CREATE INDEX IF NOT EXISTS idx_card_products_price ON card_products(price_usdc);

-- CARD ORDERS
CREATE INDEX IF NOT EXISTS idx_card_orders_user_id ON card_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_card_orders_status ON card_orders(status);
CREATE INDEX IF NOT EXISTS idx_card_orders_product_id ON card_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_card_orders_tx_hash ON card_orders(tx_hash);
CREATE INDEX IF NOT EXISTS idx_card_orders_tracking_number ON card_orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_card_orders_shipping_status ON card_orders(shipping_status);
CREATE INDEX IF NOT EXISTS idx_card_orders_flagged ON card_orders(flagged);
CREATE INDEX IF NOT EXISTS idx_card_orders_created_at ON card_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_card_orders_paid_at ON card_orders(paid_at);
CREATE INDEX IF NOT EXISTS idx_card_orders_deleted_at ON card_orders(deleted_at);
CREATE INDEX IF NOT EXISTS idx_card_orders_network ON card_orders(network);
CREATE INDEX IF NOT EXISTS idx_card_orders_user_status ON card_orders(user_id, status);

-- PAYMENT TRANSACTIONS
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_tx_hash ON payment_transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_network_id ON payment_transactions(network_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_from_address ON payment_transactions(from_address);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_expires_at ON payment_transactions(expires_at);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON payment_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_verified_at ON payment_transactions(verified_at);

-- SUPPORT TICKETS
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_category ON support_tickets(category);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to ON support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at);

-- TICKET MESSAGES
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_author ON ticket_messages(author);

-- NOTIFICATIONS
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- ADMIN NOTIFICATIONS
CREATE INDEX IF NOT EXISTS idx_admin_notifications_admin_id ON admin_notifications(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_read ON admin_notifications(read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON admin_notifications(created_at);

-- AUDIT LOGS
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON audit_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

COMMIT;
