-- =============================================================================
-- Migration: 202608020010_ticket_reply_realtime.sql
-- Purpose: Notify every admin in real-time when a customer replies to a ticket,
--          and re-open the ticket (status -> open) on a customer reply.
-- =============================================================================

BEGIN;

-- Notify admins when a customer replies to a support ticket.
CREATE OR REPLACE FUNCTION public.notify_admins_of_customer_reply()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ticket_number TEXT;
  v_subject TEXT;
BEGIN
  IF NEW.author <> 'customer' OR NEW.internal THEN
    RETURN NEW;
  END IF;

  SELECT ticket_number, subject INTO v_ticket_number, v_subject
  FROM support_tickets WHERE id = NEW.ticket_id;

  INSERT INTO admin_notifications (admin_id, type, title, message, related_type, related_id)
  SELECT
    a.id,
    'support_reply'::notification_type,
    'Customer reply on ticket ' || COALESCE(v_ticket_number, ''),
    COALESCE('Subject: ' || v_subject, NULL),
    'ticket',
    NEW.ticket_id
  FROM admins a;

  UPDATE support_tickets
  SET status = 'open', updated_at = now()
  WHERE id = NEW.ticket_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_admins_of_customer_reply ON ticket_messages;
CREATE TRIGGER trg_notify_admins_of_customer_reply
  AFTER INSERT ON ticket_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admins_of_customer_reply();

COMMIT;