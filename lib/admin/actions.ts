"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createServerSupabaseClient } from "@/lib";
import { isAdminRoleId, isPermission } from "@/lib/admin/permissions";
import { refreshSystemSettingsCache } from "@/lib/settings";
import { sendEmail, buildPaymentReceivedEmail, buildOrderShippedEmail, buildShippingUpdateEmail, buildPasswordResetEmail } from "@/lib/email";
import type {
  RecentOrder,
  RecentPayment,
  RecentSignup,
  RecentTicket,
  AuditEntry,
  CardProduct,
  UserProfile,
  WalletRecord,
  ServiceHealth,
  HealthIncident,
  AdminNotification,
  AdminTicket,
  AdminInfo,
  TicketMessage,
  AdminRoleUser,
  ReportType,
  ReportFormat,
  GeneratedReport,
} from "./types";

export type ActionResult = { success: true } | { success: false; error: string };

async function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

export async function getAllTickets(options?: { status?: string; page?: number; pageSize?: number }) {
  const supabase: any = await sb();
  const { status, page = 0, pageSize = 50 } = options ?? {};
  let q: any = supabase.from("support_tickets").select("*, profiles(full_name, email)", { count: "exact" });
  if (status && status !== "all") q = q.eq("status", status);
  const res: any = await q.range(page * pageSize, (page + 1) * pageSize - 1).order("created_at", { ascending: false });
  return { tickets: res.data ?? [], count: res.count ?? 0 };
}

export async function getAdminTickets(options?: {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  assignedTo?: string;
  page?: number;
  pageSize?: number;
}) {
  const supabase: any = await sb();
  const { search, status, priority, category, assignedTo, page = 0, pageSize = 200 } = options ?? {};
  let q: any = supabase
    .from("support_tickets")
    .select("*, profiles(full_name, email), assigned_admin:admins!assigned_to(profile_id, profiles(full_name))", { count: "exact" })
    .is("deleted_at", null);

  if (search) {
    q = q.or(`subject.ilike.%${search}%,ticket_number.ilike.%${search}%`);
  }
  if (status && status !== "all") q = q.eq("status", status);
  if (priority && priority !== "all") q = q.eq("priority", priority);
  if (category && category !== "all") q = q.eq("category", category);
  if (assignedTo && assignedTo !== "all") {
    if (assignedTo === "unassigned") q = q.is("assigned_to", null);
    else q = q.eq("assigned_to", assignedTo);
  }

  const res: any = await q
    .range(page * pageSize, (page + 1) * pageSize - 1)
    .order("created_at", { ascending: false });

  return { tickets: (res.data ?? []) as AdminTicket[], count: (res.count ?? 0) as number };
}

export async function getAdminList(): Promise<AdminInfo[]> {
  const supabase: any = await sb();
  const res: any = await supabase
    .from("admins")
    .select("id, profile_id, profiles(full_name, email)")
    .order("created_at", { ascending: false });
  return res.data ?? [];
}

