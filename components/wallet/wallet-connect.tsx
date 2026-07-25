"use client";

import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Plug } from "lucide-react";

export function WalletConnect() {
  const { isConnected, address } = useAccount();
  const { open } = useWeb3Modal();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isConnected ? "Connected Wallet" : "Connect Wallet"}</CardTitle>
        <CardDescription>
          Connect MetaMask, WalletConnect, Coinbase Wallet, or Trust Wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/10 ring-1 ring-brand-500/20">
            <Wallet className="h-7 w-7 text-brand-400" />
          </div>
          <h3 className="text-base font-semibold text-white">
            {isConnected ? "Wallet connected" : "No wallet connected"}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-surface-400">
            {isConnected
              ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
              : "Connect your self-custody wallet to start ordering cards and making crypto payments."}
          </p>
          <Button className="mt-6" onClick={() => open()}>
            {isConnected ? <Plug className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
            {isConnected ? "Switch Wallet" : "Connect Wallet"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
