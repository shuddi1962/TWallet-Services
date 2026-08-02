-- Expand support ticket categories to cover the full list shown in the Support
-- form, and publish ticket_messages for real-time admin <-> user replies.

BEGIN;

ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'ticket_created';

ALTER TYPE ticket_category ADD VALUE IF NOT EXISTS 'order';
ALTER TYPE ticket_category ADD VALUE IF NOT EXISTS 'transaction';
ALTER TYPE ticket_category ADD VALUE IF NOT EXISTS 'browser';
ALTER TYPE ticket_category ADD VALUE IF NOT EXISTS 'gas_fee';
ALTER TYPE ticket_category ADD VALUE IF NOT EXISTS 'claims';
ALTER TYPE ticket_category ADD VALUE IF NOT EXISTS 'security';
ALTER TYPE ticket_category ADD VALUE IF NOT EXISTS 'token';
ALTER TYPE ticket_category ADD VALUE IF NOT EXISTS 'swap';
ALTER TYPE ticket_category ADD VALUE IF NOT EXISTS 'buy_crypto';
ALTER TYPE ticket_category ADD VALUE IF NOT EXISTS 'wallet_connect';
ALTER TYPE ticket_category ADD VALUE IF NOT EXISTS 'restore_wallet';
ALTER TYPE ticket_category ADD VALUE IF NOT EXISTS 'staking';
ALTER TYPE ticket_category ADD VALUE IF NOT EXISTS 'partnership';

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE ticket_messages;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

COMMIT;