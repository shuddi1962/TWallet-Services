"use client";

import { Smartphone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWalletConnect } from "@/lib/hooks/use-wallet-connect";

export function ConnectButton() {
  const { openWallet, connecting, isConnected } = useWalletConnect();

  if (isConnected) {
    return (
      <Button disabled className="cursor-default">
        <Smartphone className="h-4 w-4" />
        <span>Connected</span>
      </Button>
    );
  }

  return (
    <Button onClick={() => openWallet()} disabled={connecting}>
      {connecting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Smartphone className="h-4 w-4" />
      )}
      <span>{connecting ? "Connecting..." : "Connect Wallet"}</span>
    </Button>
  );
}
