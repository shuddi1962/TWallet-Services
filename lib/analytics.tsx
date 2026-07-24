"use client";

import { useEffect } from "react";

export type AnalyticsEvent =
  | "page_view"
  | "order_created"
  | "payment_submitted"
  | "payment_verified"
  | "wallet_connected"
  | "card_ordered"
  | "signup_completed";

export interface AnalyticsProps {
  enabled?: boolean;
}

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.umami !== "undefined") {
      window.umami.track(event, properties);
    }
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", event, properties);
    }
  } catch {
    // silently fail in environments without analytics
  }
}

export function AnalyticsProvider({ enabled = true }: AnalyticsProps) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    trackEvent("page_view", { path: window.location.pathname });
  }, [enabled]);

  return null;
}

export function usePageViewTracking() {
  useEffect(() => {
    trackEvent("page_view", { path: window.location.pathname });
  }, []);
}

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, unknown>) => void };
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}
