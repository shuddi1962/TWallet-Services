-- Live payment transactions for the Transactions page:
--  1. 'confirming' state while on-chain verification is in progress
--  2. exactly one payment transaction per order (upsert key for resubmission)
--  3. error_message column for failed verification diagnostics
--  4. RLS: users may update their own pending payment record only (metadata
--     resubmission); status/amount transitions are edge-function only.

BEGIN;

ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'confirming';

ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS error_message TEXT;

DROP INDEX IF EXISTS idx_payment_transactions_order_id;
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions (order_id);

CREATE POLICY "Users update own pending payment metadata"
  ON payment_transactions FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND status = 'pending'
    AND amount = (SELECT co.amount_usdc FROM card_orders co WHERE co.id = order_id)
    AND user_id = (SELECT co.user_id FROM card_orders co WHERE co.id = order_id)
  );

COMMIT;
