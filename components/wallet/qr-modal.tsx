"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Loader2, ExternalLink } from "lucide-react";
import QRCode from "qrcode";

interface Props {
  open: boolean;
  uri: string | null;
  onClose: () => void;
}

export function QRModal({ open, uri, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [qrError, setQrError] = useState(false);

  useEffect(() => {
    if (!open || !uri || !canvasRef.current) return;

    setQrError(false);

    QRCode.toCanvas(canvasRef.current, uri, {
      width: 360,
      margin: 2,
      color: {
        dark: "#ffffff",
        light: "#00000000",
      },
    }).catch(() => {
      setQrError(true);
    });
  }, [open, uri]);

  useEffect(() => {
    if (!open) return;
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

  const copyUri = async () => {
    if (!uri) return;
    await navigator.clipboard.writeText(uri);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
                <h2 className="text-lg font-semibold text-white">Scan with phone</h2>
                <p className="mt-1 text-sm text-surface-400">
                  Open your wallet app and scan the QR code
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
              {!uri ? (
                <div className="flex h-[360px] w-[360px] items-center justify-center rounded-2xl border border-white/10">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
                </div>
              ) : qrError ? (
                <div className="flex h-[360px] w-[360px] flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 px-8 text-center">
                  <p className="text-sm text-red-400">Failed to render QR code</p>
                  <button
                    type="button"
                    onClick={copyUri}
                    className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs text-surface-200 hover:bg-white/20"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy link instead
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl bg-white p-4 shadow-lg">
                  <canvas ref={canvasRef} className="block h-[328px] w-[328px]" />
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={copyUri}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-surface-300 transition hover:bg-white/5 hover:text-white"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy URI
                  </>
                )}
              </button>
              {uri && (
                <a
                  href={`https://walletconnect.com/wc?uri=${encodeURIComponent(uri)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-surface-300 transition hover:bg-white/5 hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open WalletConnect
                </a>
              )}
            </div>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-surface-500">
              You can also paste the URI into any WalletConnect-compatible wallet.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
