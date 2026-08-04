import type { Metadata } from "next";
import Link from "next/link";
import { TrustLogo } from "@/components/brand/trust-logo";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-surface-950">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-950/20 via-surface-950 to-surface-950" />
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[min(600px,80vw)] w-[min(600px,80vw)] rounded-full bg-brand-500/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[min(400px,60vw)] w-[min(400px,60vw)] rounded-full bg-accent-500/5 blur-3xl" />
      <div className="relative flex items-center justify-center p-4 pt-[max(2rem,env(safe-area-inset-top))]">
        <Link href="/" className="group">
          <TrustLogo size="md" />
        </Link>
      </div>
      <div className="relative flex flex-1 items-center justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
