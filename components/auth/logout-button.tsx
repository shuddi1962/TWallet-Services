"use client";

import { useTransition } from "react";
import { signOut } from "@/features/auth/server/actions";
import { LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function LogoutButton({
  className,
  label = "Log out",
}: {
  className?: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => void signOut())}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-60",
        className,
      )}
      aria-label="Log out of your account"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <LogOut className="h-4 w-4" aria-hidden="true" />
      )}
      <span>{pending ? "Signing out…" : label}</span>
    </button>
  );
}
