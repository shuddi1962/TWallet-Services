-- =============================================================================
-- Migration: 202608020015_admin_live_tables.sql
-- Purpose: Publish card_products and supported_wallet_addresses to realtime so
--          the admin Card Products and Receiving Wallets pages update live
--          (add/edit/archive/toggle) without page refreshes.
-- Verification: INSERT/UPDATE on card_products streams to subscribed clients
-- Author: TWallet Engineering
-- Date: 2026-08-02
-- =============================================================================

BEGIN;

ALTER PUBLICATION supabase_realtime ADD TABLE card_products;
ALTER PUBLICATION supabase_realtime ADD TABLE supported_wallet_addresses;

COMMIT;