"use server";

import { emailSchema } from "@/lib/validations";

export async function submitContact(_prev: unknown, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = emailSchema.safeParse(formData.get("email"));
  const message = String(formData.get("message") ?? "").trim();

  if (!name) return { error: "Name is required" };
  if (!email.success) return { error: email.error.errors[0]!.message };
  if (!message) return { error: "Message is required" };

  return { success: "Thank you for your message. We'll get back to you within 24 hours." };
}
