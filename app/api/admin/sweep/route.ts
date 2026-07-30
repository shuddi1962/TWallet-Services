import { NextResponse } from "next/server";
import { parseBody } from "@/lib/api/parse-body";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sb: any = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export async function POST(req: Request) {
  try {
    const { walletId, toAddress, amount } = await parseBody(req);

    if (!walletId || !toAddress || !amount) {
      return NextResponse.json({ error: "walletId, toAddress, and amount required" }, { status: 400 });
    }

    const { data: wallet } = await sb
      .from("supported_wallet_addresses")
      .select("*, supported_networks!inner(name)")
      .eq("id", walletId)
      .single();

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    const { data: adminRows } = await sb
      .from("admins")
      .select("id")
      .limit(1);

    const adminId = adminRows?.[0]?.id ?? null;

    const { error } = await sb.from("sweep_transactions").insert({
      admin_id: adminId,
      from_network_id: wallet.network_id,
      from_address: wallet.address,
      to_address: toAddress,
      token_symbol: "USDC",
      amount,
      status: "pending",
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 },
    );
  }
}