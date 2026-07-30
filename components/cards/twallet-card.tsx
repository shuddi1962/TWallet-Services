"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { CardFinish } from "@/lib/cards";

export type CardFaceProps = {
  finish?: CardFinish;
  holderName?: string;
  panDisplay?: string;
  expiry?: string;
  cvv?: string;
  network?: "visa" | "mastercard";
  isVirtual?: boolean;
  balanceLabel?: string;
  className?: string;
  interactive?: boolean;
  defaultFlipped?: boolean;
};

const FINISH: Record<
  CardFinish,
  { front: string; back: string; accent: string; chip: string; label: string }
> = {
  sapphire: {
    front: "linear-gradient(145deg,#0b1f4d 0%,#1d4ed8 42%,#2563eb 68%,#0ea5e9 100%)",
    back: "linear-gradient(145deg,#0a1740 0%,#1e3a8a 100%)",
    accent: "#93c5fd",
    chip: "linear-gradient(135deg,#fde68a,#d97706)",
    label: "SAPPHIRE",
  },
  obsidian: {
    front: "linear-gradient(145deg,#0a0a0a 0%,#171717 40%,#262626 70%,#0f0f0f 100%)",
    back: "linear-gradient(145deg,#050505 0%,#1a1a1a 100%)",
    accent: "#d4d4d8",
    chip: "linear-gradient(135deg,#e5e5e5,#737373)",
    label: "BLACK",
  },
  cyber: {
    front: "linear-gradient(145deg,#0f0724 0%,#4c1d95 40%,#7c3aed 70%,#06b6d4 100%)",
    back: "linear-gradient(145deg,#0c061c 0%,#3b0764 100%)",
    accent: "#c4b5fd",
    chip: "linear-gradient(135deg,#a5f3fc,#0891b2)",
    label: "PREMIUM",
  },
  gold: {
    front: "linear-gradient(145deg,#1c1404 0%,#78350f 35%,#b45309 65%,#fbbf24 100%)",
    back: "linear-gradient(145deg,#1a1205 0%,#78350f 100%)",
    accent: "#fde68a",
    chip: "linear-gradient(135deg,#fef3c7,#b45309)",
    label: "GOLD",
  },
  holographic: {
    front: "linear-gradient(145deg,#0c0a1a 0%,#831843 35%,#6d28d9 65%,#0891b2 100%)",
    back: "linear-gradient(145deg,#0a0816 0%,#4a044e 100%)",
    accent: "#f9a8d4",
    chip: "linear-gradient(135deg,#fbcfe8,#a855f7,#22d3ee)",
    label: "HOLO",
  },
};

function TrustMark({ color = "#fff" }: { color?: string }) {
  return (
    <div className="flex items-center gap-2">
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden>
        <path
          d="M16 3L5 7.5v8.2c0 7.1 4.6 11.8 11 13.3 6.4-1.5 11-6.2 11-13.3V7.5L16 3z"
          fill={color}
          opacity="0.95"
        />
        <path
          d="M11.2 16.1l3 3 6.6-6.6"
          stroke="#0b1220"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[13px] font-bold tracking-[0.18em]" style={{ color }}>
        TRUST
      </span>
    </div>
  );
}

function VisaLogo() {
  return (
    <span className="text-[18px] font-black italic tracking-tight text-white drop-shadow-sm">
      VISA
    </span>
  );
}

function MastercardLogo() {
  return (
    <div className="flex items-center" aria-label="Mastercard">
      <span className="h-7 w-7 rounded-full bg-[#eb001b] opacity-95" />
      <span className="-ml-3 h-7 w-7 rounded-full bg-[#f79e1b] opacity-90" />
    </div>
  );
}

function ContactlessIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="opacity-80" aria-hidden>
      <path d="M8 8c2.2 2.2 2.2 5.8 0 8" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M11 5.5c3.6 3.6 3.6 9.4 0 13" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14 3c5 5 5 13 0 18" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Chip({ gradient }: { gradient: string }) {
  return (
    <div
      className="relative h-10 w-[48px] overflow-hidden rounded-[6px] shadow-md"
      style={{ background: gradient }}
    >
      <div className="absolute inset-[3px] rounded-[3px] border border-black/15" />
      <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-black/20" />
      <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-black/20" />
      <div className="absolute left-[30%] top-[20%] h-[60%] w-[40%] rounded-sm border border-black/15" />
    </div>
  );
}

export function TwalletCard({
  finish = "sapphire",
  holderName = "CARDHOLDER",
  panDisplay = "•••• •••• •••• 4281",
  expiry = "08/29",
  cvv = "•••",
  network = "visa",
  isVirtual = true,
  balanceLabel,
  className,
  interactive = true,
  defaultFlipped = false,
}: CardFaceProps) {
  const [flipped, setFlipped] = useState(defaultFlipped);
  const theme = FINISH[finish] ?? FINISH.sapphire;

  return (
    <div className={cn("w-full max-w-[380px]", className)} style={{ perspective: "1400px" }}>
      <button
        type="button"
        disabled={!interactive}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (interactive) setFlipped((f) => !f);
        }}
        className={cn(
          "relative block w-full touch-manipulation text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          interactive ? "cursor-pointer" : "cursor-default",
        )}
        style={{ aspectRatio: "1.586 / 1" }}
        aria-pressed={flipped}
        aria-label={flipped ? "Show card front" : "Show card back"}
      >
        <div
          className="relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.4,0.2,0.2,1)] will-change-transform"
          style={{
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* FRONT */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/15"
            style={{
              background: theme.front,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
            }}
          >
            <div className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 left-8 h-40 w-40 rounded-full bg-black/20 blur-2xl" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(115deg,transparent_40%,white_50%,transparent_60%)]" />

            <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <TrustMark />
                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                    {isVirtual ? "Virtual Debit" : "Physical Debit"}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium tracking-wider text-white/50">
                    {theme.label} · CRYPTO
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Chip gradient={theme.chip} />
                <ContactlessIcon />
                {balanceLabel && (
                  <div className="ml-auto rounded-full bg-black/20 px-3 py-1 text-right backdrop-blur-sm">
                    <p className="text-[9px] uppercase tracking-wider text-white/55">Balance</p>
                    <p className="text-sm font-bold text-white">{balanceLabel}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="font-mono text-[17px] font-medium tracking-[0.18em] text-white sm:text-[19px]">
                  {panDisplay}
                </p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.16em] text-white/45">Cardholder</p>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-white/90">
                      {holderName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.16em] text-white/45">Valid thru</p>
                    <p className="mt-0.5 text-xs font-semibold text-white/90">{expiry}</p>
                  </div>
                  {network === "visa" ? <VisaLogo /> : <MastercardLogo />}
                </div>
              </div>
            </div>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/15"
            style={{
              background: theme.back,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              WebkitTransform: "rotateY(180deg)",
            }}
          >
            <div className="mt-6 h-11 w-full bg-black/85" />
            <div className="mt-5 px-5">
              <div className="flex items-center gap-2">
                <div className="h-9 flex-1 rounded-sm bg-[repeating-linear-gradient(0deg,#e5e5e5_0px,#e5e5e5_2px,#f5f5f5_2px,#f5f5f5_4px)]" />
                <div className="flex h-9 min-w-[64px] items-center justify-center rounded-sm bg-white px-3">
                  <span className="font-mono text-sm font-bold tracking-widest text-surface-900">
                    {cvv || "•••"}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-right text-[10px] uppercase tracking-wider text-white/50">CVV</p>
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div>
                <TrustMark color="rgba(255,255,255,0.85)" />
                <p className="mt-2 max-w-[220px] text-[10px] leading-relaxed text-white/45">
                  Crypto-funded debit. Non-custodial wallet payments. Authorized use only.
                </p>
              </div>
              {network === "visa" ? <VisaLogo /> : <MastercardLogo />}
            </div>
          </div>
        </div>
      </button>
      {interactive && (
        <p className="mt-2 text-center text-[11px] text-surface-500">
          {flipped ? "Tap to show front" : "Tap card to flip"}
        </p>
      )}
    </div>
  );
}

export function finishForSlug(slug?: string | null): CardFinish {
  switch (slug) {
    case "virtual-premium":
      return "cyber";
    case "physical-premium":
      return "gold";
    case "physical-black":
      return "obsidian";
    case "virtual-standard":
    case "physical-standard":
    default:
      return "sapphire";
  }
}

export function networkForSlug(slug?: string | null): "visa" | "mastercard" {
  if (slug === "physical-black" || slug === "virtual-premium") return "mastercard";
  return "visa";
}
