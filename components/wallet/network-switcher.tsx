"use client";

import { useState } from "react";
import { useSwitchChain, useChainId } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";

const NETWORKS = [
  { id: 1, name: "Ethereum Mainnet", chain: "ETH" },
  { id: 11155111, name: "Sepolia", chain: "ETH" },
  { id: 137, name: "Polygon", chain: "MATIC" },
  { id: 8453, name: "Base", chain: "ETH" },
  { id: 42161, name: "Arbitrum", chain: "ETH" },
  { id: 10, name: "Optimism", chain: "ETH" },
];

export function NetworkSwitcher() {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [open, setOpen] = useState(false);

  const current = NETWORKS.find((n) => n.id === chainId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-haspopup="listbox"
          >
            <span>{current?.name ?? "Select Network"}</span>
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </Button>
          {open && (
            <div
              className="absolute z-10 mt-1 w-full rounded-lg border border-white/10 bg-surface-900 shadow-lg"
              role="listbox"
            >
              {NETWORKS.map((network) => (
                <button
                  key={network.id}
                  role="option"
                  aria-selected={chainId === network.id}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-white hover:bg-white/5 first:rounded-t-lg last:rounded-b-lg"
                  onClick={() => {
                    switchChain?.({ chainId: network.id });
                    setOpen(false);
                  }}
                >
                  {chainId === network.id && (
                    <Check className="h-4 w-4 text-brand-400" aria-hidden="true" />
                  )}
                  <span className={chainId === network.id ? "ml-0" : "ml-6"}>
                    {network.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
