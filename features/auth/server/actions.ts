"use server";

import { createServerSupabaseClient } from "@/lib";
import { emailSchema, passwordSchema } from "@/lib/validations";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(_prev: unknown, formData: FormData) {
  const email = emailSchema.safeParse(formData.get("email"));
  const password = passwordSchema.safeParse(formData.get("password"));
  const name = String(formData.get("name") ?? "").trim();

  if (!email.success) return { error: email.error.errors[0]!.message };
  if (!password.success) return { error: password.error.errors[0]!.message };
  if (!name) return { error: "Name is required" };

  const supabase = await createServerSupabaseClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.signUp({
    email: email.data,
    password: password.data,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) return { error: error.message };
  redirect("/auth/verify?email=" + encodeURIComponent(email.data));
}

export async function signIn(_prev: unknown, formData: FormData) {
  const email = emailSchema.safeParse(formData.get("email"));
  const password = passwordSchema.safeParse(formData.get("password"));

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

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}

export async function sendPasswordResetEmail(_prev: unknown, formData: FormData) {
  const email = emailSchema.safeParse(formData.get("email"));
  if (!email.success) return { error: email.error.errors[0]!.message };

  const supabase = await createServerSupabaseClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.resetPasswordForEmail(email.data, {
    redirectTo: `${origin}/auth/reset-password`,
  });

  if (error) return { error: error.message };
  return { success: "Check your email for a reset link" };
}

export async function updatePassword(_prev: unknown, formData: FormData) {
  const password = passwordSchema.safeParse(formData.get("password"));
  if (!password.success) return { error: password.error.errors[0]!.message };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password: password.data });

  if (error) return { error: error.message };
  redirect("/auth/login?reset=success");
}
