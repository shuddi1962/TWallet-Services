"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Wallet, ShieldCheck, AlertTriangle, Loader2, X, ChevronDown, CheckCircle2, Pencil, Power } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ManualValidation } from "@/components/wallet/manual-validation";
import { useWalletConnect } from "@/lib/hooks/use-wallet-connect";
import { createClient } from "@/lib/supabase/client";
import { disconnectMyWallet, changeMyWalletAddress } from "@/features/wallet-validate/server/actions";

type AssignedWallet = {
  id: string;
  address: string;
  network: string;
  wallet_name: string;
  assigned_at: string | null;
};

export default function WalletPage() {
  const { isConnected, address } = useWalletConnect();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"choose" | "web3" | "manual">("choose");
  const [showWeb3Details, setShowWeb3Details] = useState(false);
  const [web3Busy, setWeb3Busy] = useState(false);
  const [assigned, setAssigned] = useState<AssignedWallet | null>(null);
  const assignedLoaded = useRef(false);

  // Change-address form
  const [editOpen, setEditOpen] = useState(false);
  const [networks, setNetworks] = useState<{ id: string; name: string }[]>([]);
  const [newAddress, setNewAddress] = useState("");
  const [newNetwork, setNewNetwork] = useState("");
  const [changeBusy, setChangeBusy] = useState(false);
  const [disconnectBusy, setDisconnectBusy] = useState(false);

  // Auto-connect: when an admin assigns a wallet address after manual
  // validation, the wallet is written to this account and reflects here in
  // real time (the admin-assigned row is marked default).
  const loadAssigned = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("wallets")
      .select("id, address, network, label, message")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setAssigned({
        id: data.id as string,
        address: data.address as string,
        network: (data.network as string) ?? "",
        wallet_name: ((data.label as string) ?? "Wallet") as string,
        assigned_at: null,
      });
    }
  }, []);

  useEffect(() => {
    if (assignedLoaded.current) return;
    assignedLoaded.current = true;
    void loadAssigned();

    const supabase = createClient();
    const channel = supabase
      .channel("my-assigned-wallet-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wallet_validations" },
        () => {
          void loadAssigned();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wallets" },
        () => {
          void loadAssigned();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadAssigned]);

  useEffect(() => {
    if (searchParams.get("connect") === "1") {
      setOpen(true);
      setMode("choose");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!editOpen || networks.length > 0) return;
    const supabase = createClient();
    (async () => {
      try {
        const { data } = await supabase
          .from("supported_networks")
          .select("id, name")
          .eq("active", true);
        const list = ((data ?? []) as unknown as { id: string; name: string }[]).map((n) => ({
          id: n.id,
          name: n.name,
        }));
        setNetworks(list);
        setNewNetwork((prev) => prev || list[0]?.id || "");
      } catch {
        /* ignore */
      }
    })();
  }, [editOpen, networks.length]);

  const handleWeb3 = () => {
    setWeb3Busy(true);
    setTimeout(() => setWeb3Busy(false), 1600);
  };

  const handleDisconnect = async () => {
    if (!assigned) return;
    if (!window.confirm("Disconnect this wallet from your account?")) return;
    setDisconnectBusy(true);
    const res = await disconnectMyWallet(assigned.id);
    setDisconnectBusy(false);
    if (res.success) {
      toast.success("Wallet disconnected");
      setAssigned(null);
      void loadAssigned();
    } else {
      toast.error(res.error);
    }
  };

  const handleChangeAddress = async () => {
    if (!assigned) return;
    if (!newAddress.trim()) return toast.error("Enter the new wallet address");
    setChangeBusy(true);
    const res = await changeMyWalletAddress(newAddress, newNetwork);
    setChangeBusy(false);
    if (res.success) {
      toast.success("Wallet address updated");
      setEditOpen(false);
      setNewAddress("");
      void loadAssigned();
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Wallet</h1>
        <p className="mt-1 text-sm text-slate-500">
          Validate your wallet to make crypto payments
        </p>
      </div>

      {assigned ? (
        <Card className="border-emerald-200 bg-emerald-50/60">
          <CardContent className="flex flex-col gap-4 p-5">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)]" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-emerald-800">Wallet connected</p>
                <p className="truncate font-mono text-xs text-emerald-700">
                  {assigned.address.slice(0, 6)}…{assigned.address.slice(-4)}
                </p>
                <p className="text-[11px] text-emerald-600">
                  {assigned.wallet_name}
                  {assigned.network ? ` · ${assigned.network}` : ""} · verified by TWallet
                </p>
              </div>
              <div className="ml-auto flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-lg border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-100"
                  onClick={() => {
                    setEditOpen((v) => !v);
                    setNewNetwork(assigned.network || networks[0]?.id || "");
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  Change
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-lg border-red-300 bg-white text-red-600 hover:bg-red-50"
                  onClick={() => void handleDisconnect()}
                  disabled={disconnectBusy}
                >
                  {disconnectBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Power className="h-3.5 w-3.5" aria-hidden="true" />}
                  Disconnect
                </Button>
              </div>
            </div>

            {editOpen && (
              <div className="rounded-xl border border-emerald-200 bg-white p-4">
                <p className="mb-3 text-xs font-semibold text-slate-700">Change wallet address</p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="0x… or Solana base58 address"
                    disabled={changeBusy}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-brand-500 focus:outline-none"
                    aria-label="New wallet address"
                  />
                  <select
                    value={newNetwork}
                    onChange={(e) => setNewNetwork(e.target.value)}
                    disabled={changeBusy || networks.length === 0}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    aria-label="Network"
                  >
                    {networks.map((n) => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => void handleChangeAddress()}
                    disabled={changeBusy}
                  >
                    {changeBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : null}
                    Save
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (isConnected && address) ? (
        <Card className="border-emerald-200 bg-emerald-50/60">
          <CardContent className="flex items-center gap-3 p-5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)]" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">Wallet connected</p>
              <p className="font-mono text-xs text-emerald-700">
                {address?.slice(0, 6)}…{address?.slice(-4)}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {!open && !assigned && !(isConnected && address) ? (
        <Card className="border-slate-200 bg-white">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 ring-1 ring-brand-200">
              <Wallet className="h-8 w-8 text-brand-600" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-900">Connect Wallet</h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Validate your wallet to make crypto payments
            </p>
            <Button
              type="button"
              className="mt-6 rounded-full px-10"
              onClick={() => {
                setOpen(true);
                setMode("choose");
              }}
            >
              <Wallet className="h-4 w-4" aria-hidden="true" />
              Connect Wallet
              <ChevronDown className="h-4 w-4 opacity-70" aria-hidden="true" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="relative rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white shadow-sm sm:h-11 sm:w-11">
              <Wallet className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Connect your wallet</h2>
              <p className="text-xs text-slate-500">Choose how you want to link your wallet</p>
            </div>
          </div>

          {mode === "choose" && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setMode("web3");
                  setShowWeb3Details(false);
                  setWeb3Busy(false);
                }}
                className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-300"
                aria-label="Connect wallet automatically with Web3"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
                  <Wallet className="h-5 w-5 text-brand-600" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">Connect Wallet (Web3)</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    WalletConnect QR · MetaMask · Trust Wallet · 300+ wallets
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode("manual")}
                className="flex w-full items-center gap-4 rounded-2xl border border-neutral-300 bg-neutral-50 p-4 text-left transition hover:border-black"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-white shadow-sm">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-black">Manual Wallet Validation</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Submit your wallet details for manual validation verification
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-black px-2.5 py-1 text-[10px] font-semibold text-white">
                  <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                  Recommended
                </span>
              </button>
            </div>
          )}

          {mode === "web3" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Temporarily unavailable</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      Browser wallet connections are currently unavailable on TWallet. Use manual wallet
                      validation instead — our team verifies your wallet details and activates it for you.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 w-full rounded-xl text-slate-400"
                  onClick={() => setShowWeb3Details((v) => !v)}
                  disabled={web3Busy}
                >
                  {web3Busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {showWeb3Details ? "Hide details" : "Why is this unavailable?"}
                </Button>
                {showWeb3Details && (
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2 w-full rounded-xl"
                    onClick={() => void handleWeb3()}
                  >
                    {web3Busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Wallet className="h-4 w-4" aria-hidden="true" />
                    )}
                    Try web3 connect
                  </Button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setMode("choose")}
                className="w-full text-center text-xs font-medium text-slate-400 transition hover:text-slate-600"
              >
                ← Back to options
              </button>
            </div>
          )}

          {mode === "manual" && (
            <div>
              <ManualValidation />
              <button
                type="button"
                onClick={() => setMode("choose")}
                className="mt-4 w-full text-center text-xs font-medium text-slate-400 transition hover:text-slate-600"
              >
                ← Back to options
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
