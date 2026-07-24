"use client";

import posthog from "posthog-js";

type EventProperties = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, properties?: EventProperties) {
  try {
    if (typeof posthog.capture === "function") {
      posthog.capture(name, properties);
    }
  } catch {
    // Analytics should never break the app
  }
}

// Auth events
export const trackSignup = () => trackEvent("user_registered");
export const trackLogin = () => trackEvent("user_logged_in");
export const trackLogout = () => trackEvent("user_logged_out");

// Wallet events
export const trackWalletConnected = (provider: string) => trackEvent("wallet_connected", { provider });
export const trackWalletDisconnected = () => trackEvent("wallet_disconnected");
export const trackNetworkSwitched = (chainId: number) => trackEvent("network_switched", { chainId: String(chainId) });

// Card events
export const trackCardOrdered = (productName: string) => trackEvent("card_ordered", { product: productName });
export const trackCardViewed = (cardType: string) => trackEvent("card_viewed", { type: cardType });

// Payment events
export const trackPaymentInitiated = (amount: string, network: string) => trackEvent("payment_initiated", { amount, network });
export const trackPaymentConfirmed = (txHash: string) => trackEvent("payment_confirmed", { txHash: txHash.slice(0, 10) });
export const trackPaymentFailed = (reason: string) => trackEvent("payment_failed", { reason });

// Order events
export const trackOrderCreated = () => trackEvent("order_created");
export const trackOrderStatusChanged = (status: string) => trackEvent("order_status_changed", { status });

// Support events
export const trackTicketCreated = () => trackEvent("support_ticket_created");
export const trackTicketResolved = () => trackEvent("support_ticket_resolved");

// Navigation events
export const trackPageView = (path: string) => trackEvent("page_view", { path });
