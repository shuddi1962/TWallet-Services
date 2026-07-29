"use client";

import dynamic from "next/dynamic";
import { type ReactNode } from "react";

/**
 * Client-only wallet stack (avoids SSR indexedDB / window issues).
 * Loading state still renders children so the page shell appears immediately;
 * hooks only run after Providers mounts.
 */
const Providers = dynamic(
  () => import("@/providers").then((m) => m.Providers),
  {
    ssr: false,
    loading: () => null,
  },
);

export function WalletProviders({ children }: { children: ReactNode }) {
  return <Providers>{children}</Providers>;
}
