-- =============================================================================
-- Migration: 202607200007_seed_data.sql
-- Purpose: Development seed data — countries, networks, tokens, card products
-- Dependencies: 202607200001_initial_schema.sql
-- Rollback: DELETE FROM ... ;
-- Verification: SELECT count(*) FROM ... ;
-- Author: TWallet Engineering
-- Date: 2026-07-20
-- =============================================================================

BEGIN;

-- =============================================================================
-- COUNTRIES (shipping destinations)
-- =============================================================================
INSERT INTO supported_networks (id, name, chain_id, currency, explorer_url, rpc_url, icon_url, active)
VALUES
  ('ethereum',      'Ethereum',      1,     'ETH',  'https://etherscan.io',          'https://eth-mainnet.g.alchemy.com/v2',           'ethereum.svg',  true),
  ('polygon',       'Polygon',      137,    'MATIC', 'https://polygonscan.com',       'https://polygon-mainnet.g.alchemy.com/v2',      'polygon.svg',   true),
  ('arbitrum',      'Arbitrum',    42161,   'ETH',  'https://arbiscan.io',            'https://arb-mainnet.g.alchemy.com/v2',          'arbitrum.svg',  true),
  ('optimism',      'Optimism',      10,    'ETH',  'https://optimistic.etherscan.io', 'https://opt-mainnet.g.alchemy.com/v2',         'optimism.svg',  true),
  ('base',          'Base',        8453,    'ETH',  'https://basescan.org',           'https://base-mainnet.g.alchemy.com/v2',         'base.svg',      true),
  ('solana',        'Solana',       101,    'SOL',  'https://solscan.io',             'https://api.mainnet-beta.solana.com',            'solana.svg',    true)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- TOKENS (per network)
-- =============================================================================
INSERT INTO supported_tokens (network_id, symbol, name, contract_address, decimals)
VALUES
  ('polygon',  'USDC', 'USD Coin',       '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', 6),
  ('polygon',  'USDT', 'Tether',         '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 6),
  ('ethereum', 'USDC', 'USD Coin',       '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6),
  ('ethereum', 'USDT', 'Tether',         '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6),
  ('arbitrum', 'USDC', 'USD Coin',       '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', 6),
  ('optimism', 'USDC', 'USD Coin',       '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', 6),
  ('base',     'USDC', 'USD Coin',       '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', 6),
  ('solana',   'USDC', 'USD Coin',       'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 6),
  ('polygon',  'DAI',  'Dai Stablecoin', '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 18)
ON CONFLICT (symbol, network_id) DO NOTHING;

-- =============================================================================
-- CARD PRODUCTS
-- =============================================================================
INSERT INTO card_products (slug, name, type, description, price_usdc, annual_fee_usdc, networks, tokens, currency, card_art_url, features)
VALUES
  ('virtual-standard',     'Virtual Standard',     'virtual', 'Digital-first debit card for everyday spending.',  9.99,  0,    ARRAY['polygon','ethereum','arbitrum'], ARRAY['USDC','USDT'], 'USD', '/card-art/virtual-standard.svg',   '["Instant issuance","Virtual card details","Online purchases","ATM access","Free virtual card"]'),
  ('virtual-premium',      'Virtual Premium',      'virtual', 'Premium digital card with higher limits and rewards.', 29.99, 99,  ARRAY['polygon','ethereum','arbitrum','optimism','base'], ARRAY['USDC','USDT','DAI'], 'USD', '/card-art/virtual-premium.svg', '["Instant issuance","Priority support","2% cashback","Higher limits","Crypto cashback"]'),
  ('physical-standard',    'Physical Standard',    'physical', 'Metal debit card shipped worldwide.',  19.99, 0,    ARRAY['polygon','ethereum','arbitrum'], ARRAY['USDC','USDT'], 'USD', '/card-art/physical-standard.svg',   '["Metal card","Free shipping","ATM withdrawals","Online purchases","Custom design"]'),
  ('physical-premium',     'Physical Premium',     'physical', 'Premium metal card with priority shipping and rewards.',  49.99, 199, ARRAY['polygon','ethereum','arbitrum','optimism','base','solana'], ARRAY['USDC','USDT','DAI'], 'USD', '/card-art/physical-premium.svg', '["Brushed metal finish","Priority shipping","3% cashback","Concierge service","Exclusive events","Custom engraving"]'),
  ('physical-black',       'Physical Black',       'physical', 'Exclusive black metal card. Invite only.',  99.99, 499, ARRAY['polygon','ethereum','arbitrum','optimism','base','solana'], ARRAY['USDC','USDT','DAI'], 'USD', '/card-art/physical-black.svg',     '["Black carbon fiber","VIP shipping","5% cashback","Personal concierge","Airport lounge access","Invite-only events","Custom engraving","Dedicated account manager"]')
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- SYSTEM SETTINGS
-- =============================================================================
INSERT INTO system_settings (category, settings)
VALUES
  ('general',          '{"site_name":"TWallet Card","support_email":"support@twallet.com","support_phone":"+1-800-TWALLET","platform_fee_percent":1.5,"min_order_amount":9.99,"max_order_amount":10000,"default_currency":"USD"}'),
  ('payment',          '{"min_confirmations":12,"allow_refunds":true,"refund_window_hours":48,"payment_timeout_hours":48,"allowed_networks":["polygon","ethereum","arbitrum","optimism","base","solana"],"allowed_tokens":["USDC","USDT","DAI"]}'),
  ('shipping',         '{"domestic_shipping_days":"3-5","international_shipping_days":"7-14","free_shipping_threshold":50,"tracking_enabled":true,"carriers":["USPS","FedEx","DHL"]}'),
  ('kyc',              '{"required_tier":"none","verification_providers":[],"max_attempts":3}'),
  ('notifications',    '{"email_enabled":true,"push_enabled":true,"sms_enabled":false,"admin_email":"admin@twallet.com"}'),
  ('limits',           '{"daily_order_limit":10,"monthly_order_limit":50,"max_wallets_per_user":5,"min_payment_amount":1,"max_payment_amount":50000}')
ON CONFLICT (category) DO NOTHING;

COMMIT;
