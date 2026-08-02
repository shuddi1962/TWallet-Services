import { z } from "zod";

export const ticketCategories = [
  "shipping",
  "payment",
  "card",
  "account",
  "other",
  "order",
  "transaction",
  "browser",
  "gas_fee",
  "claims",
  "security",
  "token",
  "swap",
  "buy_crypto",
  "wallet_connect",
  "restore_wallet",
  "staking",
  "partnership",
] as const;

export type TicketCategory = (typeof ticketCategories)[number];

export const supportTicketSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  category: z.enum(ticketCategories),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  message: z.string().min(1, "Message is required").max(5000),
  orderId: z.string().uuid("Invalid order ID").optional(),
  attachmentUrls: z.array(z.string().url()).max(5).optional(),
});

export type SupportTicketFormData = z.infer<typeof supportTicketSchema>;

export function validateSupportTicket(data: unknown) {
  return supportTicketSchema.safeParse(data);
}
