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
import { Eye, EyeOff, TimerOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("redirect");
    if (r && r.startsWith("/")) setRedirect(r);
    if (params.get("connect") === "1") {
      window.sessionStorage.setItem("tw-pending-connect", "1");
    }
    if (params.get("expired") === "1") {
      setNotice("Your session expired due to inactivity. Please sign in again.");
    } else if (params.get("confirmed") === "1") {
      setNotice("Your email is confirmed. You can sign in now.");
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
          {notice && (
            <div
              role="status"
              className="mb-4 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-400"
            >
              <TimerOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{notice}</span>
            </div>
          )}
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
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="border-surface-300 bg-white pr-10 text-surface-900 placeholder:text-surface-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-900"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </div>
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
                <Label htmlFor="country" className="text-surface-200">Country</Label>
                <select
                  id="country"
                  name="country"
                  required
                  defaultValue="US"
                  className="w-full rounded-md border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="NG">Nigeria</option>
                  <option value="GH">Ghana</option>
                  <option value="ZA">South Africa</option>
                  <option value="KE">Kenya</option>
                  <option value="IN">India</option>
                  <option value="AE">United Arab Emirates</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="ES">Spain</option>
                  <option value="IT">Italy</option>
                  <option value="NL">Netherlands</option>
                  <option value="PT">Portugal</option>
                  <option value="TR">Turkey</option>
                  <option value="BR">Brazil</option>
                  <option value="MX">Mexico</option>
                  <option value="JP">Japan</option>
                  <option value="ID">Indonesia</option>
                  <option value="SG">Singapore</option>
                  <option value="PH">Philippines</option>
                  <option value="AR">Argentina</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-surface-200">Email</Label>
                <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="border-surface-300 bg-white text-surface-900 placeholder:text-surface-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-surface-200">Password</Label>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required placeholder="••••••••" aria-describedby="password-hint" className="border-surface-300 bg-white pr-10 text-surface-900 placeholder:text-surface-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-900"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </div>
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
