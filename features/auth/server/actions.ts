"use server";

import { cookies } from "next/headers";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib";
import { createAdminClient } from "@/lib/supabase/admin";
import { emailSchema, passwordSchema } from "@/lib/validations";
import {
  sendEmail,
  buildPasswordResetEmail,
  buildPasswordChangedEmail,
  buildEmailVerificationEmail,
} from "@/lib/email";
import { ensureAdminProvisioned, isAdminUser } from "@/lib/admin-provision";
import { detectCountry } from "@/lib/geo";
import { getSystemSettings } from "@/lib/settings";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://twalletservices.com";

/** Cookie that tracks the last server-verified activity on protected pages. */
const LAST_ACTIVE_COOKIE = "tw-last-active";

async function setInactivityCookie(idleMinutes: number) {
  try {
    const cookieStore = await cookies();
    cookieStore.set(LAST_ACTIVE_COOKIE, `${Date.now()}:${Math.max(1, Math.round(idleMinutes))}`, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: Math.max(60, Math.round(idleMinutes) * 60),
    });
  } catch {
    // Cookie store unavailable (e.g. edge context) — the middleware still enforces.
  }
}

async function sendVerificationEmail(email: string) {
  try {
    const admin = createAdminClient();
    // No password: the user already exists (created unconfirmed via the admin
    // API), and passing one would make GoTrue reject the link with "User
    // already registered".
    const { data: link, error } = await admin.auth.admin.generateLink({
      type: "signup",
      email,
      options: { redirectTo: `${SITE_URL}/auth/callback` },
    } as Parameters<typeof admin.auth.admin.generateLink>[0]);
    if (error || !link?.properties) {
      console.error("[email] generateLink(signup) failed for", email, error?.message ?? "no properties");
      return false;
    }
    const code = link.properties.email_otp;
    const res = await sendEmail({
      to: email,
      subject: "Verify your TWallet email",
      html: buildEmailVerificationEmail({ code }),
      type: "verification_email",
    });
    if (!res.success) console.error("[email] verification send failed:", res.error);
    return res.success;
  } catch (err) {
    console.error("[email] sendVerificationEmail failed:", err instanceof Error ? err.message : err);
    return false;
  }
}

export async function signUp(_prev: unknown, formData: FormData) {
  const { allowed } = await checkRateLimit("signup", "register", RATE_LIMITS.register);
  if (!allowed) return { error: "Too many requests. Please try again later." };

  const email = emailSchema.safeParse(formData.get("email"));
  const password = passwordSchema.safeParse(formData.get("password"));
  const name = String(formData.get("name") ?? "").trim();
  const countryRaw = String(formData.get("country") ?? "").trim().toUpperCase();
  const country = /^[A-Z]{2}$/.test(countryRaw) ? countryRaw : await detectCountry();

  if (!email.success) return { error: email.error.errors[0]!.message };
  if (!password.success) return { error: password.error.errors[0]!.message };
  if (!name) return { error: "Name is required" };

  const admin = createAdminClient();

  // Create the user via the admin API with `email_confirm: false` — the admin
  // API sends NO email, so exactly one verification email goes out (our own
  // Resend channel below), never a duplicate from Supabase's SMTP.
  const { data, error } = await admin.auth.admin.createUser({
    email: email.data,
    password: password.data,
    email_confirm: false,
    user_metadata: { full_name: name, ...(country ? { country } : {}) },
  });

  if (error) {
    if (!/already registered|already been registered|already exists/i.test(error.message)) {
      return { error: error.message };
    }

    // The email already exists in auth.users. Recover the two legitimate cases:
    //   1) the user registered before but never confirmed (missed/never got the
    //      code) — re-send the code instead of erroring;
    //   2) the account was soft-deleted — reactivate it (keeping the history)
    //      and treat it as a fresh registration.
    // Anything else (active, confirmed account) must sign in instead.
    const { data: link, error: linkError } = await admin.auth.admin.generateLink({
      type: "signup",
      email: email.data,
      options: { redirectTo: `${SITE_URL}/auth/callback` },
    } as Parameters<typeof admin.auth.admin.generateLink>[0]);

    if (!linkError && link?.properties) {
      // Existing unconfirmed user — resend the code, no "already registered" error.
      await sendVerificationEmail(email.data);
      redirect("/auth/verify?email=" + encodeURIComponent(email.data));
    }

    const existing = await admin
      .from("profiles")
      .select("id, status, deleted_at")
      .eq("email", email.data)
      .maybeSingle();

    if (existing.data?.status === "deleted") {
      const { error: reactivateError } = await admin.auth.admin.updateUserById(existing.data.id, {
        password: password.data,
        email_confirm: false,
      });
      if (reactivateError) return { error: reactivateError.message };
      await admin
        .from("profiles")
        .update({ status: "active", deleted_at: null, full_name: name, ...(country ? { country } : {}) })
        .eq("id", existing.data.id);
      await sendVerificationEmail(email.data);
      redirect("/auth/verify?email=" + encodeURIComponent(email.data));
    }

    return { error: "An account with this email already exists. Please sign in instead." };
  }

  // Send the verification code through our own Resend channel (branded email).
  if (data?.user?.email) {
    await sendVerificationEmail(data.user.email);
  }

  redirect("/auth/verify?email=" + encodeURIComponent(email.data));
}

