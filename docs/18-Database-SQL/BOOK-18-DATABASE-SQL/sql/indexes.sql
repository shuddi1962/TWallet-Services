-- =============================================================================
-- TWallet Services — Indexes
-- Version: 1.0.0
-- Description: All performance indexes for the 19 tables.
-- Run order: 3rd (after schema.sql, policies.sql)
-- =============================================================================

-- Additional indexes beyond PK and FK auto-indexes

CREATE INDEX IF NOT EXISTS idx_profiles_country ON profiles (country);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles (status) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_wallets_default ON wallets (user_id) WHERE is_default = true;

CREATE INDEX IF NOT EXISTS idx_card_products_type ON card_products (type);
CREATE INDEX IF NOT EXISTS idx_card_products_active ON card_products (id) WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_card_orders_user_created ON card_orders (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_card_orders_tx_hash ON card_orders (tx_hash) WHERE tx_hash IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_card_orders_shipping ON card_orders (shipping_status);

CREATE INDEX IF NOT EXISTS idx_payments_network_token ON payment_transactions (network_id, token_id);
CREATE INDEX IF NOT EXISTS idx_payments_amount ON payment_transactions (amount);
CREATE INDEX IF NOT EXISTS idx_payments_verified ON payment_transactions (verified_at) WHERE verified_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_expires ON payment_transactions (expires_at) WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_tickets_priority ON support_tickets (priority);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON support_tickets (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_user_status ON support_tickets (user_id, status);

CREATE INDEX IF NOT EXISTS idx_networks_chain_id ON supported_networks (chain_id);
CREATE INDEX IF NOT EXISTS idx_tokens_symbol ON supported_tokens (symbol, network_id);
CREATE INDEX IF NOT EXISTS idx_wallet_addresses_network ON supported_wallet_addresses (network_id);
CREATE INDEX IF NOT EXISTS idx_wallet_addresses_active ON supported_wallet_addresses (id) WHERE active = true;

-- Full-text search index for profiles (future)
-- CREATE INDEX IF NOT EXISTS idx_profiles_search ON profiles USING gin(to_tsvector('english', full_name || ' ' || email));
