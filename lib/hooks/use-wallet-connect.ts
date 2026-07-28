"use client";

import { useCallback } from "react";
import { useConnect, useAccount } from "wagmi";
import { useWalletConnectionState } from "./wallet-connection-context";

type WcMessage = { type: string; data?: unknown };

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
      const onDisplayUri = (msg: WcMessage) => {
        if (msg.type === "display_uri") setUri(String(msg.data));
      };
      wcConnector.emitter.on("message", onDisplayUri);
      await connectAsync({ connector: wcConnector });
      wcConnector.emitter.off("message", onDisplayUri);
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
