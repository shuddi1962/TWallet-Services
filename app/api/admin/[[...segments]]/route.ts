import { createAdminClient } from "@/lib";
import { AppError, ErrorCodes } from "@/lib/errors";
import { NextResponse } from "next/server";

const ALLOWED_TABLES = ["profiles", "card_orders", "payment_transactions", "card_products", "notifications", "wallets", "supported_networks", "audit_logs"] as const;

export async function GET(request: Request, { params }: { params: Promise<{ segments?: string[] }> }) {
  try {
    const segments = (await params).segments ?? [];
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
    const offset = Number(searchParams.get("offset")) || 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new AppError(ErrorCodes.UNAUTHORIZED, "Not authenticated");

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single() as { data: { role: string } | null; error: unknown };
    if (!profile || !["super_admin", "operations", "finance", "support", "viewer"].includes(profile.role)) {
      throw new AppError(ErrorCodes.FORBIDDEN, "Not authorized");
    }

    if (segments.length === 0) {
      const results: Record<string, number> = {};
      for (const table of ALLOWED_TABLES) {
        const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
        results[table] = count ?? 0;
      }
      return NextResponse.json({ data: results });
    }

    const table = segments[0];
    if (!table || !ALLOWED_TABLES.includes(table as typeof ALLOWED_TABLES[number])) {
      throw new AppError(ErrorCodes.VALIDATION_ERROR, "Invalid table");
    }

    const { data, error, count } = await supabase
      .from(table)
      .select("*", { count: "estimated" })
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (error) throw new AppError(ErrorCodes.INTERNAL_ERROR, error.message);

    return NextResponse.json({ data, count, limit, offset });
  } catch (err) {
    if (err instanceof AppError) {
      return NextResponse.json(err.toJSON(), { status: err.status });
    }
    return NextResponse.json({ error: { code: ErrorCodes.INTERNAL_ERROR, message: "Internal error" } }, { status: 500 });
  }
}
