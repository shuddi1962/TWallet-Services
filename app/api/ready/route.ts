import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

async function checkDatabase() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/rest/v1/`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
      },
    );
    if (res.status >= 500) throw new Error("Database API error");
    return { status: "ok" as const };
  } catch (e) {
    return { status: "error" as const, message: e instanceof Error ? e.message : "Database unreachable" };
  }
}

function checkEnvVars() {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ] as const;
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    return { status: "error" as const, message: `Missing: ${missing.join(", ")}` };
  }
  return { status: "ok" as const };
}

async function checkStorage() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/bucket`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
      },
    );
    return { status: "ok" as const, buckets: res.ok ? 1 : 0 };
  } catch (e) {
    return { status: "error" as const, message: e instanceof Error ? e.message : "Storage unreachable" };
  }
}

export async function GET() {
  const checks = {
    env: checkEnvVars(),
    database: await checkDatabase(),
    storage: await checkStorage(),
  };

  const allHealthy = Object.values(checks).every((c) => c.status === "ok");
  const httpStatus = allHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status: allHealthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
    },
    { status: httpStatus },
  );
}
