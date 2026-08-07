"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense, type ReactNode } from "react";
import posthog from "posthog-js";
import { CONSENT_EVENT, getAnalyticsConsent } from "@/lib/consent";

function initPostHog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (typeof window === "undefined" || !key || posthog.__loaded) return;
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
    capture_pageview: false,
    loaded: (ph) => {
      if (process.env.NODE_ENV !== "production") ph.opt_out_capturing();
      if (getAnalyticsConsent() !== "granted") ph.opt_out_capturing();
    },
  });
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (posthog.__loaded && getAnalyticsConsent() === "granted") {
      posthog.capture("$pageview", { path: pathname, search: searchParams?.toString() });
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (getAnalyticsConsent() === "granted") initPostHog();

    const onConsent = (event: Event) => {
      const granted = (event as CustomEvent<{ granted: boolean }>).detail?.granted;
      if (granted) {
        initPostHog();
        posthog.capture("$pageview", {
          path: window.location.pathname,
          search: window.location.search.replace(/^\?/, ""),
        });
      } else if (posthog.__loaded) {
        posthog.opt_out_capturing();
      }
    };

    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);

  return (
    <>
      <Suspense fallback={null}><PostHogPageView /></Suspense>
      {children}
    </>
  );
}
