-- =============================================================================
-- Migration: 202607290001_hardening.sql
-- Purpose: Schema drift fixes, analytics RLS, session settings, product archive
-- =============================================================================

BEGIN;

-- Card products: support archive flag used by admin actions
ALTER TABLE card_products
  ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_card_products_active_archived
  ON card_products (active, archived)
  WHERE active = true AND archived = false;

-- Analytics events: enable RLS (was missing)
ALTER TABLE IF EXISTS analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "analytics_events_admin_all" ON analytics_events;
CREATE POLICY "analytics_events_admin_all"
  ON analytics_events
  FOR ALL
  TO authenticated
  USING (public.current_user_is_admin())
  WITH CHECK (public.current_user_is_admin());

DROP POLICY IF EXISTS "analytics_events_insert_own" ON analytics_events;
CREATE POLICY "analytics_events_insert_own"
  ON analytics_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Session / security settings
INSERT INTO system_settings (category, settings)
VALUES
  ('security', '{"session_idle_minutes":30,"session_warn_minutes":25,"max_login_attempts":5,"require_email_verified":true,"jwt_refresh_enabled":true}'::jsonb)
ON CONFLICT (category) DO UPDATE
SET settings = EXCLUDED.settings,
    updated_at = now();

-- Realtime publication for live dashboards
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE card_orders;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE payment_transactions;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE support_tickets;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

COMMIT;
