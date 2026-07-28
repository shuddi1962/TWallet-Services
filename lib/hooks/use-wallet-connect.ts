"use client";

import { useCallback } from "react";
import { useConnect, useAccount } from "wagmi";
import { useWalletConnectionState } from "./wallet-connection-context";

export function useWalletConnect() {
  const { isConnected } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const { setUri, setConnecting } = useWalletConnectionState();

  const openWallet = useCallback(async () => {
    if (isConnected) return;
    const wcConnector = connectors.find((c) => c.id === "walletConnect");
    if (!wcConnector) return;

    setConnecting(true);
    setUri(null);

    try {
      await connectAsync({
        connector: wcConnector,
        onDisplayUri: (uri) => setUri(uri),
      });
    } catch (e) {
      console.error("WalletConnect error:", e);
    }

    setUri(null);
    setConnecting(false);
  }, [isConnected, connectAsync, connectors, setUri, setConnecting]);

  return {
    openWallet,
    connectors,
    connecting: isConnected ? false : isPending,
    isConnected,
  };
}
