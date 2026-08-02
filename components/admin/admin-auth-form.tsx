"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/features/auth/server/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export function AdminAuthForm() {
  const [loginState, loginAction, loginPending] = useActionState(signIn, undefined);
  const [redirect, setRedirect] = useState("/admin");
  const searchParams = useSearchParams();

  useEffect(() => {
    const r = searchParams.get("redirect");
    if (r && r.startsWith("/admin")) setRedirect(r);
  }, [searchParams]);

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white">Sign in to Admin</h1>
        <p className="mt-1 text-surface-400">Restricted access — authorized admins only</p>
      </div>

      <Card className="border-white/10 bg-surface-900/70">
        <CardContent className="p-6">
          <form action={loginAction} className="space-y-4">
            <input type="hidden" name="redirect" value={redirect} />
            {loginState?.error && (
              <div className="rounded-lg border border-error/20 bg-error/10 p-3 text-sm text-error" role="alert">
                {loginState.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-surface-200">Email</Label>
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

            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-surface-200">Password</Label>
              <Input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="border-surface-300 bg-white text-surface-900 placeholder:text-surface-400"
              />
            </div>

            <Link
              href="/admin/forgot-password"
              className="block text-right text-sm text-brand-400 hover:underline"
            >
              Forgot password?
            </Link>

            <Button type="submit" fullWidth loading={loginPending}>
              {loginPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-surface-500">
        You can&apos;t self-register. Admin access is granted by a super admin — contact the platform owner.
      </p>
    </div>
  );
}