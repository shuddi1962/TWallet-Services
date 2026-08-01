"use client";

import { useActionState, useState, useEffect } from "react";
import { signIn, signUp } from "@/features/auth/server/actions";
import { trackLogin, trackSignup } from "@/lib/analytics";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

type Mode = "login" | "register";

const MODES: { value: Mode; label: string }[] = [
  { value: "login", label: "Sign in" },
  { value: "register", label: "Create account" },
];

export function AuthForm({ initialMode = "login" }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [loginState, loginAction, loginPending] = useActionState(signIn, undefined);
  const [registerState, registerAction, registerPending] = useActionState(signUp, undefined);
  const [redirect, setRedirect] = useState("/dashboard");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("redirect");
    if (r && r.startsWith("/")) setRedirect(r);
    if (params.get("connect") === "1") {
      window.sessionStorage.setItem("tw-pending-connect", "1");
    }
  }, []);

  const title = mode === "login" ? "Sign in" : "Create account";
  const subtitle =
    mode === "login" ? "Welcome back to TWALLET" : "Get your TWALLET card today";

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="mt-1 text-surface-400">{subtitle}</p>
      </div>

      <div className="mb-6 flex rounded-xl border border-white/10 bg-surface-900/70 p-1" role="tablist" aria-label="Authentication mode">
        {MODES.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={mode === tab.value}
            onClick={() => setMode(tab.value)}
            className={cn(
              "flex-1 rounded-lg py-2 text-sm font-semibold transition-colors",
              mode === tab.value
                ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                : "text-surface-400 hover:text-white",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="border-white/10 bg-surface-900/70">
        <CardContent className="p-6">
          {mode === "login" ? (
            <form action={loginAction} onSubmit={() => trackLogin()} className="space-y-4">
              <input type="hidden" name="redirect" value={redirect} />
              {loginState?.error && (
                <div className="rounded-lg border border-error/20 bg-error/10 p-3 text-sm text-error" role="alert">
                  {loginState.error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-surface-200">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="border-surface-300 bg-white text-surface-900 placeholder:text-surface-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-surface-200">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="border-surface-300 bg-white text-surface-900 placeholder:text-surface-400"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="text-brand-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" fullWidth loading={loginPending}>
                {loginPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          ) : (
            <form
              action={registerAction}
              onSubmit={() => {
                trackSignup();
                window.sessionStorage.setItem("tw-pending-connect", "1");
              }}
              className="space-y-4"
            >
              {registerState?.error && (
                <div className="rounded-lg border border-error/20 bg-error/10 p-3 text-sm text-error" role="alert">
                  {registerState.error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-surface-200">Full name</Label>
                <Input id="name" name="name" type="text" required placeholder="John Doe" className="border-surface-300 bg-white text-surface-900 placeholder:text-surface-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-surface-200">Email</Label>
                <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="border-surface-300 bg-white text-surface-900 placeholder:text-surface-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-surface-200">Password</Label>
                <Input id="password" name="password" type="password" autoComplete="new-password" required placeholder="••••••••" aria-describedby="password-hint" className="border-surface-300 bg-white text-surface-900 placeholder:text-surface-400" />
                <p id="password-hint" className="text-xs text-surface-400">
                  Min 8 chars, 1 uppercase, 1 lowercase, 1 number
                </p>
              </div>

              <Button type="submit" fullWidth loading={registerPending}>
                {registerPending ? "Creating account..." : "Create account"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-surface-500">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("register")}
              className="text-brand-400 hover:underline"
            >
              Create one
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("login")}
              className="text-brand-400 hover:underline"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </div>
  );
}
