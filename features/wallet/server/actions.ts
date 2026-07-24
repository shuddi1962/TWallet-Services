"use server";

import { createServerSupabaseClient } from "@/lib";
import { addressSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function saveWallet(_prev: unknown, formData: FormData) {
  const address = addressSchema.safeParse(formData.get("address"));
  const label = String(formData.get("label") ?? "").trim();
  const chain = String(formData.get("chain") ?? "").trim();

  if (!address.success) return { error: "Invalid wallet address" };
  if (!label) return { error: "Label is required" };
  if (!chain) return { error: "Chain is required" };

  const supabase = await createServerSupabaseClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("wallets").insert({
    user_id: user.id,
    address: address.data,
    label,
    chain,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/wallet");
  return { success: true };
}

export async function removeWallet(walletId: string) {
  const supabase = await createServerSupabaseClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("wallets")
    .delete()
    .eq("id", walletId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/wallet");
  return { success: true };
}

export async function getWallets() {
  const supabase = await createServerSupabaseClient() as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };

  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}
