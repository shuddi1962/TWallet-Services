"use server";

import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib";
import { emailSchema, passwordSchema } from "@/lib/validations";
import { sendEmail, buildPasswordResetEmail, buildPasswordChangedEmail } from "@/lib/email";
import { ensureAdminProvisioned, isAdminUser } from "@/lib/admin-provision";
import { redirect } from "next/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://twalletservices.com";

export async function signUp(_prev: unknown, formData: FormData) {
  const { allowed } = await checkRateLimit("signup", "register", RATE_LIMITS.register);
  if (!allowed) return { error: "Too many requests. Please try again later." };

  const email = emailSchema.safeParse(formData.get("email"));
  const password = passwordSchema.safeParse(formData.get("password"));
  const name = String(formData.get("name") ?? "").trim();

  if (!email.success) return { error: email.error.errors[0]!.message };
  if (!password.success) return { error: password.error.errors[0]!.message };
  if (!name) return { error: "Name is required" };

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signUp({
    email: email.data,
    password: password.data,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${SITE_URL}/auth/callback`,
    },
  });

  if (error) return { error: error.message };

  redirect("/auth/verify?email=" + encodeURIComponent(email.data));
}

export async function signIn(_prev: unknown, formData: FormData) {
  const { allowed } = await checkRateLimit("signin", "login", RATE_LIMITS.login);
  if (!allowed) return { error: "Too many requests. Please try again later." };

  const email = emailSchema.safeParse(formData.get("email"));
  const password = passwordSchema.safeParse(formData.get("password"));
  const redirectTo = String(formData.get("redirect") ?? "").trim();

  if (!email.success) return { error: email.error.errors[0]!.message };
  if (!password.success) return { error: password.error.errors[0]!.message };

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: email.data,
    password: password.data,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Invalid email or password" };
    }
    return { error: error.message };
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    await ensureAdminProvisioned(user);
    if (redirectTo && redirectTo.startsWith("/")) {
      redirect(redirectTo);
    }
    if (await isAdminUser(user.id)) {
      redirect("/admin");
    }
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}

export async function sendPasswordResetEmail(_prev: unknown, formData: FormData) {
  const { allowed } = await checkRateLimit("forgot-password", "forgotPassword", RATE_LIMITS.forgotPassword);
  if (!allowed) return { error: "Too many requests. Please try again later." };

  const email = emailSchema.safeParse(formData.get("email"));
  if (!email.success) return { error: email.error.errors[0]!.message };

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email.data, {
    redirectTo: `${SITE_URL}/auth/reset-password`,
  });

  if (error) return { error: error.message };

  sendEmail({
    to: email.data,
    subject: "Reset Your TWallet Password",
    html: buildPasswordResetEmail({ resetUrl: `${SITE_URL}/auth/reset-password` }),
  });

  return { success: "Check your email for a reset link" };
}

export async function updatePassword(_prev: unknown, formData: FormData) {
  const password = passwordSchema.safeParse(formData.get("password"));
  if (!password.success) return { error: password.error.errors[0]!.message };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password: password.data });

  if (error) return { error: error.message };

  // Fire-and-forget password changed notification
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.email) {
    sendEmail({
      to: user.email,
      subject: "Password Changed - TWallet",
      html: buildPasswordChangedEmail(),
    });
  }

  redirect("/auth/login?reset=success");
}
