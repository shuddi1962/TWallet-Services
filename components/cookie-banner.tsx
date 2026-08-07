"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAnalyticsConsent, setAnalyticsConsent } from "@/lib/consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getAnalyticsConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-surface-700 bg-surface-900/95 p-4 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-sm text-surface-300">
          We use cookies to keep the site secure and working. Analytics are only
          loaded with your consent.{" "}
          <Link href="/cookies" className="text-brand-400 underline">
            Learn more
          </Link>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => {
              setAnalyticsConsent(false);
              setVisible(false);
            }}
            className="rounded-lg border border-surface-600 px-4 py-2 text-sm font-medium text-surface-200 transition hover:border-surface-500"
          >
            Decline
          </button>
          <button
            onClick={() => {
              setAnalyticsConsent(true);
              setVisible(false);
            }}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
