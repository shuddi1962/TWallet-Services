"use client";

import { useActionState } from "react";
import Link from "next/link";
import { adminSendPasswordResetEmail } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(adminSendPasswordResetEmail, undefined);

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white">Admin password reset</h1>
        <p className="mt-1 text-surface-400">
          Enter your admin email and we&apos;ll send you a reset link
        </p>
      </div>

      <Card className="border-white/10 bg-surface-900/70">
        <CardContent className="p-6">
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="rounded-lg border border-error/20 bg-error/10 p-3 text-sm text-error" role="alert">
                {state.error}
              </div>
            )}
            {state?.success && (
              <div className="rounded-lg border border-success/20 bg-success/10 p-3 text-sm text-success" role="status">
                {state.success}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-surface-200">Admin email</Label>
              <Input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@twalletservices.com"
                className="border-surface-300 bg-white text-surface-900 placeholder:text-surface-400"
              />
            </div>

            <Button type="submit" fullWidth loading={pending}>
              {pending ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-surface-500">
        <Link href="/admin/login" className="text-brand-400 hover:underline">
          Back to admin sign in
        </Link>
      </p>
    </div>
  );
}