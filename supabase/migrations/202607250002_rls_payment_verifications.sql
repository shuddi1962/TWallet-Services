-- =============================================================================
-- Migration: 202607250002_rls_payment_verifications.sql
-- Purpose: RLS for payment_verifications + sweep_transactions
-- Dependencies: 202607250001_payment_verifications.sql
-- =============================================================================

BEGIN;

-- =============================================================================
-- PAYMENT VERIFICATIONS RLS
-- =============================================================================
ALTER TABLE payment_verifications ENABLE ROW LEVEL SECURITY;

-- Service role can read/write everything (used by edge functions + admin)
CREATE POLICY "service_role_all_payment_verifications"
  ON payment_verifications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users can read their own order's verifications
CREATE POLICY "users_read_own_payment_verifications"
  ON payment_verifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM card_orders co
      JOIN payment_transactions pt ON pt.order_id = co.id
      WHERE pt.tx_hash = payment_verifications.tx_hash
        AND co.user_id = auth.uid()
    )
  );

-- =============================================================================
-- SWEEP TRANSACTIONS RLS
-- =============================================================================
ALTER TABLE sweep_transactions ENABLE ROW LEVEL SECURITY;

-- Only admins can manage sweep transactions
CREATE POLICY "admins_all_sweep_transactions"
  ON sweep_transactions
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Service role can always read/write
CREATE POLICY "service_role_all_sweep_transactions"
  ON sweep_transactions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMIT;