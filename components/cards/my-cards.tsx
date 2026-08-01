"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
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
} from "lucide-react";
import { TwalletCard, finishForSlug, networkForSlug } from "@/components/cards/twallet-card";
import type { CardFinish } from "@/lib/cards";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  updateCardControls,
  updateCardPin,
  fundCard,
  cancelCard,
  revealCardSecrets,
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
  pin_hint: string;
  card_products?: { slug?: string; name?: string; type?: string } | null;
};

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
  tone?: "blue" | "green" | "yellow" | "cyan";
  disabled?: boolean;
}) {
  const toneMap = {
    blue: "bg-sky-500/15 text-sky-300",
    green: "bg-emerald-500/15 text-emerald-300",
    yellow: "bg-amber-500/15 text-amber-300",
    cyan: "bg-cyan-500/15 text-cyan-300",
  };
  return (
    <div className="flex items-center gap-4 border-b border-white/[0.06] py-4 last:border-0">
      <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", toneMap[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-white">{title}</p>
        <p className="text-sm text-surface-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition",
          checked ? "bg-brand-500" : "bg-surface-700",
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
  onOrderAnother,
}: {
  cards: IssuedCardRow[];
  onOrderAnother?: () => void;
}) {
  const [cards, setCards] = useState(initial);
  const [selectedId, setSelectedId] = useState(initial[0]?.id ?? "");
  const [fundAmount, setFundAmount] = useState("50");
  const [pin, setPin] = useState("");
  const [pending, startTransition] = useTransition();
  const [revealed, setRevealed] = useState<{ pan: string; cvv: string } | null>(null);
  const [revealing, setRevealing] = useState(false);

  const selected = useMemo(
    () => cards.find((c) => c.id === selectedId) ?? cards[0] ?? null,
    [cards, selectedId],
  );

  const patchLocal = (id: string, patch: Partial<IssuedCardRow>) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  if (!cards.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-surface-900/40 px-6 py-16 text-center">
        <Shield className="mx-auto h-10 w-10 text-surface-500" />
        <p className="mt-4 text-lg font-semibold text-white">No cards issued yet</p>
        <p className="mt-2 text-sm text-surface-400">
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
    setRevealed({ pan: res.data.pan, cvv: res.data.cvv });
    toast.success("Card details visible — hide when done");
  };

  const run = (fn: () => Promise<{ error?: string; success?: boolean; balance?: number }>, ok?: string) => {
    startTransition(async () => {
      const res = await fn();
      if (res.error) toast.error(res.error);
      else {
        if (ok) toast.success(ok);
        if (typeof res.balance === "number") patchLocal(selected.id, { balance_usdc: res.balance });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">My cards</p>
          <h2 className="mt-1 text-2xl font-bold text-white">Cards & balance</h2>
          <p className="mt-1 text-sm text-surface-400">
            Real debit design · fund with crypto · freeze & security controls
          </p>
        </div>
        <Button variant="outline" className="rounded-full" onClick={onOrderAnother}>
          <Plus className="h-4 w-4" />
          Order another
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {cards.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setSelectedId(c.id);
              setRevealed(null);
            }}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition",
              c.id === selected.id
                ? "border-brand-500/40 bg-brand-500/15 text-brand-200"
                : "border-white/10 bg-white/[0.03] text-surface-400 hover:text-white",
            )}
          >
            {c.label} ···{c.pan_last4}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="space-y-4 xl:col-span-2">
          <TwalletCard
            finish={finish}
            holderName={selected.holder_name}
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
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 font-mono text-sm text-amber-100">
              <p>
                <span className="text-surface-400">Number:</span> {revealed.pan}
              </p>
              <p className="mt-1">
                <span className="text-surface-400">CVV:</span> {revealed.cvv}
              </p>
              <p className="mt-1">
                <span className="text-surface-400">Expiry:</span> {expiry}
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-surface-500">Available balance</p>
              <p className="mt-1 text-xl font-bold text-white">{balanceLabel}</p>
              <p className="mt-0.5 text-[11px] text-surface-500">USDC spendable</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-surface-500">Status</p>
              <Badge
                className={cn(
                  "mt-2 capitalize",
                  selected.frozen || selected.status === "frozen"
                    ? "bg-sky-500/15 text-sky-300"
                    : "bg-emerald-500/15 text-emerald-300",
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

        <div className="space-y-4 xl:col-span-3">
          <div className="rounded-3xl border border-white/[0.07] bg-[#0b1220]/90 p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-white">Card settings & security</h3>
            <p className="mt-1 text-sm text-surface-400">
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
                  run(() => updateCardControls(selected.id, { international_enabled: v }), "Updated");
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
                  run(() => updateCardControls(selected.id, { contactless_enabled: v }), "Updated");
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
                  run(() => updateCardControls(selected.id, { online_enabled: v }), "Updated");
                }}
              />
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                <KeyRound className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white">Card PIN: {selected.pin_hint || "••••"}</p>
                <p className="text-sm text-surface-400">Update your 4-digit ATM card PIN.</p>
              </div>
              <div className="flex gap-2">
                <input
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="••••"
                  inputMode="numeric"
                  className="w-24 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-center font-mono text-white outline-none focus:border-brand-500/40"
                />
                <Button
                  variant="outline"
                  className="rounded-full"
                  disabled={pending || pin.length !== 4}
                  onClick={() =>
                    run(async () => {
                      const r = await updateCardPin(selected.id, pin);
                      if (!r.error) setPin("");
                      return r;
                    }, "PIN updated")
                  }
                >
                  Update PIN
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/[0.07] bg-[#0b1220]/90 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Fund with crypto</h3>
                <p className="text-sm text-surface-400">Top up USDC balance for spend & ATM.</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-surface-500">$</span>
                <input
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value.replace(/[^\d.]/g, ""))}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-7 pr-16 text-white outline-none focus:border-brand-500/40"
                  placeholder="50.00"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-surface-500">USDC</span>
              </div>
              <Button
                className="rounded-xl"
                disabled={pending}
                onClick={() => {
                  const amt = Number(fundAmount);
                  run(() => fundCard(selected.id, amt), `Funded $${amt.toFixed(2)} USDC`);
                }}
              >
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Add funds
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["25", "50", "100", "250"].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setFundAmount(q)}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-surface-400 hover:border-brand-500/30 hover:text-white"
                >
                  ${q}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-red-500/15 bg-red-500/5 p-5">
            <div className="flex items-start gap-3">
              <Trash2 className="mt-0.5 h-5 w-5 text-red-400" />
              <div>
                <p className="font-semibold text-red-300">Cancel card</p>
                <p className="text-sm text-surface-400">Permanently deactivate this card.</p>
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

          <p className="text-center text-xs text-surface-500">
            Need a new product?{" "}
            <button
              type="button"
              onClick={onOrderAnother}
              className="font-medium text-brand-400 transition hover:text-brand-300 hover:underline"
            >
              Order from catalog
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
