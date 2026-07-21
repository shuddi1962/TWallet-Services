-- =============================================================================
-- Migration: 202607200006_storage.sql
-- Purpose: Create Storage buckets + RLS policies for file access
-- Dependencies: 202607200001_initial_schema.sql, 202607200002_rls.sql
-- Rollback: DROP POLICY IF EXISTS ... ; DELETE FROM storage.buckets WHERE ...;
-- Verification: SELECT * FROM storage.buckets;
-- Author: TWallet Engineering
-- Date: 2026-07-20
-- =============================================================================

BEGIN;

-- =============================================================================
-- AVATARS (private — user only)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  false,
  2097152,  -- 2MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']::TEXT[]
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can view own avatar"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

-- =============================================================================
-- DOCUMENTS (private — KYC, identity)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760,  -- 10MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf']::TEXT[]
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can view own documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND auth.uid()::TEXT = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents' AND public.current_user_is_admin());

-- =============================================================================
-- SUPPORT FILES (private — ticket attachments)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'support-files',
  'support-files',
  false,
  20971520,  -- 20MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'text/plain', 'application/zip']::TEXT[]
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can view own support files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'support-files'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload support files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'support-files'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all support files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'support-files' AND public.current_user_is_admin());

-- =============================================================================
-- CARD ASSETS (public — card art, brand logos)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'card-assets',
  'card-assets',
  true,
  5242880,  -- 5MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']::TEXT[]
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Card assets are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'card-assets');

CREATE POLICY "Admins can manage card assets"
  ON storage.objects FOR ALL
  USING (bucket_id = 'card-assets' AND public.current_user_is_admin())
  WITH CHECK (bucket_id = 'card-assets' AND public.current_user_is_admin());

-- =============================================================================
-- PUBLIC ASSETS (public — landing page images, static resources)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public-assets',
  'public-assets',
  true,
  10485760,  -- 10MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'application/json']::TEXT[]
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public assets are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'public-assets');

CREATE POLICY "Admins can manage public assets"
  ON storage.objects FOR ALL
  USING (bucket_id = 'public-assets' AND public.current_user_is_admin())
  WITH CHECK (bucket_id = 'public-assets' AND public.current_user_is_admin());

COMMIT;
