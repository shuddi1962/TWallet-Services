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

const { cookieStore } = vi.hoisted(() => ({
  cookieStore: { set: vi.fn(), delete: vi.fn() },
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
  cookies: vi.fn(async () => cookieStore),
}));

const { redirectMock } = vi.hoisted(() => ({ redirectMock: vi.fn() }));

vi.mock("next/navigation", () => ({ redirect: redirectMock }));

import { createServerSupabaseClient } from "@/lib";
import { createAdminClient } from "@/lib/supabase/admin";
import { clearRateLimits } from "@/lib/rate-limit";
import { signUp, signIn, signOut, sendPasswordResetEmail, updatePassword } from "./actions";

beforeEach(() => {
  vi.clearAllMocks();
  clearRateLimits();
  (createServerSupabaseClient as any).mockResolvedValue({
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
      getUser: vi.fn().mockResolvedValue({ data: { user: { email: "test@example.com" } }, error: null }),
    },
  });
  (createAdminClient as any).mockReturnValue({
    auth: {
      admin: {
        generateLink: vi.fn(async () => ({
          data: { properties: { email_otp: "123456", confirmation_url: "http://localhost:3000/auth/reset-password?token_hash=abc&type=recovery" } },
          error: null,
        })),
      },
    },
  });
});

describe("signUp", () => {
  it("returns error for invalid email", async () => {
    const fd = new FormData();
    fd.set("email", "bad");
    fd.set("password", "StrongPass1");
    fd.set("name", "Test");
    const result = await signUp(null, fd);
    expect(result).toEqual({ error: "Invalid email address" });
  });

  it("returns error for weak password", async () => {
    const fd = new FormData();
    fd.set("email", "test@example.com");
    fd.set("password", "short");
    fd.set("name", "Test");
    const result = await signUp(null, fd);
    expect(result).toEqual({ error: expect.any(String) });
  });

  it("returns error for missing name", async () => {
    const fd = new FormData();
    fd.set("email", "test@example.com");
    fd.set("password", "StrongPass1");
    fd.set("name", "");
    const result = await signUp(null, fd);
    expect(result).toEqual({ error: "Name is required" });
  });

  it("redirects on success", async () => {
    const auth = (await (createServerSupabaseClient as any)()).auth;
    auth.signUp.mockResolvedValue({ error: null });
    const fd = new FormData();
    fd.set("email", "new@example.com");
    fd.set("password", "StrongPass1");
    fd.set("name", "New User");
    await signUp(null, fd);
    expect(auth.signUp).toHaveBeenCalledWith({
      email: "new@example.com",
      password: "StrongPass1",
      options: {
        data: { full_name: "New User" },
        emailRedirectTo: "http://localhost:3000/auth/callback",
      },
    });
    expect(redirectMock).toHaveBeenCalledWith("/auth/verify?email=new%40example.com");
  });

  it("returns error from Supabase", async () => {
    const auth = (await (createServerSupabaseClient as any)()).auth;
    auth.signUp.mockResolvedValue({ error: { message: "Email already registered" } });
    const fd = new FormData();
    fd.set("email", "test@example.com");
    fd.set("password", "StrongPass1");
    fd.set("name", "Test");
    const result = await signUp(null, fd);
    expect(result).toEqual({ error: "Email already registered" });
  });
});

describe("signIn", () => {
  it("returns error for invalid email", async () => {
    const fd = new FormData();
    fd.set("email", "bad");
    fd.set("password", "StrongPass1");
    const result = await signIn(null, fd);
    expect(result).toEqual({ error: "Invalid email address" });
  });

  it("returns error for invalid credentials", async () => {
    const auth = (await (createServerSupabaseClient as any)()).auth;
    auth.signInWithPassword.mockResolvedValue({ error: { message: "Invalid login credentials" } });
    const fd = new FormData();
    fd.set("email", "test@example.com");
    fd.set("password", "StrongPass1");
    const result = await signIn(null, fd);
    expect(result).toEqual({ error: "Invalid email or password" });
  });

  it("redirects on success", async () => {
    const auth = (await (createServerSupabaseClient as any)()).auth;
    auth.signInWithPassword.mockResolvedValue({ error: null });
    const fd = new FormData();
    fd.set("email", "test@example.com");
    fd.set("password", "StrongPass1");
    await signIn(null, fd);
    expect(redirectMock).toHaveBeenCalledWith("/dashboard");
  });
});

describe("signOut", () => {
  it("calls supabase signOut and redirects", async () => {
    const auth = (await (createServerSupabaseClient as any)()).auth;
    auth.signOut.mockResolvedValue({ error: null });
    await signOut();
    expect(auth.signOut).toHaveBeenCalled();
    expect(redirectMock).toHaveBeenCalledWith("/auth/login");
  });
});

describe("sendPasswordResetEmail", () => {
  it("returns error for invalid email", async () => {
    const fd = new FormData();
    fd.set("email", "bad");
    const result = await sendPasswordResetEmail(null, fd);
    expect(result).toEqual({ error: "Invalid email address" });
  });

  it("sends reset email via generateLink", async () => {
    const fd = new FormData();
    fd.set("email", "test@example.com");
    const result = await sendPasswordResetEmail(null, fd);
    expect(result).toEqual({ success: "Check your email for a reset code" });
  });
});

describe("updatePassword", () => {
  it("returns error for weak password", async () => {
    const fd = new FormData();
    fd.set("password", "short");
    const result = await updatePassword(null, fd);
    expect(result).toEqual({ error: expect.any(String) });
  });

  it("redirects on success", async () => {
    const auth = (await (createServerSupabaseClient as any)()).auth;
    auth.updateUser.mockResolvedValue({ error: null });
    const fd = new FormData();
    fd.set("password", "StrongPass1");
    await updatePassword(null, fd);
    expect(auth.updateUser).toHaveBeenCalledWith({ password: "StrongPass1" });
    expect(redirectMock).toHaveBeenCalledWith("/auth/login?reset=success");
  });
});
