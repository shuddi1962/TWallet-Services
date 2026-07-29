"use client";

import { Component, type ReactNode } from "react";
import { Providers } from "@/providers";

/**
 * Always wrap with WagmiProvider. Never render app children without it
 * (previous error boundary dropped the provider and broke all wagmi hooks).
 */
class WalletErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[WalletErrorBoundary]", error);
  }

  render() {
    // Keep children inside Providers even after a child error —
    // only replace the failing subtree, not the provider shell.
    if (this.state.hasError) {
      return (
        <Providers>
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="text-lg font-semibold text-white">Something went wrong loading wallets</p>
            <p className="max-w-md text-sm text-surface-400">
              Refresh the page. If it continues, clear site data and try again.
            </p>
            <button
              type="button"
              className="rounded-full bg-brand-600 px-5 py-2 text-sm font-medium text-white"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          </div>
        </Providers>
      );
    }

    return <Providers>{this.props.children}</Providers>;
  }
}

export function WalletProviders({ children }: { children: ReactNode }) {
  return <WalletErrorBoundary>{children}</WalletErrorBoundary>;
}
