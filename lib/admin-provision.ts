import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "twalletservices.admin@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function ensureAdminProvisioned(user: {
  id: string;
  email?: string | null;
}): Promise<boolean> {
  if (!isAdminEmail(user.email)) return false;

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("admins")
    .select("profile_id")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (existing) return true;

  const { error: roleError } = await admin
    .from("user_roles")
    .upsert({ user_id: user.id, role: "admin" }, { onConflict: "user_id" });

  if (roleError) return false;

  const { error: adminError } = await admin
    .from("admins")
    .upsert({ profile_id: user.id, role: "super_admin" }, { onConflict: "profile_id" });

  return !adminError;
}

export async function isAdminUser(userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("admins")
    .select("profile_id")
    .eq("profile_id", userId)
    .maybeSingle();
  return Boolean(data);
}
