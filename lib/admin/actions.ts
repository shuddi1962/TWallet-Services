"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import type { RecentOrder, RecentPayment, RecentSignup, RecentTicket, AuditEntry, CardProduct, UserProfile } from "./types";

export type ActionResult = { success: true } | { success: false; error: string };

async function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

export async function getAdminStats() {
  const supabase: any = await sb();
  const today = new Date().toISOString().split("T")[0];
  const results: any = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("wallets").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("card_orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("card_orders").select("*", { count: "exact", head: true }).in("status", ["delivered", "completed"]),
    supabase.from("payment_transactions").select("amount").eq("status", "confirmed"),
    supabase.from("support_tickets").select("*", { count: "exact", head: true }).in("status", ["open", "pending"]),
    supabase.from("payment_transactions").select("*", { count: "exact", head: true }).eq("status", "confirmed").gte("created_at", today),
  ]);

  const revenue = results[4]?.data?.reduce?.((sum: number, tx: any) => sum + (tx.amount || 0), 0) ?? 0;
  return {
    totalUsers: results[0]?.count ?? 0,
    activeWallets: results[1]?.count ?? 0,
    pendingOrders: results[2]?.count ?? 0,
    completedOrders: results[3]?.count ?? 0,
    revenue,
    openTickets: results[5]?.count ?? 0,
    todayTransactions: results[6]?.count ?? 0,
  };
}

export async function getRecentOrders(): Promise<RecentOrder[]> {
  const supabase: any = await sb();
  const res: any = await supabase.from("card_orders").select("*, profiles(full_name, email), card_products(name, type)").order("created_at", { ascending: false }).limit(5);
  return res.data ?? [];
}

export async function getRecentPayments(): Promise<RecentPayment[]> {
  const supabase: any = await sb();
  const res: any = await supabase.from("payment_transactions").select("*, supported_networks(name)").order("created_at", { ascending: false }).limit(5);
  return res.data ?? [];
}

export async function getRecentSignups(): Promise<RecentSignup[]> {
  const supabase: any = await sb();
  const res: any = await supabase.from("profiles").select("full_name, email, country, created_at").order("created_at", { ascending: false }).limit(5);
  return res.data ?? [];
}

export async function getRecentTickets(): Promise<RecentTicket[]> {
  const supabase: any = await sb();
  const res: any = await supabase.from("support_tickets").select("*").in("status", ["open", "pending"]).order("created_at", { ascending: false }).limit(5);
  return res.data ?? [];
}

export async function getActivityFeed(): Promise<AuditEntry[]> {
  const supabase: any = await sb();
  const res: any = await supabase.from("audit_logs").select("*, admins(profile_id, profiles(full_name))").order("created_at", { ascending: false }).limit(10);
  return res.data ?? [];
}

export async function getUsers(options?: { search?: string; status?: string; country?: string; page?: number; pageSize?: number }) {
  const supabase: any = await sb();
  const { search, status, country, page = 0, pageSize = 50 } = options ?? {};
  let q: any = supabase.from("profiles").select("*, user_roles(role), wallets(address)", { count: "exact" });
  if (search) q = q.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  if (status && status !== "all") {
    if (status === "deleted") q = q.not("deleted_at", "is", null);
    else q = q.eq("status", status).is("deleted_at", null);
  } else q = q.is("deleted_at", null);
  if (country) q = q.eq("country", country);
  const res: any = await q.range(page * pageSize, (page + 1) * pageSize - 1).order("created_at", { ascending: false });
  return { users: (res.data ?? []) as UserProfile[], count: (res.count ?? 0) as number };
}

export async function getOrders(options?: { search?: string; status?: string; page?: number; pageSize?: number }) {
  const supabase: any = await sb();
  const { search, status, page = 0, pageSize = 50 } = options ?? {};
  let q: any = supabase.from("card_orders").select("*, profiles(full_name, email), card_products(name, type)", { count: "exact" });
  if (search) q = q.or(`id.ilike.%${search}%,profiles.full_name.ilike.%${search}%`);
  if (status && status !== "all") q = q.eq("status", status);
  const res: any = await q.range(page * pageSize, (page + 1) * pageSize - 1).order("created_at", { ascending: false });
  return { orders: (res.data ?? []) as RecentOrder[], count: (res.count ?? 0) as number };
}

export async function getPayments(options?: { search?: string; status?: string; page?: number; pageSize?: number }) {
  const supabase: any = await sb();
  const { search, status, page = 0, pageSize = 50 } = options ?? {};
  let q: any = supabase.from("payment_transactions").select("*, supported_networks(name)", { count: "exact" });
  if (search) q = q.or(`tx_hash.ilike.%${search}%`);
  if (status && status !== "all") q = q.eq("status", status);
  const res: any = await q.range(page * pageSize, (page + 1) * pageSize - 1).order("created_at", { ascending: false });
  return { payments: (res.data ?? []) as RecentPayment[], count: (res.count ?? 0) as number };
}

export async function getCardProducts(): Promise<CardProduct[]> {
  const supabase: any = await sb();
  const res: any = await supabase.from("card_products").select("*").order("created_at", { ascending: false });
  return res.data ?? [];
}

export async function getAuditLogs(options?: { search?: string; action?: string; targetType?: string; page?: number; pageSize?: number }) {
  const supabase: any = await sb();
  const { search, action, targetType, page = 0, pageSize = 50 } = options ?? {};
  let q: any = supabase.from("audit_logs").select("*, admins(profile_id, profiles(full_name))", { count: "exact" });
  if (search) q = q.or(`target_id.ilike.%${search}%,ip_address.ilike.%${search}%`);
  if (action && action !== "all") q = q.eq("action", action);
  if (targetType && targetType !== "all") q = q.eq("target_type", targetType);
  const res: any = await q.range(page * pageSize, (page + 1) * pageSize - 1).order("created_at", { ascending: false });
  return { logs: (res.data ?? []) as AuditEntry[], count: (res.count ?? 0) as number };
}

export async function updateOrderStatus(orderId: string, status: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase.from("card_orders").update({ status } as any).eq("id", orderId);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function suspendUser(userId: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase.from("profiles").update({ status: "suspended" } as any).eq("id", userId);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/users");
  return { success: true };
}

export async function reactivateUser(userId: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase.from("profiles").update({ status: "active" } as any).eq("id", userId);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/users");
  return { success: true };
}
