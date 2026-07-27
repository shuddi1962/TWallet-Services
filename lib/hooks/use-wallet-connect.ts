"use client";

import { useCallback } from "react";
import { useConnect, useAccount, type Connector } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";

export function useWalletConnect() {
  const { isConnected } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const { open: openModal } = useWeb3Modal();

  const openWallet = useCallback(
    async (connector?: Connector) => {
      if (isConnected) return;
      if (connector) {
        try {
          await connectAsync({ connector });
        } catch {}
      } else {
        openModal();
      }
    },
    [isConnected, connectAsync, openModal],
  );

  return {
    openWallet,
    connectors,
    connecting: isPending,
    isConnected,
  };
}