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

function genPan(network: "visa" | "mastercard") {
  const bin = network === "mastercard" ? "5424" : "4532";
  const mid = String(Math.floor(Math.random() * 1e8)).padStart(8, "0");
  const last4 = String(Math.floor(1000 + Math.random() * 9000));
  const digits = `${bin}${mid}${last4}`.slice(0, 16);
  const groups = digits.match(/.{1,4}/g) ?? [digits];
  return {
    pan_full: groups.join(""),
    pan_display: `${groups[0]} •••• •••• ${groups[3] ?? last4}`,
    pan_last4: groups[3] ?? last4,
    pan_formatted: groups.join(" "),
  };
}

function genCvv() {
  return String(Math.floor(100 + Math.random() * 900));
}

export async function getIssuedCards() {
  try {
    const { supabase, user } = await authed();
    if (!user) return { error: "Not authenticated", data: null };

    // Simple select first — avoid nested join failures
    const { data, error } = await supabase
      .from("issued_cards")
      .select("*")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      // table missing
      if (error.message?.includes("does not exist") || error.code === "42P01") {
        return { data: [], error: null };
      }
      return { error: error.message, data: null };
    }

    const rows = data ?? [];
    if (!rows.length) return { data: [], error: null };

    const productIds = [...new Set(rows.map((r: { product_id: string }) => r.product_id).filter(Boolean))];
    let productsById: Record<string, unknown> = {};
    if (productIds.length) {
      const { data: products } = await supabase
        .from("card_products")
        .select("id, slug, name, type, price_usdc, features")
        .in("id", productIds);
      for (const p of products ?? []) {
        productsById[p.id] = p;
      }
    }

    const enriched = rows.map((r: { product_id: string }) => ({
      ...r,
      card_products: productsById[r.product_id] ?? null,
    }));

    return { data: enriched, error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Unknown error", data: null };
  }
}

export async function getIssuedCard(id: string) {
  const { supabase, user } = await authed();
  if (!user) return { error: "Not authenticated", data: null };

  const { data, error } = await supabase
    .from("issued_cards")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}

/** Reveal full PAN + CVV for the card owner only */
export async function revealCardSecrets(cardId: string) {
  const { supabase, user } = await authed();
  if (!user) return { error: "Not authenticated", data: null };

  const rl = await checkRateLimit(user.id, "revealCard", { window: 60_000, max: 10 });
  if (!rl.allowed) return { error: `Too many reveals. Retry in ${rl.retryAfter}s`, data: null };

  const { data, error } = await supabase
    .from("issued_cards")
    .select("id, pan_full, pan_formatted, pan_display, cvv_hint, expiry_month, expiry_year, holder_name")
    .eq("id", cardId)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) return { error: error.message, data: null };
  if (!data) return { error: "Card not found", data: null };

  const formatted =
    data.pan_formatted ||
    (data.pan_full
      ? String(data.pan_full).replace(/(.{4})/g, "$1 ").trim()
      : data.pan_display);

  return {
    data: {
      pan: formatted,
      cvv: data.cvv_hint,
      expiry: `${String(data.expiry_month).padStart(2, "0")}/${String(data.expiry_year).padStart(2, "0")}`,
      holder: data.holder_name,
    },
    error: null,
  };
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

export async function syncIssuedCardsFromOrders() {
  try {
    const { supabase, user } = await authed();
    if (!user) return { error: "Not authenticated", created: 0 };

    const { data: orders, error: ordersErr } = await supabase
      .from("card_orders")
      .select("id, product_id, status")
      .eq("user_id", user.id)
      .in("status", ["paid", "processing", "shipped", "delivered"]);

    if (ordersErr) return { error: ordersErr.message, created: 0 };

    let created = 0;
    for (const o of orders ?? []) {
      const { data: existing } = await supabase
        .from("issued_cards")
        .select("id")
        .eq("order_id", o.id)
        .is("deleted_at", null)
        .maybeSingle();
      if (existing) continue;

      const { data: product } = await supabase
        .from("card_products")
        .select("slug, name, type")
        .eq("id", o.product_id)
        .maybeSingle();

      const slug = product?.slug ?? "";
      const finish =
        slug === "virtual-premium"
          ? "cyber"
          : slug === "physical-premium"
            ? "gold"
            : slug === "physical-black"
              ? "obsidian"
              : "sapphire";
      const network = slug === "physical-black" || slug === "virtual-premium" ? "mastercard" : "visa";
      const pan = genPan(network as "visa" | "mastercard");
      const cvv = genCvv();
      const holder = (
        (user.user_metadata as { full_name?: string })?.full_name ?? "CARDHOLDER"
      ).toUpperCase();
      const expY = (new Date().getFullYear() + 4) % 100;
      const expM = ((new Date().getMonth() + 3) % 12) + 1;

      const insertPayload: Record<string, unknown> = {
        user_id: user.id,
        order_id: o.id,
        product_id: o.product_id,
        label: product?.name ?? "TWallet Card",
        finish,
        card_type: product?.type === "physical" ? "physical" : "virtual",
        network,
        status: product?.type === "physical" ? "pending_activation" : "active",
        pan_last4: pan.pan_last4,
        pan_display: pan.pan_display,
        pan_full: pan.pan_full,
        pan_formatted: pan.pan_formatted,
        expiry_month: expM,
        expiry_year: expY,
        cvv_hint: cvv,
        holder_name: holder,
        balance_usdc: 0,
      };

      const { error } = await supabase.from("issued_cards").insert(insertPayload);
      if (error) {
        // retry without optional columns if migration not applied
        delete insertPayload.pan_full;
        delete insertPayload.pan_formatted;
        const { error: e2 } = await supabase.from("issued_cards").insert(insertPayload);
        if (!e2) created += 1;
      } else {
        created += 1;
      }
    }

    return { success: true, created };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "sync failed", created: 0 };
  }
}
