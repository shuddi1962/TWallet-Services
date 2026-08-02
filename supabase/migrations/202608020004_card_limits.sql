BEGIN;

-- Spending limit: expose the existing daily_limit_usdc through a user toggle.
-- daily_limit_usdc already exists (default 2500); this adds the on/off switch.

ALTER TABLE issued_cards
  ADD COLUMN IF NOT EXISTS spend_limit_enabled BOOLEAN NOT NULL DEFAULT true;

COMMIT;
