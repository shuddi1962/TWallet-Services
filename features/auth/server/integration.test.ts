import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib", () => ({
  createServerSupabaseClient: vi.fn(),
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
import { clearRateLimits } from "@/lib/rate-limit";
import { signUp, signIn, signOut, sendPasswordResetEmail, updatePassword } from "./actions";

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

beforeEach(() => {
  vi.clearAllMocks();
  clearRateLimits();
});

describe("Auth Integration", () => {
  it("signs up, signs in, resets password, signs out", async () => {
    const auth = makeAuth();
    auth.signUp.mockResolvedValue({ error: null });
    auth.signInWithPassword.mockResolvedValue({ error: null });
    auth.resetPasswordForEmail.mockResolvedValue({ error: null });
    auth.updateUser.mockResolvedValue({ error: null });
    auth.signOut.mockResolvedValue({ error: null });
    (createServerSupabaseClient as any).mockResolvedValue({ auth });
    const base = { email: "user@example.com", password: "StrongPass1" };

    const signUpFd = new FormData();
    signUpFd.set("email", base.email);
    signUpFd.set("password", base.password);
    signUpFd.set("name", "Test User");
    await signUp(null, signUpFd);
    expect(auth.signUp).toHaveBeenCalledWith({
      email: base.email,
      password: base.password,
      options: { data: { full_name: "Test User" }, emailRedirectTo: "http://localhost:3000/auth/callback" },
    });

    const signInFd = new FormData();
    signInFd.set("email", base.email);
    signInFd.set("password", base.password);
    await signIn(null, signInFd);
    expect(auth.signInWithPassword).toHaveBeenCalledWith({ email: base.email, password: base.password });

    const resetFd = new FormData();
    resetFd.set("email", base.email);
    await sendPasswordResetEmail(null, resetFd);
    expect(auth.resetPasswordForEmail).toHaveBeenCalledWith(base.email, {
      redirectTo: "http://localhost:3000/auth/reset-password",
    });

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

  it("handles duplicate signup", async () => {
    const auth = makeAuth();
    auth.signUp.mockResolvedValue({ error: { message: "User already registered" } });
    (createServerSupabaseClient as any).mockResolvedValue({ auth });
    const fd = new FormData();
    fd.set("email", "existing@example.com");
    fd.set("password", "StrongPass1");
    fd.set("name", "Existing");
    const result = await signUp(null, fd);
    expect(result).toEqual({ error: "User already registered" });
  });
});