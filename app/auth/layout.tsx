import type { Metadata } from "next";
import Link from "next/link";
import { Wallet } from "lucide-react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-brand-50 to-white">
      <div className="flex items-center justify-center p-4 pt-8">
        <Link href="/" className="flex items-center gap-2">
          <Wallet className="h-7 w-7 text-brand-600" />
          <span className="text-xl font-bold tracking-tight text-surface-900">
            TWallet
          </span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}
