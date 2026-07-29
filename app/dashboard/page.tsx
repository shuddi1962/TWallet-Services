/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib";
import { createClient } from "@supabase/supabase-js";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import type { DashboardData } from "@/lib/types";

export const dynamic = "force-dynamic";

async function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

export default async function DashboardPage() {
  const authSb = await createServerSupabaseClient();
  const { data: { user } } = await authSb.auth.getUser();
  if (!user) redirect("/auth/login?redirect=/dashboard");

  const adminDb: any = await sb();

  const [
    activeCardsRes,
    totalOrdersRes,
    recentOrdersRes,
    walletsRes,
    transactionsRes,
    notificationsRes,
  ]: any = await Promise.all([
    adminDb
      .from("card_orders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .in("status", ["paid", "processing", "shipped", "delivered"]),
    adminDb
      .from("card_orders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    adminDb
      .from("card_orders")
      .select("id, order_number, status, amount_usdc, network, token, created_at, card_products(name, type, slug)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    adminDb
      .from("wallets")
      .select("id, address, network, label, is_default, connected_at")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    adminDb
      .from("payment_transactions")
      .select("id, amount, status, tx_hash, network_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
    adminDb
      .from("notifications")
      .select("id, type, title, message, read, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const confirmedTx = (transactionsRes?.data ?? []).filter(
    (t: any) => t.status === "confirmed",
  );
  const totalSpent = confirmedTx.reduce(
    (sum: number, t: any) => sum + Number(t.amount ?? 0),
    0,
  );

  const dashboardData: DashboardData = {
    userName:
      (user.user_metadata as any)?.full_name ??
      user.email?.split("@")[0] ??
      "User",
    userEmail: user.email ?? "",
    stats: {
      activeCards: activeCardsRes?.count ?? 0,
      totalOrders: totalOrdersRes?.count ?? 0,
      walletCount: (walletsRes?.data ?? []).length,
      totalSpent,
    },
    recentOrders: recentOrdersRes?.data ?? [],
    wallets: walletsRes?.data ?? [],
    recentTransactions: transactionsRes?.data ?? [],
    notifications: notificationsRes?.data ?? [],
  };

  return <DashboardContent data={dashboardData} />;
}