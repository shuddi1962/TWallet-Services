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

  const { data, error } = await supabase
    .from("payment_transactions")
    .select(
      "id, amount, status, confirmations, tx_hash, network_id, created_at, verified_at, order_id, card_orders(order_number)",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return { error: error.message, data: null };
  return { data, error: null };
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
