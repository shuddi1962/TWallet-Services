"use server";

import { createServerSupabaseClient } from "@/lib";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { ticketCategories, type TicketCategory } from "@/lib/validations/support";

export async function createTicket(_prev: unknown, formData: FormData) {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const { allowed } = await checkRateLimit(ip, "supportTicket", RATE_LIMITS.supportTicket);
  if (!allowed) return { error: "Too many requests. Please try again later." };

  const subject = String(formData.get("subject") ?? "").trim();
  const rawCategory = String(formData.get("category") ?? "other").trim();
  const category = (ticketCategories as readonly string[]).includes(rawCategory)
    ? (rawCategory as TicketCategory)
    : "other";
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
      category,
      priority: priority as "low" | "medium" | "high" | "urgent",
      status: "open",
      ...(orderId ? { order_id: orderId } : {}),
    })
    .select("id, ticket_number")
    .single();

  if (error || !ticket) return { error: error?.message ?? "Could not create ticket" };

  const { error: msgError } = await supabase.from("ticket_messages").insert({
    ticket_id: ticket.id,
    author: "customer",
    message,
  });

  if (msgError) return { error: msgError.message };

  await supabase.from("notifications").insert({
    user_id: user.id,
    type: "ticket_created",
    title: `Ticket ${ticket.ticket_number} received`,
    message: "We've received your request and will get back to you within 24 hours.",
  });

  revalidatePath("/dashboard/support");
  return { success: "Ticket submitted. We'll get back to you within 24 hours." };
}

export async function getCustomerTicketMessages(ticketId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", messages: null };

  const { data: ticket, error: ticketError } = await supabase
    .from("support_tickets")
    .select("id, ticket_number, user_id, status")
    .eq("id", ticketId)
    .eq("user_id", user.id)
    .single();
  if (ticketError || !ticket) return { error: "Ticket not found", messages: null };

  const { data, error } = await supabase
    .from("ticket_messages")
    .select("id, ticket_id, author, message, internal, created_at")
    .eq("ticket_id", ticketId)
    .eq("internal", false)
    .order("created_at", { ascending: true });

  if (error) return { error: error.message, messages: null };
  return { error: null, messages: data ?? [], ticket };
}

export async function replyToTicket(ticketId: string, message: string) {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const { allowed } = await checkRateLimit(ip, "supportTicket", RATE_LIMITS.supportTicket);
  if (!allowed) return { error: "Too many requests. Please try again later." };

  const clean = message.trim();
  if (!clean) return { error: "Message is required" };
  if (clean.length > 5000) return { error: "Message must be 5000 characters or fewer" };

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const { data: ticket, error: ticketError } = await supabase
    .from("support_tickets")
    .select("id, ticket_number, user_id")
    .eq("id", ticketId)
    .eq("user_id", user.id)
    .single();
  if (ticketError || !ticket) return { error: "Ticket not found" };

  const { error: msgError } = await supabase.from("ticket_messages").insert({
    ticket_id: ticket.id,
    author: "customer",
    message: clean,
  });
  if (msgError) return { error: msgError.message };

  await supabase
    .from("support_tickets")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", ticket.id);

  revalidatePath("/dashboard/support");
  return { success: "Reply sent. Our team will get back to you." };
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
