import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { handleCors, corsHeaders } from "../_shared/cors.ts";
import { createNotification } from "../_shared/notifications.ts";

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST allowed" }), { status: 405 });
    }

    const auth = req.headers.get("authorization")?.replace("Bearer ", "");
    if (auth !== Deno.env.get("INTERNAL_SECRET")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { user_id, type, title, message } = await req.json();

    if (!user_id || !type || !title || !message) {
      return new Response(
        JSON.stringify({ error: "user_id, type, title, message required" }),
        { status: 400 },
      );
    }

    await createNotification(user_id, type, { title, message });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
