-- =============================================================================
-- Migration: 202608020005_wallet_validation_status.sql
-- Purpose:
--   1. Add `status` (pending/validated/rejected) to wallet_validations so
--      admins can approve or reject manual wallet validations.
--   2. Track reviewer + reviewed_at for the audit trail.
--   3. Give admins UPDATE rights on wallet_validations (users keep own-only).
-- Rollback: drop the policy, drop columns, drop index.
-- Author: TWallet Engineering
-- Date: 2026-08-02
-- =============================================================================

BEGIN;

ALTER TABLE wallet_validations
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
  CHECK (status IN ('pending', 'validated', 'rejected'));

ALTER TABLE wallet_validations
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

ALTER TABLE wallet_validations
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_wallet_validations_status ON wallet_validations(status);

CREATE POLICY "Admins can update validations"
  ON wallet_validations FOR UPDATE
  TO authenticated
  USING (current_user_is_admin())
  WITH CHECK (current_user_is_admin());

COMMIT;
