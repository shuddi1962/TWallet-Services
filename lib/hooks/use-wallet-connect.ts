"use client";

import { useCallback } from "react";
import { useConnect, useAccount } from "wagmi";

export function useWalletConnect() {
  const { isConnected } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();

  const openWallet = useCallback(async () => {
    if (isConnected) return;
    const wcConnector = connectors.find((c) => c.id === "walletConnect");
    if (!wcConnector) {
      console.error("[useWalletConnect] walletConnect connector not found");
      return;
    }
    try {
      await connectAsync({ connector: wcConnector });
    } catch (err) {
      console.error("[useWalletConnect] connection failed:", err);
    }
  }, [isConnected, connectAsync, connectors]);

  return {
    openWallet,
    connectors,
    connecting: isPending,
    isConnected,
  };
}
