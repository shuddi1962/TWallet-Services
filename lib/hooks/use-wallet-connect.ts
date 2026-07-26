"use client";

import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";

export function useWalletConnect() {
  const { isConnected } = useAccount();
  const { open } = useAppKit();

  return {
    openWallet: () => { if (!isConnected) open(); },
    connecting: false,
    isConnected,
  };
}
