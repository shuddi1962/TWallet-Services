import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { parseRequestBody } from "../_shared/request-body.ts";

serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body = await parseRequestBody(req);
    const txHash = body.txHash ?? body.transactionHash ?? "";
    const network = body.network ?? body.chainId ?? "";
    const event = body.event ?? "unknown";

    if (!txHash) {
      return new Response(JSON.stringify({ error: "missing txHash" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    await supabase.from("webhook_events").insert({
      source: "blockchain",
      event,
      payload: body,
      status: "received",
    });

    return new Response(JSON.stringify({ received: true, txHash }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
