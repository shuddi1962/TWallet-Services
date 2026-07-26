"use client";

import { useConnect, useAccount } from "wagmi";

export function useWalletConnect() {
  const { isConnected } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();

  return {
    openWallet: async () => {
      if (!isConnected && connectors.length > 0) {
        try {
          await connectAsync({ connector: connectors[0] });
        } catch {}
      }
    },
    connecting: isPending,
    isConnected,
  };
}