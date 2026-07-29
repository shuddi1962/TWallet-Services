BEGIN;

ALTER TABLE issued_cards
  ADD COLUMN IF NOT EXISTS pan_full TEXT,
  ADD COLUMN IF NOT EXISTS pan_formatted TEXT;

-- Backfill placeholders for existing rows
UPDATE issued_cards
SET
  pan_full = COALESCE(pan_full, '4532' || lpad((floor(random()*1e8))::bigint::text, 8, '0') || pan_last4),
  pan_formatted = COALESCE(
    pan_formatted,
    substring(COALESCE(pan_full, '4532' || lpad((floor(random()*1e8))::bigint::text, 8, '0') || pan_last4) from 1 for 4)
      || ' ' || substring(COALESCE(pan_full, pan_last4) from 5 for 4)
      || ' ' || substring(COALESCE(pan_full, pan_last4) from 9 for 4)
      || ' ' || pan_last4
  )
WHERE pan_full IS NULL OR pan_formatted IS NULL;

COMMIT;
