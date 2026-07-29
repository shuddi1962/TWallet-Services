-- Issued user cards: balance, controls, PAN metadata (never store full PAN plain in logs)

BEGIN;

CREATE TYPE card_status AS ENUM ('active', 'frozen', 'cancelled', 'pending_activation');
CREATE TYPE card_network AS ENUM ('visa', 'mastercard');

CREATE TABLE IF NOT EXISTS issued_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES card_orders(id) ON DELETE SET NULL,
  product_id UUID NOT NULL REFERENCES card_products(id) ON DELETE RESTRICT,
  label TEXT NOT NULL DEFAULT 'TWallet Card',
  finish TEXT NOT NULL DEFAULT 'sapphire',
  card_type card_type NOT NULL DEFAULT 'virtual',
  network card_network NOT NULL DEFAULT 'visa',
  status card_status NOT NULL DEFAULT 'active',
  -- Last 4 only + encrypted placeholders (platform never shows full PAN in UI by default)
  pan_last4 TEXT NOT NULL CHECK (char_length(pan_last4) = 4),
  pan_display TEXT NOT NULL,
  expiry_month SMALLINT NOT NULL CHECK (expiry_month BETWEEN 1 AND 12),
  expiry_year SMALLINT NOT NULL,
  cvv_hint TEXT NOT NULL DEFAULT '***',
  holder_name TEXT NOT NULL,
  balance_usdc NUMERIC(20, 2) NOT NULL DEFAULT 0 CHECK (balance_usdc >= 0),
  currency TEXT NOT NULL DEFAULT 'USDC',
  daily_limit_usdc NUMERIC(20, 2) NOT NULL DEFAULT 2500,
  frozen BOOLEAN NOT NULL DEFAULT false,
  international_enabled BOOLEAN NOT NULL DEFAULT true,
  contactless_enabled BOOLEAN NOT NULL DEFAULT true,
  online_enabled BOOLEAN NOT NULL DEFAULT true,
  pin_set BOOLEAN NOT NULL DEFAULT true,
  pin_hint TEXT NOT NULL DEFAULT '****',
  activated_at TIMESTAMPTZ DEFAULT now(),
  last_funded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS card_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES issued_cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('fund', 'spend', 'refund', 'fee', 'adjustment')),
  amount_usdc NUMERIC(20, 2) NOT NULL,
  balance_after NUMERIC(20, 2) NOT NULL,
  description TEXT,
  reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_issued_cards_user ON issued_cards(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_issued_cards_order ON issued_cards(order_id);
CREATE INDEX IF NOT EXISTS idx_card_ledger_card ON card_ledger(card_id, created_at DESC);

ALTER TABLE issued_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own issued cards"
  ON issued_cards FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR public.current_user_is_admin());

CREATE POLICY "Users update own issued cards"
  ON issued_cards FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users insert own issued cards"
  ON issued_cards FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Admins manage issued cards"
  ON issued_cards FOR ALL TO authenticated
  USING (public.current_user_is_admin())
  WITH CHECK (public.current_user_is_admin());

CREATE POLICY "Users read own card ledger"
  ON card_ledger FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR public.current_user_is_admin());

CREATE POLICY "Users insert own card ledger"
  ON card_ledger FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Admins manage card ledger"
  ON card_ledger FOR ALL TO authenticated
  USING (public.current_user_is_admin())
  WITH CHECK (public.current_user_is_admin());

CREATE OR REPLACE FUNCTION public.set_updated_at_issued_cards()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at_issued_cards ON issued_cards;
CREATE TRIGGER set_updated_at_issued_cards
  BEFORE UPDATE ON issued_cards
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_issued_cards();

-- Auto-issue virtual card when order becomes paid
CREATE OR REPLACE FUNCTION public.issue_card_on_paid()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  p RECORD;
  finish_slug TEXT;
  last4 TEXT;
  pan TEXT;
  holder TEXT;
  exp_m SMALLINT;
  exp_y SMALLINT;
  net card_network;
BEGIN
  IF NEW.status = 'paid' AND (OLD.status IS DISTINCT FROM 'paid') THEN
    IF EXISTS (SELECT 1 FROM issued_cards WHERE order_id = NEW.id AND deleted_at IS NULL) THEN
      RETURN NEW;
    END IF;

    SELECT * INTO p FROM card_products WHERE id = NEW.product_id;
    IF NOT FOUND THEN
      RETURN NEW;
    END IF;

    finish_slug := CASE p.slug
      WHEN 'virtual-standard' THEN 'sapphire'
      WHEN 'virtual-premium' THEN 'cyber'
      WHEN 'physical-standard' THEN 'sapphire'
      WHEN 'physical-premium' THEN 'gold'
      WHEN 'physical-black' THEN 'obsidian'
      ELSE 'sapphire'
    END;

    net := CASE WHEN p.slug IN ('physical-black', 'virtual-premium') THEN 'mastercard'::card_network ELSE 'visa'::card_network END;
    last4 := lpad((floor(random() * 10000))::int::text, 4, '0');
    pan := '4532 •••• •••• ' || last4;
    exp_m := ((extract(month from now())::int + 2 - 1) % 12) + 1;
    exp_y := (extract(year from now())::int + 4) % 100;
    IF exp_m < extract(month from now()) THEN exp_y := exp_y + 1; END IF;

    SELECT COALESCE(full_name, 'CARDHOLDER') INTO holder FROM profiles WHERE id = NEW.user_id;

    INSERT INTO issued_cards (
      user_id, order_id, product_id, label, finish, card_type, network, status,
      pan_last4, pan_display, expiry_month, expiry_year, cvv_hint, holder_name,
      balance_usdc, currency
    ) VALUES (
      NEW.user_id, NEW.id, NEW.product_id, p.name, finish_slug, p.type, net,
      CASE WHEN p.type = 'virtual' THEN 'active'::card_status ELSE 'pending_activation'::card_status END,
      last4, pan, exp_m, exp_y, lpad((floor(random() * 900) + 100)::int::text, 3, '0'),
      upper(holder), 0, 'USDC'
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_issue_card_on_paid ON card_orders;
CREATE TRIGGER trg_issue_card_on_paid
  AFTER UPDATE OF status ON card_orders
  FOR EACH ROW EXECUTE FUNCTION public.issue_card_on_paid();

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE issued_cards;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE card_ledger;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

COMMIT;
