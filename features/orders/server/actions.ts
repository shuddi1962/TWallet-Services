"use server";

import { createServerSupabaseClient } from "@/lib";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { sendEmail, buildOrderConfirmationEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getPostHogClient } from "@/lib/posthog-server";

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
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const { allowed } = checkRateLimit(ip, "createOrder", RATE_LIMITS.createOrder);
  if (!allowed) return { error: "Too many requests. Please try again later." };

  const productId = String(formData.get("productId") ?? "");
  const network = String(formData.get("network") ?? "");
  const token = String(formData.get("token") ?? "");

  if (!productId) return { error: "Product is required" };
  if (!network) return { error: "Network is required" };
  if (!token) return { error: "Token is required" };

  const supabase = (await createServerSupabaseClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

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

  const posthog = getPostHogClient();
  if (posthog) {
    posthog.capture({
      distinctId: user.id,
      event: "server_order_created",
      properties: {
        order_number: orderNumber,
        product_id: productId,
        network,
        token,
        amount_usdc: product.price_usdc,
      },
    });
    await posthog.flush();
  }

  // Fire-and-forget order confirmation email
  if (user?.email) {
    const origin = (await headers()).get("origin");
    sendEmail({
      to: user.email,
      subject: `Order Confirmed - ${orderNumber}`,
      html: buildOrderConfirmationEmail({
        orderNumber,
        productName: product.name,
        amount: product.price_usdc.toString(),
        orderUrl: `${origin}/dashboard/orders/${order.id}`,
      }),
    });
  }

  revalidatePath("/dashboard/orders");
  return {
    success: true,
    order: order,
  };
}
