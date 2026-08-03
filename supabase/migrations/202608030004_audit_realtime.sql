-- Publish audit_logs over Realtime so the admin Audit Logs panel stays live.
-- (RLS SELECT on audit_logs already requires current_user_is_admin(), which the
--  signed-in admin's JWT satisfies, so Realtime can deliver rows to the panel.)

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication p
    JOIN pg_publication_tables pt ON pt.pubname = p.pubname
    WHERE p.pubname = 'supabase_realtime'
      AND pt.schemaname = 'public'
      AND pt.tablename = 'audit_logs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;
  END IF;
END $$;