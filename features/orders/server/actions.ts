"use server";

import { createServerSupabaseClient } from "@/lib";
import { revalidatePath } from "next/cache";

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TW-${timestamp}-${random}`;
}

export async function createOrder(_prev: unknown, formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const network = String(formData.get("network") ?? "");
  const token = String(formData.get("token") ?? "");

  if (!productId) return { error: "Product is required" };
  if (!network) return { error: "Network is required" };
  if (!token) return { error: "Token is required" };

  const supabase = await createServerSupabaseClient() as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: product, error: productError } = await supabase
    .from("card_products")
    .select("id, price_usdc, name")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    return { error: "Product not found" };
  }

  const orderNumber = generateOrderNumber();

  const { data: order, error: orderError } = await supabase
    .from("card_orders")
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      product_id: productId,
      status: "pending",
      amount_usdc: product.price_usdc,
      network,
      token,
    })
    .select("id, order_number, amount_usdc")
    .single();

  if (orderError) return { error: orderError.message };

  revalidatePath("/dashboard/orders");
  return {
    success: true,
    order: order,
  };
}

export async function getOrders() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };

  const { data, error } = await supabase
    .from("card_orders")
    .select(
      "id, order_number, status, amount_usdc, network, token, tx_hash, created_at, paid_at, product_id, card_products(name, type)",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}

export async function getOrder(orderId: string) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };

  const { data, error } = await supabase
    .from("card_orders")
    .select(
      "*, card_products(*), payment_transactions(*), shipping_addresses(*)",
    )
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}
