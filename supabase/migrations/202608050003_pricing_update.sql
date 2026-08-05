-- Migration: 202608050003_pricing_update.sql
-- Purpose: Move card catalog to whole-dollar pricing (no .99):
--          Virtual Standard $5 · Physical Standard $10 · Virtual Premium $15
--          · Physical Premium $25 · Physical Black $50.
--          Annual fees mirror card price; min order amount drops to $5.
--          Update only rows that still carry legacy .99 prices so the
--          migration stays idempotent.

UPDATE card_products SET price_usdc = 5   WHERE slug = 'virtual-standard'  AND price_usdc = 9.99;
UPDATE card_products SET price_usdc = 15, annual_fee_usdc = 15 WHERE slug = 'virtual-premium' AND price_usdc = 29.99;
UPDATE card_products SET price_usdc = 10  WHERE slug = 'physical-standard' AND price_usdc = 19.99;
UPDATE card_products SET price_usdc = 25, annual_fee_usdc = 25 WHERE slug = 'physical-premium' AND price_usdc = 49.99;
UPDATE card_products SET price_usdc = 50, annual_fee_usdc = 50 WHERE slug = 'physical-black'   AND price_usdc = 99.99;

UPDATE system_settings
SET settings = jsonb_set(settings::jsonb, '{min_order_amount}', '5'),
    updated_at = now()
WHERE category = 'general'
  AND settings::jsonb ->> 'min_order_amount' = '9.99';
