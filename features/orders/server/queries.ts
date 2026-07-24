import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const sbToken = cookieStore.get("sb-access-token")?.value;
  const sbRefresh = cookieStore.get("sb-refresh-token")?.value;
  if (!sbToken) return {};

  // Try to get a fresh session
  const sessionRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${sbToken}`, apikey: SUPABASE_ANON_KEY },
  });
  if (!sessionRes.ok) return {};
  return { Authorization: `Bearer ${sbToken}`, apikey: SUPABASE_ANON_KEY };
}

async function fetchUser() {
  const cookieStore = await cookies();
  const sbToken = cookieStore.get("sb-access-token")?.value;
  if (!sbToken) return null;
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${sbToken}`, apikey: SUPABASE_ANON_KEY },
  });
  if (!res.ok) return null;
  const { id } = await res.json();
  return id;
}

export async function getOrders() {
  const userId = await fetchUser();
  if (!userId) return { error: "Not authenticated", data: null };
  const headers = { Authorization: `Bearer ${(await cookies()).get("sb-access-token")?.value}`, apikey: SUPABASE_ANON_KEY };
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/card_orders?user_id=eq.${userId}&select=id,order_number,status,amount_usdc,network,token,tx_hash,created_at,paid_at,product_id,card_products(name,type)&order=created_at.desc`,
    { headers },
  );
  if (!res.ok) return { error: res.statusText, data: null };
  const data = await res.json();
  return { data, error: null };
}

export async function getOrder(orderId: string) {
  const userId = await fetchUser();
  if (!userId) return { error: "Not authenticated", data: null };
  const headers = { Authorization: `Bearer ${(await cookies()).get("sb-access-token")?.value}`, apikey: SUPABASE_ANON_KEY };
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/card_orders?id=eq.${orderId}&user_id=eq.${userId}&select=*,card_products(*),payment_transactions(*),shipping_addresses(*)`,
    { headers },
  );
  if (!res.ok) return { error: res.statusText, data: null };
  const [data] = await res.json();
  if (!data) return { error: "Order not found", data: null };
  return { data, error: null };
}