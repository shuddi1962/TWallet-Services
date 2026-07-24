import { z } from "zod";

export const emailSchema = z.string().email("Invalid email address").max(255);
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(128);
export const uuidSchema = z.string().uuid("Invalid UUID");
export const urlSchema = z.string().url("Invalid URL").max(2048);
export const hexColorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color");

export const authRegisterSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: z.string().min(1, "Name is required").max(100),
});

export const authLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const authForgotPasswordSchema = z.object({
  email: emailSchema,
});

export const authResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});

export const walletConnectSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
  chainId: z.number().int().positive(),
  provider: z.string().max(50),
});

export const createOrderSchema = z.object({
  cardProductId: uuidSchema,
  shippingAddressId: uuidSchema,
  networkId: uuidSchema,
});

export const createPaymentSchema = z.object({
  orderId: uuidSchema,
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Invalid transaction hash"),
  networkId: uuidSchema,
  amount: z.string().regex(/^\d+(\.\d+)?$/, "Invalid amount"),
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid token address"),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  email: emailSchema.optional(),
  phone: z.string().max(20).optional(),
  country: z.string().max(100).optional(),
  avatarUrl: urlSchema.optional(),
});

export const createTicketSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  category: z.enum(["general", "order", "card", "payment", "wallet", "technical", "other"]),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  message: z.string().min(1, "Message is required").max(5000),
  orderId: z.string().uuid().optional(),
  attachmentUrls: z.array(urlSchema).max(5).optional(),
});

export const replyTicketSchema = z.object({
  message: z.string().min(1).max(5000),
  attachmentUrls: z.array(urlSchema).max(5).optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
  cursor: z.string().optional(),
});

export const dateRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export type AuthRegisterInput = z.infer<typeof authRegisterSchema>;
export type AuthLoginInput = z.infer<typeof authLoginSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type ReplyTicketInput = z.infer<typeof replyTicketSchema>;
