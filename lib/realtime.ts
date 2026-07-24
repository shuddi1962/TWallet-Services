import { createClient } from "@/lib/supabase/client";

type ChannelCallback = (payload: Record<string, unknown>) => void;

export function subscribeOrders(userId: string, callback: ChannelCallback) {
  const supabase = createClient();
  return supabase
    .channel("orders")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "card_orders", filter: `user_id=eq.${userId}` },
      (payload) => callback(payload.new),
    )
    .subscribe();
}

export function subscribeNotifications(userId: string, callback: ChannelCallback) {
  const supabase = createClient();
  return supabase
    .channel("notifications")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
      (payload) => callback(payload.new),
    )
    .subscribe();
}

export function subscribePayments(orderId: string, callback: ChannelCallback) {
  const supabase = createClient();
  return supabase
    .channel("payments")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "payment_transactions", filter: `order_id=eq.${orderId}` },
      (payload) => callback(payload.new),
    )
    .subscribe();
}

export function subscribeWallets(userId: string, callback: ChannelCallback) {
  const supabase = createClient();
  return supabase
    .channel("wallets")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "wallets", filter: `user_id=eq.${userId}` },
      (payload) => callback(payload.new),
    )
    .subscribe();
}

export function subscribeAdminOrders(callback: ChannelCallback) {
  const supabase = createClient();
  return supabase
    .channel("admin-orders")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "card_orders" },
      (payload) => callback(payload.new),
    )
    .subscribe();
}

export function subscribeAdminPayments(callback: ChannelCallback) {
  const supabase = createClient();
  return supabase
    .channel("admin-payments")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "payment_transactions" },
      (payload) => callback(payload.new),
    )
    .subscribe();
}

export function subscribeAdminUsers(callback: ChannelCallback) {
  const supabase = createClient();
  return supabase
    .channel("admin-users")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "profiles" },
      (payload) => callback(payload.new),
    )
    .subscribe();
}
