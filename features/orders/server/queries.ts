import { createServerSupabaseClient } from "@/lib";

export async function getOrders() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated", data: null };

    const { data, error } = await supabase
      .from("card_orders")
      .select("id, order_number, status, amount_usdc, network, token, tx_hash, created_at, paid_at, product_id, card_products(name,type)")
      .order("created_at", { ascending: false });

    if (error) return { error: error.message, data: null };
    return { data, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to fetch orders";
    return { error: msg, data: null };
  }
}

export async function getOrder(orderId: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated", data: null };

    const { data, error } = await supabase
      .from("card_orders")
      .select("*, card_products(*), payment_transactions(*), shipping_addresses(*)")
      .eq("id", orderId)
      .single();

    if (error) return { error: error.message, data: null };
    if (!data) return { error: "Order not found", data: null };
    return { data, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to fetch order";
    return { error: msg, data: null };
  }
}
