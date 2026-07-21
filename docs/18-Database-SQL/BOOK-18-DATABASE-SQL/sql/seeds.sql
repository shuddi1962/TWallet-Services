-- =============================================================================
-- TWallet Services — Development Seed Data
-- Version: 1.0.0
-- Description: Seed data for local development. NEVER run on production.
-- Run order: Last (after all other scripts)
-- =============================================================================

-- Clear existing seed data
TRUNCATE TABLE supported_tokens CASCADE;
TRUNCATE TABLE supported_networks CASCADE;
TRUNCATE TABLE supported_wallet_addresses CASCADE;
TRUNCATE TABLE card_products CASCADE;

-- =============================================================================
-- Supported Networks
-- =============================================================================
INSERT INTO supported_networks (id, name, chain_id, currency, explorer_url, rpc_url, icon_url, active) VALUES
  ('ethereum', 'Ethereum', 1, 'ETH', 'https://etherscan.io', 'https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}', NULL, true),
  ('polygon', 'Polygon', 137, 'MATIC', 'https://polygonscan.com', 'https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}', NULL, true),
  ('arbitrum', 'Arbitrum', 42161, 'ETH', 'https://arbiscan.io', 'https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}', NULL, true),
  ('optimism', 'Optimism', 10, 'ETH', 'https://optimistic.etherscan.io', 'https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}', NULL, true),
  ('base', 'Base', 8453, 'ETH', 'https://basescan.org', 'https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}', NULL, true),
  ('avalanche', 'Avalanche C-Chain', 43114, 'AVAX', 'https://snowtrace.io', 'https://avax-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}', NULL, true);

-- =============================================================================
-- Supported Tokens
-- =============================================================================
INSERT INTO supported_tokens (network_id, symbol, name, contract_address, decimals, active) VALUES
  ('ethereum', 'USDC', 'USD Coin', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, true),
  ('ethereum', 'USDT', 'Tether USD', '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, true),
  ('ethereum', 'ETH', 'Ether', '0x0000000000000000000000000000000000000000', 18, true),
  ('polygon', 'USDC', 'USD Coin', '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', 6, true),
  ('polygon', 'USDT', 'Tether USD', '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 6, true),
  ('polygon', 'MATIC', 'Polygon', '0x0000000000000000000000000000000000001010', 18, true),
  ('arbitrum', 'USDC', 'USD Coin', '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', 6, true),
  ('arbitrum', 'USDT', 'Tether USD', '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', 6, true),
  ('base', 'USDC', 'USD Coin', '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', 6, true);

-- =============================================================================
-- Card Products
-- =============================================================================
INSERT INTO card_products (slug, name, type, description, price_usdc, annual_fee_usdc, networks, tokens, currency, features, active) VALUES
  ('visa-classic', 'Visa Classic', 'physical', 'Everyday spending with no annual fee.', 25.00, 0.00, '{ethereum,polygon}', '{USDC,USDT}', 'USD', '["No annual fee", "Free shipping", "24/7 support"]', true),
  ('visa-platinum', 'Visa Platinum', 'physical', 'Premium metal card with exclusive benefits.', 50.00, 0.00, '{ethereum,polygon,arbitrum,base}', '{USDC,USDT}', 'USD', '["Metal finish", "Priority support", "Free shipping", "Cashback rewards"]', true),
  ('visa-black', 'Visa Black', 'physical', 'Ultimate prestige card with concierge service.', 150.00, 100.00, '{ethereum,polygon,arbitrum,base,optimism,avalanche}', '{USDC,USDT,ETH}', 'USD', '["Carbon fiber design", "Personal concierge", "Lounge access", "Travel insurance", "Priority shipping"]', true),
  ('visa-virtual', 'Visa Virtual', 'virtual', 'Instant virtual card for online payments.', 10.00, 0.00, '{ethereum,polygon,arbitrum}', '{USDC,USDT}', 'USD', '["Instant issuance", "No shipping", "Online use only", "Free"]', true),
  ('visa-virtual-plus', 'Visa Virtual+', 'virtual', 'Enhanced virtual card with higher limits.', 25.00, 0.00, '{ethereum,polygon,arbitrum,base}', '{USDC,USDT,ETH}', 'USD', '["Instant issuance", "Higher limits", "Multi-currency support", "Priority support"]', true);

-- =============================================================================
-- System Settings
-- =============================================================================
INSERT INTO system_settings (category, settings) VALUES
  ('general', '{"platform_name":"TWallet Card","support_email":"support@twalletservices.com","maintenance_mode":false}'::jsonb),
  ('payments', '{"default_network":"ethereum","min_confirmations":12,"platform_fee_percent":2.5,"max_amount":100000,"min_amount":10,"payment_timeout_hours":48}'::jsonb),
  ('security', '{"max_login_attempts":5,"lockout_duration_minutes":15,"session_duration_hours":24,"admin_session_hours":8}'::jsonb),
  ('notifications', '{"email_order_confirmed":true,"email_payment_received":true,"email_shipping_update":true,"admin_new_order_alert":true,"admin_failed_payment_alert":true}'::jsonb);
