"use client";

import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Plug, Loader2 } from "lucide-react";
import { useWalletConnect } from "@/lib/hooks/use-wallet-connect";

export function WalletConnect() {
  const { isConnected, address } = useAccount();
  const { openWallet, connecting } = useWalletConnect();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isConnected ? "Trust Wallet Connected" : "Connect Trust Wallet"}</CardTitle>
        <CardDescription>
          {isConnected ? "Your wallet is connected and ready to use" : "Connect your Trust Wallet to start ordering cards and making crypto payments"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/10 ring-1 ring-brand-500/20">
            <Smartphone className="h-7 w-7 text-brand-400" />
          </div>
          <h3 className="text-base font-semibold text-white">
            {isConnected ? "Trust Wallet connected" : "No wallet connected"}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-surface-400">
            {isConnected
              ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
              : "Connect Trust Wallet to start ordering cards and making crypto payments."}
          </p>
          <Button className="mt-6" onClick={() => openWallet()} disabled={connecting}>
            {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : isConnected ? <Plug className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
            {connecting ? "Connecting..." : isConnected ? "Switch Wallet" : "Connect Trust Wallet"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
