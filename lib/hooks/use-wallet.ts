"use client";

import { useAccount, useBalance, useDisconnect, useSwitchChain } from "wagmi";
import { formatUnits } from "viem";
import { useWalletConnect } from "@/lib/hooks/use-wallet-connect";

export function useWallet() {
  const { address, isConnected, chainId, connector } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { openWallet } = useWalletConnect();

  return {
    address,
    isConnected,
    chainId,
    connector,
    balance: balanceData ? formatUnits(balanceData.value, balanceData.decimals) : "",
    symbol: balanceData?.symbol ?? "",
    connect: () => openWallet(),
    disconnect: () => disconnect(),
    switchNetwork: (chainId: number) => switchChain({ chainId }),
  };
}
