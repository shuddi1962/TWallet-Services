import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        },
      },
    },
  );
}

export async function getOrders() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };

  const { data, error } = await supabase
    .from("card_orders")
    .select("id, order_number, status, amount_usdc, network, token, tx_hash, created_at, paid_at, product_id, card_products(name, type)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}

export async function getOrder(orderId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };

  const { data, error } = await supabase
    .from("card_orders")
    .select("*, card_products(*), payment_transactions(*), shipping_addresses(*)")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}