"use client";

import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";

export function useWallet() {
  const { address, isConnected, chainId, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { open } = useWeb3Modal();

  return {
    address,
    isConnected,
    chainId,
    connector,
    balance: "",
    symbol: "",
    connect: () => open(),
    disconnect: () => disconnect(),
    switchNetwork: (chainId: number) => switchChain({ chainId }),
  };
}
