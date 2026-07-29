"use client";

import { useCallback, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

/**
 * Opens the official Reown / WalletConnect modal via AppKitBridge:
 * QR code + full wallet grid (MetaMask, Trust, Binance, Ledger, …).
 */
export function useWalletConnect() {
  const { isConnected, address, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const [connecting, setConnecting] = useState(false);

  const openWallet = useCallback(async () => {
    setConnecting(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("twallet:open-wallet", {
          detail: { view: isConnected ? "Account" : "Connect" },
        }),
      );
    }
    setTimeout(() => setConnecting(false), 600);
  }, [isConnected]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("twallet:close-wallet"));
    }
  }, [disconnect]);

  return {
    openWallet,
    connectWith: openWallet,
    disconnect: handleDisconnect,
    connecting,
    isConnected,
    address,
    chainId,
    connectors: [] as const,
    selectOpen: false,
    setSelectOpen: (_v: boolean) => {},
    error: null as Error | null,
  };
}
