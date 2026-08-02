/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { requireAuth, requireAdmin } from "@/lib/api/require-auth";
import { parseBody } from "@/lib/api/parse-body";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteHandler = (req: NextRequest, params: Record<string, string>, user?: any) => Promise<NextResponse>;

const handlers = new Map<string, Map<string, RouteHandler>>();

function route(method: string, path: string, handler: RouteHandler) {
  if (!handlers.has(method)) handlers.set(method, new Map());
  handlers.get(method)!.set(path, handler);
}

import { createClient } from "@supabase/supabase-js";
import { authRegisterSchema, authLoginSchema, createOrderSchema, createPaymentSchema, updateProfileSchema, createTicketSchema } from "@/lib/zod/schemas";

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

function validateBody(schema: any, body: any): NextResponse | null {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((iss: any) => ({ code: "GEN_004", field: iss.path.join("."), message: iss.message }));
    return apiError(errors, 422);
  }
  return null;
}

// ── Auth ──────────────────────────────────────────────
route("POST", "auth/register", async (req, _p, _u) => {
  const body = await parseBody(req);
  const valErr = validateBody(authRegisterSchema, body);
  if (valErr) return valErr;
  const supabase: any = sb();
  const { data, error }: any = await supabase.auth.signUp({ email: body.email, password: body.password, options: { data: { full_name: body.fullName } } });
  if (error) return apiError([{ code: "AUTH_001", message: error.message }], 400);
  return apiSuccess({ user: data.user }, "Registration successful", 201);
});

route("POST", "auth/login", async (req) => {
  const body = await parseBody(req);
  const valErr = validateBody(authLoginSchema, body);
  if (valErr) return valErr;
  const supabase: any = sb();
  const { data, error }: any = await supabase.auth.signInWithPassword({ email: body.email, password: body.password });
  if (error) return apiError([{ code: "AUTH_004", message: "Invalid credentials" }], 401);
  return apiSuccess({ session: data.session, user: data.user });
});

route("POST", "auth/logout", async (_req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const supabase: any = sb();
  await supabase.auth.admin.signOut(user.id);
  return apiSuccess(null, "Logged out");
});

