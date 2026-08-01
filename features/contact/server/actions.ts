"use server";

import { createServerSupabaseClient } from "@/lib";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { emailSchema } from "@/lib/validations";
import { headers } from "next/headers";

export async function submitContact(_prev: unknown, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = emailSchema.safeParse(formData.get("email"));
  const message = String(formData.get("message") ?? "").trim();

  if (!name) return { error: "Name is required" };
  if (!email.success) return { error: email.error.errors[0]!.message };
  if (!message) return { error: "Message is required" };

  const ip = (await headers()).get("x-forwarded-for") ?? null;
  const { allowed } = await checkRateLimit(ip ?? "unknown", "contact", RATE_LIMITS.contact);
  if (!allowed) return { error: "Too many requests. Please try again later." };

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("contact_messages").insert({
    name,
    email: email.data,
    message,
    ip_address: ip,
  });

  if (error) {
    console.error("[submitContact] Supabase error:", error.message);
    return { error: "Something went wrong. Please try again." };
  }

  return { success: "Thank you for your message. We'll get back to you within 24 hours." };
}
