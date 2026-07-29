"use client";

import { useCallback, useState } from "react";
import { useAccount, useConnect, useDisconnect, useConnectors } from "wagmi";
import { useWalletConnectionState } from "./wallet-connection-context";

export function useWalletConnect() {
  const { isConnected, address, chainId } = useAccount();
  const { connectAsync, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const connectors = useConnectors();
  const { connecting, setConnecting } = useWalletConnectionState();
  const [selectOpen, setSelectOpen] = useState(false);

  const openWallet = useCallback(async () => {
    if (isConnected) {
      setSelectOpen(true);
      return;
    }

    const available = connectors.filter((c) => c.id !== "safe");
    if (available.length === 0) return;

    if (available.length === 1) {
      setConnecting(true);
      try {
        await connectAsync({ connector: available[0] });
      } catch {
        // user rejected or connector error
      } finally {
        setConnecting(false);
      }
      return;
    }

    setSelectOpen(true);
  }, [isConnected, connectors, connectAsync, setConnecting]);

  const connectWith = useCallback(
    async (connectorId: string) => {
      const connector = connectors.find((c) => c.uid === connectorId || c.id === connectorId);
      if (!connector) return;
      setSelectOpen(false);
      setConnecting(true);
      try {
        await connectAsync({ connector });
      } catch {
        // user rejected
      } finally {
        setConnecting(false);
      }
    },
    [connectors, connectAsync, setConnecting],
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
