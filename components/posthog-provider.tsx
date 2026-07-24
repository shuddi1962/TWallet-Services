"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense, type ReactNode } from "react";
import posthog from "posthog-js";

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    posthog.capture("$pageview", { path: pathname, search: searchParams?.toString() });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (typeof window !== "undefined" && key && !posthog.__loaded) {
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
        capture_pageview: false,
        loaded: (ph) => {
          if (process.env.NODE_ENV !== "production") ph.opt_out_capturing();
        },
      });
    }
  }, []);

  return (
    <>
      <Suspense fallback={null}><PostHogPageView /></Suspense>
      {children}
    </>
  );
}
