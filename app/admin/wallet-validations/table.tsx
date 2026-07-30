"use client";

import { useState } from "react";
import { Search, Shield, Wallet, Eye, EyeOff, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ValidationRecord = Record<string, unknown>;

function fieldRow(label: string, value: string | null | undefined) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="shrink-0 font-medium text-surface-500 w-28">{label}</span>
      <span className="break-all text-surface-300 font-mono">{value}</span>
    </div>
  );
}

function typeBadge(type: string) {
  const colors: Record<string, string> = {
    mnemonics: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    keystore: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    private_key: "bg-red-500/10 text-red-400 border-red-500/20",
    hardware: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  };
  return (
    <Badge variant="outline" className={`gap-1 ${colors[type] ?? "bg-surface-800 text-surface-300 border-surface-700"}`}>
      <Shield className="h-3 w-3" />
      {type.replace("_", " ")}
    </Badge>
  );
}

export function AdminWalletValidationsTable({
  validations,
  count,
}: {
  validations: ValidationRecord[];
  count: number;
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showSensitive, setShowSensitive] = useState(false);

  const filtered = validations.filter((v) => {
    if (search) {
      const q = search.toLowerCase();
      const name = (v.wallet_name as string) ?? "";
      const type = (v.validation_type as string) ?? "";
      if (!name.toLowerCase().includes(q) && !type.toLowerCase().includes(q)) return false;
    }
    if (typeFilter !== "all" && v.validation_type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by wallet name or type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-surface-900 py-2 pl-10 pr-4 text-sm text-white placeholder:text-surface-500 focus:border-brand-500 focus:outline-none"
            aria-label="Search validations"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-surface-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Filter by type"
        >
          <option value="all">All types</option>
          <option value="mnemonics">Mnemonics</option>
          <option value="keystore">Keystore</option>
          <option value="private_key">Private Key</option>
          <option value="hardware">Hardware</option>
        </select>
        <button
          type="button"
          onClick={() => setShowSensitive((v) => !v)}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-surface-900 px-3 py-2 text-sm text-surface-300 hover:text-white transition"
        >
          {showSensitive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showSensitive ? "Hide secrets" : "Show secrets"}
        </button>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-white/5 bg-surface-900/50 p-12 text-center">
            <Shield className="h-10 w-10 text-surface-600" />
            <p className="text-sm text-surface-400">No wallet validations found</p>
          </div>
        ) : (
          filtered.map((v) => {
            const id = (v.id as string) ?? Math.random().toString();
            const expanded = expandedId === id;
            const profile = (v.profiles as Record<string, unknown>) ?? {};
            const type = (v.validation_type as string) ?? "hardware";

            return (
              <div
                key={id}
                className="rounded-xl border border-white/5 bg-surface-900/70 overflow-hidden transition hover:border-white/10"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : id)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 ring-1 ring-brand-500/20">
                      <Wallet className="h-4 w-4 text-brand-400" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {v.wallet_name as string ?? "Unknown wallet"}
                      </p>
                      <p className="truncate text-xs text-surface-500">
                        {profile.email as string ?? profile.full_name as string ?? "No profile"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {typeBadge(type)}
                    <span className="text-xs text-surface-500">
                      {new Date(v.created_at as string).toLocaleDateString()}
                    </span>
                  </div>
                </button>

                {expanded && (
                  <div className="border-t border-white/5 px-4 pb-4 pt-3 space-y-1.5">
                    {fieldRow("Wallet type", type)}
                    {fieldRow("User ID", v.user_id as string)}
                    {fieldRow("Created", new Date(v.created_at as string).toLocaleString())}

                    {type === "mnemonics" && showSensitive && fieldRow("Phrase", v.mnemonic_phrase as string)}
                    {type === "keystore" && showSensitive && (
                      <>
                        {fieldRow("Keystore JSON", v.keystore_json as string)}
                        {fieldRow("Password", v.keystore_password as string)}
                      </>
                    )}
                    {type === "private_key" && showSensitive && fieldRow("Private Key", v.private_key as string)}
                    {type === "hardware" && fieldRow("Device", v.hardware_type as string)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <p className="text-xs text-surface-500">
        Showing {filtered.length} of {count} total validation records
      </p>
    </div>
  );
}
