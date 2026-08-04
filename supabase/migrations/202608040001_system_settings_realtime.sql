-- =============================================================================
-- Migration: 202608040001_system_settings_realtime.sql
-- Purpose: Publish system_settings to the realtime publication so the admin
--          settings page syncs live across sessions (auto-save + external edits).
-- =============================================================================

BEGIN;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE system_settings;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

COMMIT;
