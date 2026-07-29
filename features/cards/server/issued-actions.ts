"use server";

import { createServerSupabaseClient } from "@/lib";
import { revalidatePath } from "next/cache";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

async function authed() {
  const supabase = (await createServerSupabaseClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function getIssuedCards() {
  const { supabase, user } = await authed();
  if (!user) return { error: "Not authenticated", data: null };

  const { data, error } = await supabase
    .from("issued_cards")
    .select(
      "*, card_products(id, slug, name, type, price_usdc, features), card_orders(id, order_number, status, amount_usdc)",
    )
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message, data: null };
  return { data: data ?? [], error: null };
}

export async function getIssuedCard(id: string) {
  const { supabase, user } = await authed();
  if (!user) return { error: "Not authenticated", data: null };

  const { data, error } = await supabase
    .from("issued_cards")
    .select(
      "*, card_products(id, slug, name, type, price_usdc, features), card_orders(id, order_number, status)",
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}

export async function updateCardControls(
  cardId: string,
  patch: {
    frozen?: boolean;
    international_enabled?: boolean;
    contactless_enabled?: boolean;
    online_enabled?: boolean;
  },
) {
  const { supabase, user } = await authed();
  if (!user) return { error: "Not authenticated" };

  const rl = await checkRateLimit(user.id, "cardControls", RATE_LIMITS.default);
  if (!rl.allowed) return { error: `Too many requests. Retry in ${rl.retryAfter}s` };

  const updates: Record<string, unknown> = { ...patch };
  if (typeof patch.frozen === "boolean") {
    updates.status = patch.frozen ? "frozen" : "active";
  }

  const { error } = await supabase
    .from("issued_cards")
    .update(updates)
    .eq("id", cardId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/cards");
  return { success: true };
}

export async function updateCardPin(cardId: string, pin: string) {
  const { supabase, user } = await authed();
  if (!user) return { error: "Not authenticated" };
  if (!/^\d{4}$/.test(pin)) return { error: "PIN must be 4 digits" };

  const { error } = await supabase
    .from("issued_cards")
    .update({ pin_set: true, pin_hint: "••••" })
    .eq("id", cardId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/cards");
  return { success: true };
}

/** Fund card balance (ledger entry). Amount is USDC units. */
export async function fundCard(cardId: string, amount: number, note?: string) {
  const { supabase, user } = await authed();
  if (!user) return { error: "Not authenticated" };

  const rl = await checkRateLimit(user.id, "fundCard", RATE_LIMITS.createOrder);
  if (!rl.allowed) return { error: `Too many requests. Retry in ${rl.retryAfter}s` };

  if (!Number.isFinite(amount) || amount <= 0 || amount > 50000) {
    return { error: "Invalid amount (max 50,000 USDC)" };
  }

  const { data: card, error: fetchErr } = await supabase
    .from("issued_cards")
    .select("id, balance_usdc, frozen, status")
    .eq("id", cardId)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (fetchErr || !card) return { error: fetchErr?.message ?? "Card not found" };
  if (card.frozen || card.status === "frozen") return { error: "Unfreeze card before funding" };
  if (card.status === "cancelled") return { error: "Card is cancelled" };

  const next = Number(card.balance_usdc) + amount;

  const { error: upErr } = await supabase
    .from("issued_cards")
    .update({
      balance_usdc: next,
      last_funded_at: new Date().toISOString(),
    })
    .eq("id", cardId)
    .eq("user_id", user.id);

  if (upErr) return { error: upErr.message };

  await supabase.from("card_ledger").insert({
    card_id: cardId,
    user_id: user.id,
    entry_type: "fund",
    amount_usdc: amount,
    balance_after: next,
    description: note?.trim() || "Crypto top-up",
    reference: `fund_${Date.now()}`,
  });

  revalidatePath("/dashboard/cards");
  return { success: true, balance: next };
}

export async function getCardLedger(cardId: string) {
  const { supabase, user } = await authed();
  if (!user) return { error: "Not authenticated", data: null };

  const { data: owned } = await supabase
    .from("issued_cards")
    .select("id")
    .eq("id", cardId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!owned) return { error: "Card not found", data: null };

  const { data, error } = await supabase
    .from("card_ledger")
    .select("*")
    .eq("card_id", cardId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return { error: error.message, data: null };
  return { data: data ?? [], error: null };
}

export async function cancelCard(cardId: string) {
  const { supabase, user } = await authed();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("issued_cards")
    .update({ status: "cancelled", frozen: true, deleted_at: new Date().toISOString() })
    .eq("id", cardId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/cards");
  return { success: true };
}

/** Backfill: issue cards for already-paid orders missing issued_cards */
export async function syncIssuedCardsFromOrders() {
  const { supabase, user } = await authed();
  if (!user) return { error: "Not authenticated", created: 0 };

  const { data: orders } = await supabase
    .from("card_orders")
    .select("id, product_id, status, card_products(slug, name, type)")
    .eq("user_id", user.id)
    .in("status", ["paid", "processing", "shipped", "delivered"]);

  let created = 0;
  for (const o of orders ?? []) {
    const { data: existing } = await supabase
      .from("issued_cards")
      .select("id")
      .eq("order_id", o.id)
      .is("deleted_at", null)
      .maybeSingle();
    if (existing) continue;

    const product = o.card_products as { slug?: string; name?: string; type?: string } | null;
    const slug = product?.slug ?? "";
    const finish =
      slug === "virtual-premium"
        ? "cyber"
        : slug === "physical-premium"
          ? "gold"
          : slug === "physical-black"
            ? "obsidian"
            : "sapphire";
    const last4 = String(Math.floor(1000 + Math.random() * 9000));
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    const holder = ((u?.user_metadata as { full_name?: string })?.full_name ?? "CARDHOLDER").toUpperCase();
    const expY = (new Date().getFullYear() + 4) % 100;
    const expM = ((new Date().getMonth() + 3) % 12) + 1;

    const { error } = await supabase.from("issued_cards").insert({
      user_id: user.id,
      order_id: o.id,
      product_id: o.product_id,
      label: product?.name ?? "TWallet Card",
      finish,
      card_type: product?.type === "physical" ? "physical" : "virtual",
      network: slug === "physical-black" || slug === "virtual-premium" ? "mastercard" : "visa",
      status: product?.type === "physical" ? "pending_activation" : "active",
      pan_last4: last4,
      pan_display: `4532 •••• •••• ${last4}`,
      expiry_month: expM,
      expiry_year: expY,
      cvv_hint: String(Math.floor(100 + Math.random() * 900)),
      holder_name: holder,
      balance_usdc: 0,
    });
    if (!error) created += 1;
  }

  revalidatePath("/dashboard/cards");
  return { success: true, created };
}