export async function signIn(_prev: unknown, formData: FormData) {
  const settings = await getSystemSettings();
  const maxAttempts = Number(settings.security?.max_login_attempts ?? 5);
  const lockoutMinutes = Number(settings.security?.lockout_duration_minutes ?? 15);
  const { allowed } = await checkRateLimit("signin", "login", {
    window: lockoutMinutes * 60 * 1000,
    max: maxAttempts,
  });
  if (!allowed) return { error: "Too many failed attempts. Please try again later." };

  const email = emailSchema.safeParse(formData.get("email"));
  // Login must NOT enforce registration complexity rules — an existing account
  // may predate them (e.g. an admin password without an uppercase letter).
  // Authentication is Supabase's job; we only require a non-empty password.
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "").trim();

  if (!email.success) return { error: email.error.errors[0]!.message };
  if (!password) return { error: "Password is required" };

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.data,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Invalid email or password" };
    }
    return { error: error.message };
  }

  const user = data?.user;

  if (user) {
    const [country, isAdmin] = await Promise.all([
      detectCountry(),
      isAdminUser(user.id),
    ]);
    // A soft-deleted account cannot sign in — the owner re-registers with the
    // same email instead (signUp reactivates it).
    const profile = await supabase.from("profiles").select("status").eq("id", user.id).maybeSingle();
    if (profile.data?.status === "deleted") {
      await supabase.auth.signOut();
      return { error: "This account has been deleted. Register again with this email to reactivate it." };
    }
    if (country) {
      await supabase.from("profiles").update({ country }).eq("id", user.id);
    }
    await ensureAdminProvisioned(user);
    await setInactivityCookie(Number(settings.security?.session_idle_minutes ?? 30));
    if (redirectTo && redirectTo.startsWith("/")) {
      redirect(redirectTo);
    }
    if (isAdmin) {
      redirect("/admin/dashboard");
    }
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  try {
    const cookieStore = await cookies();
    cookieStore.delete(LAST_ACTIVE_COOKIE);
  } catch {
    // no cookie store — the middleware clears/ignores it anyway
  }
  redirect("/auth/login");
}

export async function resendVerificationEmail(email: string) {
  const parsed = emailSchema.safeParse(String(email ?? "").trim());
  if (!parsed.success) return { error: "Invalid email address" };

  const { allowed } = await checkRateLimit("resend-verification", "resendVerification", RATE_LIMITS.forgotPassword);
  if (!allowed) return { error: "Too many requests. Please try again later." };

  await sendVerificationEmail(parsed.data);
  return { success: "A new verification code was sent to your email." };
}

