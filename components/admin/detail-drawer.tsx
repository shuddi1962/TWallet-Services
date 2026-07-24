"use client";

import { type ReactNode } from "react";
import { X } from "lucide-react";

interface DetailSection {
  title: string;
  content: ReactNode;
}

interface DetailDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  sections: DetailSection[];
}

export function DetailDrawer({ open, onClose, title, sections }: DetailDrawerProps) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-lg border-l border-surface-800 bg-surface-950 shadow-xl overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-800 bg-surface-950 px-6 py-4">
          <h2 className="text-lg font-semibold text-surface-50">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-surface-400 hover:text-surface-200" aria-label="Close drawer">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-4 space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-medium text-surface-400 uppercase tracking-wider mb-2">{section.title}</h3>
              <div className="text-surface-200 text-sm">{section.content}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
