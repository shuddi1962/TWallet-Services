"use client";

import { useActionState } from "react";
import { updatePassword } from "@/features/auth/server/actions";

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(updatePassword, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-2xl font-bold">Set new password</h1>
        <p className="mb-8 text-surface-500">Enter your new password below</p>

        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="rounded-lg border border-error/20 bg-error/10 p-3 text-sm text-error">
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </main>
  );
}
