"use client";

import { useCallback, useState } from "react";
import { useAccount, useConnect, useDisconnect, useConnectors, type Connector } from "wagmi";
import { useWalletConnectionState } from "./wallet-connection-context";

export function useWalletConnect() {
  const { isConnected, address, chainId } = useAccount();
  const { connectAsync, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const connectors = useConnectors();
  const { connecting, setConnecting } = useWalletConnectionState();
  const [selectOpen, setSelectOpen] = useState(false);

  const connectWithConnector = useCallback(
    async (connector: Connector) => {
      setSelectOpen(false);
      setConnecting(true);
      try {
        await connectAsync({ connector });
      } catch {
        // user rejected or connector error
      } finally {
        setConnecting(false);
      }
    },
    [connectAsync, setConnecting],
  );

  const openWallet = useCallback(async () => {
    if (isConnected) {
      setSelectOpen(true);
      return;
    }

    const available = connectors.filter((c) => c.id !== "safe");
    const first = available[0];
    if (!first) return;

    if (available.length === 1) {
      await connectWithConnector(first);
      return;
    }

    setSelectOpen(true);
  }, [isConnected, connectors, connectWithConnector]);

  const connectWith = useCallback(
    async (connectorId: string) => {
      const connector = connectors.find((c) => c.uid === connectorId || c.id === connectorId);
      if (!connector) return;
      await connectWithConnector(connector);
    },
    [connectors, connectWithConnector],
  );

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  return {
    openWallet,
    connectWith,
    disconnect: handleDisconnect,
    connecting: isPending || connecting,
    isConnected,
    address,
    chainId,
    connectors,
    selectOpen,
    setSelectOpen,
    error,
  };
}
