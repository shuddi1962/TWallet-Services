"use client";

import { useCallback } from "react";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";

export function useWalletConnect() {
  const { isConnected } = useAccount();
  const { open } = useAppKit();

  const openWallet = useCallback(async () => {
    if (isConnected) return;
    open();
  }, [isConnected, open]);

  return {
    openWallet,
    connecting: false,
    isConnected,
  };
}
