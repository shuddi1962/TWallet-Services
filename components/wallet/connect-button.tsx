"use client";

import { Wallet, ChevronDown, LogOut, Copy, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWalletConnect } from "@/lib/hooks/use-wallet-connect";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { toast } from "sonner";

function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function ConnectButton() {
  const { openWallet, disconnect, connecting, isConnected, address } = useWalletConnect();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!address) return;
    const ok = await copyToClipboard(address);
    if (ok) {
      setCopied(true);
      toast.success("Address copied");
      setTimeout(() => setCopied(false), 1500);
    } else {
      toast.error("Could not copy address");
    }
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-sm font-medium text-brand-300 transition hover:bg-brand-500/20"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          {short(address)}
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-surface-900 shadow-2xl">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  void openWallet();
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-surface-200 hover:bg-white/5"
              >
                <Wallet className="h-4 w-4" />
                Switch wallet
              </button>
              <button
                type="button"
                onClick={() => void copy()}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-surface-200 hover:bg-white/5"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy address"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  void disconnect();
                }}
                className="flex w-full items-center gap-2 border-t border-white/5 px-4 py-2.5 text-left text-sm text-red-400 hover:bg-white/5"
              >
                <LogOut className="h-4 w-4" />
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <Button
      type="button"
      onClick={() => openWallet()}
      size="sm"
      className="rounded-full"
      // Never lock the header on WalletConnect QR / reconnect hangs
      disabled={false}
      aria-busy={connecting}
    >
      {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
      <span>Connect</span>
    </Button>
  );
}
