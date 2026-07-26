"use client";

import dynamic from "next/dynamic";
import { Component, ReactNode } from "react";

const ProvidersInner = dynamic(() => import("@/providers").then((m) => m.Providers), {
  ssr: false,
});

class WalletErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[WalletErrorBoundary] Caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.children;
    }
    return <ProvidersInner>{this.props.children}</ProvidersInner>;
  }
}

export function WalletProviders({ children }: { children: ReactNode }) {
  return <WalletErrorBoundary>{children}</WalletErrorBoundary>;
}
