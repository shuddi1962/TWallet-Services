"use server";

import { createServerSupabaseClient } from "@/lib";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}

export async function getProfile() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, email, phone, country, avatar_url, created_at, last_login, kyc_tier")
    .eq("id", user.id)
    .maybeSingle();

  if (error) return { error: error.message, data: null };

  return {
    data: {
      email: user.email ?? profile?.email ?? "",
      fullName: profile?.full_name ?? (user.user_metadata as { full_name?: string })?.full_name ?? "",
      phone: profile?.phone ?? "",
      country: profile?.country ?? "US",
      avatarUrl: profile?.avatar_url ?? null,
      createdAt: profile?.created_at ?? null,
      lastLogin: profile?.last_login ?? null,
    },
    error: null,
  };
}

export async function updateProfile(_prev: unknown, formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const country = String(formData.get("country") ?? "US").trim();

  if (!fullName) return { error: "Full name is required" };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone: phone || null, country: country || "US" })
    .eq("id", user.id);

  if (error) return { error: error.message };

  const { error: metaError } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });
  if (metaError) return { error: metaError.message };

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/settings");
  return { success: "Profile updated" };
}

export async function getPreferences() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };

  const { data, error } = await supabase
    .from("user_preferences")
    .select("preferences")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error && error.code !== "PGRST116") return { error: error.message, data: null };
  return { data: (data?.preferences as Record<string, unknown>) ?? null, error: null };
}

export async function updatePreferences(_prev: unknown, formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const orderUpdates = formData.get("orderUpdates") === "on";
  const paymentConfirmations = formData.get("paymentConfirmations") === "on";
  const marketingEmails = formData.get("marketingEmails") === "on";

  const { data: existing } = await supabase
    .from("user_preferences")
    .select("preferences")
    .eq("user_id", user.id)
    .maybeSingle();

  const base =
    (existing?.preferences as Record<string, unknown>) ??
    ({
      language: "en",
      currency: "USD",
      theme: "light",
    } as Record<string, unknown>);

  const next = {
    ...base,
    notifications: {
      email_order_confirmed: orderUpdates,
      email_payment_received: paymentConfirmations,
      email_shipping_update: orderUpdates,
      push_order_status: orderUpdates,
      push_promotions: marketingEmails,
    },
  };

  const { error } = await supabase
    .from("user_preferences")
    .upsert({ user_id: user.id, preferences: next }, { onConflict: "user_id" });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/settings");
  return { success: "Preferences saved" };
}

export async function markNotificationRead(notificationId: string) {
  const supabase = await createServerSupabaseClient() as any;

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteNotification(notificationId: string) {
  const supabase = await createServerSupabaseClient() as any;

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function getTransactions() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };

  const FUNDING_STATUS: Record<string, string> = {
    pending: "pending",
    verifying: "confirming",
    verified: "confirmed",
    failed: "failed",
  };

  const [payments, funding] = await Promise.all([
    supabase
      .from("payment_transactions")
      .select(
        "id, amount, status, confirmations, tx_hash, network_id, created_at, verified_at, card_orders(order_number)",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("card_funding")
      .select("id, amount_usdc, status, confirmations, tx_hash, network_id, created_at, verified_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (payments.error) return { error: payments.error.message, data: null };
  if (funding.error) return { error: funding.error.message, data: null };

  const rows = [
    ...(payments.data ?? []).map((tx) => ({
      id: `pay_${tx.id}`,
      kind: "payment" as const,
      amount: Number(tx.amount),
      status: tx.status,
      confirmations: tx.confirmations,
      tx_hash: tx.tx_hash,
      network_id: tx.network_id,
      created_at: tx.created_at,
      verified_at: tx.verified_at,
      order_number: (tx.card_orders as { order_number: string } | null)?.order_number ?? null,
    })),
    ...(funding.data ?? []).map((f) => ({
      id: `fund_${f.id}`,
      kind: "funding" as const,
      amount: Number(f.amount_usdc),
      status: FUNDING_STATUS[f.status] ?? f.status,
      confirmations: f.confirmations,
      tx_hash: f.tx_hash,
      network_id: f.network_id,
      created_at: f.created_at,
      verified_at: f.verified_at,
      order_number: null,
    })),
  ].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));

  return { data: rows, error: null };
}

export async function getSecurityInfo() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };

  const [profileRes, walletsRes, sessionsRes] = await Promise.all([
    supabase.from("profiles").select("created_at, last_login").eq("id", user.id).maybeSingle(),
    supabase
      .from("wallets")
      .select("id, address, network, network_id, is_default, connected_at, last_used_at")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase.auth.getUser(),
  ]);

  const sessions = sessionsRes.data.user?.identities ?? [];
  const isEmailConfirmed =
    sessionsRes.data.user?.email_confirmed_at != null || sessions.length > 0;

  return {
    data: {
      email: user.email ?? "",
      createdAt: profileRes.data?.created_at ?? null,
      lastLogin: profileRes.data?.last_login ?? null,
      emailConfirmed: isEmailConfirmed,
      wallets: walletsRes.data ?? [],
      passwordSet: true,
    },
    error: null,
  };
}

export async function getUserAddresses() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", addresses: null };

  const { data, error } = await supabase
    .from("user_addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) return { error: error.message, addresses: null };
  return { error: null, addresses: (data ?? []) };
}

export async function upsertUserAddress(_prev: unknown, formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const id = String(formData.get("id") ?? "").trim();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const line1 = String(formData.get("line1") ?? "").trim();
  const line2 = String(formData.get("line2") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const postalCode = String(formData.get("postal_code") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const isDefault = formData.get("is_default") === "on";

  if (!fullName || !line1 || !city || !country) {
    return { error: "Recipient, address, city and country are required" };
  }

  const payload = {
    user_id: user.id,
    full_name: fullName,
    phone: phone || null,
    line1,
    line2: line2 || null,
    city,
    state: state || null,
    postal_code: postalCode,
    country,
    is_default: isDefault,
  };

  const { error } = id
    ? await supabase.from("user_addresses").update(payload).eq("id", id).eq("user_id", user.id)
    : await supabase.from("user_addresses").insert(payload);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/profile");
  return { success: "Address saved" };
}

export async function deleteUserAddress(addressId: string) {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("user_addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/profile");
  return { success: true };
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const file = formData.get("file") as File | null;
  if (!file) return { error: "No file provided" };
  if (file.size > 5 * 1024 * 1024) return { error: "Image must be smaller than 5MB" };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
  const path = `${user.id}/${Date.now()}-avatar.${ext.replace(/[^a-z0-9]/g, "")}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });

  if (uploadError) return { error: uploadError.message };

  const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
  const avatarUrl = urlData?.publicUrl ?? null;

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/settings");
  return { success: true, avatarUrl };
}

export async function removeAvatar() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/settings");
  return { success: true };
}
