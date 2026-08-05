"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRealtime } from "@/lib/hooks/use-realtime";
import { useAccount, useChainId, useSwitchChain, useWriteContract } from "wagmi";
import { erc20Abi } from "viem";
import { createClient } from "@/lib/supabase/client";
import { openConnectDialog } from "@/lib/utils/connect";
import { formatPaymentError } from "@/lib/payment-errors";
import type { FundingSetup } from "@/components/cards/funding-setup";
import {
  Snowflake,
  Globe2,
  Wifi,
  KeyRound,
  Wallet,
  Plus,
  Trash2,
  Loader2,
  ArrowUpRight,
  Shield,
  Eye,
  EyeOff,
  Copy,
  Check,
  Send,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Gauge,
} from "lucide-react";
import { TwalletCard, finishForSlug, networkForSlug } from "@/components/cards/twallet-card";
import type { CardFinish } from "@/lib/cards";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddressQR } from "@/components/ui/address-qr";
import {
  updateCardControls,
  updateCardPin,
  updateCardLimit,
  cancelCard,
  revealCardSecrets,
  submitCardFundingTx,
} from "@/features/cards/server/issued-actions";
import { cn } from "@/lib/utils/cn";

export type IssuedCardRow = {
  id: string;
  label: string;
  finish: string;
  card_type: "virtual" | "physical";
  network: "visa" | "mastercard";
  status: string;
  pan_last4: string;
  pan_display: string;
  pan_full?: string | null;
  pan_formatted?: string | null;
  expiry_month: number;
  expiry_year: number;
  cvv_hint: string;
  holder_name: string;
  balance_usdc: number;
  frozen: boolean;
  international_enabled: boolean;
  contactless_enabled: boolean;
  online_enabled: boolean;
  spend_limit_enabled: boolean;
  daily_limit_usdc: number;
  pin_set: boolean;
  pin_hint: string;
  card_products?: { slug?: string; name?: string; type?: string } | null;
};

