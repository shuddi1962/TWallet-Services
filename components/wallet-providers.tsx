"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const ProvidersInner = dynamic(() => import("@/providers").then((m) => m.Providers), {
  ssr: false,
});

export function WalletProviders({ children }: { children: ReactNode }) {
  return <ProvidersInner>{children}</ProvidersInner>;
}
