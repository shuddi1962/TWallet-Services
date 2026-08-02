-- Real on-chain card funding: each funding attempt is verified on-chain by the
-- verify-card-funding edge function before the card balance is credited.

BEGIN;

CREATE TABLE IF NOT EXISTS card_funding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES issued_cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount_usdc NUMERIC(20, 2) NOT NULL CHECK (amount_usdc > 0),
  network_id TEXT NOT NULL REFERENCES supported_networks(id),
  token_id UUID REFERENCES supported_tokens(id),
  receiving_wallet_id UUID REFERENCES supported_wallet_addresses(id),
  tx_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verifying', 'verified', 'failed')),
  from_address TEXT,
  to_address TEXT,
  block_number BIGINT,
  confirmations INT NOT NULL DEFAULT 0,
  credited BOOLEAN NOT NULL DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_card_funding_tx_hash ON card_funding (tx_hash) WHERE tx_hash IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_card_funding_card ON card_funding (card_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_card_funding_user ON card_funding (user_id, created_at DESC);

ALTER TABLE card_funding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own card funding"
  ON card_funding FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR public.current_user_is_admin());

CREATE POLICY "Users insert own card funding"
  ON card_funding FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users update own card funding"
  ON card_funding FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Admins manage card funding"
  ON card_funding FOR ALL TO authenticated
  USING (public.current_user_is_admin())
  WITH CHECK (public.current_user_is_admin());

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE card_funding;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

COMMIT;
