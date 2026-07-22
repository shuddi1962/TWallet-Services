"use client";

import { useActionState } from "react";
import { sendPasswordResetEmail } from "@/features/auth/server/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(
    sendPasswordResetEmail,
    undefined,
  );

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-surface-900">Reset password</h1>
        <p className="mt-1 text-surface-500">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="rounded-lg border border-error/20 bg-error/10 p-3 text-sm text-error">
                {state.error}
              </div>
            )}
            {state?.success && (
              <div className="rounded-lg border border-success/20 bg-success/10 p-3 text-sm text-success">
                {state.success}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
              />
            </div>

            <Button type="submit" fullWidth loading={pending}>
              {pending ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-surface-500">
        <Link href="/auth/login" className="text-brand-600 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
