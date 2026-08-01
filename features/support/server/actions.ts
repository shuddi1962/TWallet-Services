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

  const { data: ticketNumber } = await supabase.rpc("generate_ticket_number");

  const { data: ticket, error } = await supabase
    .from("support_tickets")
    .insert({
      ticket_number: ticketNumber ?? `TKT-${Date.now()}`,
      user_id: user.id,
      subject,
      category: category as "shipping" | "payment" | "card" | "account" | "other",
      priority: priority as "low" | "medium" | "high" | "urgent",
      status: "open",
      ...(orderId ? { order_id: orderId } : {}),
    })
    .select("id")
    .single();

  if (error || !ticket) return { error: error?.message ?? "Could not create ticket" };

  const { error: msgError } = await supabase.from("ticket_messages").insert({
    ticket_id: ticket.id,
    author: "customer",
    message,
  });

  if (msgError) return { error: msgError.message };

  revalidatePath("/dashboard/support");
  return { success: "Ticket submitted. We'll get back to you within 24 hours." };
}

export async function getMyTickets() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };

  const { data, error } = await supabase
    .from("support_tickets")
    .select("id, ticket_number, subject, category, priority, status, created_at, updated_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}
