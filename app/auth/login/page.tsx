"use client";

import { useActionState, useState, useEffect } from "react";
import { signIn } from "@/features/auth/server/actions";
import { trackLogin } from "@/lib/analytics";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, undefined);
  const [redirect, setRedirect] = useState("/dashboard");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("redirect");
    if (r && r.startsWith("/")) setRedirect(r);
    if (params.get("connect") === "1") {
      window.sessionStorage.setItem("tw-pending-connect", "1");
    }
  }, []);

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white">Sign in</h1>
        <p className="mt-1 text-surface-400">Welcome back to TWALLET</p>
      </div>

      <Card className="border-white/10 bg-surface-900/70">
        <CardContent className="p-6">
          <form action={formAction} onSubmit={() => trackLogin()} className="space-y-4">
            <input type="hidden" name="redirect" value={redirect} />
            {state?.error && (
              <div className="rounded-lg border border-error/20 bg-error/10 p-3 text-sm text-error" role="alert">
                {state.error}
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
                className="border-white/10 bg-surface-800 text-white placeholder:text-surface-500"
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
                className="border-white/10 bg-surface-800 text-white placeholder:text-surface-500"
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

            <Button type="submit" fullWidth loading={pending}>
              {pending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-surface-500">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-brand-400 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
