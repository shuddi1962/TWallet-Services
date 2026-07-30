import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { handleCors, corsHeaders } from "../_shared/cors.ts";
import { parseRequestBody } from "../_shared/request-body.ts";
import { supabase } from "../_shared/supabase-admin.ts";
import { createNotification } from "../_shared/notifications.ts";

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["paid", "cancelled"],
  paid: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

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

    const { order_id, status, note, tx_hash, from_address } = await parseRequestBody(req);

    if (!order_id || !status) {
      return new Response(JSON.stringify({ error: "order_id and status required" }), { status: 400 });
    }

    const { data: order } = await supabase
      .from("card_orders")
      .select("id, status, user_id, amount_usdc, network, token")
      .eq("id", order_id)
      .single();

    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }

    const allowed = VALID_TRANSITIONS[order.status];
    if (!allowed?.includes(status)) {
      return new Response(
        JSON.stringify({
          error: `Cannot transition from ${order.status} to ${status}`,
          allowed: allowed ?? [],
        }),
        { status: 400 },
      );
    }

    const updates: Record<string, unknown> = { status };
    if (status === "paid") {
      updates.paid_at = new Date().toISOString();
      if (tx_hash) updates.tx_hash = tx_hash;
      if (from_address) updates.from_address = from_address;
    }
    if (status === "processing") updates.processing_at = new Date().toISOString();
    if (status === "shipped") updates.shipped_at = new Date().toISOString();
    if (status === "delivered") updates.delivered_at = new Date().toISOString();
    if (note) updates.admin_note = note;

    const { error: updateError } = await supabase
      .from("card_orders")
      .update(updates)
      .eq("id", order_id);

    if (updateError) throw updateError;

    await createNotification(order.user_id, `order_${status}`, {
      title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your order has been updated to ${status}.`,
    });

    return new Response(JSON.stringify({ ok: true, order_id, status }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});