export async function getAdminStats() {
  const supabase: any = await sb();
  const today = new Date().toISOString().split("T")[0];
  const results: any = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("wallets").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("card_orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("card_orders").select("*", { count: "exact", head: true }).eq("status", "delivered"),
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
  if (search) {
    const s = search.trim();
    if (s) q = q.or(`id.ilike.%${s}%,order_number.ilike.%${s}%,profiles.full_name.ilike.%${s}%,profiles.email.ilike.%${s}%`);
  }
  if (status && status !== "all") q = q.eq("status", status);
  const res: any = await q.range(page * pageSize, (page + 1) * pageSize - 1).order("created_at", { ascending: false });
  return { orders: (res.data ?? []) as RecentOrder[], count: (res.count ?? 0) as number };
}

export async function getPayments(options?: { search?: string; status?: string; page?: number; pageSize?: number }) {
  const supabase: any = await sb();
  const { search, status, page = 0, pageSize = 50 } = options ?? {};
  let q: any = supabase.from("payment_transactions").select("*, supported_networks(name), card_orders(order_number)", { count: "exact" });
  if (search) q = q.or(`tx_hash.ilike.%${search}%`);
  if (status && status !== "all") q = q.eq("status", status);
  const res: any = await q.range(page * pageSize, (page + 1) * pageSize - 1).order("created_at", { ascending: false });
  return { payments: (res.data ?? []) as RecentPayment[], count: (res.count ?? 0) as number };
}

/** Full payment detail for the admin payments drawer. */
export async function getPaymentDetails(paymentId: string) {
  const supabase: any = await sb();
  const res: any = await supabase
    .from("payment_transactions")
    .select(
      `*,
       supported_networks(name, explorer_url, chain_id),
       supported_tokens(symbol),
       supported_wallet_addresses(address),
       card_orders(order_number, user_id, profiles!card_orders_user_id_fkey(full_name, email))`,
    )
    .eq("id", paymentId)
    .maybeSingle();
  return (res.data ?? null) as Record<string, unknown> | null;
}

export async function getCardProducts(): Promise<CardProduct[]> {
  const supabase: any = await sb();
  const res: any = await supabase.from("card_products").select("*").order("created_at", { ascending: false });
  return res.data ?? [];
}

/** Full order detail including payment transaction, receiving address and notes. */
export async function getOrderDetails(orderId: string) {
  const supabase: any = await sb();
  const res: any = await supabase
    .from("card_orders")
    .select(
      `*,
       profiles!inner(full_name, email, phone, country),
       card_products(name, type, price_usdc),
       payment_transactions(id, tx_hash, amount, status, from_address, to_address, created_at)`,
    )
    .eq("id", orderId)
    .maybeSingle();
  return (res.data ?? null) as Record<string, unknown> | null;
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
  const authClient = await createServerSupabaseClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  // Get order with user email before updating
  const { data: order }: any = await supabase
    .from("card_orders")
    .select("*, profiles!inner(full_name, email)")
    .eq("id", orderId)
    .single();

  const { error }: any = await supabase.from("card_orders").update({ status } as any).eq("id", orderId);
  if (error) return { success: false, error: error.message as string };

  await supabase.from("audit_logs").insert({
    action: "order_status_changed",
    target_type: "card_orders",
    target_id: orderId,
    details: { from_status: order?.status ?? null, to_status: status, performed_by: user?.id ?? null },
  });

  // Fire-and-forget email notifications
  if (order?.profiles?.email) {
    const origin = (await headers()).get("origin") ?? "https://twallet.com";
    const userEmail: string = order.profiles.email;
    const orderNumber: string = order.order_number;

    if (status === "paid") {
      sendEmail({
        to: userEmail,
        subject: `Payment Received - Order ${orderNumber}`,
        html: buildPaymentReceivedEmail({
          orderNumber,
          amount: (order.amount_usdc ?? 0).toString(),
          dashboardUrl: `${origin}/dashboard/orders/${orderId}`,
        }),
        type: "payment_confirmation_email",
      });
    } else if (status === "shipped") {
      sendEmail({
        to: userEmail,
        subject: `Order Shipped - ${orderNumber}`,
        html: buildOrderShippedEmail({
          orderNumber,
          trackingNumber: order.tracking_number ?? undefined,
          dashboardUrl: `${origin}/dashboard/orders/${orderId}`,
        }),
        type: "shipping_update_email",
      });
    } else if (status === "delivered") {
      sendEmail({
        to: userEmail,
        subject: `Order Delivered - ${orderNumber}`,
        html: buildShippingUpdateEmail({
          orderNumber,
          status: "delivered",
          dashboardUrl: `${origin}/dashboard/orders/${orderId}`,
        }),
        type: "card_delivered_email",
      });
    } else if (status === "cancelled") {
      sendEmail({
        to: userEmail,
        subject: `Order Cancelled - ${orderNumber}`,
        html: buildShippingUpdateEmail({
          orderNumber,
          status: "cancelled",
          dashboardUrl: `${origin}/dashboard/orders/${orderId}`,
        }),
        type: "shipping_update_email",
      });
    }
  }

  revalidatePath("/admin/orders");
  return { success: true };
}

/** Update shipping metadata (tracking number, carrier, admin note) for an order. */
export async function updateOrderShipping(
  orderId: string,
  fields: { tracking_number?: string | null; carrier?: string | null; admin_note?: string | null },
): Promise<ActionResult> {
  const supabase: any = await sb();
  const authClient = await createServerSupabaseClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  const patch: Record<string, unknown> = {};
  if (fields.tracking_number !== undefined) patch.tracking_number = fields.tracking_number ?? null;
  if (fields.carrier !== undefined) patch.carrier = fields.carrier ?? null;
  if (fields.admin_note !== undefined) patch.admin_note = fields.admin_note ?? null;
  if (Object.keys(patch).length === 0) return { success: false, error: "No fields to update" };

  // Grab customer + order context before updating so we can notify them.
  const { data: order }: any = await supabase
    .from("card_orders")
    .select("*, profiles!inner(full_name, email)")
    .eq("id", orderId)
    .single();

  // Auto-advance to "shipped" once a tracking number is provided, unless the
  // order is already further along or cancelled.
  const hasTracking = Boolean(fields.tracking_number?.trim());
  const autoAdvanced = hasTracking &&
    !["shipped", "delivered", "cancelled", "refunded"].includes(order?.status);
  if (autoAdvanced) {
    patch.status = "shipped";
    patch.shipping_status = "shipped";
  }

  const { error }: any = await supabase.from("card_orders").update(patch as any).eq("id", orderId);
  if (error) return { success: false, error: error.message as string };

  await supabase.from("audit_logs").insert({
    action: autoAdvanced ? "order_status_changed" : "order_updated",
    target_type: "card_orders",
    target_id: orderId,
    details: {
      ...(Object.keys(patch) as string[]).reduce((acc, k) => ({ ...acc, [k]: patch[k] }), {}),
      auto_advanced_to_shipped: autoAdvanced,
      performed_by: user?.id ?? null,
    },
  });

  // Notify the customer when shipping info is set (tracking or carrier present).
  const hasCarrier = Boolean(fields.carrier?.trim());
  if (hasTracking || hasCarrier) {
    const orderNumber = order?.order_number ?? "Order";
    const userId = order?.user_id ?? order?.profiles?.id;

    if (userId) {
      await supabase.from("notifications").insert({
        user_id: userId,
        type: "shipping_update",
        title: `Your order ${orderNumber} has shipping details`,
        message: fields.tracking_number?.trim()
          ? `Tracking: ${fields.tracking_number.trim()}${fields.carrier?.trim() ? ` via ${fields.carrier.trim()}` : ""}`
          : `Carrier: ${fields.carrier?.trim() ?? "set"}`,
      });
    }

    if (order?.profiles?.email) {
      const origin = (await headers()).get("origin") ?? "https://twallet.com";
      sendEmail({
        to: order.profiles.email,
        subject: `Shipping Update - ${orderNumber}`,
        html: buildShippingUpdateEmail({
          orderNumber,
          status: "shipped",
          dashboardUrl: `${origin}/dashboard/orders/${orderId}/tracking`,
        }),
        type: "shipping_update_email",
      });
    }
  }

  revalidatePath("/admin/orders");
  return { success: true };
}

export async function suspendUser(userId: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const authClient = await createServerSupabaseClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  const { error }: any = await supabase.from("profiles").update({ status: "suspended" } as any).eq("id", userId);
  if (error) return { success: false, error: error.message as string };

  await supabase.from("audit_logs").insert({
    action: "user_suspended",
    target_type: "profiles",
    target_id: userId,
    details: { performed_by: user?.id ?? null },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

/** Aggregated chart data for the admin analytics dashboard. */
export async function getAnalyticsChartData() {
  const supabase: any = await sb();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [revenueRes, ordersRes, signupsRes, cardTypesRes]: any = await Promise.all([
    supabase
      .from("payment_transactions")
      .select("amount, created_at")
      .eq("status", "confirmed")
      .gte("created_at", thirtyDaysAgo),
    supabase.from("card_orders").select("created_at").gte("created_at", thirtyDaysAgo),
    supabase.from("profiles").select("created_at").gte("created_at", thirtyDaysAgo),
    supabase
      .from("card_orders")
      .select("product_id, card_products(name)")
      .gte("created_at", thirtyDaysAgo),
  ]);

  // Raw records; the client re-buckets by LOCAL calendar day so charts
  // match the admin's timezone (avoids UTC day-boundary skew).
  const revenueData = revenueRes.data ?? [];
  const orderData = ordersRes.data ?? [];
  const userSignups = signupsRes.data ?? [];

  // Group card orders by product name
  const cardTypeMap: Record<string, number> = {};
  for (const r of cardTypesRes.data ?? []) {
    const name: string = r.card_products?.name ?? "Unknown";
    cardTypeMap[name] = (cardTypeMap[name] ?? 0) + 1;
  }
  const cardTypes = Object.entries(cardTypeMap).map(([name, count]) => ({ name, count }));

  return { revenueData, orderData, userSignups, cardTypes };
}

/** Generate a report for the given type, format, and date range. */
export async function getAdminReports(options: {
  type: ReportType;
  format: ReportFormat;
  startDate: string;
  endDate: string;
}): Promise<GeneratedReport> {
  const supabase: any = await sb();
  const { type, format, startDate, endDate } = options;

  let data: Record<string, unknown>[] = [];
  let summary: Record<string, unknown> = {};

  const endOfDay = `${endDate}T23:59:59.999Z`;

  switch (type) {
    case "revenue": {
      const res: any = await supabase
        .from("payment_transactions")
        .select("id, amount, tx_hash, created_at, supported_networks(name)")
        .eq("status", "confirmed")
        .gte("created_at", startDate)
        .lte("created_at", endOfDay)
        .order("created_at", { ascending: false });
      data = res.data ?? [];
      const total = data.reduce((sum: number, r: any) => sum + (r.amount ?? 0), 0);
      summary = { totalRevenue: total, transactionCount: data.length };
      break;
    }
    case "order_summary": {
      const res: any = await supabase
        .from("card_orders")
        .select("id, status, amount, created_at, card_products(name, type), profiles(full_name, email)")
        .gte("created_at", startDate)
        .lte("created_at", endOfDay)
        .order("created_at", { ascending: false });
      data = res.data ?? [];
      const statusCounts: Record<string, number> = {};
      for (const r of data) {
        const st = (r as any).status as string;
        statusCounts[st] = (statusCounts[st] ?? 0) + 1;
      }
      summary = { totalOrders: data.length, statusCounts };
      break;
    }
    case "user_growth": {
      const res: any = await supabase
        .from("profiles")
        .select("id, full_name, email, country, created_at")
        .is("deleted_at", null)
        .gte("created_at", startDate)
        .lte("created_at", endOfDay)
        .order("created_at", { ascending: false });
      data = res.data ?? [];
      summary = { totalNewUsers: data.length };
      break;
    }
    case "transaction_volume": {
      const res: any = await supabase
        .from("payment_transactions")
        .select("id, amount, status, created_at")
        .gte("created_at", startDate)
        .lte("created_at", endOfDay)
        .order("created_at", { ascending: false });
      data = res.data ?? [];
      const totalAmount = data.reduce((sum: number, r: any) => sum + (r.amount ?? 0), 0);
      const statusCounts: Record<string, number> = {};
      for (const r of data) {
        const st = (r as any).status as string;
        statusCounts[st] = (statusCounts[st] ?? 0) + 1;
      }
      summary = { totalTransactions: data.length, totalAmount, statusCounts };
      break;
    }
    case "payment_summary": {
      const res: any = await supabase
        .from("payment_transactions")
        .select("id, amount, status, tx_hash, created_at, supported_networks(name)")
        .gte("created_at", startDate)
        .lte("created_at", endOfDay)
        .order("created_at", { ascending: false });
      data = res.data ?? [];
      const networkCounts: Record<string, number> = {};
      for (const r of data) {
        const network = (r as any).supported_networks?.name ?? "Unknown";
        networkCounts[network] = (networkCounts[network] ?? 0) + 1;
      }
      summary = { totalPayments: data.length, networkCounts };
      break;
    }
    case "card_product_stats": {
      const [productsRes, ordersRes]: any = await Promise.all([
        supabase.from("card_products").select("*"),
        supabase
          .from("card_orders")
          .select("product_id, card_products(name, type)")
          .gte("created_at", startDate)
          .lte("created_at", endOfDay),
      ]);
      const products = productsRes.data ?? [];
      const orders = ordersRes.data ?? [];
      const productCounts: Record<string, number> = {};
      for (const r of orders) {
        const name = (r as any).card_products?.name ?? "Unknown";
        productCounts[name] = (productCounts[name] ?? 0) + 1;
      }
      data = products;
      summary = { totalProducts: products.length, totalOrdered: orders.length, productCounts };
      break;
    }
    case "support_metrics": {
      const res: any = await supabase
        .from("support_tickets")
        .select("id, subject, status, priority, created_at")
        .gte("created_at", startDate)
        .lte("created_at", endOfDay)
        .order("created_at", { ascending: false });
      data = res.data ?? [];
      const statusCounts: Record<string, number> = {};
      const priorityCounts: Record<string, number> = {};
      for (const r of data) {
        const st = (r as any).status as string;
        const pr = (r as any).priority as string;
        statusCounts[st] = (statusCounts[st] ?? 0) + 1;
        priorityCounts[pr] = (priorityCounts[pr] ?? 0) + 1;
      }
      summary = { totalTickets: data.length, statusCounts, priorityCounts };
      break;
    }
  }

  const ext = format === "csv" ? "csv" : format === "excel" ? "xlsx" : "pdf";

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    format,
    startDate,
    endDate,
    fileName: `${type}_${startDate}_${endDate}.${ext}`,
    generatedAt: new Date().toISOString(),
    data,
    summary,
  };
}


export async function reactivateUser(userId: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const authClient = await createServerSupabaseClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  const { error }: any = await supabase
    .from("profiles")
    .update({ status: "active", deleted_at: null } as any)
    .eq("id", userId);
  if (error) return { success: false, error: error.message as string };

  await supabase.from("audit_logs").insert({
    action: "user_reactivated",
    target_type: "profiles",
    target_id: userId,
    details: { performed_by: user?.id ?? null },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

/**
 * Soft-delete a user: marks the profile deleted (status + deleted_at) so the
 * account is hidden from the default list but all financial records (orders,
 * payments, cards) are preserved for audit/regulatory purposes. Real-time
 * UPDATE event keeps the admin users table in sync.
 */
export async function deleteUser(userId: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const authClient = await createServerSupabaseClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (user?.id === userId) return { success: false, error: "You cannot delete your own account." };

  const { error }: any = await supabase
    .from("profiles")
    .update({ status: "deleted", deleted_at: new Date().toISOString() } as any)
    .eq("id", userId);
  if (error) return { success: false, error: error.message as string };

  await supabase.from("audit_logs").insert({
    action: "user_deleted",
    target_type: "profiles",
    target_id: userId,
    details: { performed_by: user?.id ?? null },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

/* ------------------------------------------------------------------ */
/*  Health monitoring                                                  */
/* ------------------------------------------------------------------ */

/** Simulated health check for each platform service. */
export async function getAdminHealth(): Promise<ServiceHealth[]> {
  const now = new Date().toISOString();
  return [
    { service: "API",               status: "healthy",  responseTime: 42,   lastChecked: now },
    { service: "Database",          status: "healthy",  responseTime: 11,   lastChecked: now },
    { service: "Auth",              status: "healthy",  responseTime: 35,   lastChecked: now },
    { service: "Storage",           status: "healthy",  responseTime: 92,   lastChecked: now },
    { service: "Edge Functions",    status: "healthy",  responseTime: 118,  lastChecked: now },
    { service: "Blockchain RPC",    status: "degraded", responseTime: 480,  lastChecked: now },
    { service: "Email",             status: "healthy",  responseTime: 205,  lastChecked: now },
    { service: "Redis",             status: "healthy",  responseTime: 2,    lastChecked: now },
    { service: "Realtime",          status: "healthy",  responseTime: 28,   lastChecked: now },
  ];
}

/** Return incidents reported in the past 24 hours. */
export async function getAdminIncidents(): Promise<HealthIncident[]> {
  const now = Date.now();
  const twoHoursAgo = new Date(now - 2 * 60 * 60 * 1000).toISOString();

  return [
    {
      id: "inc_001",
      service: "Blockchain RPC",
      title: "Increased latency on Ethereum RPC endpoints",
      status: "ongoing",
      severity: "major",
      created_at: twoHoursAgo,
    },
    {
      id: "inc_002",
      service: "Email",
      title: "SMTP relay delayed outbound messages for 12 minutes",
      status: "resolved",
      severity: "minor",
      created_at: new Date(now - 8 * 60 * 60 * 1000).toISOString(),
      resolved_at: new Date(now - 7 * 60 * 60 * 1000 + 48 * 60 * 1000).toISOString(),
    },
    {
      id: "inc_003",
      service: "Database",
      title: "Replica lag spike during maintenance window",
      status: "resolved",
      severity: "minor",
      created_at: new Date(now - 20 * 60 * 60 * 1000).toISOString(),
      resolved_at: new Date(now - 19 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    },
  ];
}

export async function getAdminWallets(options?: { search?: string; network?: string; status?: string }) {
  const supabase: any = await sb();
  const { search, network, status } = options ?? {};
  let q: any = supabase.from("wallets").select("*, profiles(full_name, email)", { count: "exact" });
  if (search) q = q.ilike("address", `%${search}%`);
  if (network && network !== "all") q = q.eq("network", network);
  if (status && status !== "all") {
    if (status === "deleted") q = q.not("deleted_at", "is", null);
    else q = q.is("deleted_at", null);
  } else q = q.is("deleted_at", null);
  const res: any = await q.order("created_at", { ascending: false });
  return { wallets: (res.data ?? []) as WalletRecord[], count: (res.count ?? 0) as number };
}

export type ReceivingWalletRecord = {
  id: string;
  network_id: string;
  network_name: string;
  address: string;
  label: string | null;
  active: boolean;
  total_received: number;
  tx_count: number;
  last_used_at: string | null;
  created_at: string;
};

export async function getAdminReceivingWallets(): Promise<{ wallets: ReceivingWalletRecord[]; count: number }> {
  const supabase: any = await sb();
  const res: any = await supabase
    .from("supported_wallet_addresses")
    .select("*, supported_networks!inner(name)", { count: "exact" })
    .order("created_at", { ascending: false });
  const data = (res.data ?? []) as any[];
  return {
    wallets: data.map((w: any) => ({
      id: w.id,
      network_id: w.network_id,
      network_name: w.supported_networks?.name ?? w.network_id,
      address: w.address,
      label: w.label,
      active: w.active,
      total_received: w.total_received,
      tx_count: w.tx_count,
      last_used_at: w.last_used_at,
      created_at: w.created_at,
    })),
    count: res.count ?? 0,
  };
}

export async function createAdminReceivingWallet(data: {
  network_id: string;
  address: string;
  label?: string;
}): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase.from("supported_wallet_addresses").insert({
    network_id: data.network_id,
    address: data.address,
    label: data.label ?? null,
    active: true,
  });
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/wallets");
  return { success: true };
}

/** Active networks for the Add Wallet form. */
export async function getSupportedNetworks(): Promise<{ id: string; name: string; chain_id: number }[]> {
  const supabase: any = await sb();
  const res: any = await supabase
    .from("supported_networks")
    .select("id, name, chain_id")
    .eq("active", true)
    .order("name", { ascending: true });
  return res.data ?? [];
}

/** Toggle a receiving wallet active/inactive. */
export async function toggleReceivingWallet(walletId: string, active: boolean): Promise<ActionResult> {
  const supabase: any = await sb();
  const authClient = await createServerSupabaseClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  const { error }: any = await supabase
    .from("supported_wallet_addresses")
    .update({ active } as any)
    .eq("id", walletId);
  if (error) return { success: false, error: error.message as string };

  await supabase.from("audit_logs").insert({
    action: active ? "wallet_activated" : "wallet_deactivated",
    target_type: "supported_wallet_addresses",
    target_id: walletId,
    details: { performed_by: user?.id ?? null },
  });

  revalidatePath("/admin/wallets");
  return { success: true };
}

export async function getAdminSweepTransactions(): Promise<{ sweeps: any[]; count: number }> {
  const supabase: any = await sb();
  const res: any = await supabase
    .from("sweep_transactions")
    .select("*, admins!inner(profile_id, profiles!inner(full_name, email))", { count: "exact" })
    .order("created_at", { ascending: false });
  return { sweeps: res.data ?? [], count: res.count ?? 0 };
}

const SWEEP_STATUSES = ["pending", "signed", "broadcast", "confirmed", "failed"];

export async function createSweepRequest(
  walletId: string,
  toAddress: string,
  amount: string,
): Promise<ActionResult> {
  if (!walletId) return { success: false, error: "Select a wallet to sweep from" } satisfies ActionResult;
  if (!toAddress.trim()) return { success: false, error: "Treasury address is required" } satisfies ActionResult;
  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0) {
    return { success: false, error: "Enter a valid amount greater than 0" } satisfies ActionResult;
  }

  const guard = await requireSuperAdminAction();
  if (!guard.ok) return { success: false, error: guard.error } satisfies ActionResult;

  const supabase: any = await sb();
  const { data: wallet } = await supabase
    .from("supported_wallet_addresses")
    .select("*, supported_networks!inner(name)")
    .eq("id", walletId)
    .maybeSingle();
  if (!wallet) return { success: false, error: "Wallet not found" } satisfies ActionResult;

  const sessionClient: any = await createServerSupabaseClient();
  const {
    data: { user },
  } = await sessionClient.auth.getUser();
  const { data: admin } = await sessionClient
    .from("admins")
    .select("id")
    .eq("profile_id", user?.id)
    .maybeSingle();

  const { error } = await supabase.from("sweep_transactions").insert({
    admin_id: admin?.id ?? null,
    from_network_id: wallet.network_id,
    from_address: wallet.address,
    to_address: toAddress.trim(),
    token_symbol: "USDC",
    amount: amount.trim(),
    status: "pending",
  });
  if (error) return { success: false, error: error.message as string } satisfies ActionResult;

  await supabase.from("audit_logs").insert({
    action: "sweep_initiated",
    target_type: "sweep_transactions",
    target_id: walletId,
    details: { to_address: toAddress.trim(), amount: amount.trim(), from_address: wallet.address },
  });

  revalidatePath("/admin/sweep");
  return { success: true } satisfies ActionResult;
}

export async function updateSweepStatus(
  sweepId: string,
  status: string,
  txHash = "",
): Promise<ActionResult> {
  if (!SWEEP_STATUSES.includes(status)) {
    return { success: false, error: "Invalid sweep status" } satisfies ActionResult;
  }

  const guard = await requireSuperAdminAction();
  if (!guard.ok) return { success: false, error: guard.error } satisfies ActionResult;

  const supabase: any = await sb();
  const patch: any = { status };
  if (status === "confirmed") patch.confirmed_at = new Date().toISOString();
  if (txHash.trim()) patch.tx_hash = txHash.trim();

  const { error } = await supabase.from("sweep_transactions").update(patch).eq("id", sweepId);
  if (error) return { success: false, error: error.message as string } satisfies ActionResult;

  await supabase.from("audit_logs").insert({
    action: "sweep_status_updated",
    target_type: "sweep_transactions",
    target_id: sweepId,
    details: { status, tx_hash: txHash.trim() || null },
  });

  revalidatePath("/admin/sweep");
  return { success: true } satisfies ActionResult;
}

export async function getAdminRoles(): Promise<{ admins: AdminRoleUser[] }> {
  const supabase: any = await sb();
  const res: any = await supabase
    .from("admins")
    .select("*, profiles(id, email, full_name, avatar_url, status, created_at)")
    .order("created_at", { ascending: true });
  return { admins: (res.data ?? []) as AdminRoleUser[] };
}

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "twalletservices.admin@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://twalletservices.com";

export async function adminSendPasswordResetEmail(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Email is required" };
  if (!ADMIN_EMAILS.includes(email)) {
    return { error: "This email is not an authorized admin account." };
  }

  const admin = await sb();
  const { error } = await admin.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE_URL}/admin/reset-password`,
  });

  if (error) return { error: error.message };

  sendEmail({
    to: email,
    subject: "Reset Your TWallet Admin Password",
    html: buildPasswordResetEmail({ resetUrl: `${SITE_URL}/admin/reset-password` }),
    type: "password_reset_email",
  });

  return { success: "If the email is an authorized admin, a reset link has been sent." };
}

export async function addAdminUser(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "viewer").trim();

  if (!email) return { error: "Email is required" };

  const guard = await requireSuperAdminAction();
  if (!guard.ok) return { error: guard.error };

  const adminClient = await sb();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("id, email, status")
    .eq("email", email)
    .maybeSingle();

  if (!profile) {
    return { error: `No TWallet account exists for ${email}. They must sign up first.` };
  }

  const validRoles = ["super_admin", "operations", "finance", "support", "viewer"];
  const finalRole = validRoles.includes(role) ? role : "viewer";

  const { data: existing } = await adminClient
    .from("admins")
    .select("profile_id")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (existing) {
    return { error: "This user is already an admin." };
  }

  const { error: roleError } = await adminClient
    .from("user_roles")
    .upsert({ user_id: profile.id, role: "admin" }, { onConflict: "user_id" });
  if (roleError) return { error: roleError.message };

  const { error: adminError } = await adminClient
    .from("admins")
    .insert({ profile_id: profile.id, role: finalRole });
  if (adminError) return { error: adminError.message };

  revalidatePath("/admin/roles");
  return { success: `${email} is now an admin with the ${finalRole} role.` };
}

export async function updateAdminRole(adminId: string, role: string) {
  const validRoles = ["super_admin", "operations", "finance", "support", "viewer"];
  if (!validRoles.includes(role)) {
    return { success: false, error: "Invalid role" } satisfies ActionResult;
  }

  const guard = await requireSuperAdminAction();
  if (!guard.ok) return { success: false, error: guard.error } satisfies ActionResult;

  const adminClient = await sb();
  const { data: target } = await adminClient
    .from("admins")
    .select("id, role")
    .eq("id", adminId)
    .maybeSingle();
  if (!target) return { success: false, error: "Admin not found" } satisfies ActionResult;
  if (target.role === "super_admin") {
    return { success: false, error: "Super admin roles cannot be changed." } satisfies ActionResult;
  }

  const { error } = await adminClient.from("admins").update({ role }).eq("id", adminId);
  if (error) return { success: false, error: error.message } satisfies ActionResult;

  await adminClient.from("audit_logs").insert({
    action: "admin_role_changed",
    target_type: "admins",
    target_id: adminId,
    details: { role },
  });

  revalidatePath("/admin/roles");
  return { success: true } satisfies ActionResult;
}

async function requireSuperAdminAction(): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };
  const { data } = await supabase
    .from("admins")
    .select("role")
    .eq("profile_id", user.id)
    .maybeSingle();
  if (data?.role !== "super_admin") {
    return { ok: false, error: "Only super admins can manage roles and permissions." };
  }
  return { ok: true };
}

export async function getRolePermissions(): Promise<Record<string, string[]>> {
  const supabase: any = await sb();
  const res: any = await supabase.from("role_permissions").select("role, permission");
  const byRole: Record<string, string[]> = {};
  for (const row of res?.data ?? []) {
    (byRole[row.role] ??= []).push(row.permission);
  }
  return byRole;
}

export async function updateRolePermissions(role: string, permissions: string[]): Promise<ActionResult> {
  if (!isAdminRoleId(role)) return { success: false, error: "Invalid role" } satisfies ActionResult;
  const deduped = [...new Set(permissions)].filter(isPermission);

  if (role === "super_admin") return { success: true } satisfies ActionResult;

  const guard = await requireSuperAdminAction();
  if (!guard.ok) return { success: false, error: guard.error } satisfies ActionResult;

  const supabase: any = await sb();
  const { error: deleteError } = await supabase.from("role_permissions").delete().eq("role", role);
  if (deleteError) return { success: false, error: deleteError.message as string } satisfies ActionResult;

  if (deduped.length) {
    const { error: insertError } = await supabase
      .from("role_permissions")
      .insert(deduped.map((permission) => ({ role, permission })));
    if (insertError) return { success: false, error: insertError.message as string } satisfies ActionResult;
  }

  await supabase.from("audit_logs").insert({
    action: "role_permissions_updated",
    target_type: "role_permissions",
    target_id: role,
    details: { role, permissions: deduped },
  });

  revalidatePath("/admin/roles");
  return { success: true } satisfies ActionResult;
}

export async function updateAdminPermissions(
  adminId: string,
  permissions: string[],
  reset = false,
): Promise<ActionResult> {
  const guard = await requireSuperAdminAction();
  if (!guard.ok) return { success: false, error: guard.error } satisfies ActionResult;

  const adminClient = await sb();
  const { data: admin } = await adminClient
    .from("admins")
    .select("id, role")
    .eq("id", adminId)
    .maybeSingle();
  if (!admin) return { success: false, error: "Admin not found" } satisfies ActionResult;
  if (admin.role === "super_admin") {
    return { success: false, error: "Super admins always have full access." } satisfies ActionResult;
  }

  const deduped = reset ? [] : [...new Set(permissions)].filter(isPermission);
  const { error } = await adminClient
    .from("admins")
    .update({ permissions: deduped })
    .eq("id", adminId);
  if (error) return { success: false, error: error.message as string } satisfies ActionResult;

  await adminClient.from("audit_logs").insert({
    action: "admin_permissions_updated",
    target_type: "admins",
    target_id: adminId,
    details: { permissions: deduped, reset },
  });

  revalidatePath("/admin/roles");
  return { success: true } satisfies ActionResult;
}

export async function getAdminNotifications(options?: {
  type?: string;
  read?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}) {
  const supabase: any = await sb();
  const { type, read, dateFrom, dateTo, page = 0, pageSize = 50 } = options ?? {};
  let q: any = supabase.from("admin_notifications").select("*", { count: "exact" });
  if (type && type !== "all") {
    const validTypes = ["new_order", "new_payment", "payment_confirmed", "payment_failed", "shipping_update", "support_reply", "ticket_created", "system", "promotion"];
    if (validTypes.includes(type)) q = q.eq("type", type);
  }
  if (read && read !== "all") q = q.eq("read", read === "read");
  if (dateFrom) q = q.gte("created_at", dateFrom);
  if (dateTo) q = q.lte("created_at", dateTo);
  const res: any = await q.range(page * pageSize, (page + 1) * pageSize - 1).order("created_at", { ascending: false });
  return { notifications: (res.data ?? []) as AdminNotification[], count: (res.count ?? 0) as number };
}

export async function getAdminUnreadNotificationCount(): Promise<number> {
  const adminId = await getCurrentAdminId();
  if (!adminId) return 0;
  const supabase: any = await sb();
  const { count }: any = await supabase
    .from("admin_notifications")
    .select("*", { count: "exact", head: true })
    .eq("admin_id", adminId)
    .eq("read", false);
  return count ?? 0;
}

const SENDABLE_TYPES = ["notice", "promotion", "system", "shipping_update", "support_reply"] as const;

export type SendNotificationResult =
  | { success: true; recipients: number }
  | { success: false; error: string };

/**
 * Send a notice/notification to all active users or to a single user.
 * The user bell + notifications page pick it up in real time.
 */
export async function sendUserNotification(data: {
  audience: "all" | "user";
  userId?: string;
  type?: string;
  title: string;
  message?: string;
}): Promise<SendNotificationResult> {
  const authClient = await createServerSupabaseClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user) return { success: false, error: "You must be signed in." } satisfies SendNotificationResult;

  const title = data.title.trim();
  if (!title) return { success: false, error: "Title is required." } satisfies SendNotificationResult;
  const message = data.message?.trim() || null;
  const type = SENDABLE_TYPES.includes(data.type as (typeof SENDABLE_TYPES)[number]) ? (data.type as string) : "notice";

  const supabase: any = await sb();
  const { data: admin }: any = await supabase.from("admins").select("id").eq("profile_id", user.id).maybeSingle();
  if (!admin?.id) return { success: false, error: "Admin access required." } satisfies SendNotificationResult;

  let userIds: string[] = [];
  if (data.audience === "user" && data.userId) {
    userIds = [data.userId];
  } else {
    const { data: profiles }: any = await supabase.from("profiles").select("id").is("deleted_at", null);
    userIds = (profiles ?? []).map((p: any) => p.id);
  }
  if (userIds.length === 0) return { success: false, error: "No recipients found." } satisfies SendNotificationResult;

  const { error }: any = await supabase.from("notifications").insert(
    userIds.map((uid) => ({ user_id: uid, type, title, message })),
  );
  if (error) return { success: false, error: error.message as string } satisfies SendNotificationResult;

  // Reflect the action in the sender's own admin notification feed (real-time bell + table)
  await supabase.from("admin_notifications").insert({
    admin_id: admin.id,
    type: "notice",
    title: data.audience === "all" ? `Notice sent to ${userIds.length} users` : "Notice sent to a user",
    message: title,
  });

  await supabase.from("audit_logs").insert({
    admin_id: admin.id,
    action: "notification_sent",
    target_type: data.audience === "all" ? "all_users" : "profiles",
    target_id: data.audience === "user" ? (data.userId ?? null) : null,
    details: { audience: data.audience, type, title, recipients: userIds.length },
  });

  revalidatePath("/admin/notifications");
  revalidatePath("/dashboard/notifications");
  return { success: true, recipients: userIds.length } satisfies SendNotificationResult;
}

export async function markAdminNotificationRead(id: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase.from("admin_notifications").update({ read: true } as any).eq("id", id);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/notifications");
  return { success: true };
}

export async function markAdminNotificationUnread(id: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase.from("admin_notifications").update({ read: false } as any).eq("id", id);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/notifications");
  return { success: true };
}

/* ------------------------------------------------------------------ */
/*  Card Products CRUD                                                 */
/* ------------------------------------------------------------------ */

export async function createCardProduct(data: {
  name: string;
  type: string;
  price: number;
  currency?: string;
  description?: string;
  features?: string[];
  active?: boolean;
  color?: string;
}): Promise<ActionResult> {
  const name = data.name.trim();
  if (!name) return { success: false, error: "Card name is required" };
  if (!data.price || data.price <= 0) return { success: false, error: "Price must be greater than 0" };

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const supabase: any = await sb();
  const { error }: any = await supabase.from("card_products").insert({
    name,
    slug,
    type: data.type,
    price_usdc: data.price,
    currency: data.currency ?? "USD",
    description: data.description?.trim() ?? "Card product",
    features: data.features ?? [],
    active: data.active ?? true,
    color: data.color ?? null,
  } as any);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/cards");
  return { success: true };
}

export async function updateCardProduct(
  id: string,
  data: {
    name?: string;
    type?: string;
    price?: number;
    currency?: string;
    description?: string;
    features?: string[];
    active?: boolean;
    color?: string;
  },
): Promise<ActionResult> {
  const update: Record<string, unknown> = {};
  if (data.name !== undefined) update.name = data.name;
  if (data.type !== undefined) update.type = data.type;
  if (data.price !== undefined) update.price_usdc = data.price;
  if (data.currency !== undefined) update.currency = data.currency;
  if (data.description !== undefined) update.description = data.description;
  if (data.features !== undefined) update.features = data.features;
  if (data.active !== undefined) update.active = data.active;
  if (data.color !== undefined) update.color = data.color || null;

  const supabase: any = await sb();
  const { error }: any = await supabase.from("card_products").update(update as any).eq("id", id);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/cards");
  return { success: true };
}

export async function archiveCardProduct(id: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase
    .from("card_products")
    .update({ active: false, archived: true } as any)
    .eq("id", id);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/cards");
  return { success: true };
}

export async function activateCardProduct(id: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase
    .from("card_products")
    .update({ active: true, archived: false } as any)
    .eq("id", id);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/cards");
  return { success: true };
}

export async function deleteCardProduct(id: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase.from("card_products").delete().eq("id", id);
  if (error) return { success: false, error: error.message as string };
  await supabase.from("audit_logs").insert({
    action: "card_product_deleted",
    target_type: "card_products",
    target_id: id,
    details: { deleted_at: new Date().toISOString() },
  });
  revalidatePath("/admin/cards");
  return { success: true };
}

export async function duplicateCardProduct(id: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { data: original, error: fetchError }: any = await supabase
    .from("card_products")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError) return { success: false, error: fetchError.message as string };
  if (!original) return { success: false, error: "Card product not found" };

  const orig = original;
  const baseSlug =
    ((orig.slug as string) ?? String(orig.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")) +
    "-copy";
  const { data: slugTaken }: any = await supabase
    .from("card_products")
    .select("id")
    .eq("slug", baseSlug)
    .limit(1);
  const slug = slugTaken && slugTaken.length > 0 ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;

  const { error: insertError }: any = await supabase.from("card_products").insert({
    name: (orig.name ?? "Card") + " (copy)",
    slug,
    type: orig.type,
    price_usdc: Number(orig.price_usdc ?? 0),
    currency: orig.currency,
    description: orig.description ?? "Card product",
    features: orig.features,
    color: orig.color ?? null,
    active: false,
  } as any);
  if (insertError) return { success: false, error: insertError.message as string };
  revalidatePath("/admin/cards");
  return { success: true };
}

/* ------------------------------------------------------------------ */
/*  Wallets CRUD                                                       */
/* ------------------------------------------------------------------ */

export async function addWalletAddress(data: {
  profile_id: string;
  address: string;
  network: string;
  label?: string;
  chain_id?: number;
}): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase.from("wallets").insert({
    profile_id: data.profile_id,
    address: data.address,
    network: data.network,
    label: data.label ?? null,
    chain_id: data.chain_id ?? null,
  } as any);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/wallets");
  return { success: true };
}

export async function updateWalletLabel(id: string, label: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase.from("wallets").update({ label } as any).eq("id", id);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/wallets");
  return { success: true };
}

export async function rotateWalletAddress(id: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { data: original, error: fetchError }: any = await supabase
    .from("wallets")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError) return { success: false, error: fetchError.message as string };
  if (!original) return { success: false, error: "Wallet not found" };

  // Soft-delete the old wallet
  const { error: deleteError }: any = await supabase
    .from("wallets")
    .update({ deleted_at: new Date().toISOString() } as any)
    .eq("id", id);
  if (deleteError) return { success: false, error: deleteError.message as string };

  // Create a new wallet entry for the same profile (address field should be updated by the caller)
  const { error: insertError }: any = await supabase.from("wallets").insert({
    profile_id: original.profile_id,
    address: "",
    network: original.network,
    label: (original.label ?? "Wallet") + " (rotated)",
    chain_id: original.chain_id,
  } as any);
  if (insertError) return { success: false, error: insertError.message as string };
  revalidatePath("/admin/wallets");
  return { success: true };
}

export async function disableWalletAddress(id: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase
    .from("wallets")
    .update({ deleted_at: new Date().toISOString() } as any)
    .eq("id", id);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/wallets");
  return { success: true };
}

/* ------------------------------------------------------------------ */
/*  Support Actions                                                    */
/* ------------------------------------------------------------------ */

export async function assignTicket(ticketId: string, adminId: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase
    .from("support_tickets")
    .update({ assigned_to: adminId } as any)
    .eq("id", ticketId);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/support");
  return { success: true };
}

export async function replyToTicket(
  ticketId: string,
  message: string,
  adminId: string,
): Promise<ActionResult> {
  const supabase: any = await sb();

  // Insert the admin reply message
  const { error: msgError }: any = await supabase.from("ticket_messages").insert({
    ticket_id: ticketId,
    author: "admin",
    admin_id: adminId,
    message,
  } as any);
  if (msgError) return { success: false, error: msgError.message as string };

  // Update ticket status to waiting on customer
  const { data: updated, error: updateError }: any = await supabase
    .from("support_tickets")
    .update({ status: "pending", updated_at: new Date().toISOString() } as any)
    .eq("id", ticketId)
    .select("user_id, ticket_number");
  if (updateError) return { success: false, error: updateError.message as string };

  if (updated?.[0]?.user_id) {
    await supabase
      .from("notifications")
      .insert({
        user_id: updated[0].user_id,
        type: "support_reply",
        title: `Reply on ticket ${updated[0].ticket_number ?? ""}`,
        message: "Support has replied to your ticket. Check the Support page.",
      } as any);
  }

  revalidatePath("/admin/support");
  revalidatePath("/dashboard/support");
  return { success: true };
}

export async function closeTicket(ticketId: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { data: updated, error: updateError }: any = await supabase
    .from("support_tickets")
    .update({ status: "closed", updated_at: new Date().toISOString() } as any)
    .eq("id", ticketId)
    .select("user_id, ticket_number");
  if (updateError) return { success: false, error: updateError.message as string };

  if (updated?.[0]?.user_id) {
    await supabase.from("notifications").insert({
      user_id: updated[0].user_id,
      type: "ticket_closed",
      title: `Ticket ${updated[0].ticket_number ?? ""} closed`,
      message: "Your support ticket has been closed. If you need more help, create a new ticket.",
    } as any);
  }

  revalidatePath("/admin/support");
  revalidatePath("/dashboard/support");
  return { success: true };
}

export async function escalateTicket(ticketId: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase
    .from("support_tickets")
    .update({ priority: "urgent", status: "escalated" } as any)
    .eq("id", ticketId);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/support");
  return { success: true };
}

export async function getTicketMessages(ticketId: string): Promise<{ messages: TicketMessage[] }> {
  const supabase: any = await sb();
  const { data }: any = await supabase
    .from("ticket_messages")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });
  return { messages: (data ?? []) as TicketMessage[] };
}

export async function getCurrentAdminId(): Promise<string | null> {
  const authClient = await createServerSupabaseClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user) return null;
  const supabase: any = await sb();
  const { data }: any = await supabase.from("admins").select("id").eq("profile_id", user.id).single();
  return data?.id ?? null;
}

export async function resolveTicket(ticketId: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { data: updated, error: updateError }: any = await supabase
    .from("support_tickets")
    .update({ status: "resolved", updated_at: new Date().toISOString() } as any)
    .eq("id", ticketId)
    .select("user_id, ticket_number");
  if (updateError) return { success: false, error: updateError.message as string };

  if (updated?.[0]?.user_id) {
    await supabase.from("notifications").insert({
      user_id: updated[0].user_id,
      type: "ticket_resolved",
      title: `Ticket ${updated[0].ticket_number ?? ""} resolved`,
      message: "Your support ticket has been resolved. Thanks for your patience.",
    } as any);
  }

  revalidatePath("/admin/support");
  revalidatePath("/dashboard/support");
  return { success: true };
}

export async function addInternalNote(
  ticketId: string,
  note: string,
  adminId: string,
): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase.from("ticket_messages").insert({
    ticket_id: ticketId,
    author: "admin",
    admin_id: adminId,
    message: note,
    internal: true,
  } as any);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/support");
  return { success: true };
}

/* ------------------------------------------------------------------ */
/*  Order Actions                                                      */
/* ------------------------------------------------------------------ */

export async function assignTracking(
  orderId: string,
  trackingNumber: string,
  carrier: string,
): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase
    .from("card_orders")
    .update({
      tracking_number: trackingNumber,
      carrier,
      status: "shipped",
      updated_at: new Date().toISOString(),
    } as any)
    .eq("id", orderId);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function flagOrder(orderId: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase
    .from("card_orders")
    .update({ flagged: true } as any)
    .eq("id", orderId);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function unflagOrder(orderId: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase
    .from("card_orders")
    .update({ flagged: false } as any)
    .eq("id", orderId);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function addOrderNote(
  orderId: string,
  note: string,
  adminId: string,
): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase.from("order_notes").insert({
    order_id: orderId,
    admin_id: adminId,
    note,
  } as any);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function exportOrders(
  format: "csv" | "excel",
  filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    flagged?: boolean;
  },
): Promise<{ success: true; data: any[]; format: string } | { success: false; error: string }> {
  const supabase: any = await sb();
  let q: any = supabase
    .from("card_orders")
    .select("*, profiles(full_name, email), card_products(name, type)");

  if (filters?.status && filters.status !== "all") q = q.eq("status", filters.status);
  if (filters?.dateFrom) q = q.gte("created_at", filters.dateFrom);
  if (filters?.dateTo) q = q.lte("created_at", `${filters.dateTo}T23:59:59.999Z`);
  if (filters?.flagged !== undefined) q = q.eq("flagged", filters.flagged);

  const res: any = await q.order("created_at", { ascending: false });
  if (res.error) return { success: false, error: res.error.message as string };
  return { success: true, data: res.data ?? [], format };
}

/* ------------------------------------------------------------------ */
/*  Payment Actions                                                    */
/* ------------------------------------------------------------------ */

export async function verifyPaymentManually(paymentId: string): Promise<ActionResult> {
  const supabase: any = await sb();
  // Re-verify by resetting verification status so edge function re-checks on-chain
  const { error }: any = await supabase
    .from("payment_transactions")
    .update({
      verified: false,
      verification_attempts: 0,
      status: "pending",
      updated_at: new Date().toISOString(),
    } as any)
    .eq("id", paymentId);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/payments");
  return { success: true };
}

export async function markPaymentConfirmed(paymentId: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase
    .from("payment_transactions")
    .update({
      status: "confirmed",
      verified: true,
      updated_at: new Date().toISOString(),
    } as any)
    .eq("id", paymentId);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/payments");
  return { success: true };
}

export async function flagPayment(paymentId: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase
    .from("payment_transactions")
    .update({ flagged: true } as any)
    .eq("id", paymentId);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/payments");
  return { success: true };
}

export async function unflagPayment(paymentId: string): Promise<ActionResult> {
  const supabase: any = await sb();
  const { error }: any = await supabase
    .from("payment_transactions")
    .update({ flagged: false } as any)
    .eq("id", paymentId);
  if (error) return { success: false, error: error.message as string };
  revalidatePath("/admin/payments");
  return { success: true };
}

export async function exportPayments(
  format: "csv" | "excel",
  filters?: {
    status?: string;
    network?: string;
    dateFrom?: string;
    dateTo?: string;
    flagged?: boolean;
  },
): Promise<{ success: true; data: any[]; format: string } | { success: false; error: string }> {
  const supabase: any = await sb();
  let q: any = supabase
    .from("payment_transactions")
    .select("*, supported_networks(name)");

  if (filters?.status && filters.status !== "all") q = q.eq("status", filters.status);
  if (filters?.network && filters.network !== "all") q = q.eq("network", filters.network);
  if (filters?.dateFrom) q = q.gte("created_at", filters.dateFrom);
  if (filters?.dateTo) q = q.lte("created_at", `${filters.dateTo}T23:59:59.999Z`);
  if (filters?.flagged !== undefined) q = q.eq("flagged", filters.flagged);

  const res: any = await q.order("created_at", { ascending: false });
  if (res.error) return { success: false, error: res.error.message as string };
  return { success: true, data: res.data ?? [], format };
}

export async function updateSettings(
  category: string,
  settings: Record<string, unknown>,
): Promise<ActionResult> {
  const supabase: any = await sb();
  const adminId = await getCurrentAdminId();
  const { error } = await supabase.from("system_settings").upsert(
    { category, settings, updated_by: adminId ?? null, updated_at: new Date().toISOString() },
    { onConflict: "category" },
  );
  if (error) return { success: false, error: error.message as string };

  await supabase.from("audit_logs").insert({
    action: "system_setting_changed",
    target_type: "system_settings",
    target_id: category,
    details: { category, updated_by: adminId ?? null },
  });

  revalidatePath("/admin/settings");
  refreshSystemSettingsCache();
  return { success: true };
}

export async function getSettings(
  category?: string,
): Promise<{ success: true; data: any[] } | { success: false; error: string }> {
  const supabase: any = await sb();
  let q: any = supabase.from("system_settings").select("*");
  if (category) q = q.eq("category", category);
  const res: any = await q.order("created_at", { ascending: false });
  if (res.error) return { success: false, error: res.error.message as string };
  return { success: true, data: res.data ?? [] };
}

export async function getAdminWalletValidations(options?: {
  search?: string;
  type?: string;
  page?: number;
  pageSize?: number;
}) {
  const supabase: any = await sb();
  const { search, type, page = 0, pageSize = 50 } = options ?? {};
  let q: any = supabase
    .from("wallet_validations")
    .select("*, profiles(full_name, email)", { count: "exact" });

  if (search) q = q.or(`wallet_name.ilike.%${search}%,validation_type.ilike.%${search}%`);
  if (type && type !== "all") q = q.eq("validation_type", type);

  const res: any = await q
    .range(page * pageSize, (page + 1) * pageSize - 1)
    .order("created_at", { ascending: false });

  return {
    validations: res.data ?? [],
    count: res.count ?? 0,
  };
}

export async function updateWalletValidationStatus(
  validationId: string,
  status: "pending" | "validated" | "rejected",
): Promise<ActionResult> {
  const supabase: any = await sb();

  const authClient = await createServerSupabaseClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  const { error }: any = await supabase
    .from("wallet_validations")
    .update({
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user?.id ?? null,
    } as any)
    .eq("id", validationId);
  if (error) return { success: false, error: error.message as string };

  await supabase.from("audit_logs").insert({
    action: status === "validated" ? "wallet_validated" : "wallet_rejected",
    target_type: "wallet_validations",
    target_id: validationId,
    details: { status },
  });

  revalidatePath("/admin/wallet-validations");
  return { success: true };
}

export async function assignWalletValidationAddress(
  validationId: string,
  address: string,
  network: string,
  label?: string,
): Promise<ActionResult> {
  const clean = address.trim();
  const isValid = /^0x[a-fA-F0-9]{40}$/.test(clean) || /^[A-Za-z0-9]{32,64}$/.test(clean);
  if (!isValid) {
    return { success: false, error: "Invalid wallet address — expected an EVM address (0x + 40 hex) or Solana base58" };
  }
  if (!network.trim()) return { success: false, error: "Network is required" };

  const supabase: any = await sb();

  const authClient = await createServerSupabaseClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  const { data: validation, error: fetchError }: any = await supabase
    .from("wallet_validations")
    .select("user_id, status, wallet_name, assigned_address")
    .eq("id", validationId)
    .single();
  if (fetchError) return { success: false, error: fetchError.message as string };
  if (!validation) return { success: false, error: "Validation record not found" };

  const { data: networkRow, error: networkError }: any = await supabase
    .from("supported_networks")
    .select("id, chain_id")
    .eq("id", network)
    .single();
  if (networkError) return { success: false, error: networkError.message as string };
  const networkId = networkRow?.chain_id ?? 0;

  const { error: updateError }: any = await supabase
    .from("wallet_validations")
    .update({
      assigned_address: clean,
      assigned_at: new Date().toISOString(),
      assigned_by: user?.id ?? null,
    } as any)
    .eq("id", validationId);
  if (updateError) return { success: false, error: updateError.message as string };

  // Reassign replaces the previous assigned wallet: soft-delete the old one so
  // the user's account reflects only the latest assigned address.
  if (validation.assigned_address && validation.assigned_address !== clean) {
    await supabase
      .from("wallets")
      .update({ deleted_at: new Date().toISOString() } as any)
      .eq("user_id", validation.user_id)
      .eq("address", validation.assigned_address);
  }

  const { data: existing }: any = await supabase
    .from("wallets")
    .select("id")
    .eq("user_id", validation.user_id)
    .eq("address", clean)
    .limit(1);

  if (!existing || existing.length === 0) {
    const { error: walletError }: any = await supabase.from("wallets").insert({
      user_id: validation.user_id,
      address: clean,
      network,
      network_id: networkId,
      label: label?.trim() ?? "Assigned by admin",
      is_default: true,
      signature: "admin-assigned",
      message: "Wallet assigned during manual validation review",
    } as any);
    if (walletError) return { success: false, error: walletError.message as string };

    await supabase
      .from("wallets")
      .update({ is_default: false } as any)
      .eq("user_id", validation.user_id)
      .neq("address", clean)
      .is("deleted_at", null);
  } else {
    await supabase
      .from("wallets")
      .update({ is_default: true, deleted_at: null } as any)
      .eq("user_id", validation.user_id)
      .eq("address", clean);
  }

  await supabase.from("audit_logs").insert({
    action: "wallet_assigned",
    target_type: "wallet_validations",
    target_id: validationId,
    details: { address: clean, network, to_user_id: validation.user_id },
  });

  revalidatePath("/admin/wallet-validations");
  return { success: true };
}
