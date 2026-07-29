"use client";

import { useEffect } from "react";
import { useAppKit } from "@reown/appkit/react";

/** Bridges window events → official Reown AppKit modal (QR + all wallets) */
export function AppKitBridge() {
  const { open, close } = useAppKit();

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ view?: "Connect" | "Account" }>).detail;
      void open({ view: detail?.view ?? "Connect" }).catch((err: unknown) => {
        console.error("[AppKit] open failed", err);
      });
    };
    const onClose = () => {
      try {
        close();
      } catch {
        // ignore
      }
    };
    window.addEventListener("twallet:open-wallet", onOpen);
    window.addEventListener("twallet:close-wallet", onClose);
    return () => {
      window.removeEventListener("twallet:open-wallet", onOpen);
      window.removeEventListener("twallet:close-wallet", onClose);
    };
  }, [open, close]);

  return null;
}
