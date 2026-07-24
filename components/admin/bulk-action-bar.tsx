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
    <div className="flex items-center gap-3 rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 mb-4" role="status" aria-live="polite">
      <span className="text-sm font-medium text-surface-200">{selectedCount} selected</span>
      <div className="flex gap-2 ml-auto">
        {actions.map((a) => (
          <button
            key={a.action}
            onClick={() => onAction(a.action)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              a.variant === "destructive"
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "bg-surface-800 text-surface-300 hover:bg-surface-700"
            }`}
          >
            {a.label}
          </button>
        ))}
        <button onClick={onClear} className="rounded-lg p-1.5 text-surface-500 hover:text-surface-300" aria-label="Clear selection">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
