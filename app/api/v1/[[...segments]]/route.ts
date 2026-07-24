/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { requireAuth, requireAdmin } from "@/lib/api/require-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteHandler = (req: NextRequest, params: Record<string, string>, user?: any) => Promise<NextResponse>;

const handlers = new Map<string, Map<string, RouteHandler>>();

function route(method: string, path: string, handler: RouteHandler) {
  if (!handlers.has(method)) handlers.set(method, new Map());
  handlers.get(method)!.set(path, handler);
}

import { createClient } from "@supabase/supabase-js";
function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

// ── Auth ──────────────────────────────────────────────
route("POST", "auth/register", async (req, _p, _u) => {
  const body = await req.json();
  const supabase: any = sb();
  const { data, error }: any = await supabase.auth.signUp({ email: body.email, password: body.password, options: { data: { full_name: body.fullName } } });
  if (error) return apiError([{ code: "AUTH_001", message: error.message }], 400);
  return apiSuccess({ user: data.user }, "Registration successful", 201);
});

route("POST", "auth/login", async (req) => {
  const body = await req.json();
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
  const body = await req.json();
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
  const body = await req.json();
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
  const body = await req.json();
  const supabase: any = sb();
  const { data, error }: any = await supabase.from("support_tickets").insert({ user_id: user.id, subject: body.subject, category: body.category ?? "general", priority: body.priority ?? "medium", message: body.message }).select().single();
  if (error) return apiError([{ code: "GEN_001", message: error.message }], 400);
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

// ── Webhooks ─────────────────────────────────────────
route("POST", "webhooks/walletconnect", async (req) => {
  const body = await req.json();
  const supabase: any = sb();
  await supabase.from("webhook_events").insert({ source: "walletconnect", payload: body });
  return apiSuccess(null, "Webhook received");
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

  const handler = methodHandlers.get(path);
  if (!handler) return apiError([{ code: "GEN_001", message: `Not found: ${method} /api/v1/${path}` }], 404);

  try {
    const { user } = await requireAuth(req);
    const pathParams: Record<string, string> = {};
    return await handler(req, pathParams, user);
  } catch (err: any) {
    return apiError([{ code: "GEN_006", message: err?.message ?? "Internal server error" }], 500);
  }
}
