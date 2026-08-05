"use server";

import { createServerSupabaseClient } from "@/lib";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { sendEmail, buildOrderConfirmationEmail } from "@/lib/email";
import { getSystemSettings } from "@/lib/settings";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getOrders() {
  const { getOrders: q } = await import("./queries");
  return q();
}

export async function getOrder(orderId: string) {
  const { getOrder: q } = await import("./queries");
  return q(orderId);
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TW-${timestamp}-${random}`;
}

export async function createOrder(_prev: unknown, formData: FormData) {
  // Never let an unexpected server error surface as a 500 page — return a
  // structured error so the client shows a toast and the flow continues.
  try {
    return await createOrderInner(formData);
  } catch (e) {
    console.error("[createOrder] Unexpected error:", e);
    return {
      error: e instanceof Error ? e.message : "Something went wrong while creating your order. Please try again.",
    };
  }
}

async function createOrderInner(formData: FormData) {
  let ip = "unknown";
  try {
    ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  } catch {
    // headers unavailable — proceed without rate limiting
  }
  try {
    const { allowed } = await checkRateLimit(ip, "createOrder", RATE_LIMITS.createOrder);
    if (!allowed) return { error: "Too many requests. Please try again later." };
  } catch {
    // rate limiter unavailable — fail open, never block ordering
  }

  const productId = String(formData.get("productId") ?? "");
  const network = String(formData.get("network") ?? "");
  const token = String(formData.get("token") ?? "");

  if (!productId) return { error: "Product is required" };
  if (!network) return { error: "Network is required" };
  if (!token) return { error: "Token is required" };

  const supabase = await createServerSupabaseClient() as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Wallet gate: a validated (admin-approved) wallet must exist before an
  // order can be placed. Wallet details are only recorded after the user
  // goes through connect → manual validation → admin approval.
  const { data: wallet } = await supabase
    .from("wallets")
    .select("id")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .limit(1)
    .maybeSingle();
  if (!wallet) {
    return {
      error: "Connect your wallet first before ordering a card. Open the Connect wallet dialog from your dashboard.",
    };
  }

  // KYC gate: when the admin requires KYC, only verified users can order.
  const settings = await getSystemSettings();
  if (settings.kyc?.require_kyc) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("kyc_tier")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile || profile.kyc_tier === "none") {
      return { error: "KYC verification is required before ordering a card. Complete verification in your account settings first." };
    }
  }

  const { data: product, error: productError } = await supabase
    .from("card_products")
    .select("id, price_usdc, name")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    return { error: "Product not found" };
  }

  const orderNumber = generateOrderNumber();

  const { data: order, error: orderError } = await supabase
    .from("card_orders")
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      product_id: productId,
      status: "pending",
      amount_usdc: product.price_usdc,
      network,
      token,
    })
    .select("id, order_number, amount_usdc")
    .single();

  if (orderError) return { error: orderError.message };

  // Fire-and-forget order confirmation email
  if (user?.email) {
    try {
      const origin = (await headers()).get("origin") ?? "https://twalletservices.com";
      sendEmail({
        to: user.email,
        subject: `Order Confirmed - ${orderNumber}`,
        html: buildOrderConfirmationEmail({
          orderNumber,
          productName: product.name,
          amount: product.price_usdc.toString(),
          orderUrl: `${origin}/dashboard/orders/${order.id}`,
        }),
        type: "order_confirmation_email",
      });
    } catch {
      // email is best-effort — never fail an already-created order over it
    }
  }

  revalidatePath("/dashboard/orders");
  return {
    success: true,
    order: order,
  };
}
