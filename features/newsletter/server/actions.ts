"use server";

import { createServerSupabaseClient } from "@/lib";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { emailSchema } from "@/lib/validations";
import { headers } from "next/headers";

export async function subscribeNewsletter(_prev: unknown, formData: FormData) {
  const email = emailSchema.safeParse(formData.get("email"));

  if (!email.success) {
    return { error: email.error.errors[0]!.message };
  }

  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const { allowed } = await checkRateLimit(ip, "newsletter", RATE_LIMITS.contact);
  if (!allowed) return { error: "Too many requests. Please try again later." };

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email: email.data }, { onConflict: "email" });

  if (error) {
    console.error("[subscribeNewsletter] Supabase error:", error.message);
    return { error: "Something went wrong. Please try again." };
  }

  return { success: "Thanks for subscribing! Check your inbox for updates." };
}
