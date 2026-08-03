-- =============================================================================
-- Migration: 202608030002_sweep_live.sql
-- Purpose: realtime publication for sweep_transactions + audit actions for sweeps
-- Dependencies: 202607250001_payment_verifications.sql, 202607250002_rls_payment_verifications.sql
-- =============================================================================

ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'sweep_initiated';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'sweep_status_updated';

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'sweep_transactions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.sweep_transactions;
  END IF;
END $$;

COMMIT;