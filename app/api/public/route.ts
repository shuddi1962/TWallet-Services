import { createServerSupabaseClient } from "@/lib";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get("endpoint");

    if (!endpoint) {
      return NextResponse.json({ error: { message: "endpoint is required" } }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    switch (endpoint) {
      case "products": {
        const { data, error } = await supabase
          .from("card_products")
          .select("id, name, type, price_usdc, delivery_days, features")
          .eq("active", true) as unknown as { data: unknown; error: { message: string } | null };
        if (error) throw error;
        return NextResponse.json({ data });
      }
      case "networks": {
        const { data, error } = await supabase
          .from("supported_networks")
          .select("*")
          .eq("active", true) as unknown as { data: unknown; error: { message: string } | null };
        if (error) throw error;
        return NextResponse.json({ data });
      }
      default:
        return NextResponse.json({ error: { message: "Unknown endpoint" } }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: { message: err instanceof Error ? err.message : "Internal error" } },
      { status: 500 },
    );
  }
}
