-- =============================================================================
-- Migration: 202607310001_fix_admin_rls_and_validations.sql
-- Purpose:
--   1. Fix infinite RLS recursion on `admins` (stack depth exceeded) that
--      blocked the admin dashboard: is_admin/current_user_is_admin/
--      current_user_role are now SECURITY DEFINER so policy subqueries
--      against `admins` do not recurse.
--   2. Admins can view ALL wallet_validations (admin dashboard table).
--   3. Publish wallet_validations over realtime so the admin dashboard
--      updates live when a customer submits a manual validation.
-- Rollback: re-run previous function definitions without SECURITY DEFINER
--           / DROP POLICY "Admins can view all validations" / ALTER PUBLICATION.
-- Author: TWallet Engineering
-- Date: 2026-07-31
-- =============================================================================

BEGIN;

-- =============================================================================
-- 1. SECURITY DEFINER admin helpers (break RLS recursion)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
PARALLEL SAFE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins a WHERE a.profile_id = user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
PARALLEL SAFE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin(auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS admin_role
LANGUAGE sql
STABLE
PARALLEL SAFE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT a.role FROM admins a WHERE a.profile_id = auth.uid()),
    'viewer'::admin_role
  );
$$;

-- =============================================================================
-- 2. Wallet validations: admins can view all records (users keep own-only)
-- =============================================================================
CREATE POLICY "Admins can view all validations"
  ON wallet_validations FOR SELECT
  TO authenticated
  USING (current_user_is_admin());

-- =============================================================================
-- 3. Realtime publication for wallet validations
-- =============================================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'wallet_validations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.wallet_validations;
  END IF;
END $$;

COMMIT;
