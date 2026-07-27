"use client";

import { useCallback } from "react";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";

export function useWalletConnect() {
  const { isConnected } = useAccount();
  const { open: openModal } = useWeb3Modal();

  const openWallet = useCallback(async () => {
    if (isConnected) return;
    openModal();
  }, [isConnected, openModal]);

  return {
    openWallet,
    connecting: false,
    isConnected,
  };
}