route("POST", "auth/forgot-password", async (req) => {
  const body = await parseBody(req);
  const supabase: any = sb();
  const { error }: any = await supabase.auth.resetPasswordForEmail(body.email, { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password` });
  if (error) return apiError([{ code: "AUTH_005", message: error.message }], 400);
  return apiSuccess(null, "Password reset email sent");
});

// ── Users ─────────────────────────────────────────────
route("GET", "users/me", async (_req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const supabase: any = sb();
  const { data }: any = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return apiSuccess(data);
});

route("PATCH", "users/me", async (req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const body = await parseBody(req);
  const valErr = validateBody(updateProfileSchema, body);
  if (valErr) return valErr;
  const supabase: any = sb();
  const { data, error }: any = await supabase.from("profiles").update(body).eq("id", user.id).select().single();
  if (error) return apiError([{ code: "GEN_001", message: error.message }], 400);
  return apiSuccess(data, "Profile updated");
});

// ── Wallets ───────────────────────────────────────────
route("GET", "wallets", async (_req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const supabase: any = sb();
  const { data }: any = await supabase.from("wallets").select("*").eq("user_id", user.id).is("deleted_at", null);
  return apiSuccess(data);
});

// ── Orders ────────────────────────────────────────────
route("GET", "orders", async (_req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const supabase: any = sb();
  const { data }: any = await supabase.from("card_orders").select("*, card_products(name, type)").eq("user_id", user.id).order("created_at", { ascending: false });
  return apiSuccess(data);
});

// ── Payments ──────────────────────────────────────────
route("GET", "payments", async (_req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const supabase: any = sb();
  const { data }: any = await supabase.from("payment_transactions").select("*, supported_networks(name)").eq("user_id", user.id).order("created_at", { ascending: false });
  return apiSuccess(data);
});

// ── Notifications ─────────────────────────────────────
route("GET", "notifications", async (_req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const supabase: any = sb();
  const { data }: any = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  return apiSuccess(data);
});

// ── Support ──────────────────────────────────────────
route("GET", "support/tickets", async (_req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const supabase: any = sb();
  const { data }: any = await supabase.from("support_tickets").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  return apiSuccess(data);
});

route("POST", "support/tickets", async (req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const body = await parseBody(req);
  const valErr = validateBody(createTicketSchema, body);
  if (valErr) return valErr;
  const supabase: any = sb();
  const { data: ticketNumber } = await supabase.rpc("generate_ticket_number");
  const { data, error }: any = await supabase
    .from("support_tickets")
    .insert({
      ticket_number: ticketNumber ?? `TKT-${Date.now()}`,
      user_id: user.id,
      subject: body.subject,
      category: body.category ?? "other",
      priority: body.priority ?? "medium",
      status: "open",
      ...(body.orderId ? { order_id: body.orderId } : {}),
    })
    .select()
    .single();
  if (error) return apiError([{ code: "GEN_001", message: error.message }], 400);

  await supabase.from("ticket_messages").insert({
    ticket_id: data.id,
    author: "customer",
    message: body.message,
  });

  await supabase.from("notifications").insert({
    user_id: user.id,
    type: "ticket_created",
    title: `Ticket ${data.ticket_number} received`,
    message: "We've received your request and will get back to you within 24 hours.",
  });

  return apiSuccess(data, "Ticket created", 201);
});

// ── Admin ─────────────────────────────────────────────
route("GET", "admin/dashboard", async (req) => {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const supabase: any = sb();
  const [profiles, orders, payments, tickets]: any = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("card_orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("payment_transactions").select("amount").eq("status", "confirmed"),
    supabase.from("support_tickets").select("*", { count: "exact", head: true }).in("status", ["open", "pending"]),
  ]);
  const revenue = (payments?.data ?? []).reduce((s: number, t: any) => s + (t.amount ?? 0), 0);
  return apiSuccess({ totalUsers: profiles?.count ?? 0, pendingOrders: orders?.count ?? 0, revenue, openTickets: tickets?.count ?? 0 });
});

route("GET", "admin/users", async (req) => {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const url = new URL(req.url);
  const supabase: any = sb();
  const q: any = supabase.from("profiles").select("*, user_roles(role), wallets(address)");
  if (url.searchParams.get("search")) q.or(`full_name.ilike.%${url.searchParams.get("search")}%,email.ilike.%${url.searchParams.get("search")}%`);
  const { data }: any = await q.is("deleted_at", null).order("created_at", { ascending: false });
  return apiSuccess(data);
});

route("GET", "admin/orders", async (req) => {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const supabase: any = sb();
  const { data }: any = await supabase.from("card_orders").select("*, profiles(full_name, email), card_products(name, type)").order("created_at", { ascending: false });
  return apiSuccess(data);
});

route("GET", "admin/payments", async (req) => {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const supabase: any = sb();
  const { data }: any = await supabase.from("payment_transactions").select("*, supported_networks(name)").order("created_at", { ascending: false });
  return apiSuccess(data);
});

route("GET", "admin/settings", async (req) => {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const supabase: any = sb();
  const { data }: any = await supabase.from("app_settings").select("*").single();
  return apiSuccess(data);
});

// ── System ───────────────────────────────────────────
route("GET", "system/health", async () => {
  return apiSuccess({ status: "ok", timestamp: new Date().toISOString(), uptime: process.uptime() });
});

route("GET", "system/version", async () => {
  const pkg = await import("@/package.json").then((m) => ({ version: m.default.version }));
  return apiSuccess(pkg);
});

route("GET", "system/status", async () => {
  const supabase: any = sb();
  const { error }: any = await supabase.from("profiles").select("id").limit(1);
  return apiSuccess({ database: error ? "degraded" : "ok", timestamp: new Date().toISOString() });
});

route("GET", "system/config", async () => {
  return apiSuccess({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
    environment: process.env.NODE_ENV ?? "development",
  });
});

// ── Orders (dynamic) ─────────────────────────────────
route("GET", "orders/:id", async (_req, params, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const supabase: any = sb();
  const { data }: any = await supabase.from("card_orders").select("*, card_products(name, type)").eq("id", params.id).eq("user_id", user.id).single();
  if (!data) return apiError([{ code: "GEN_001", message: "Order not found" }], 404);
  return apiSuccess(data);
});

route("PATCH", "orders/:id/cancel", async (_req, params, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const supabase: any = sb();
  const { data, error }: any = await supabase.from("card_orders").update({ status: "cancelled" } as any).eq("id", params.id).eq("user_id", user.id).select().single();
  if (error) return apiError([{ code: "GEN_001", message: error.message }], 400);
  return apiSuccess(data, "Order cancelled");
});

// ── Payments (dynamic) ──────────────────────────────
route("GET", "payments/:id", async (_req, params, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const supabase: any = sb();
  const { data }: any = await supabase.from("payment_transactions").select("*").eq("id", params.id).eq("user_id", user.id).single();
  if (!data) return apiError([{ code: "GEN_001", message: "Payment not found" }], 404);
  return apiSuccess(data);
});

// ── Support tickets (dynamic) ───────────────────────
route("GET", "support/tickets/:id", async (_req, params, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const supabase: any = sb();
  const { data }: any = await supabase.from("support_tickets").select("*").eq("id", params.id).eq("user_id", user.id).single();
  if (!data) return apiError([{ code: "GEN_001", message: "Ticket not found" }], 404);
  return apiSuccess(data);
});

route("PATCH", "support/tickets/:id", async (req, params, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const body = await parseBody(req);
  const supabase: any = sb();
  const { data, error }: any = await supabase.from("support_tickets").update(body as any).eq("id", params.id).eq("user_id", user.id).select().single();
  if (error) return apiError([{ code: "GEN_001", message: error.message }], 400);
  return apiSuccess(data, "Ticket updated");
});

route("POST", "support/tickets/:id/reply", async (req, params, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const body = await parseBody(req);
  const supabase: any = sb();
  const { data, error }: any = await supabase.from("ticket_messages").insert({ ticket_id: params.id, user_id: user.id, message: body.message }).select().single();
  if (error) return apiError([{ code: "GEN_001", message: error.message }], 400);
  return apiSuccess(data, "Reply added", 201);
});

// ── Notifications (dynamic) ──────────────────────────
route("DELETE", "notifications/:id", async (_req, params, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const supabase: any = sb();
  const { error }: any = await supabase.from("notifications").delete().eq("id", params.id).eq("user_id", user.id);
  if (error) return apiError([{ code: "GEN_001", message: error.message }], 400);
  return apiSuccess(null, "Notification deleted");
});

// ── Admin (dynamic) ──────────────────────────────────
route("PATCH", "admin/users/:id", async (req, params) => {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const body = await parseBody(req);
  const supabase: any = sb();
  const { data, error: updateError }: any = await supabase.from("profiles").update(body as any).eq("id", params.id).select().single();
  if (updateError) return apiError([{ code: "GEN_001", message: updateError.message }], 400);
  return apiSuccess(data, "User updated");
});

route("PATCH", "admin/orders/:id", async (req, params) => {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const body = await parseBody(req);
  const supabase: any = sb();
  const { data, error: updateError }: any = await supabase.from("card_orders").update(body as any).eq("id", params.id).select().single();
  if (updateError) return apiError([{ code: "GEN_001", message: updateError.message }], 400);
  return apiSuccess(data, "Order updated");
});

route("PATCH", "admin/payments/:id", async (req, params) => {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const body = await parseBody(req);
  const supabase: any = sb();
  const { data, error: updateError }: any = await supabase.from("payment_transactions").update(body as any).eq("id", params.id).select().single();
  if (updateError) return apiError([{ code: "GEN_001", message: updateError.message }], 400);
  return apiSuccess(data, "Payment updated");
});

route("PATCH", "admin/cards/:id", async (req, params) => {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const body = await parseBody(req);
  const supabase: any = sb();
  const { data, error: updateError }: any = await supabase.from("card_products").update(body as any).eq("id", params.id).select().single();
  if (updateError) return apiError([{ code: "GEN_001", message: updateError.message }], 400);
  return apiSuccess(data, "Card product updated");
});

// ── Webhooks ─────────────────────────────────────────
route("POST", "webhooks/walletconnect", async (req) => {
  const body = await parseBody(req);
  const supabase: any = sb();
  await supabase.from("webhook_events").insert({ source: "walletconnect", payload: body });
  return apiSuccess(null, "Webhook received");
});

route("POST", "webhooks/blockchain", async (req) => {
  const body = await parseBody(req);
  const supabase: any = sb();
  await supabase.from("webhook_events").insert({ source: "blockchain", payload: body });
  return apiSuccess(null, "Webhook received");
});

route("POST", "webhooks/email", async (req) => {
  const body = await parseBody(req);
  const supabase: any = sb();
  await supabase.from("webhook_events").insert({ source: "email", payload: body });
  return apiSuccess(null, "Webhook received");
});

route("POST", "webhooks/storage", async (req) => {
  const body = await parseBody(req);
  const supabase: any = sb();
  await supabase.from("webhook_events").insert({ source: "storage", payload: body });
  return apiSuccess(null, "Webhook received");
});

route("POST", "webhooks/shipping", async (req) => {
  const body = await parseBody(req);
  const supabase: any = sb();
  await supabase.from("webhook_events").insert({ source: "shipping", payload: body });
  return apiSuccess(null, "Webhook received");
});

// ── Auth (additional) ─────────────────────────────────
route("POST", "auth/refresh", async (req) => {
  const body = await parseBody(req);
  const supabase: any = sb();
  const { data, error }: any = await supabase.auth.refreshSession({ refresh_token: body.refreshToken });
  if (error) return apiError([{ code: "AUTH_006", message: "Session expired" }], 401);
  return apiSuccess({ session: data.session, user: data.user });
});

route("POST", "auth/verify-email", async (req) => {
  const body = await parseBody(req);
  const supabase: any = sb();
  const { error }: any = await supabase.auth.verifyOtp({ token_hash: body.token, type: "email" });
  if (error) return apiError([{ code: "AUTH_005", message: error.message }], 400);
  return apiSuccess(null, "Email verified");
});

route("GET", "auth/session", async (_req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  return apiSuccess({ user });
});

// ── Users (additional) ───────────────────────────────
route("GET", "users/preferences", async (_req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const supabase: any = sb();
  const { data }: any = await supabase.from("user_preferences").select("*").eq("user_id", user.id).single();
  return apiSuccess(data ?? {});
});

route("PATCH", "users/preferences", async (req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const body = await parseBody(req);
  const supabase: any = sb();
  const { data, error }: any = await supabase.from("user_preferences").upsert({ user_id: user.id, ...body }).select().single();
  if (error) return apiError([{ code: "GEN_001", message: error.message }], 400);
  return apiSuccess(data, "Preferences updated");
});

route("GET", "users/security", async (_req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const supabase: any = sb();
  const { data }: any = await supabase.from("profiles").select("id, email, created_at").eq("id", user.id).single();
  return apiSuccess(data);
});

route("DELETE", "users/me", async (_req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const supabase: any = sb();
  const { error }: any = await supabase.from("profiles").update({ deleted_at: new Date().toISOString() } as any).eq("id", user.id);
  if (error) return apiError([{ code: "GEN_001", message: error.message }], 400);
  return apiSuccess(null, "Account scheduled for deletion");
});

// ── Wallets (additional) ─────────────────────────────
route("POST", "wallets/connect", async (req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const body = await parseBody(req);
  const supabase: any = sb();
  const { data, error }: any = await supabase.from("wallets").insert({ user_id: user.id, address: body.address, network: body.network, chain_id: body.chainId }).select().single();
  if (error) return apiError([{ code: "WALLET_001", message: error.message }], 400);
  return apiSuccess(data, "Wallet connected", 201);
});

route("GET", "wallets/networks", async () => {
  const supabase: any = sb();
  const { data }: any = await supabase.from("supported_networks").select("*").eq("active", true);
  return apiSuccess(data);
});

// ── Cards ────────────────────────────────────────────
route("GET", "cards", async () => {
  const supabase: any = sb();
  const { data }: any = await supabase.from("card_products").select("*").eq("archived", false);
  return apiSuccess(data);
});

route("POST", "cards/order", async (req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const body = await parseBody(req);
  const valErr = validateBody(createOrderSchema, body);
  if (valErr) return valErr;
  const supabase: any = sb();
  const { data, error }: any = await supabase.from("card_orders").insert({ user_id: user.id, card_product_id: body.cardProductId, shipping_address_id: body.shippingAddressId, network_id: body.networkId, status: "pending" }).select().single();
  if (error) return apiError([{ code: "GEN_001", message: error.message }], 400);
  return apiSuccess(data, "Order created", 201);
});

route("GET", "cards/orders", async (_req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const supabase: any = sb();
  const { data }: any = await supabase.from("card_orders").select("*, card_products(name, type)").eq("user_id", user.id).order("created_at", { ascending: false });
  return apiSuccess(data);
});

// ── Payments (additional) ────────────────────────────
route("POST", "payments/create", async (req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const body = await parseBody(req);
  const valErr = validateBody(createPaymentSchema, body);
  if (valErr) return valErr;
  const supabase: any = sb();
  const { data, error }: any = await supabase.from("payment_transactions").insert({ user_id: user.id, order_id: body.orderId, tx_hash: body.txHash, network_id: body.networkId, amount: body.amount, token_address: body.tokenAddress, status: "pending" }).select().single();
  if (error) return apiError([{ code: "PAY_001", message: error.message }], 400);
  return apiSuccess(data, "Payment created", 201);
});

route("POST", "payments/verify", async (req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const body = await parseBody(req);
  const supabase: any = sb();
  const { data, error }: any = await supabase.from("payment_transactions").update({ verified: true, status: "confirmed" } as any).eq("id", body.paymentId).select().single();
  if (error) return apiError([{ code: "PAY_010", message: error.message }], 400);
  return apiSuccess(data, "Payment verified");
});

route("GET", "payments/history", async (_req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const supabase: any = sb();
  const { data }: any = await supabase.from("payment_transactions").select("*").eq("user_id", user.id).eq("status", "confirmed").order("created_at", { ascending: false });
  return apiSuccess(data);
});

route("GET", "payments/estimate-fees", async (req) => {
  const url = new URL(req.url);
  const network = url.searchParams.get("network") ?? "ethereum";
  return apiSuccess({ network, estimatedGas: "0.001", estimatedTime: "30 seconds" });
});

// ── Transactions ─────────────────────────────────────
route("GET", "transactions", async (_req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const supabase: any = sb();
  const { data }: any = await supabase.from("payment_transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  return apiSuccess(data);
});

route("GET", "transactions/export", async (_req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const supabase: any = sb();
  const { data }: any = await supabase.from("payment_transactions").select("id, amount, status, tx_hash, created_at").eq("user_id", user.id).order("created_at", { ascending: false });
  const csv = ["id,amount,status,tx_hash,created_at", ...((data ?? []) as any[]).map((t) => `${t.id},${t.amount},${t.status},${t.tx_hash ?? ""},${t.created_at}`)].join("\n");
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=transactions.csv" } });
});

// ── Notifications (additional) ────────────────────────
route("PATCH", "notifications/read", async (req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const body = await parseBody(req);
  const supabase: any = sb();
  const { error }: any = await supabase.from("notifications").update({ read: true } as any).eq("id", body.id).eq("user_id", user.id);
  if (error) return apiError([{ code: "GEN_001", message: error.message }], 400);
  return apiSuccess(null, "Notification marked as read");
});

route("GET", "notifications/preferences", async (_req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const supabase: any = sb();
  const { data }: any = await supabase.from("notification_preferences").select("*").eq("user_id", user.id).single();
  return apiSuccess(data ?? {});
});

route("PATCH", "notifications/preferences", async (req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const body = await parseBody(req);
  const supabase: any = sb();
  const { data, error }: any = await supabase.from("notification_preferences").upsert({ user_id: user.id, ...body }).select().single();
  if (error) return apiError([{ code: "GEN_001", message: error.message }], 400);
  return apiSuccess(data, "Preferences updated");
});

// ── Uploads ──────────────────────────────────────────
route("POST", "upload/avatar", async (req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return apiError([{ code: "GEN_004", message: "No file provided" }], 400);
  if (file.size > 5 * 1024 * 1024) return apiError([{ code: "GEN_004", message: "File too large (max 5MB)" }], 400);
  const supabase: any = sb();
  const filename = `avatars/${user.id}-${Date.now()}-${file.name}`;
  const { data, error }: any = await supabase.storage.from("avatars").upload(filename, file);
  if (error) return apiError([{ code: "GEN_001", message: error.message }], 400);
  const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filename);
  return apiSuccess({ url: urlData.publicUrl, path: data?.path }, "Avatar uploaded", 201);
});

route("POST", "upload/document", async (req, _p, user) => {
  if (!user) return apiError([{ code: "AUTH_006", message: "Not authenticated" }], 401);
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return apiError([{ code: "GEN_004", message: "No file provided" }], 400);
  const supabase: any = sb();
  const filename = `documents/${user.id}-${Date.now()}-${file.name}`;
  const { data, error }: any = await supabase.storage.from("documents").upload(filename, file);
  if (error) return apiError([{ code: "GEN_001", message: error.message }], 400);
  return apiSuccess({ path: data?.path }, "Document uploaded", 201);
});

// ── Admin (additional) ───────────────────────────────
route("GET", "admin/cards", async (req) => {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const supabase: any = sb();
  const { data }: any = await supabase.from("card_products").select("*").order("created_at", { ascending: false });
  return apiSuccess(data);
});

route("POST", "admin/cards", async (req) => {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const body = await parseBody(req);
  const supabase: any = sb();
  const { data, error: insertError }: any = await supabase.from("card_products").insert(body).select().single();
  if (insertError) return apiError([{ code: "GEN_001", message: insertError.message }], 400);
  return apiSuccess(data, "Card product created", 201);
});

route("GET", "admin/reports", async (req) => {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const supabase: any = sb();
  const { data }: any = await supabase.from("payment_transactions").select("amount, status, created_at").eq("status", "confirmed").order("created_at", { ascending: false }).limit(100);
  return apiSuccess(data);
});

route("PATCH", "admin/settings", async (req) => {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const body = await parseBody(req);
  const supabase: any = sb();
  const { data, error: updateError }: any = await supabase.from("app_settings").upsert(body).select().single();
  if (updateError) return apiError([{ code: "GEN_001", message: updateError.message }], 400);
  return apiSuccess(data, "Settings updated");
});

// ── Analytics ────────────────────────────────────────
route("GET", "analytics/dashboard", async (req) => {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const supabase: any = sb();
  const [profiles, orders, payments]: any = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("card_orders").select("*", { count: "exact", head: true }),
    supabase.from("payment_transactions").select("amount").eq("status", "confirmed"),
  ]);
  return apiSuccess({
    totalUsers: profiles?.count ?? 0,
    totalOrders: orders?.count ?? 0,
    revenue: (payments?.data ?? []).reduce((s: number, t: any) => s + (t.amount ?? 0), 0),
  });
});

route("GET", "analytics/orders", async (req) => {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const supabase: any = sb();
  const { data }: any = await supabase.from("card_orders").select("status, created_at").order("created_at", { ascending: false });
  return apiSuccess(data);
});

route("GET", "analytics/payments", async (req) => {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const supabase: any = sb();
  const { data }: any = await supabase.from("payment_transactions").select("amount, status, created_at").order("created_at", { ascending: false });
  return apiSuccess(data);
});

route("GET", "analytics/users", async (req) => {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const supabase: any = sb();
  const { data }: any = await supabase.from("profiles").select("created_at").is("deleted_at", null).order("created_at", { ascending: false });
  return apiSuccess(data);
});

route("GET", "analytics/export", async (req) => {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const supabase: any = sb();
  const { data }: any = await supabase.from("payment_transactions").select("amount, status, created_at").eq("status", "confirmed");
  const csv = ["amount,status,created_at", ...((data ?? []) as any[]).map((t) => `${t.amount},${t.status},${t.created_at}`)].join("\n");
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=analytics.csv" } });
});

// ── Main handler ─────────────────────────────────────
export async function GET(req: NextRequest, { params }: any) {
  return handleRequest("GET", req, params);
}
export async function POST(req: NextRequest, { params }: any) {
  return handleRequest("POST", req, params);
}
export async function PATCH(req: NextRequest, { params }: any) {
  return handleRequest("PATCH", req, params);
}
export async function PUT(req: NextRequest, { params }: any) {
  return handleRequest("PUT", req, params);
}
export async function DELETE(req: NextRequest, { params }: any) {
  return handleRequest("DELETE", req, params);
}

async function handleRequest(method: string, req: NextRequest, params: any) {
  const segments: string[] = params?.segments ?? [];
  const path = segments.join("/");

  const methodHandlers = handlers.get(method);
  if (!methodHandlers) return apiError([{ code: "GEN_006", message: "Method not allowed" }], 405);

  // Try exact match first, then fall back to dynamic patterns
  let handler = methodHandlers.get(path);
  let pathParams: Record<string, string> = {};
  if (!handler) {
    // Try pattern matching: e.g. "orders/:id" matches "orders/abc-123"
    for (const [pattern, h] of methodHandlers.entries()) {
      if (!pattern.includes(":")) continue;
      const patternSegments = pattern.split("/");
      const pathSegments = path.split("/");
      if (patternSegments.length !== pathSegments.length) continue;
      let matched = true;
      pathParams = {};
      for (let i = 0; i < patternSegments.length; i++) {
        const patternSeg = patternSegments[i] ?? "";
        const pathSeg = pathSegments[i] ?? "";
        if (patternSeg.startsWith(":")) {
          pathParams[patternSeg.slice(1)] = pathSeg;
        } else if (patternSeg !== pathSeg) {
          matched = false;
          break;
        }
      }
      if (matched) { handler = h; break; }
    }
  }
  if (!handler) return apiError([{ code: "GEN_001", message: `Not found: ${method} /api/v1/${path}` }], 404);

  try {
    const { user } = await requireAuth(req);
    return await handler(req, pathParams, user);
  } catch (err: any) {
    return apiError([{ code: "GEN_006", message: err?.message ?? "Internal server error" }], 500);
  }
}
