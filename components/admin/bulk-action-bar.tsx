"use client";

import { X } from "lucide-react";

interface BulkAction {
  label: string;
  action: string;
  variant?: "default" | "destructive";
}

interface BulkActionBarProps {
  selectedCount: number;
  actions: BulkAction[];
  onAction: (action: string) => void;
  onClear: () => void;
}

export function BulkActionBar({ selectedCount, actions, onAction, onClear }: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 mb-4" role="status" aria-live="polite">
      <span className="text-sm font-medium text-slate-700">{selectedCount} selected</span>
      <div className="flex gap-2 ml-auto">
        {actions.map((a) => (
          <button
            key={a.action}
            onClick={() => onAction(a.action)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              a.variant === "destructive"
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "bg-neutral-900 text-white hover:bg-neutral-800"
            }`}
          >
            {a.label}
          </button>
        ))}
        <button onClick={onClear} className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600" aria-label="Clear selection">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
