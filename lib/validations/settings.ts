import { z } from "zod";

export const settingsSchema = z.object({
  language: z.enum(["en", "es", "fr", "de", "zh", "ja"]).default("en"),
  timezone: z.string().max(50).default("UTC"),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).default("MM/DD/YYYY"),
  numberFormat: z.enum(["1,234.56", "1.234,56", "1 234,56"]).default("1,234.56"),
  notifications: z.object({
    orderUpdates: z.boolean().default(true),
    paymentConfirmations: z.boolean().default(true),
    marketingEmails: z.boolean().default(false),
    securityAlerts: z.boolean().default(true),
    supportReplies: z.boolean().default(true),
  }).default({}),
  appearance: z.object({
    theme: z.enum(["dark", "light", "system"]).default("dark"),
    sidebarCollapsed: z.boolean().default(false),
  }).default({}),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

export function validateSettings(data: unknown) {
  return settingsSchema.safeParse(data);
}
