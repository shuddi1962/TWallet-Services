-- =============================================================================
-- Migration: 202608020014_fix_payment_confirmed_trigger.sql
-- Purpose:
--   1. Add missing card_orders columns referenced by edge functions
--      (from_address, to_address, processing_at, shipped_at, delivered_at).
--   2. Fix the payment_confirmed() trigger: it INSERTed a non-existent
--      `confirmed_at` column into payment_transactions (the real column is
--      `verified_at`), causing every pending → paid transition to fail and
--      roll back. The same failure broke admin status changes.
-- Dependencies: 202607200005_triggers.sql (original trigger)
-- Verification: update an order to paid and confirm a payment_transactions row
--               is created with verified_at populated
-- Author: TWallet Engineering
-- Date: 2026-08-02
-- =============================================================================

BEGIN;

-- Edge functions write these columns on card_orders; make them exist safely.
ALTER TABLE card_orders
  ADD COLUMN IF NOT EXISTS from_address TEXT,
  ADD COLUMN IF NOT EXISTS to_address TEXT,
  ADD COLUMN IF NOT EXISTS processing_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

-- Rewrite the trigger so pending → paid works again:
--   * verified_at instead of the non-existent confirmed_at
--   * from/to_address read from card_orders columns (now present)
CREATE OR REPLACE FUNCTION payment_confirmed()
RETURNS TRIGGER
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'paid' AND OLD.status = 'pending' THEN
    -- Create payment transaction record
    INSERT INTO payment_transactions (order_id, user_id, amount, network_id, token_id, tx_hash, status, from_address, to_address, verified_at)
    VALUES (NEW.id, NEW.user_id, NEW.amount_usdc, NEW.network, (SELECT id FROM supported_tokens WHERE symbol = NEW.token LIMIT 1), NEW.tx_hash, 'confirmed', NEW.from_address, NEW.to_address, now())
    ON CONFLICT (order_id) DO UPDATE
      SET status = 'confirmed',
          tx_hash = COALESCE(EXCLUDED.tx_hash, payment_transactions.tx_hash),
          verified_at = COALESCE(payment_transactions.verified_at, now());

    -- Update order status
    UPDATE card_orders
    SET status = 'paid',
        paid_at = COALESCE(NEW.paid_at, now()),
        paid_usdc = NEW.amount_usdc,
        tx_hash = NEW.tx_hash
    WHERE id = NEW.id;

    -- Notify user
    PERFORM create_notification(
      NEW.user_id,
      'payment_confirmed',
      'Payment Confirmed',
      'Your payment for order ' || NEW.order_number || ' has been confirmed.',
      'order',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

COMMIT;