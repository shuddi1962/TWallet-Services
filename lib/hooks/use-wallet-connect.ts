"use client";

import { useCallback } from "react";
import { useConnect, useAccount, type Connector } from "wagmi";
import { useWalletModal } from "@/lib/wallet-modal-context";

export function useWalletConnect() {
  const { isConnected } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const modal = useWalletModal();

  const openWallet = useCallback(
    async (connector?: Connector) => {
      if (isConnected) return;
      if (connector) {
        try {
          await connectAsync({ connector });
        } catch {}
      } else {
        modal.open(connectors);
      }
    },
    [isConnected, connectAsync, connectors, modal],
  );

  return {
    openWallet,
    connectors,
    connecting: isPending,
    isConnected,
  };
}