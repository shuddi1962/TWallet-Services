/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

export async function auditLog(params: {
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: Record<string, unknown>;
}) {
  try {
    const supabase: any = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
    const hdrs: any = await headers();
    await supabase.from("audit_logs").insert({
      admin_id: params.adminId,
      action: params.action,
      target_type: params.targetType,
      target_id: params.targetId,
      details: params.details ?? {},
      ip_address: (hdrs.get("x-forwarded-for") ?? hdrs.get("x-real-ip") ?? "unknown") as string,
      user_agent: (hdrs.get("user-agent") ?? null) as string | null,
    });
  } catch {
    // Audit failures should not break the request
  }
}
