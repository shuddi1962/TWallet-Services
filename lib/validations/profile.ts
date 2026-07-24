import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().max(20).optional().default(""),
  country: z.string().max(100).optional().default(""),
  avatarUrl: z.string().url("Invalid URL").max(2048).optional().default(""),
  shippingAddress: z.object({
    line1: z.string().min(1, "Address is required").max(255),
    line2: z.string().max(255).optional().default(""),
    city: z.string().min(1, "City is required").max(100),
    state: z.string().max(100).optional().default(""),
    postalCode: z.string().max(20).optional().default(""),
    country: z.string().min(1, "Country is required").max(100),
  }).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export function validateProfile(data: unknown) {
  return profileSchema.safeParse(data);
}
