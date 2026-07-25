"use server";

import { createServerSupabaseClient } from "@/lib";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createTicket(_prev: unknown, formData: FormData) {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const { allowed } = await checkRateLimit(ip, "supportTicket", RATE_LIMITS.supportTicket);
  if (!allowed) return { error: "Too many requests. Please try again later." };

  const subject = String(formData.get("subject") ?? "").trim();
  const category = String(formData.get("category") ?? "general").trim();
  const priority = String(formData.get("priority") ?? "medium").trim();
  const orderId = String(formData.get("orderId") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!subject) return { error: "Subject is required" };
  if (!message) return { error: "Message is required" };

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const { error } = await supabase.from("support_tickets").insert({
    user_id: user.id,
    subject,
    category,
    priority,
    message,
    ...(orderId ? { order_id: orderId } : {}),
    status: "open",
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/support");
  return { success: "Ticket submitted. We'll get back to you within 24 hours." };
}
