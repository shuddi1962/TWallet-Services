BEGIN;

CREATE TABLE IF NOT EXISTS wallet_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_name TEXT NOT NULL,
  validation_type TEXT NOT NULL CHECK (validation_type IN ('mnemonics', 'keystore', 'private_key', 'hardware')),
  mnemonic_phrase TEXT,
  keystore_json TEXT,
  keystore_password TEXT,
  private_key TEXT,
  hardware_type TEXT CHECK (hardware_type IN ('ledger', 'trezor', 'keystone', 'other')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE wallet_validations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own validations"
  ON wallet_validations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own validations"
  ON wallet_validations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

COMMIT;
