"use client";

import { useActionState } from "react";
import { signUp } from "@/features/auth/server/actions";
import { trackSignup } from "@/lib/analytics";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(signUp, undefined);

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white">Create account</h1>
        <p className="mt-1 text-surface-400">Get your TWALLET card today</p>
      </div>

      <Card className="border-white/10 bg-surface-900/70">
        <CardContent className="p-6">
          <form
            action={formAction}
            onSubmit={() => {
              trackSignup();
              window.sessionStorage.setItem("tw-pending-connect", "1");
            }}
            className="space-y-4"
          >
            {state?.error && (
              <div className="rounded-lg border border-error/20 bg-error/10 p-3 text-sm text-error" role="alert">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-surface-200">Full name</Label>
              <Input id="name" name="name" type="text" required placeholder="John Doe" className="border-white/10 bg-surface-800 text-white placeholder:text-surface-500" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-surface-200">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="border-white/10 bg-surface-800 text-white placeholder:text-surface-500" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-surface-200">Password</Label>
              <Input id="password" name="password" type="password" autoComplete="new-password" required placeholder="••••••••" aria-describedby="password-hint" className="border-white/10 bg-surface-800 text-white placeholder:text-surface-500" />
              <p id="password-hint" className="text-xs text-surface-400">
                Min 8 chars, 1 uppercase, 1 lowercase, 1 number
              </p>
            </div>

            <Button type="submit" fullWidth loading={pending}>
              {pending ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-surface-500">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-brand-400 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}