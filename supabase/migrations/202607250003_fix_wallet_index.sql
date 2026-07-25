-- =============================================================================
-- Migration: 202607250003_fix_wallet_index.sql
-- Purpose: Replace unique index on address with composite index (network_id, address)
-- Allows same address across multiple networks
-- =============================================================================

BEGIN;

DROP INDEX IF EXISTS idx_supported_wallet_addresses_addr;
CREATE UNIQUE INDEX IF NOT EXISTS idx_supported_wallet_addresses_network_addr ON supported_wallet_addresses (network_id, address);

COMMIT;