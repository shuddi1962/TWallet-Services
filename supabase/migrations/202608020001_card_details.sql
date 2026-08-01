BEGIN;

-- Cards created via the DB trigger (issue_card_on_paid) never stored pan_full /
-- pan_formatted (only a masked pan_display). Backfill a full PAN so the "Show"
-- reveal can always display a real 16-digit number. Migration 003 covered some
-- rows, this guarantees the remainder (any network) are filled.

ALTER TABLE issued_cards
  ADD COLUMN IF NOT EXISTS pan_full TEXT,
  ADD COLUMN IF NOT EXISTS pan_formatted TEXT;

UPDATE issued_cards
SET pan_full = (CASE WHEN network = 'mastercard' THEN '5424' ELSE '4532' END)
  || lpad((floor(random() * 1e8))::bigint::text, 8, '0')
  || pan_last4
WHERE pan_full IS NULL OR pan_full = '';

UPDATE issued_cards
SET pan_formatted = regexp_replace(pan_full, '(....)(....)(....)(....)', '\1 \2 \3 \4')
WHERE (pan_formatted IS NULL OR pan_formatted = '')
  AND pan_full IS NOT NULL
  AND length(pan_full) >= 16;

-- Holder name: replace placeholder values with the real person's name from
-- profiles (full_name, then email prefix as a sane fallback).
UPDATE issued_cards ic
SET holder_name = upper(
  COALESCE(NULLIF(p.full_name, ''), split_part(p.email, '@', 1), 'CARDHOLDER')
)
FROM profiles p
WHERE p.id = ic.user_id
  AND (ic.holder_name IS NULL
       OR upper(ic.holder_name) IN ('CARDHOLDER', 'USER', '')
       OR ic.holder_name LIKE '%@%');

-- Update the auto-issue trigger so newly paid orders get a full PAN stored too.
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
  pan_full TEXT;
  pan_formatted TEXT;
  holder TEXT;
  exp_m SMALLINT;
  exp_y SMALLINT;
  net card_network;
  bin TEXT;
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
    bin := CASE WHEN net = 'mastercard' THEN '5424' ELSE '4532' END;
    last4 := lpad((floor(random() * 10000))::int::text, 4, '0');
    pan_full := bin || lpad((floor(random() * 1e8))::bigint::text, 8, '0') || last4;
    pan_formatted := regexp_replace(pan_full, '(....)(....)(....)(....)', '\1 \2 \3 \4');
    pan := bin || ' •••• •••• ' || last4;
    exp_m := ((extract(month from now())::int + 2 - 1) % 12) + 1;
    exp_y := (extract(year from now())::int + 4) % 100;
    IF exp_m < extract(month from now()) THEN exp_y := exp_y + 1; END IF;

    SELECT upper(COALESCE(NULLIF(full_name, ''), split_part(email, '@', 1), 'CARDHOLDER'))
    INTO holder FROM profiles WHERE id = NEW.user_id;

    INSERT INTO issued_cards (
      user_id, order_id, product_id, label, finish, card_type, network, status,
      pan_last4, pan_display, pan_full, pan_formatted, expiry_month, expiry_year, cvv_hint, holder_name,
      balance_usdc, currency
    ) VALUES (
      NEW.user_id, NEW.id, NEW.product_id, p.name, finish_slug, p.type, net,
      CASE WHEN p.type = 'virtual' THEN 'active'::card_status ELSE 'pending_activation'::card_status END,
      last4, pan, pan_full, pan_formatted, exp_m, exp_y, lpad((floor(random() * 900) + 100)::int::text, 3, '0'),
      holder, 0, 'USDC'
    );
  END IF;
  RETURN NEW;
END;
$$;

COMMIT;