export async function sendPasswordResetEmail(_prev: unknown, formData: FormData) {
  const { allowed } = await checkRateLimit("forgot-password", "forgotPassword", RATE_LIMITS.forgotPassword);
  if (!allowed) return { error: "Too many requests. Please try again later." };

  const email = emailSchema.safeParse(formData.get("email"));
  if (!email.success) return { error: email.error.errors[0]!.message };

  // Mint a real recovery code + link and deliver them through our own Resend
  // channel — no dependency on Supabase's SMTP config.
  try {
    const admin = createAdminClient();
    const { data: link, error } = await admin.auth.admin.generateLink({
      type: "recovery",
      email: email.data,
      options: { redirectTo: `${SITE_URL}/auth/reset-password` },
    });
    if (error || !link?.properties) {
      console.error("[email] generateLink(recovery) failed for", email.data, error?.message ?? "no properties");
    } else {
      const code = link.properties.email_otp;
      const resetUrl = `${SITE_URL}/auth/reset-password?token_hash=${encodeURIComponent(link.properties.hashed_token)}&type=recovery`;
      const res = await sendEmail({
        to: email.data,
        subject: "Reset Your TWallet Password",
        html: buildPasswordResetEmail({ resetUrl, code }),
        type: "password_reset_email",
      });
      if (!res.success) console.error("[email] reset send failed:", res.error);
      return { success: "Check your email for a reset code" };
    }
  } catch (err) {
    console.error("[email] sendPasswordResetEmail failed:", err instanceof Error ? err.message : err);
  }

  // Fallback: let Supabase send its own recovery email (may not arrive if SMTP is down).
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email.data, {
    redirectTo: `${SITE_URL}/auth/reset-password`,
  });
  if (error) return { error: error.message };

  return { success: "Check your email for a reset code" };
}

export async function updatePassword(_prev: unknown, formData: FormData) {
  const password = passwordSchema.safeParse(formData.get("password"));
  if (!password.success) return { error: password.error.errors[0]!.message };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password: password.data });

  if (error) return { error: error.message };

  // Password-changed notification (best-effort, awaited so it isn't dropped)
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.email) {
    try {
      const res = await sendEmail({
        to: user.email,
        subject: "Password Changed - TWallet",
        html: buildPasswordChangedEmail(),
        type: "password_changed_email",
      });
      if (!res.success) console.error("[email] password-changed send failed:", res.error);
    } catch (err) {
      console.error("[email] password-changed send failed:", err instanceof Error ? err.message : err);
    }
  }

  redirect("/auth/login?reset=success");
}

export async function changePassword(_prev: unknown, formData: FormData) {
  const { allowed } = await checkRateLimit("change-password", "changePassword", RATE_LIMITS.forgotPassword);
  if (!allowed) return { error: "Too many requests. Please try again later." };

  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword) return { error: "Current password is required" };
  if (newPassword !== confirmPassword) return { error: "New passwords do not match" };

  const parsed = passwordSchema.safeParse(newPassword);
  if (!parsed.success) return { error: parsed.error.errors[0]!.message };

  if (currentPassword === newPassword) return { error: "New password must be different from current password" };

  // Verify the current password against the account before allowing a change.
  if (user.email) {
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (verifyError) return { error: "Current password is incorrect" };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data });
  if (error) return { error: error.message };

  // Sync last-change timestamp to profiles so dashboards + realtime reflect it.
  await supabase.from("profiles").update({ password_changed_at: new Date().toISOString() }).eq("id", user.id);

  // Notify the account owner via the bell.
  await supabase.from("notifications").insert({
    user_id: user.id,
    type: "system",
    title: "Password changed",
    message: "Your account password was updated successfully. If this wasn't you, contact support immediately.",
  });

  if (user.email) {
    try {
      const res = await sendEmail({
        to: user.email,
        subject: "Password Changed - TWallet",
        html: buildPasswordChangedEmail(),
        type: "password_changed_email",
      });
      if (!res.success) console.error("[email] password-changed send failed:", res.error);
    } catch (err) {
      console.error("[email] password-changed send failed:", err instanceof Error ? err.message : err);
    }
  }

  revalidatePath("/dashboard/security");
  revalidatePath("/admin/settings");
  return { success: "Password updated successfully. Your account is synced across devices." };
}
