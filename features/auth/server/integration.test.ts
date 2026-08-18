import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib", () => ({
  createServerSupabaseClient: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn(async () => ({ success: true })),
  buildPasswordResetEmail: vi.fn(() => "<p>reset</p>"),
  buildPasswordChangedEmail: vi.fn(() => "<p>changed</p>"),
  buildEmailVerificationEmail: vi.fn(() => "<p>verify</p>"),
}));

vi.mock("@/lib/admin-provision", () => ({
  ensureAdminProvisioned: vi.fn().mockResolvedValue(undefined),
  isAdminUser: vi.fn().mockResolvedValue(false),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() => ({
    get: (key: string) => {
      const map: Record<string, string> = {
        "x-forwarded-for": `127.0.0.${Math.floor(Math.random() * 255)}`,
        origin: "http://localhost:3000",
      };
      return map[key] ?? null;
    },
  })),
}));

const { redirectMock } = vi.hoisted(() => ({ redirectMock: vi.fn() }));

vi.mock("next/navigation", () => ({ redirect: redirectMock }));

import { createServerSupabaseClient } from "@/lib";
import { createAdminClient } from "@/lib/supabase/admin";
import { clearRateLimits } from "@/lib/rate-limit";
import { signUp, signIn, signOut, sendPasswordResetEmail, updatePassword } from "./actions";

function makeAdmin() {
  return {
    auth: {
      admin: {
        createUser: vi.fn(),
        generateLink: vi.fn(async () => ({
          data: { properties: { email_otp: "123456", confirmation_url: "http://localhost:3000/auth/reset-password?token_hash=abc&type=recovery" } },
          error: null,
        })),
        updateUserById: vi.fn(async () => ({ error: null })),
      },
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
      update: vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) })),
    })),
  };
}

function makeAuth() {
  return {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
    getUser: vi.fn().mockResolvedValue({ data: { user: { email: "user@example.com" } }, error: null }),
  };
}

function makeProfilesFrom(status = "active") {
  return vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        maybeSingle: vi.fn().mockResolvedValue({ data: { status }, error: null }),
      })),
    })),
    update: vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) })),
  }));
}

beforeEach(() => {
  vi.clearAllMocks();
  clearRateLimits();
});

describe("Auth Integration", () => {
  it("signs up, signs in, resets password, signs out", async () => {
    const auth = makeAuth();
    auth.signInWithPassword.mockResolvedValue({ error: null });
    auth.resetPasswordForEmail.mockResolvedValue({ error: null });
    auth.updateUser.mockResolvedValue({ error: null });
    auth.signOut.mockResolvedValue({ error: null });
    (createServerSupabaseClient as any).mockResolvedValue({ auth, from: makeProfilesFrom() });
    const admin = makeAdmin();
    admin.auth.admin.createUser.mockResolvedValue({
      data: { user: { id: "u1", email: "user@example.com" } },
      error: null,
    });
    (createAdminClient as any).mockReturnValue(admin);
    const base = { email: "user@example.com", password: "StrongPass1" };

    const signUpFd = new FormData();
    signUpFd.set("email", base.email);
    signUpFd.set("password", base.password);
    signUpFd.set("name", "Test User");
    await signUp(null, signUpFd);
    expect(admin.auth.admin.createUser).toHaveBeenCalledWith({
      email: base.email,
      password: base.password,
      email_confirm: false,
      user_metadata: { full_name: "Test User" },
    });

    const signInFd = new FormData();
    signInFd.set("email", base.email);
    signInFd.set("password", base.password);
    await signIn(null, signInFd);
    expect(auth.signInWithPassword).toHaveBeenCalledWith({ email: base.email, password: base.password });

    const resetFd = new FormData();
    resetFd.set("email", base.email);
    const resetResult = await sendPasswordResetEmail(null, resetFd);
    expect(resetResult).toEqual({ success: "Check your email for a reset code" });
    expect(admin.auth.admin.generateLink).toHaveBeenCalled();
    expect(auth.resetPasswordForEmail).not.toHaveBeenCalled();

    const updateFd = new FormData();
    updateFd.set("password", "NewStrongPass1");
    await updatePassword(null, updateFd);
    expect(auth.updateUser).toHaveBeenCalledWith({ password: "NewStrongPass1" });

    await signOut();
    expect(auth.signOut).toHaveBeenCalled();
    expect(redirectMock).toHaveBeenCalledTimes(4);
  });

  it("returns user-friendly error for invalid credentials", async () => {
    const auth = makeAuth();
    auth.signInWithPassword.mockResolvedValue({ error: { message: "Invalid login credentials" } });
    (createServerSupabaseClient as any).mockResolvedValue({ auth });
    const fd = new FormData();
    fd.set("email", "test@example.com");
    fd.set("password", "WrongPass1");
    const result = await signIn(null, fd);
    expect(result).toEqual({ error: "Invalid email or password" });
  });

  it("handles duplicate signup by resending the code", async () => {
    const auth = makeAuth();
    (createServerSupabaseClient as any).mockResolvedValue({ auth, from: makeProfilesFrom() });
    const admin = makeAdmin();
    admin.auth.admin.createUser.mockResolvedValue({
      data: null,
      error: { message: "A user with this email address has already been registered" },
    });
    (createAdminClient as any).mockReturnValue(admin);
    const fd = new FormData();
    fd.set("email", "existing@example.com");
    fd.set("password", "StrongPass1");
    fd.set("name", "Existing");
    await signUp(null, fd);
    // generateLink succeeds → unconfirmed → code re-sent, no error surfaced.
    expect(redirectMock).toHaveBeenCalledWith("/auth/verify?email=existing%40example.com");
  });

  it("rejects sign-in for a soft-deleted account", async () => {
    const auth = makeAuth();
    auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: "deleted-id", email: "deleted@example.com" } },
      error: null,
    });
    (createServerSupabaseClient as any).mockResolvedValue({ auth, from: makeProfilesFrom("deleted") });
    const fd = new FormData();
    fd.set("email", "deleted@example.com");
    fd.set("password", "StrongPass1");
    const result = await signIn(null, fd);
    expect(result).toEqual({
      error: "This account has been deleted. Register again with this email to reactivate it.",
    });
    expect(auth.signOut).toHaveBeenCalled();
  });

  it("falls back to Supabase email when generateLink fails", async () => {
    const auth = makeAuth();
    auth.resetPasswordForEmail.mockResolvedValue({ error: null });
    (createServerSupabaseClient as any).mockResolvedValue({ auth });
    const admin = makeAdmin();
    (admin.auth.admin.generateLink as any).mockResolvedValue({ data: null, error: { message: "boom" } });
    (createAdminClient as any).mockReturnValue(admin);
    const fd = new FormData();
    fd.set("email", "user@example.com");
    fd.set("password", "StrongPass1");
    fd.set("name", "Test User");
    const result = await sendPasswordResetEmail(null, fd);
    expect(result).toEqual({ success: "Check your email for a reset code" });
    expect(auth.resetPasswordForEmail).toHaveBeenCalledWith("user@example.com", {
      redirectTo: "http://localhost:3000/auth/reset-password",
    });
  });
});