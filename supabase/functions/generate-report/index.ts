import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface ReportRequest {
  type: string;
  startDate: string;
  endDate: string;
  format: "csv" | "excel" | "pdf";
}

serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body: ReportRequest = await req.json();
    const { type, startDate, endDate, format } = body;
    const endOfDay = `${endDate}T23:59:59.999Z`;

    let data: Record<string, unknown>[] = [];
    let summary: Record<string, unknown> = {};

    switch (type) {
      case "revenue": {
        const res = await supabase
          .from("payment_transactions").select("amount, created_at, status, supported_networks(name)")
          .eq("status", "confirmed").gte("created_at", startDate).lte("created_at", endOfDay);
        data = res.data ?? [];
        summary = {
          totalRevenue: data.reduce((s, r) => s + Number(r.amount ?? 0), 0),
          transactionCount: data.length,
        };
        break;
      }
      case "order_summary": {
        const res = await supabase
          .from("card_orders").select("id, status, created_at, card_products(name)")
          .gte("created_at", startDate).lte("created_at", endOfDay);
        data = res.data ?? [];
        const counts: Record<string, number> = {};
        for (const row of data) {
          const st = String(row.status ?? "unknown");
          counts[st] = (counts[st] ?? 0) + 1;
        }
        summary = { statusCounts: counts, totalOrders: data.length };
        break;
      }
      case "user_growth": {
        const res = await supabase
          .from("profiles").select("id, created_at")
          .gte("created_at", startDate).lte("created_at", endOfDay);
        data = res.data ?? [];
        summary = { newUsers: data.length };
        break;
      }
      case "transaction_volume": {
        const res = await supabase
          .from("payment_transactions").select("amount, status, created_at")
          .gte("created_at", startDate).lte("created_at", endOfDay);
        data = res.data ?? [];
        const counts: Record<string, number> = {};
        for (const row of data) {
          const st = String(row.status ?? "unknown");
          counts[st] = (counts[st] ?? 0) + 1;
        }
        summary = {
          totalAmount: data.reduce((s, r) => s + Number(r.amount ?? 0), 0),
          statusCounts: counts,
        };
        break;
      }
      case "payment_summary": {
        const res = await supabase
          .from("payment_transactions").select("amount, status, network_id, created_at, supported_networks(name)")
          .gte("created_at", startDate).lte("created_at", endOfDay);
        data = res.data ?? [];
        const counts: Record<string, number> = {};
        for (const row of data) {
          const net = String((row.supported_networks as any)?.name ?? "unknown");
          counts[net] = (counts[net] ?? 0) + 1;
        }
        summary = { networkCounts: counts, total: data.length };
        break;
      }
      case "card_product_stats": {
        const res = await supabase
          .from("card_orders").select("card_product_id, card_products(name)")
          .gte("created_at", startDate).lte("created_at", endOfDay);
        data = res.data ?? [];
        const counts: Record<string, number> = {};
        for (const row of data) {
          const name = String((row.card_products as any)?.name ?? "Unknown");
          counts[name] = (counts[name] ?? 0) + 1;
        }
        summary = { productCounts: counts, total: data.length };
        break;
      }
      case "support_metrics": {
        const res = await supabase
          .from("support_tickets").select("id, status, priority, created_at")
          .gte("created_at", startDate).lte("created_at", endOfDay);
        data = res.data ?? [];
        const statusCounts: Record<string, number> = {};
        const priorityCounts: Record<string, number> = {};
        for (const row of data) {
          statusCounts[String(row.status)] = (statusCounts[String(row.status)] ?? 0) + 1;
          priorityCounts[String(row.priority)] = (priorityCounts[String(row.priority)] ?? 0) + 1;
        }
        summary = { statusCounts, priorityCounts, total: data.length };
        break;
      }
      default:
        return new Response(JSON.stringify({ error: `Unknown report type: ${type}` }), {
          status: 400, headers: { "Content-Type": "application/json" },
        });
    }

    const ext = format === "csv" ? "csv" : format === "excel" ? "xlsx" : "pdf";
    const fileName = `${type}_${startDate}_${endDate}.${ext}`;

    return new Response(
      JSON.stringify({
        success: true,
        data,
        summary,
        fileName,
        format,
        generatedAt: new Date().toISOString(),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : "unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});