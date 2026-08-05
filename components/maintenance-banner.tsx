"use client";

import { Wrench } from "lucide-react";
import { useSystemSettings } from "@/lib/hooks/use-system-settings";

export function MaintenanceBanner() {
  const settings = useSystemSettings();
  const on = Boolean(settings.general?.maintenance_mode);
  if (!on) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-[100] flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-center text-xs font-semibold text-amber-950"
    >
      <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
      We&apos;re performing scheduled maintenance — some features may be temporarily unavailable.
    </div>
  );
}
