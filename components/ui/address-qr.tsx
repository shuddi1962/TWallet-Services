"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  value: string;
  size?: number;
  className?: string;
  label?: string;
};

export function AddressQR({ value, size = 200, className, label }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!value) {
      setDataUrl(null);
      return;
    }

    let cancelled = false;
    setDataUrl(null);
    setError(false);

    void QRCode.toDataURL(value, {
      width: size * 2,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#0b1220", light: "#ffffff" },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (!value) return null;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-white p-3 shadow-lg ring-1 ring-black/5"
        style={{ width: size + 24, height: size + 24 }}
      >
        {!dataUrl && !error && (
          <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
        )}
        {error && (
          <p className="px-4 text-center text-xs text-red-500">Could not generate QR</p>
        )}
        {dataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt={label ?? "QR code"}
            width={size}
            height={size}
            className="block h-auto w-full"
            draggable={false}
          />
        )}
      </div>
      {label && <p className="text-center text-[11px] text-surface-500">{label}</p>}
    </div>
  );
}
