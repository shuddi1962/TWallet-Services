"use server";

import { createServerSupabaseClient } from "@/lib";

export async function getPaymentDetails(orderId: string) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };

  const { data: order, error: orderError } = await supabase
    .from("card_orders")
    .select("id, order_number, amount_usdc, status, network, token")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (orderError || !order) {
    return { error: "Order not found", data: null };
  }

  const { data: networks } = await supabase
    .from("supported_networks")
    .select("*")
    .eq("active", true);

  const { data: receivingWallets } = await supabase
    .from("supported_wallet_addresses")
    .select("*")
    .eq("active", true);

  const { data: tokens } = await supabase
    .from("supported_tokens")
    .select("*")
    .eq("active", true);

  const { data: paymentTx } = await supabase
    .from("payment_transactions")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return {
    data: {
      order,
      networks: networks ?? [],
      receivingWallets: receivingWallets ?? [],
      tokens: tokens ?? [],
      paymentTx: paymentTx ?? null,
    },
    error: null,
  };
}

export async function submitPaymentTx(_prev: unknown, formData: FormData) {
  const orderId = String(formData.get("orderId") ?? "");
  const txHash = String(formData.get("txHash") ?? "");
  const fromAddress = String(formData.get("fromAddress") ?? "");

  if (!orderId) return { error: "Order ID is required" };
  if (!txHash) return { error: "Transaction hash is required" };
  if (!fromAddress) return { error: "From address is required" };

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: order } = await supabase
    .from("card_orders")
    .select("id, amount_usdc, network")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (!order) return { error: "Order not found" };

  const { error } = await supabase
    .from("card_orders")
    .update({ tx_hash: txHash } as never)
    .eq("id", orderId);

  if (error) return { error: error.message };

  return { success: true, message: "Payment submitted for verification" };
}
