-- =============================================================================
-- Migration: 202608020012_password_changed_at.sql
-- Purpose: Track when a user/ad admin last changed their password so dashboards
--          sync the timestamp in real time (profiles is already in the
--          supabase_realtime publication).
-- =============================================================================

BEGIN;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ;

COMMIT;