import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";
import { AppFooter } from "@/components/layout/app-footer";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-surface-950">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-950/20 via-surface-950 to-surface-950" />
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[min(600px,80vw)] w-[min(600px,80vw)] rounded-full bg-brand-500/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[min(400px,60vw)] w-[min(400px,60vw)] rounded-full bg-white/5 blur-3xl" />
      <div className="relative flex items-center justify-center p-4 pt-[max(2rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black shadow-lg ring-1 ring-white/10">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="block text-lg font-bold text-white">Trust</span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-surface-400">
              Admin Portal
            </span>
          </div>
        </div>
      </div>
      <div className="relative flex flex-1 items-center justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-sm">{children}</div>
      </div>
      <div className="relative">
        <AppFooter variant="dark" />
      </div>
      <Link
        href="/"
        className="relative mx-auto mb-6 text-xs text-surface-500 underline-offset-4 transition hover:text-surface-300 hover:underline"
      >
        ← Back to site
      </Link>
    </div>
  );
}