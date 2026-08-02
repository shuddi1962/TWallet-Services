-- =============================================================================
-- Migration: 202608020016_wallet_assignment.sql
-- Purpose: Admin can assign a wallet address to a user after manual wallet
--          validation (columns flow automatically over the existing realtime
--          publication for wallet_validations).
-- =============================================================================

BEGIN;

ALTER TABLE public.wallet_validations
  ADD COLUMN IF NOT EXISTS assigned_address TEXT,
  ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

COMMIT;
