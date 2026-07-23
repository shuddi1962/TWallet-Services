import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard } from "lucide-react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-surface-950 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-950/20 via-surface-950 to-surface-950 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-500/5 blur-3xl pointer-events-none" />
      <div className="relative flex items-center justify-center p-4 pt-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-600/30 transition-transform group-hover:scale-110">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            TWALLET
          </span>
        </Link>
      </div>
      <div className="relative flex flex-1 items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}
