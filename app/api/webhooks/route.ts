import { createAdminClient } from "@/lib";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, data } = body;
    const signature = request.headers.get("x-webhook-signature");

    if (!event) {
      return NextResponse.json({ error: { message: "event is required" } }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("webhook_events")
      .insert({ event, payload: data, signature, source: request.headers.get("x-webhook-source") ?? "unknown" }) as unknown as { error: { message: string } | null };

    if (error) throw error;

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json(
      { error: { message: err instanceof Error ? err.message : "Internal error" } },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Webhook endpoint active" });
}
