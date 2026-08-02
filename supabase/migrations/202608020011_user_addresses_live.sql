-- =============================================================================
-- Migration: 202608020011_user_addresses_live.sql
-- Purpose: Persistent user address book (profile/settings), public avatars for
--          profile photo display, and realtime publications for profiles +
--          user_preferences so Settings/Profile pages sync live across sessions.
-- =============================================================================

BEGIN;

-- ─── User address book ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);

-- Realtime publication so the address book syncs without a reload.
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_addresses;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- ─── RLS ────────────────────────────────────────────────────────────────────
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own addresses"
  ON user_addresses FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own addresses"
  ON user_addresses FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own addresses"
  ON user_addresses FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own addresses"
  ON user_addresses FOR DELETE
  USING (user_id = auth.uid());

-- Enforce a single default address per user via trigger.
CREATE OR REPLACE FUNCTION public.enforce_single_default_address()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_default THEN
    UPDATE user_addresses
    SET is_default = false
    WHERE user_id = NEW.user_id AND id <> NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_single_default_address ON user_addresses;
CREATE TRIGGER trg_single_default_address
  BEFORE INSERT OR UPDATE OF is_default ON user_addresses
  FOR EACH ROW
  WHEN (NEW.is_default)
  EXECUTE FUNCTION public.enforce_single_default_address();

-- Keep updated_at fresh on changes.
CREATE TRIGGER set_updated_at_user_addresses
  BEFORE UPDATE ON user_addresses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── Realtime for profiles + preferences (Settings/Profile live sync) ──────
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_preferences;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- Public avatars so uploaded profile photos resolve via getPublicUrl.
UPDATE storage.buckets
SET public = true, file_size_limit = 5242880 -- 5MB
WHERE id = 'avatars' AND public = false;

-- Allow public read for the avatar bucket (profile photos shown across the
-- platform). Uploads remain owner-restricted by the existing insert/update/delete
-- policies under the user-folder naming convention.
DROP POLICY IF EXISTS "Avatars publicly viewable" ON storage.objects;
CREATE POLICY "Avatars publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

COMMIT;