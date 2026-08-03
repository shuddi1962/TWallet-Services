"use client";

import { Wallet, ChevronDown, LogOut, Copy, Check, ShieldCheck, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useWalletConnect } from "@/lib/hooks/use-wallet-connect";
import { useAssignedWallet } from "@/lib/hooks/use-assigned-wallet";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { createClient } from "@/lib/supabase/client";
import { openConnectDialog } from "@/lib/utils/connect";
import { disconnectMyWallet } from "@/features/wallet-validate/server/actions";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";

function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function ConnectButton({
  hideWhenSignedIn = false,
  className,
}: {
  hideWhenSignedIn?: boolean;
  className?: string;
}) {
  const { disconnect, isConnected, address } = useWalletConnect();
  const { wallet: assignedWallet, reload } = useAssignedWallet();
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

  if (hideWhenSignedIn && signedIn) {
    return null;
  }

  const copy = async (addr: string) => {
    const ok = await copyToClipboard(addr);
    if (ok) {
      setCopied(true);
      toast.success("Address copied");
      setTimeout(() => setCopied(false), 1500);
    } else {
      toast.error("Could not copy address");
    }
  };

  const handleDisconnect = async () => {
    if (assignedWallet) {
      if (!window.confirm("Disconnect this wallet from your account?")) {
        setMenuOpen(false);
        return;
      }
      const res = await disconnectMyWallet(assignedWallet.id);
      if (res.success) {
        toast.success("Wallet disconnected");
        setMenuOpen(false);
        void reload();
      } else {
        toast.error(res.error);
      }
      return;
    }
    setMenuOpen(false);
    void disconnect();
  };

  // Admin-assigned wallet (manual validation) — shown as a real connection.
  if (assignedWallet) {
    const addr = assignedWallet.address;
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-700"
          aria-label={`Wallet connected: ${addr.slice(0, 6)}…${addr.slice(-4)}`}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.9)]" />
          {short(addr)}
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
              <div className="border-b border-slate-100 px-4 py-2.5">
                <p className="text-[11px] uppercase tracking-wider text-slate-400">Wallet connected</p>
                <p className="truncate font-mono text-xs text-slate-800">{addr}</p>
                <p className="text-[11px] text-slate-400">
                  {assignedWallet.label}
                  {assignedWallet.network ? ` · ${assignedWallet.network}` : ""} · verified by TWallet
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/dashboard/wallet");
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50"
              >
                <ExternalLink className="h-4 w-4" />
                Wallet details
              </button>
              <button
                type="button"
                onClick={() => void copy(addr)}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy address"}
              </button>
              <button
                type="button"
                onClick={() => void handleDisconnect()}
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
                onClick={() => void copy(address)}
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
      className={cn("rounded-full", className)}
    >
      <Wallet className="h-4 w-4" />
      <span>Connect</span>
    </Button>
  );
}
