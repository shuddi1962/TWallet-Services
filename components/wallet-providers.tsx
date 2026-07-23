"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const WalletProvidersInner = dynamic(() => import("@/providers").then((m) => m.Providers), {
  ssr: false,
});

export function WalletProviders({ children }: { children: ReactNode }) {
  return <WalletProvidersInner>{children}</WalletProvidersInner>;
}
