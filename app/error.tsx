"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center bg-surface-950 px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-error">500</h1>
          <h2 className="mt-4 text-2xl font-bold text-surface-50">Something went wrong</h2>
          <p className="mt-2 text-surface-400">An unexpected error occurred. Please try again.</p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={reset}
              className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="rounded-xl border border-surface-700 px-6 py-3 font-semibold text-surface-300 transition hover:border-surface-600 hover:text-surface-100"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}