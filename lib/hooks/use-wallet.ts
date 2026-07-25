"use client";

import { useAccount, useBalance, useDisconnect, useSwitchChain } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { formatUnits } from "viem";

export function useWallet() {
  const { address, isConnected, chainId, connector } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { open } = useWeb3Modal();

  return {
    address,
    isConnected,
    chainId,
    connector,
    balance: balanceData ? formatUnits(balanceData.value, balanceData.decimals) : "",
    symbol: balanceData?.symbol ?? "",
    connect: () => open(),
    disconnect: () => disconnect(),
    switchNetwork: (chainId: number) => switchChain({ chainId }),
  };
}
