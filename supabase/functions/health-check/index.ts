import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  const checks: Record<string, { status: string; latency?: number; error?: string }> = {};

  // Database check
  const dbStart = Date.now();
  try {
    const { error } = await supabase.from("profiles").select("id").limit(1);
    checks.database = { status: error ? "degraded" : "healthy", latency: Date.now() - dbStart, error: error?.message };
  } catch { checks.database = { status: "down", error: "connection failed" }; }

  // Auth check
  const authStart = Date.now();
  try {
    const { error } = await supabase.auth.getSession();
    checks.auth = { status: error ? "degraded" : "healthy", latency: Date.now() - authStart, error: error?.message };
  } catch { checks.auth = { status: "down", error: "auth unavailable" }; }

  // Storage check
  const storageStart = Date.now();
  try {
    const { data } = await supabase.storage.listBuckets();
    checks.storage = { status: data ? "healthy" : "degraded", latency: Date.now() - storageStart };
  } catch { checks.storage = { status: "down", error: "storage unavailable" }; }

  const allHealthy = Object.values(checks).every((c) => c.status === "healthy");
  return new Response(JSON.stringify({ status: allHealthy ? "healthy" : "degraded", checks, timestamp: new Date().toISOString() }), {
    headers: { "Content-Type": "application/json" },
    status: allHealthy ? 200 : 503,
  });
});
