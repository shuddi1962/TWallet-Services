-- =============================================================================
-- Migration: 202607200008_admin.sql
-- Purpose: Create initial super admin user + setup admin infrastructure
-- Dependencies: 202607200001_initial_schema.sql, 202607200002_rls.sql
-- Rollback: DELETE FROM admins WHERE ... ;
-- Verification: SELECT count(*) FROM admins WHERE role = 'super_admin';
-- Author: TWallet Engineering
-- Date: 2026-07-20
-- =============================================================================

BEGIN;

-- =============================================================================
-- This migration runs after a user exists in auth.users.
-- For local dev: first create a user via Supabase Auth UI or API,
-- then manually insert into admins with the user's UUID.
--
-- Example:
--   INSERT INTO admins (profile_id, role)
--   VALUES ('<user-uuid>', 'super_admin');
--
-- The actual user creation happens through the application auth flow.
-- =============================================================================

-- Seed a local dev admin placeholder (commented — to be run manually):
-- INSERT INTO admins (profile_id, role)
-- SELECT id, 'super_admin' FROM profiles WHERE email = 'admin@twallet.com'
-- ON CONFLICT (profile_id) DO NOTHING;

-- Audit log cleanup configuration
INSERT INTO system_settings (category, settings)
VALUES (
  'audit',
  '{"retention_days":365,"export_enabled":true,"export_formats":["csv","json"],"alert_on_sensitive_actions":["user_suspended","payment_flagged","admin_created"]}'
)
ON CONFLICT (category) DO NOTHING;

COMMIT;
