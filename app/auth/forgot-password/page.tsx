"use client";

import { useActionState } from "react";
import { sendPasswordResetEmail } from "@/features/auth/server/actions";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(
    sendPasswordResetEmail,
    undefined,
  );

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-2xl font-bold">Reset password</h1>
        <p className="mb-8 text-surface-500">
          Enter your email and we&apos;ll send you a reset link
        </p>

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

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-surface-500">
          <Link href="/auth/login" className="text-brand-600 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
