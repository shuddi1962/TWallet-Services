"use server";

import { createServerSupabaseClient } from "@/lib";
import { addressSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const NETWORK_BY_CHAIN: Record<number, string> = {
  1: "ethereum",
  11155111: "sepolia",
  137: "polygon",
  8453: "base",
  42161: "arbitrum",
  10: "optimism",
};

export async function saveWallet(_prev: unknown, formData: FormData) {
  const address = addressSchema.safeParse(formData.get("address"));
  const label = String(formData.get("label") ?? "").trim() || "Wallet";
  const networkIdRaw = formData.get("networkId") ?? formData.get("chainId") ?? "1";
  const networkId = Number(networkIdRaw) || 1;
  const network =
    String(formData.get("network") ?? "").trim() ||
    NETWORK_BY_CHAIN[networkId] ||
    "ethereum";
  const signature = String(formData.get("signature") ?? "wc-connect");
  const message = String(formData.get("message") ?? `Connect ${address.success ? address.data : ""}`);

  if (!address.success) return { error: "Invalid wallet address" };

  const supabase = (await createServerSupabaseClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const rl = await checkRateLimit(user.id, "saveWallet", RATE_LIMITS.saveWallet);
  if (!rl.allowed) return { error: `Too many requests. Retry in ${rl.retryAfter}s` };

  const { data: existing } = await supabase
    .from("wallets")
    .select("id")
    .eq("user_id", user.id)
    .eq("address", address.data)
    .eq("network_id", networkId)
    .is("deleted_at", null)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("wallets")
      .update({ last_used_at: new Date().toISOString(), label, network })
      .eq("id", existing.id);
    revalidatePath("/dashboard/wallet");
    return { success: true, id: existing.id };
  }

  const { count } = await supabase
    .from("wallets")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .is("deleted_at", null);

  if ((count ?? 0) >= 5) return { error: "Maximum of 5 wallets per account" };

  const { data, error } = await supabase
    .from("wallets")
    .insert({
      user_id: user.id,
      address: address.data,
      label,
      network,
      network_id: networkId,
      signature,
      message,
      is_default: (count ?? 0) === 0,
      connected_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/dashboard/wallet");
  return { success: true, id: data?.id };
}

export async function removeWallet(walletId: string) {
  const supabase = (await createServerSupabaseClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("wallets")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", walletId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/wallet");
  return { success: true };
}

export async function getWallets() {
  const supabase = (await createServerSupabaseClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };

  const { data, error } = await supabase
    .from("wallets")
    .select("id, address, network, network_id, label, is_default, connected_at, last_used_at, created_at")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}
