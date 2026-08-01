"use client";

import { Wallet, ChevronDown, LogOut, Copy, Check, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useWalletConnect } from "@/lib/hooks/use-wallet-connect";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { createClient } from "@/lib/supabase/client";
import { openConnectDialog } from "@/lib/utils/connect";
import { toast } from "sonner";

function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function ConnectButton() {
  const { disconnect, isConnected, address } = useWalletConnect();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (mounted) setSignedIn(Boolean(data.user));
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: { user: { id: string } | null } | null) => {
      if (mounted) setSignedIn(Boolean(session));
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleConnect = () => {
    if (signedIn === null) return;
    if (!signedIn) {
      const redirect = "/dashboard/wallet?connect=1";
      window.sessionStorage.setItem("tw-pending-connect", "1");
      router.push(`/auth/login?redirect=${encodeURIComponent(redirect)}&connect=1`);
      return;
    }
    openConnectDialog();
  };

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
          className="inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          {short(address)}
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openConnectDialog();
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50"
              >
                <ShieldCheck className="h-4 w-4" />
                Validate manually
              </button>
              <button
                type="button"
                onClick={() => void copy()}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy address"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  void disconnect();
                }}
                className="flex w-full items-center gap-2 border-t border-slate-200 px-4 py-2.5 text-left text-sm text-red-500 hover:bg-slate-50"
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
      onClick={handleConnect}
      size="sm"
      className="rounded-full"
    >
      <Wallet className="h-4 w-4" />
      <span>Connect</span>
    </Button>
  );
}
