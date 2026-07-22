"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface TabsProps {
  tabs: { label: string; value: string }[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onValueChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg bg-surface-100 p-1",
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onValueChange(tab.value)}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
            value === tab.value
              ? "bg-white text-surface-900 shadow-sm"
              : "text-surface-500 hover:text-surface-900",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
