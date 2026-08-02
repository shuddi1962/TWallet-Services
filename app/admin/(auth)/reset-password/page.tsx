"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updatePassword } from "@/features/auth/server/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminResetPasswordPage() {
  const [state, formAction, pending] = useActionState(updatePassword, undefined);

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white">Set a new password</h1>
        <p className="mt-1 text-surface-400">
          Choose a strong password for your admin account
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

            <div className="space-y-2">
              <Label htmlFor="admin-pw" className="text-surface-200">New password</Label>
              <Input
                id="admin-pw"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                aria-describedby="pw-hint"
                className="border-surface-300 bg-white text-surface-900 placeholder:text-surface-400"
              />
              <p id="pw-hint" className="text-xs text-surface-400">
                Min 8 chars, 1 uppercase, 1 lowercase, 1 number
              </p>
            </div>

            <Button type="submit" fullWidth loading={pending}>
              {pending ? "Saving..." : "Update password"}
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