function CopyValue({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <div className="flex items-center gap-2 rounded-xl border border-surface-200 bg-surface-50 px-3 py-2">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-[0.14em] text-surface-500">{label}</p>
        <p className={cn("truncate text-sm font-semibold text-surface-900", mono && "font-mono tracking-wider")}>
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={() => void copy()}
        aria-label={`Copy ${label}`}
        title={`Copy ${label}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-surface-200 bg-white text-surface-500 transition hover:border-brand-400 hover:text-brand-600"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
  tone = "blue",
  disabled,
}: {
  icon: typeof Snowflake;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  tone?: "blue" | "green" | "yellow" | "cyan" | "purple";
  disabled?: boolean;
}) {
  const toneMap = {
    blue: "bg-sky-100 text-sky-700",
    green: "bg-emerald-100 text-emerald-700",
    yellow: "bg-amber-100 text-amber-700",
    cyan: "bg-cyan-100 text-cyan-700",
    purple: "bg-purple-100 text-purple-700",
  };
  return (
    <div className="flex items-center gap-4 border-b border-surface-200 py-4 last:border-0">
      <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", toneMap[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-surface-900">{title}</p>
        <p className="text-sm text-surface-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition",
          checked ? "bg-brand-500" : "bg-surface-300",
          disabled && "opacity-50",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition",
            checked ? "left-[22px]" : "left-0.5",
          )}
        />
      </button>
    </div>
  );
}

export function MyCards({
  cards: initial,
  funding,
  onOrderAnother,
}: {
  cards: IssuedCardRow[];
  funding?: FundingSetup;
  onOrderAnother?: () => void;
}) {
  const [cards, setCards] = useState(initial);
  const [selectedId, setSelectedId] = useState(initial[0]?.id ?? "");
  const [fundAmount, setFundAmount] = useState("50");
  const [fundNetworkId, setFundNetworkId] = useState<string>(funding?.networks[0]?.id ?? "");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [limitDraft, setLimitDraft] = useState("");
  const [pending, startTransition] = useTransition();
  const [revealed, setRevealed] = useState<{ pan: string; cvv: string; holder: string | null } | null>(null);
  const [revealing, setRevealing] = useState(false);
  const [fundStatus, setFundStatus] = useState<
    "idle" | "sending" | "submitted" | "verifying" | "verified" | "failed"
  >("idle");
  const [fundMessage, setFundMessage] = useState("");
  const [fundTxHash, setFundTxHash] = useState("");
  const [manualTxHash, setManualTxHash] = useState("");
  const [copiedAddr, setCopiedAddr] = useState(false);

  const { address: walletAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const supabase = createClient();

  const selected = useMemo(
    () => cards.find((c) => c.id === selectedId) ?? cards[0] ?? null,
    [cards, selectedId],
  );

  // Keep the limit draft in sync when switching cards
  useEffect(() => {
    if (selected) setLimitDraft(String(selected.daily_limit_usdc ?? ""));
  }, [selected?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fundNetwork =
    funding?.networks.find((n) => n.id === fundNetworkId) ?? funding?.networks[0] ?? null;
  const fundWallet = funding?.wallets.find((w) => w.network_id === fundNetwork?.id) ?? null;
  const fundToken =
    funding?.tokens.find(
      (t) => t.network_id === fundNetwork?.id && t.symbol === "USDC",
    ) ?? null;

  const patchLocal = (id: string, patch: Partial<IssuedCardRow>) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  useRealtime<{
    eventType: "INSERT" | "UPDATE" | "DELETE";
    new?: IssuedCardRow | null;
    old?: IssuedCardRow | null;
  }>("my-cards-live", "*", "issued_cards", (payload) => {
    setCards((prev) => {
      if (payload.eventType === "DELETE") {
        return prev.filter((c) => c.id !== payload.old?.id);
      }
      if (!payload.new) return prev;
      const exists = prev.some((c) => c.id === payload.new?.id);
      if (!exists) return [payload.new, ...prev];
      return prev.map((c) => (c.id === payload.new?.id ? { ...c, ...payload.new } : c));
    });
  });

  // Auto-select the network the connected wallet is on, if supported
  useEffect(() => {
    if (!isConnected || !chainId || !funding?.networks.length) return;
    const match = funding.networks.find((n) => n.chain_id === chainId);
    if (match) setFundNetworkId(match.id);
  }, [isConnected, chainId, funding]);

  if (!cards.length) {
    return (
      <div className="rounded-3xl border border-dashed border-surface-300 bg-white px-6 py-16 text-center">
        <Shield className="mx-auto h-10 w-10 text-surface-400" />
        <p className="mt-4 text-lg font-semibold text-surface-900">No cards issued yet</p>
        <p className="mt-2 text-sm text-surface-500">
          Order a card and complete crypto payment — virtual cards activate instantly after on-chain verification.
        </p>
        <Button className="mt-6 rounded-full" onClick={onOrderAnother}>
          <Plus className="h-4 w-4" />
          Browse cards
        </Button>
      </div>
    );
  }

  if (!selected) return null;

  const finish = (selected.finish as CardFinish) || finishForSlug(selected.card_products?.slug);
  const network = selected.network || networkForSlug(selected.card_products?.slug);
  const expiry = `${String(selected.expiry_month).padStart(2, "0")}/${String(selected.expiry_year).padStart(2, "0")}`;
  const balanceLabel = `$${Number(selected.balance_usdc).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const panShown = revealed?.pan ?? selected.pan_display;
  const cvvShown = revealed?.cvv ?? "•••";
  const holderShown = revealed?.holder ?? selected.holder_name;

  const toggleReveal = async () => {
    if (revealed) {
      setRevealed(null);
      return;
    }
    setRevealing(true);
    const res = await revealCardSecrets(selected.id);
    setRevealing(false);
    if (res.error || !res.data) {
      toast.error(res.error ?? "Could not reveal card details");
      return;
    }
    setRevealed({ pan: res.data.pan, cvv: res.data.cvv, holder: res.data.holder });
    toast.success("Card details visible — hide when done");
  };

  const run = (
    fn: () => Promise<{ error?: string; success?: boolean; balance?: number }>,
    ok?: string,
    revert?: () => void,
  ) => {
    startTransition(async () => {
      const res = await fn();
      if (res.error) {
        if (revert) revert();
        toast.error(res.error);
      } else {
        if (ok) toast.success(ok);
        if (typeof res.balance === "number") patchLocal(selected.id, { balance_usdc: res.balance });
      }
    });
  };

  const copyFundAddress = async () => {
    if (!fundWallet) return;
    try {
      await navigator.clipboard.writeText(fundWallet.address);
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const submitFunding = async (txHash: string, fromAddr: string) => {
    if (!selected || !fundNetwork || !fundToken || !fundWallet) return null;
    const res = await submitCardFundingTx(
      selected.id,
      Number(fundAmount),
      fundNetwork.id,
      fundToken.id,
      fundWallet.id,
      txHash,
      fromAddr,
    );
    if (res.error || !res.fundingId) {
      toast.error(res.error ?? "Could not submit funding");
      setFundStatus("failed");
      setFundMessage(res.error ?? "Could not submit funding");
      return null;
    }
    return res.fundingId;
  };

  const startVerification = async (fundingId: string, tx: string) => {
    if (!selected || !fundNetwork || !fundToken || !fundWallet) return;
    setFundStatus("verifying");
    setFundMessage("Verifying on-chain...");

    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      try {
        const { data, error } = await supabase.functions.invoke("verify-card-funding", {
          body: {
            funding_id: fundingId,
            tx_hash: tx,
            expected_amount: Number(fundAmount).toString(),
            expected_address: fundWallet.address,
            chain_id: fundNetwork.chain_id,
            token_address: fundToken?.contract_address ?? null,
          },
        });

        if (error) {
          setFundMessage("Verification check failed. Retrying...");
          return;
        }

        if (data?.verified) {
          clearInterval(interval);
          setFundStatus("verified");
          setFundMessage("Funding verified on-chain — balance updated!");
          const amt = Number(fundAmount);
          if (Number.isFinite(amt) && amt > 0) {
            setCards((prev) =>
              prev.map((c) =>
                c.id === selected.id ? { ...c, balance_usdc: Number(c.balance_usdc) + amt } : c,
              ),
            );
          }
        } else if (data?.confirmations && data.confirmations > 0) {
          setFundMessage(`Waiting for confirmations (${data.confirmations})`);
        } else {
          setFundMessage("Checking transaction...");
        }
      } catch {
        setFundMessage("Verification check failed. Retrying...");
      }
      if (attempts > 36) {
        clearInterval(interval);
        setFundStatus("failed");
        setFundMessage("Verification timed out — check your transaction on the explorer.");
      }
    }, 5000);
  };

  const handleSendFunding = async () => {
    if (!selected || !fundNetwork || !fundWallet) return;
    const amt = Number(fundAmount);
    if (!Number.isFinite(amt) || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (amt < 5) {
      toast.error("Minimum funding is $5 USDC");
      return;
    }

    // Manual path: user already sent from another wallet and pastes the tx hash
    const manualTx = manualTxHash.trim();
    if (/^0x[a-fA-F0-9]{64}$/.test(manualTx)) {
      setFundTxHash(manualTx);
      setFundStatus("submitted");
      const fundingId = await submitFunding(manualTx, walletAddress ?? "");
      if (!fundingId) return;
      await startVerification(fundingId, manualTx);
      return;
    }

    if (!isConnected) {
      toast.error("Connect a wallet or paste the transaction hash above");
      return;
    }

    if (!walletAddress) return;

    if (chainId !== fundNetwork.chain_id && switchChainAsync) {
      try {
        await switchChainAsync({ chainId: fundNetwork.chain_id });
      } catch {
        setFundStatus("failed");
        setFundMessage("Failed to switch network. Switch manually in your wallet.");
        return;
      }
    }

    setFundStatus("sending");
    setFundMessage("");

    try {
      const tokenDecimals = fundToken?.decimals ?? 6;
      const rawAmount = BigInt(Math.floor(amt * 10 ** tokenDecimals));
      const isErc20 = fundToken?.contract_address && fundToken.contract_address.length > 0;

      const tx = isErc20 && writeContractAsync
        ? await writeContractAsync({
            address: fundToken!.contract_address as `0x${string}`,
            abi: erc20Abi,
            functionName: "transfer",
            args: [fundWallet.address as `0x${string}`, rawAmount],
          })
        : null;

      if (!tx) {
        setFundStatus("failed");
        setFundMessage("Token not supported on this network yet");
        return;
      }

      setFundTxHash(tx);
      setFundStatus("submitted");

      const fundingId = await submitFunding(tx, walletAddress);
      if (!fundingId) return;

      await startVerification(fundingId, tx);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Transaction failed";
      setFundStatus("failed");
      setFundMessage(formatPaymentError(msg).message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">My cards</p>
          <h2 className="mt-1 text-2xl font-bold text-surface-900">Cards & balance</h2>
          <p className="mt-1 text-sm text-surface-500">
            Real debit design · fund with crypto · freeze & security controls
          </p>
        </div>
        <Button variant="outline" className="rounded-full" onClick={onOrderAnother}>
          <Plus className="h-4 w-4" />
          Order another
        </Button>
      </div>

      <div className="rounded-3xl border border-surface-200 bg-white p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
          {cards.map((c) => {
            const cNetwork = c.network || networkForSlug(c.card_products?.slug);
            const isSelected = c.id === selected.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedId(c.id);
                  setRevealed(null);
                  setShowPin(false);
                }}
                aria-pressed={isSelected}
                aria-label={`Select card ${c.label} ending ${c.pan_last4}`}
                className={cn(
                  "flex min-w-0 items-center gap-2.5 rounded-2xl border p-2.5 text-left transition-all sm:flex-initial sm:min-w-[168px]",
                  isSelected
                    ? "border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/25 shadow-sm shadow-brand-500/10"
                    : "border-surface-200 bg-surface-50 hover:border-surface-300 hover:bg-white",
                )}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 text-[10px] font-bold uppercase tracking-wider text-white">
                  {c.card_type === "virtual" ? "V" : "P"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-surface-900">
                    {c.label}
                  </span>
                  <span className="block text-[11px] text-surface-500">
                    {cNetwork} ···· {c.pan_last4}
                  </span>
                </span>
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    c.frozen || c.status === "frozen"
                      ? "bg-sky-500"
                      : c.status === "active"
                        ? "bg-emerald-500"
                        : "bg-amber-400",
                  )}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <TwalletCard
            finish={finish}
            holderName={holderShown}
            panDisplay={panShown}
            expiry={expiry}
            cvv={cvvShown}
            network={network}
            isVirtual={selected.card_type === "virtual"}
            balanceLabel={balanceLabel}
            defaultFlipped={!!revealed}
          />
          <Button
            variant="outline"
            className="w-full rounded-xl"
            disabled={revealing || pending}
            onClick={() => void toggleReveal()}
          >
            {revealing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : revealed ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {revealed ? "Hide full number & CVV" : "Show full number & CVV"}
          </Button>
          {revealed && (
            <div className="space-y-2 rounded-2xl border border-amber-300 bg-amber-50 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-800">
                  Card details
                </p>
                <button
                  type="button"
                  onClick={() => void toggleReveal()}
                  className="text-[11px] font-medium text-surface-500 transition hover:text-surface-900"
                >
                  Hide
                </button>
              </div>
              <CopyValue label="Card number" value={revealed.pan} />
              <div className="grid grid-cols-2 gap-2">
                <CopyValue label="CVV" value={revealed.cvv} />
                <CopyValue label="Expiry" value={expiry} />
              </div>
              {revealed.holder && <CopyValue label="Cardholder" value={revealed.holder} mono={false} />}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-surface-200 bg-white p-4">
              <p className="text-xs text-surface-500">Available balance</p>
              <p className="mt-1 text-xl font-bold text-surface-900">{balanceLabel}</p>
              <p className="mt-0.5 text-[11px] text-surface-500">USDC spendable</p>
            </div>
            <div className="rounded-2xl border border-surface-200 bg-white p-4">
              <p className="text-xs text-surface-500">Status</p>
              <Badge
                className={cn(
                  "mt-2 capitalize",
                  selected.frozen || selected.status === "frozen"
                    ? "bg-sky-100 text-sky-700"
                    : "bg-emerald-100 text-emerald-700",
                )}
              >
                {selected.frozen ? "Frozen" : selected.status.replace("_", " ")}
              </Badge>
              <p className="mt-2 text-[11px] text-surface-500">
                {selected.card_type === "virtual" ? "Instant virtual" : "Physical metal"} · {network}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-3">
          <div className="rounded-3xl border border-surface-200 bg-white p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-surface-900">Card settings & security</h3>
            <p className="mt-1 text-sm text-surface-500">
              Managing: {selected.label} (···{selected.pan_last4})
            </p>

            <div className="mt-2">
              <ToggleRow
                icon={Snowflake}
                title="Freeze card"
                description="Temporarily disable all transactions."
                checked={selected.frozen}
                tone="blue"
                disabled={pending || selected.status === "cancelled"}
                onChange={(v) => {
                  patchLocal(selected.id, { frozen: v, status: v ? "frozen" : "active" });
                  run(
                    () => updateCardControls(selected.id, { frozen: v }),
                    v ? "Card frozen" : "Card unfrozen",
                    () => patchLocal(selected.id, { frozen: !v, status: v ? "active" : "frozen" }),
                  );
                }}
              />
              <ToggleRow
                icon={Globe2}
                title="International payments"
                description="Allow transactions outside your country."
                checked={selected.international_enabled}
                tone="green"
                disabled={pending}
                onChange={(v) => {
                  patchLocal(selected.id, { international_enabled: v });
                  run(
                    () => updateCardControls(selected.id, { international_enabled: v }),
                    "Updated",
                    () => patchLocal(selected.id, { international_enabled: !v }),
                  );
                }}
              />
              <ToggleRow
                icon={Wifi}
                title="Contactless (NFC)"
                description="Enable tap-to-pay functionality."
                checked={selected.contactless_enabled}
                tone="yellow"
                disabled={pending}
                onChange={(v) => {
                  patchLocal(selected.id, { contactless_enabled: v });
                  run(
                    () => updateCardControls(selected.id, { contactless_enabled: v }),
                    "Updated",
                    () => patchLocal(selected.id, { contactless_enabled: !v }),
                  );
                }}
              />
              <ToggleRow
                icon={ArrowUpRight}
                title="Online payments"
                description="Allow e‑commerce and subscriptions."
                checked={selected.online_enabled}
                tone="cyan"
                disabled={pending}
                onChange={(v) => {
                  patchLocal(selected.id, { online_enabled: v });
                  run(
                    () => updateCardControls(selected.id, { online_enabled: v }),
                    "Updated",
                    () => patchLocal(selected.id, { online_enabled: !v }),
                  );
                }}
              />
              <ToggleRow
                icon={Gauge}
                title="Daily spending limit"
                description="Maximum spend per day before transactions are declined."
                checked={selected.spend_limit_enabled}
                tone="purple"
                disabled={pending}
                onChange={(v) => {
                  const prev = selected.spend_limit_enabled;
                  patchLocal(selected.id, { spend_limit_enabled: v });
                  run(
                    () => updateCardLimit(selected.id, { enabled: v }),
                    v ? "Spending limit enabled" : "Spending limit disabled",
                    () => patchLocal(selected.id, { spend_limit_enabled: prev }),
                  );
                }}
              />
            </div>

            {selected.spend_limit_enabled && (
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-surface-200 bg-white p-4 sm:flex-row sm:items-center">
                <div className="relative min-w-0 flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-surface-500">$</span>
                  <input
                    value={limitDraft}
                    onChange={(e) => setLimitDraft(e.target.value.replace(/[^\d.]/g, ""))}
                    inputMode="decimal"
                    aria-label="Daily spending limit amount"
                    className="w-full rounded-xl border border-surface-200 bg-surface-100 py-2.5 pl-7 pr-3 text-sm text-surface-900 outline-none focus:border-brand-400"
                  />
                </div>
                <Button
                  className="shrink-0 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 font-semibold text-white shadow-lg shadow-brand-600/30 hover:brightness-110"
                  disabled={pending}
                  onClick={() => {
                    const amt = Number(limitDraft);
                    if (!Number.isFinite(amt) || amt < 1 || amt > 50000) {
                      toast.error("Limit must be between $1 and $50,000");
                      return;
                    }
                    const prev = selected.daily_limit_usdc;
                    patchLocal(selected.id, { daily_limit_usdc: amt });
                    run(
                      () => updateCardLimit(selected.id, { dailyLimit: amt }),
                      "Daily limit updated",
                      () => {
                        patchLocal(selected.id, { daily_limit_usdc: prev });
                        setLimitDraft(String(prev));
                      },
                    );
                  }}
                >
                  {pending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Save limit
                </Button>
              </div>
            )}

              <div className="mt-4 border-t border-surface-200 pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-surface-900">Card PIN</p>
                    <p className="text-sm text-surface-500">Set or update your 4-digit ATM PIN.</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-surface-200 bg-surface-100 px-3 py-1.5 font-mono text-sm tracking-[0.3em] text-surface-900">
                    {showPin && selected.pin_hint && selected.pin_hint !== "••••"
                      ? selected.pin_hint
                      : "••••"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPin((v) => !v)}
                    aria-label={showPin ? "Hide PIN" : "Show PIN"}
                    title={showPin ? "Hide PIN" : "Show PIN"}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-surface-200 bg-white text-surface-500 transition hover:border-brand-400 hover:text-brand-600"
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="New 4-digit PIN"
                    inputMode="numeric"
                    maxLength={4}
                    aria-label="New card PIN"
                    className="w-full rounded-xl border border-surface-200 bg-surface-100 px-3 py-2.5 text-center font-mono text-sm tracking-[0.3em] text-surface-900 outline-none focus:border-brand-400 sm:max-w-[180px]"
                  />
                  <Button
                    className="shrink-0 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 font-semibold text-white shadow-lg shadow-brand-600/30 hover:brightness-110"
                    disabled={pending}
                    onClick={() => {
                      if (!/^\d{4}$/.test(pin)) {
                        toast.error("Enter a 4-digit PIN first");
                        return;
                      }
                      run(async () => {
                        const r = await updateCardPin(selected.id, pin);
                        if (!r.error) {
                          patchLocal(selected.id, { pin_hint: pin, pin_set: true });
                          setPin("");
                          setShowPin(true);
                        }
                        return r;
                      }, "PIN updated");
                    }}
                  >
                    {pending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <KeyRound className="h-4 w-4" />
                    )}
                    Update PIN
                  </Button>
                </div>
                <p className="mt-2 text-[11px] text-surface-400">
                  {pin.length === 4
                    ? "Ready — tap Update PIN to save."
                    : "Enter a new 4-digit PIN, then tap Update PIN."}
                </p>
              </div>
          </div>

          <div className="rounded-3xl border border-surface-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-surface-900">Fund with crypto</h3>
                <p className="text-sm text-surface-500">
                  Send USDC on-chain — verified in real time, balance updates instantly.
                </p>
              </div>
            </div>

            {!fundNetwork || !fundWallet ? (
              <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
                No receiving wallet configured for funding yet. Contact support.
              </div>
            ) : (
              <>
                <div className="mt-4">
                  <p className="mb-2 text-xs text-surface-500">Network</p>
                  <div className="flex flex-wrap gap-2">
                    {funding?.networks.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => setFundNetworkId(n.id)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                          n.id === fundNetwork.id
                            ? "border-brand-500 bg-brand-50 text-brand-700"
                            : "border-surface-200 bg-white text-surface-500 hover:text-surface-900",
                        )}
                      >
                        {n.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row">
                  <div className="w-full shrink-0 rounded-xl border border-surface-200 bg-white p-2 sm:w-auto">
                    <AddressQR value={fundWallet.address} size={96} label="" />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-surface-200 bg-white px-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-surface-500">
                        Receive on {fundNetwork.name} · {fundToken?.symbol ?? "USDC"}
                      </p>
                      <p className="truncate font-mono text-sm text-surface-900">{fundWallet.address}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void copyFundAddress()}
                      aria-label="Copy receiving address"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-surface-200 bg-white text-surface-500 transition hover:border-brand-400 hover:text-brand-600"
                    >
                      {copiedAddr ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm">
                  <p className="font-semibold text-blue-900">How to fund — 3 steps</p>
                  <ol className="mt-2 space-y-1.5 text-xs leading-relaxed text-surface-600">
                    <li>
                      <span className="text-brand-600">1.</span> Send{" "}
                      <strong className="text-surface-900">{fundToken?.symbol ?? "USDC"}</strong> on{" "}
                      <strong className="text-surface-900">{fundNetwork.name}</strong> (network ID{" "}
                      {fundNetwork.chain_id}) to the address above — scan the QR or copy it.
                    </li>
                    <li>
                      <span className="text-brand-600">2.</span> Minimum top-up is{" "}
                      <strong className="text-surface-900">$5 USDC</strong>. Your balance is verified
                      on-chain in real time after confirmation.
                    </li>
                    <li>
                      <span className="text-brand-600">3.</span> Sending from another wallet?
                      Paste the transaction hash below and we verify it instantly — no wallet
                      connection needed.
                    </li>
                  </ol>
                </div>

                {!isConnected && (
                  <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-surface-200 bg-white p-4 text-center">
                    <p className="text-sm font-medium text-surface-900">Connect your wallet to fund instantly</p>
                    <p className="text-xs text-surface-500">
                      Or send from any wallet to the address above, then paste the tx hash below.
                    </p>
                    <Button
                      className="mt-1 rounded-full"
                      onClick={() => openConnectDialog()}
                    >
                      <Wallet className="h-4 w-4" />
                      Connect Wallet
                    </Button>
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-surface-500">$</span>
                    <input
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value.replace(/[^\d.]/g, ""))}
                      className="w-full rounded-xl border border-surface-200 bg-surface-100 py-3 pl-7 pr-16 text-surface-900 outline-none focus:border-brand-400"
                      placeholder="50.00"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-surface-500">
                      {fundToken?.symbol ?? "USDC"}
                    </span>
                  </div>
                  <Button
                    className="rounded-xl"
                    disabled={fundStatus === "sending" || fundStatus === "verifying" || pending}
                    onClick={() => void handleSendFunding()}
                  >
                    {fundStatus === "sending" || fundStatus === "verifying" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {isConnected && !manualTxHash.trim()
                      ? "Send & fund card"
                      : "I've sent — verify"}
                  </Button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {["5", "25", "50", "100", "250"].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setFundAmount(q)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs transition",
                        fundAmount === q
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-surface-200 text-surface-500 hover:border-brand-400 hover:text-brand-700",
                      )}
                    >
                      ${q}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-[11px] text-surface-400">
                  Minimum $5 USDC per top-up · balance credited after on-chain verification.
                </p>

                <div className="mt-3">
                  <label htmlFor="manual-tx-hash" className="text-xs text-surface-500">
                    Sent from another wallet? Paste the transaction hash to verify instantly:
                  </label>
                  <input
                    id="manual-tx-hash"
                    value={manualTxHash}
                    onChange={(e) => setManualTxHash(e.target.value.trim())}
                    placeholder="0x… transaction hash"
                    className="mt-1.5 w-full rounded-xl border border-surface-200 bg-surface-100 px-3 py-2.5 font-mono text-xs text-surface-900 outline-none focus:border-brand-400"
                  />
                </div>

                {fundStatus !== "idle" && (
                  <div
                    role="status"
                    className={cn(
                      "mt-4 flex items-start gap-2 rounded-xl border p-3 text-sm",
                      fundStatus === "verified" && "border-emerald-300 bg-emerald-50 text-emerald-700",
                      fundStatus === "failed" && "border-red-300 bg-red-50 text-red-700",
                      (fundStatus === "sending" || fundStatus === "submitted" || fundStatus === "verifying") &&
                        "border-amber-300 bg-amber-50 text-amber-700",
                    )}
                  >
                    {fundStatus === "verified" ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    ) : fundStatus === "failed" ? (
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    ) : (
                      <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin" />
                    )}
                    <div className="min-w-0">
                      <p>{fundMessage || "Working..."}</p>
                      {fundTxHash && (
                        <a
                          href={`${fundNetwork.explorer_url ?? ""}/tx/${fundTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 break-all font-mono text-[11px] text-brand-600 underline-offset-2 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {fundTxHash.slice(0, 18)}...
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <Trash2 className="mt-0.5 h-5 w-5 text-red-500" />
              <div>
                <p className="font-semibold text-red-700">Cancel card</p>
                <p className="text-sm text-surface-500">Permanently deactivate this card.</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="rounded-full bg-red-500 text-white hover:bg-red-600"
              disabled={pending}
              onClick={() => {
                if (!confirm("Cancel this card permanently?")) return;
                run(async () => {
                  const r = await cancelCard(selected.id);
                  if (!r.error) {
                    setCards((prev) => prev.filter((c) => c.id !== selected.id));
                    setSelectedId("");
                  }
                  return r;
                }, "Card cancelled");
              }}
            >
              Unapply
            </Button>
          </div>

          <p className="text-center text-xs text-surface-400">
            Need a new product?{" "}
            <button
              type="button"
              onClick={onOrderAnother}
              className="font-medium text-brand-600 transition hover:text-brand-700 hover:underline"
            >
              Order from catalog
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
