"use client";

import { useCallback, useState } from "react";
import { useAccount, useConnect, useDisconnect, useConnectors } from "wagmi";

/**
 * Opens Reown AppKit when ready (QR + all wallets).
 * Falls back to wagmi WalletConnect connector (official QR modal) or injected.
 */
export function useWalletConnect() {
  const { isConnected, address, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectAsync, isPending } = useConnect();
  const connectors = useConnectors();
  const [connecting, setConnecting] = useState(false);

  const openWallet = useCallback(async () => {
    setConnecting(true);
    try {
      // Prefer AppKit modal if initialized
      const mod = await import("@reown/appkit/react").catch(() => null);
      if (mod) {
        try {
          // getAppKit from core package
          const core = await import("@reown/appkit");
          const getAppKit = (core as { getAppKit?: () => { open: (o?: { view?: string }) => Promise<void> } })
            .getAppKit;
          if (typeof getAppKit === "function") {
            const kit = getAppKit();
            await kit.open({ view: isConnected ? "Account" : "Connect" });
            return;
          }
        } catch {
          // continue to fallback
        }
      }

      // Fallback: WalletConnect connector (shows WC QR + wallet list)
      const wc = connectors.find(
        (c) => c.id === "walletConnect" || c.name.toLowerCase().includes("walletconnect"),
      );
      if (wc && !isConnected) {
        await connectAsync({ connector: wc });
        return;
      }

      // Fallback: injected browser wallet
      const injected = connectors.find(
        (c) => c.id === "injected" || c.type === "injected",
      );
      if (injected && !isConnected) {
        await connectAsync({ connector: injected });
        return;
      }

      // Last resort: first available connector
      const first = connectors[0];
      if (first && !isConnected) {
        await connectAsync({ connector: first });
      }
    } catch (e) {
      console.error("Wallet connect error:", e);
    } finally {
      setConnecting(false);
    }
  }, [connectors, connectAsync, isConnected]);

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  return {
    openWallet,
    connectWith: openWallet,
    disconnect: handleDisconnect,
    connecting: connecting || isPending,
    isConnected,
    address,
    chainId,
    connectors,
    selectOpen: false,
    setSelectOpen: (_v: boolean) => {},
    error: null as Error | null,
  };
}
