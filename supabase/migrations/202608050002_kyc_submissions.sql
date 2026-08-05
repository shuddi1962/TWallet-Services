-- =============================================================================
-- Migration: 202608050002_kyc_submissions.sql
-- Purpose: KYC document submissions with admin review (approve/reject).
--          Users submit identity documents; admins review in /admin/kyc;
--          approval sets profiles.kyc_tier so order limits unlock.
-- Dependencies: 202607200001_initial_schema.sql (profiles, notification_type,
--               audit_action), 202607200002_rls.sql (current_user_is_admin),
--               202607200006_storage.sql (documents bucket)
-- =============================================================================

BEGIN;

-- Enum values for user notifications + audit trail.
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'kyc_submitted';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'kyc_reviewed';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'kyc_submitted';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'kyc_reviewed';

-- =============================================================================
-- KYC SUBMISSIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS kyc_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'passport'
    CHECK (document_type IN ('passport', 'drivers_license', 'national_id')),
  document_number TEXT,
  document_front_url TEXT NOT NULL,
  document_back_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note TEXT,
  reviewed_by UUID REFERENCES admins(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kyc_submissions_user_id ON kyc_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_submissions_status ON kyc_submissions(status);
CREATE INDEX IF NOT EXISTS idx_kyc_submissions_created_at ON kyc_submissions(created_at DESC);

-- RLS: users manage their own submissions; admins see everything and review.
ALTER TABLE kyc_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own kyc submissions" ON kyc_submissions;
CREATE POLICY "Users can view own kyc submissions"
  ON kyc_submissions FOR SELECT
  USING (user_id = auth.uid() OR current_user_is_admin());

DROP POLICY IF EXISTS "Users can submit kyc" ON kyc_submissions;
CREATE POLICY "Users can submit kyc"
  ON kyc_submissions FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can review kyc submissions" ON kyc_submissions;
CREATE POLICY "Admins can review kyc submissions"
  ON kyc_submissions FOR UPDATE
  USING (current_user_is_admin())
  WITH CHECK (current_user_is_admin());

DROP POLICY IF EXISTS "Admins can delete kyc submissions" ON kyc_submissions;
CREATE POLICY "Admins can delete kyc submissions"
  ON kyc_submissions FOR DELETE
  USING (current_user_is_admin());

-- Realtime: new submissions + review updates appear live on both sides.
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE kyc_submissions;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- =============================================================================
-- NOTIFY ADMINS WHEN A USER SUBMITS KYC DOCUMENTS
-- =============================================================================
CREATE OR REPLACE FUNCTION public.notify_admins_of_kyc_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO admin_notifications (admin_id, type, title, message, related_type, related_id)
  SELECT
    a.id,
    'kyc_submitted'::notification_type,
    'New KYC submission — ' || NEW.full_name,
    COALESCE('Document: ' || NEW.document_type, NULL),
    'kyc_submissions',
    NEW.id
  FROM admins a;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_admins_of_kyc_submission ON kyc_submissions;
CREATE TRIGGER trg_notify_admins_of_kyc_submission
  AFTER INSERT ON kyc_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admins_of_kyc_submission();

-- =============================================================================
-- NOTIFY THE USER WHEN THEIR SUBMISSION IS REVIEWED + SYNC KYC TIER
-- =============================================================================
CREATE OR REPLACE FUNCTION public.on_kyc_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status <> 'approved' THEN
    UPDATE profiles SET kyc_tier = 'tier1' WHERE id = NEW.user_id;
    INSERT INTO notifications (user_id, type, title, message, related_type, related_id)
    VALUES (
      NEW.user_id,
      'kyc_reviewed'::notification_type,
      'KYC approved',
      'Your identity documents were approved. You can now order cards up to your tier limit.',
      'kyc_submissions',
      NEW.id
    );
  ELSIF NEW.status = 'rejected' AND OLD.status <> 'rejected' THEN
    INSERT INTO notifications (user_id, type, title, message, related_type, related_id)
    VALUES (
      NEW.user_id,
      'kyc_reviewed'::notification_type,
      'KYC rejected',
      COALESCE('Your submission was rejected. ' || NEW.admin_note, 'Your submission was rejected. Please submit again with clear, valid documents.'),
      'kyc_submissions',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_on_kyc_review ON kyc_submissions;
CREATE TRIGGER trg_on_kyc_review
  AFTER UPDATE OF status ON kyc_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.on_kyc_review();

COMMIT;
