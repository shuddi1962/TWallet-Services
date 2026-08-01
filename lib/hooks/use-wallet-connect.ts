"use client";

import { useCallback } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { toast } from "sonner";
import { openConnectDialog } from "@/lib/utils/connect";

export function useWalletConnect() {
  const { isConnected, address, chainId, status } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const openWallet = useCallback(() => {
    openConnectDialog();
  }, []);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnectAsync();
      toast.message("Wallet disconnected");
    } catch (e) {
      console.error(e);
    }
  }, [disconnectAsync]);

  return {
    openWallet,
    connectWith: openWallet,
    connectInjected: openWallet,
    connectWC: openWallet,
    disconnect: handleDisconnect,
    connecting: status === "connecting" || status === "reconnecting",
    busyId: null as string | null,
    isConnected,
    address,
    chainId,
    connectors: [] as readonly unknown[],
    selectOpen: false,
    setSelectOpen: (() => {}) as (v: boolean) => void,
    wcUri: null as string | null,
    setWcUri: (() => {}) as (v: string | null) => void,
    qrOpen: false,
    setQrOpen: (() => {}) as (v: boolean) => void,
    error: null,
    copyUri: (() => {}) as () => Promise<void>,
    openUri: (() => {}) as () => void,
  };
}