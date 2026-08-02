-- =============================================================================
-- Migration: 202608020008_admin_ticket_notifications.sql
-- Purpose: Notify every admin in real-time when a support ticket is created,
--          and publish admin_notifications + ticket_messages for realtime sync.
-- =============================================================================

BEGIN;

-- Realtime publications so the admin Notifications page and user Support page
-- live-update without a page reload.
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE admin_notifications;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE ticket_messages;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- Notify every admin row when a customer creates a support ticket.
-- Runs as table owner (SECURITY DEFINER) so INSERT is allowed on
-- admin_notifications regardless of the calling role.
CREATE OR REPLACE FUNCTION public.notify_admins_of_new_ticket()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO admin_notifications (admin_id, type, title, message, related_type, related_id)
  SELECT
    a.id,
    'ticket_created'::notification_type,
    'New support ticket ' || NEW.ticket_number,
    COALESCE('Subject: ' || NEW.subject, NULL),
    'ticket',
    NEW.id
  FROM admins a;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_admins_of_new_ticket ON support_tickets;
CREATE TRIGGER trg_notify_admins_of_new_ticket
  AFTER INSERT ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admins_of_new_ticket();

COMMIT;