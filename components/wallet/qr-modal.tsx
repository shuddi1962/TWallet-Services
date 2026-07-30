"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, ExternalLink, Loader2 } from "lucide-react";
import { AddressQR } from "@/components/ui/address-qr";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { toast } from "sonner";

interface Props {
  open: boolean;
  uri: string | null;
  onClose: () => void;
  onCopy?: () => void;
  onOpen?: () => void;
}

export function QRModal({ open, uri, onClose, onCopy, onOpen }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setCopied(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleCopy = async () => {
    if (onCopy) {
      onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      return;
    }
    if (!uri) {
      toast.error("Link not ready yet");
      return;
    }
    const ok = await copyToClipboard(uri);
    if (ok) {
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 1500);
    } else {
      toast.error("Could not copy");
    }
  };

  const handleOpen = () => {
    if (onOpen) {
      onOpen();
      return;
    }
    if (!uri) {
      toast.error("Link not ready yet");
      return;
    }
    const encoded = encodeURIComponent(uri);
    window.open(
      `https://link.trustwallet.com/wc?uri=${encoded}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-lg"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#0b1220] p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Scan with wallet app"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">Scan this QR Code with your phone</h2>
                <p className="mt-1 text-sm text-surface-400">
                  Open Trust Wallet (or any WalletConnect wallet) and scan
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-surface-400 hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-center">
              {uri ? (
                <AddressQR value={uri} size={260} label="WalletConnect" />
              ) : (
                <div className="flex h-[284px] w-[284px] flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02]">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
                  <p className="text-xs text-surface-400">Generating QR…</p>
                </div>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => void handleCopy()}
                disabled={!uri}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-surface-200 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy link
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleOpen}
                disabled={!uri}
                className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ExternalLink className="h-4 w-4" />
                Open
              </button>
            </div>

            {uri && (
              <p className="mt-4 break-all rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 font-mono text-[10px] leading-relaxed text-surface-500">
                {uri.slice(0, 72)}…
              </p>
            )}

            <p className="mt-3 text-center text-[11px] leading-relaxed text-surface-500">
              Copy the link and paste it in your wallet, or tap Open for Trust Wallet.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
