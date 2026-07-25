"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import posthog from "posthog-js";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    posthog.captureException(error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="bg-surface-950 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-error text-6xl font-bold">500</h1>
          <h2 className="text-surface-50 mt-4 text-2xl font-bold">Something went wrong</h2>
          <p className="text-surface-400 mt-2">An unexpected error occurred. Please try again.</p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={reset}
              className="bg-brand-600 hover:bg-brand-700 rounded-xl px-6 py-3 font-semibold text-white transition"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="border-surface-700 text-surface-300 hover:border-surface-600 hover:text-surface-100 rounded-xl border px-6 py-3 font-semibold transition"
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
