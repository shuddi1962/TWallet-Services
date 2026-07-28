"use client";

import { useCallback } from "react";
import { useConnect, useAccount } from "wagmi";

export function useWalletConnect() {
  const { isConnected } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();

  const openWallet = useCallback(async () => {
    if (isConnected) return;
    const wcConnector = connectors.find((c) => c.id === "walletConnect");
    if (!wcConnector) return;
    try {
      await connectAsync({ connector: wcConnector });
    } catch {}
  }, [isConnected, connectAsync, connectors]);

  return {
    openWallet,
    connectors,
    connecting: isPending,
    isConnected,
  };
}
