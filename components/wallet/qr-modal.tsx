"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useWalletConnectionState } from "@/lib/hooks/wallet-connection-context";
import QRCode from "qrcode";

export function WalletQRModal() {
  const { uri, connecting, setUri, setConnecting } = useWalletConnectionState();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!uri || !canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, uri, {
      width: 280,
      margin: 2,
      color: { dark: "#ffffff", light: "#00000000" },
    });
  }, [uri]);

  if (!uri || !connecting) return null;

  const handleClose = () => {
    setUri(null);
    setConnecting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl border border-surface-700 bg-surface-900 p-6 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-surface-400 transition-colors hover:text-surface-50"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-semibold text-white">Scan with your wallet</h3>
          <p className="text-center text-sm text-surface-400">
            Open your wallet app and scan the QR code to connect
          </p>

          <div className="flex items-center justify-center rounded-xl bg-white p-4">
            <canvas ref={canvasRef} className="h-[280px] w-[280px]" />
          </div>

          <p className="break-all text-center text-xs text-surface-500">{uri}</p>
        </div>
      </div>
    </div>
  );
}
