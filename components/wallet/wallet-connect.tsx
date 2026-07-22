"use client";

import { useAppKit } from "@web3modal/wagmi/react";
import { useAccount, useBalance, useChainId, useDisconnect } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatAddress } from "@/utils";
import { Wallet, Plug, LogOut, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function WalletConnect() {
  const { open } = useAppKit();
  const { address: wagmiAddress, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const const_chainId = useChainId();
  const { data: balance } = useBalance({ address: wagmiAddress });
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (wagmiAddress) {
      navigator.clipboard.writeText(wagmiAddress);
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected || !wagmiAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connected Wallet</CardTitle>
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
              No wallet connected
            </h3>
            <p className="mt-1 max-w-sm text-sm text-surface-400">
              Connect your self-custody wallet to start ordering cards and making crypto payments.
            </p>
            <Button className="mt-6" onClick={() => open()}>
              <Plug className="h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Connected Wallet</CardTitle>
            <CardDescription>Your self-custody wallet is connected</CardDescription>
          </div>
          <Badge variant="success">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-success" />
            Connected
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-white/5 bg-surface-800/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-surface-500">Wallet Address</p>
              <p className="mt-1 font-mono text-sm text-white">
                {formatAddress(wagmiAddress)}
              </p>
            </div>
            <button
              onClick={copyAddress}
              className="rounded-md p-2 text-surface-500 transition-colors hover:bg-white/5 hover:text-white"
            >
              {copied ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {balance && (
          <div className="rounded-lg border border-white/5 bg-surface-800/50 p-4">
            <p className="text-xs font-medium text-surface-500">Balance</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {Number(balance.formatted).toFixed(4)} {balance.symbol}
            </p>
          </div>
        )}

        <div className="rounded-lg border border-white/5 bg-surface-800/50 p-4">
          <p className="text-xs font-medium text-surface-500">Network</p>
          <p className="mt-1 text-sm font-semibold text-white">
            Chain ID: {const_chainId}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            fullWidth
            onClick={() => open()}
          >
            Switch Network
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={() => disconnect()}
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
