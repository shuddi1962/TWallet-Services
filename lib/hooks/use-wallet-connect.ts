"use client";

import { useCallback } from "react";
import { useConnect, useAccount } from "wagmi";
import { useWalletConnectionState } from "./wallet-connection-context";

type ProviderWithEvents = {
  on: (e: string, cb: (...a: unknown[]) => void) => void;
  off: (e: string, cb: (...a: unknown[]) => void) => void;
};

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

    let provider: ProviderWithEvents | null = null;
    const onUri: (...a: unknown[]) => void = (u) => setUri(u as string);

    try {
      provider = (await wcConnector.getProvider()) as ProviderWithEvents;
      provider?.on("display_uri", onUri);
      await connectAsync({ connector: wcConnector });
    } catch (e) {
      console.error("WalletConnect error:", e);
    }

    provider?.off("display_uri", onUri);
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
