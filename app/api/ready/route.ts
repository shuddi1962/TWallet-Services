import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = {};
  let allOk = true;

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAny: any = supabase;
    const { error: dbErr } = await supabaseAny.from("profiles").select("id").limit(1);
    checks.database = dbErr ? `error: ${(dbErr as Error).message}` : "ok";
    if (dbErr) allOk = false;
  } catch {
    checks.database = "error: connection failed";
    allOk = false;
  }

  return NextResponse.json(
    { status: allOk ? "ready" : "degraded", checks, timestamp: new Date().toISOString() },
    { status: allOk ? 200 : 503 },
  );
}
