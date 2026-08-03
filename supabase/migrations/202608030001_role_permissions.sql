-- =============================================================================
-- Migration: 202608030001_role_permissions.sql
-- Purpose: DB-backed RBAC. role_permissions catalog (editable by super admins),
--          per-admin permission overrides, realtime publication, audit actions.
-- Dependencies: 202607200001_initial_schema.sql (admins, admin_role, audit_action)
-- =============================================================================

-- ALTER TYPE ... ADD VALUE cannot run inside a transaction block.
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'role_permissions_updated';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'admin_permissions_updated';

BEGIN;

-- =============================================================================
-- ROLE PERMISSIONS (canonical matrix)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.role_permissions (
  role admin_role NOT NULL,
  permission TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (role, permission)
);

-- Seed: default matrix (mirrors the built-in role presets shown in the UI)
INSERT INTO public.role_permissions (role, permission)
SELECT 'super_admin', perm FROM unnest(ARRAY[
  'dashboard','users_view','users_manage','orders_view','orders_manage',
  'payments_view','payments_manage','cards_view','cards_manage',
  'tickets_view','tickets_manage','settings_view','settings_manage',
  'audit_logs','analytics'
]) AS perm
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role, permission)
SELECT 'operations', perm FROM unnest(ARRAY[
  'dashboard','users_view','orders_view','orders_manage',
  'cards_view','cards_manage','tickets_view'
]) AS perm
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role, permission)
SELECT 'finance', perm FROM unnest(ARRAY[
  'dashboard','orders_view','payments_view','payments_manage','analytics'
]) AS perm
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role, permission)
SELECT 'support', perm FROM unnest(ARRAY[
  'dashboard','users_view','orders_view','tickets_view','tickets_manage'
]) AS perm
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role, permission)
SELECT 'viewer', perm FROM unnest(ARRAY[
  'dashboard','users_view','orders_view','payments_view',
  'cards_view','tickets_view','analytics'
]) AS perm
ON CONFLICT DO NOTHING;

-- =============================================================================
-- PER-ADMIN PERMISSION OVERRIDES
-- =============================================================================
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS permissions TEXT[] NOT NULL DEFAULT '{}';

-- =============================================================================
-- RLS
-- =============================================================================
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view role permissions"
  ON public.role_permissions FOR SELECT
  USING (public.current_user_is_admin());

CREATE POLICY "Super admins can manage role permissions"
  ON public.role_permissions FOR ALL
  USING (public.current_user_role() = 'super_admin')
  WITH CHECK (public.current_user_role() = 'super_admin');

-- =============================================================================
-- REALTIME
-- =============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'role_permissions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.role_permissions;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'admins'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.admins;
  END IF;
END $$;

COMMIT;