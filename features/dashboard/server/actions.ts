"use server";

import { createServerSupabaseClient } from "@/lib";

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

export async function markNotificationRead(notificationId: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("notifications")
    .update({ read: true } as never)
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
