-- =============================================================================
-- Migration: 202607250001_payment_verifications.sql
-- Purpose: payment_verifications table + sweep_transactions table
-- Dependencies: 202607200001_initial_schema.sql, 202607200002_rls.sql
-- =============================================================================

BEGIN;

-- =============================================================================
-- PAYMENT VERIFICATIONS (append-only audit trail)
-- =============================================================================
CREATE TABLE IF NOT EXISTS payment_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tx_hash TEXT NOT NULL,
  chain_id INTEGER NOT NULL,
  expected_amount TEXT NOT NULL,
  expected_address TEXT NOT NULL,
  actual_amount TEXT,
  from_address TEXT,
  block_number BIGINT,
  confirmations INTEGER NOT NULL DEFAULT 0,
  verified BOOLEAN NOT NULL DEFAULT false,
  error_code TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payment_verifications_tx_hash ON payment_verifications (tx_hash);
CREATE INDEX idx_payment_verifications_created_at ON payment_verifications (created_at DESC);

-- =============================================================================
-- SWEEP TRANSACTIONS (admin treasury withdrawals)
-- =============================================================================
CREATE TABLE IF NOT EXISTS sweep_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE SET NULL,
  from_network_id TEXT NOT NULL REFERENCES supported_networks(id),
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  token_contract TEXT,
  amount TEXT NOT NULL,
  tx_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'signed', 'broadcast', 'confirmed', 'failed')),
  error_message TEXT,
  signed_tx_hex TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMPTZ
);

CREATE INDEX idx_sweep_transactions_status ON sweep_transactions (status);
CREATE INDEX idx_sweep_transactions_created_at ON sweep_transactions (created_at DESC);

COMMIT;