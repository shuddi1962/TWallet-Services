-- =============================================================================
-- Migration: 202608020013_geo_country_trigger.sql
-- Purpose: Redefine handle_new_user so signups persist the geo-detected country
--          from auth metadata into profiles.country (instead of a US default).
-- Dependencies: 202607200005_triggers.sql (original handle_new_user)
-- Rollback: CREATE OR REPLACE FUNCTION handle_new_user() without country column
-- Verification: new signup with raw_user_meta_data->>'country' populates profiles.country
-- Author: TWallet Engineering
-- Date: 2026-08-02
-- =============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, country)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'User'),
    COALESCE(NEW.raw_user_meta_data->>'country', 'US')::TEXT
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

COMMIT;