"use client";

import { useActionState } from "react";
import { updatePassword } from "@/features/auth/server/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(updatePassword, undefined);

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white">Set new password</h1>
        <p className="mt-1 text-surface-400">Enter your new password below</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="rounded-lg border border-error/20 bg-error/10 p-3 text-sm text-error">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
              />
              <p className="text-xs text-surface-400">
                Min 8 chars, 1 uppercase, 1 lowercase, 1 number
              </p>
            </div>

            <Button type="submit" fullWidth loading={pending}>
              {pending ? "Updating..." : "Update password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
