const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getCookies() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require("next/headers");
  return mod.cookies();
}

async function fetchUserId(): Promise<string | null> {
  try {
    const cookieStore = await getCookies();
    const sbToken = cookieStore.get("sb-access-token")?.value;
    if (!sbToken) return null;
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${sbToken}`, apikey: SUPABASE_ANON_KEY },
    });
    if (!res.ok) return null;
    const { id } = await res.json();
    return id;
  } catch {
    return null;
  }
}

export async function getOrders() {
  const userId = await fetchUserId();
  if (!userId) return { error: "Not authenticated", data: null };
  try {
    const cookieStore = await getCookies();
    const token = cookieStore.get("sb-access-token")?.value;
    const headers = { Authorization: `Bearer ${token}`, apikey: SUPABASE_ANON_KEY };
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/card_orders?user_id=eq.${userId}&select=id,order_number,status,amount_usdc,network,token,tx_hash,created_at,paid_at,product_id,card_products(name,type)&order=created_at.desc`,
      { headers },
    );
    if (!res.ok) return { error: res.statusText, data: null };
    const data = await res.json();
    return { data, error: null };
  } catch {
    return { error: "Failed to fetch orders", data: null };
  }
}

export async function getOrder(orderId: string) {
  const userId = await fetchUserId();
  if (!userId) return { error: "Not authenticated", data: null };
  try {
    const cookieStore = await getCookies();
    const token = cookieStore.get("sb-access-token")?.value;
    const headers = { Authorization: `Bearer ${token}`, apikey: SUPABASE_ANON_KEY };
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/card_orders?id=eq.${orderId}&user_id=eq.${userId}&select=*,card_products(*),payment_transactions(*),shipping_addresses(*)`,
      { headers },
    );
    if (!res.ok) return { error: res.statusText, data: null };
    const [data] = await res.json();
    if (!data) return { error: "Order not found", data: null };
    return { data, error: null };
  } catch {
    return { error: "Failed to fetch order", data: null };
  }
}