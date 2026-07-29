"use client";

import { type ReactNode } from "react";
import { Providers } from "@/providers";

/** Thin client boundary — Providers always wraps children with Wagmi. */
export function WalletProviders({ children }: { children: ReactNode }) {
  return <Providers>{children}</Providers>;
}
