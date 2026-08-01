/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@supabase/supabase-js";
import { apiError } from "./response";
import type { NextRequest } from "next/server";

export type AdminRole = "super_admin" | "operations" | "finance" | "support" | "viewer";

export const PERMISSION_MATRIX: Record<AdminRole, string[]> = {
  super_admin: ["*"],
  operations: ["read:users", "read:orders", "write:orders", "read:payments", "read:cards", "read:reports", "read:audit"],
  finance: ["read:payments", "read:orders", "read:reports", "export:reports"],
  support: ["read:users", "read:orders", "read:tickets", "write:tickets"],
  viewer: ["read:dashboard", "read:users", "read:orders", "read:payments", "read:reports", "read:audit"],
};

export function requirePermission(role: AdminRole, permission: string): boolean {
  if (role === "super_admin") return true;
  return PERMISSION_MATRIX[role]?.includes(permission) ?? false;
}

export async function requireAuth(_request?: NextRequest) {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
  const authResult: any = await sb.auth.getUser();
  const user = authResult?.data?.user;
  if (!user) {
    return { user: null as any, error: apiError([{ code: "AUTH_006", message: "Session expired" }], 401) };
  }
  return { user, error: null as any };
}

export async function getCurrentUserId(request?: NextRequest): Promise<string | null> {
  const { user, error } = await requireAuth(request);
  if (error || !user) return null;
  return user.id;
}

export async function getCurrentAdminRole(request?: NextRequest): Promise<AdminRole | null> {
  const { user, error } = await requireAuth(request);
  if (error || !user) return null;
  const sb: any = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const roleResult: any = await sb
    .from("user_roles")
    .select("role, admins!inner(profile_id)")
    .eq("user_id", user.id)
    .single();
  return (roleResult?.data?.role as AdminRole) ?? null;
}

export async function requireAdmin(request?: NextRequest) {
  const role = await getCurrentAdminRole(request);
  if (!role) {
    return { role: null as any, error: apiError([{ code: "GEN_003", message: "Forbidden" }], 403) };
  }
  return { role, error: null as any };
}
