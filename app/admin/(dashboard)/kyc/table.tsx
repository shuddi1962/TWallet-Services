"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Fingerprint, CheckCircle2, XCircle, Loader2, ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRealtime } from "@/lib/hooks/use-realtime";
import { reviewKycSubmission } from "@/lib/admin/actions";

type KycRecord = Record<string, unknown>;

type KycPayload = {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new?: KycRecord | null;
  old?: KycRecord | null;
};

function statusBadge(status: string) {
  const colors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-600 border-red-200",
  };
  return (
    <Badge variant="outline" className={`gap-1 capitalize ${colors[status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
      {status}
    </Badge>
  );
}

export function AdminKycTable({ submissions, count }: { submissions: KycRecord[]; count: number }) {
  const [records, setRecords] = useState<KycRecord[]>(submissions);
  const [total, setTotal] = useState(count);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    setRecords(submissions);
    setTotal(count);
  }, [submissions, count]);

  const handleRealtime = useCallback((payload: KycPayload) => {
    const row = payload.new;

    if (payload.eventType === "DELETE") {
      setRecords((prev) => prev.filter((v) => (v.id as string) !== payload.old?.id));
      setTotal((t) => Math.max(0, t - 1));
      return;
    }
    if (!row) return;

    if (payload.eventType === "INSERT") {
      toast.info(`New KYC submission from ${(row.full_name as string) ?? "a user"}`);
      setRecords((prev) => [{ ...row, profiles: null }, ...prev]);
      setTotal((t) => t + 1);
    } else if (payload.eventType === "UPDATE") {
      const prevStatus = (payload.old?.status as string) ?? "pending";
      const newStatus = (row.status as string) ?? "pending";
      if (prevStatus !== newStatus) {
        toast.success(`KYC for ${(row.full_name as string) ?? "user"} is now ${newStatus}`);
      }
      setRecords((prev) =>
        prev.map((v) => ((v.id as string) === row.id ? { ...v, ...row } : v)),
      );
    }
  }, []);

  useRealtime<KycPayload>("admin-kyc-live", "*", "kyc_submissions", handleRealtime);

  const handleReview = async (id: string, status: "approved" | "rejected") => {
    setReviewing(id);
    const res = await reviewKycSubmission(id, status, notes[id]);
    setReviewing(null);
    if (res.success) {
      toast.success(`KYC ${status} — the user sees the result in real time`);
      setNotes((n) => ({ ...n, [id]: "" }));
    } else {
      toast.error(res.error);
    }
  };

  const filtered = records.filter((v) => {
    if (search) {
      const q = search.toLowerCase();
      const name = (v.full_name as string) ?? "";
      const profile = (v.profiles as Record<string, unknown>) ?? {};
      const email = (profile.email as string) ?? "";
      const docNumber = (v.document_number as string) ?? "";
      if (!name.toLowerCase().includes(q) && !email.toLowerCase().includes(q) && !docNumber.toLowerCase().includes(q)) return false;
    }
    if (statusFilter !== "all" && v.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by name, email or document number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
            aria-label="Search KYC submissions"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <span
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600"
          title="Submissions update in real time"
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
            <Fingerprint className="h-10 w-10 text-slate-400" />
            <p className="text-sm text-slate-500">No KYC submissions found</p>
          </div>
        ) : (
          filtered.map((v) => {
            const id = (v.id as string) ?? Math.random().toString();
            const expanded = expandedId === id;
            const profile = (v.profiles as Record<string, unknown>) ?? {};
            const status = (v.status as string) ?? "pending";

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
                      <Fingerprint className="h-4 w-4 text-brand-600" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {v.full_name as string ?? "Unknown"}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {profile.email as string ?? "No profile"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {statusBadge(status)}
                    <span className="text-xs text-slate-400">
                      {new Date(v.created_at as string).toLocaleDateString()}
                    </span>
                  </div>
                </button>

                {expanded && (
                  <div className="border-t border-slate-200 px-4 pb-4 pt-3 space-y-3">
                    <div className="grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-2">
                      <p className="text-slate-500"><span className="font-medium text-slate-400">Document:</span> <span className="capitalize text-slate-700">{(v.document_type as string) ?? "—"}</span></p>
                      <p className="text-slate-500"><span className="font-medium text-slate-400">Document number:</span> <span className="font-mono text-slate-700">{v.document_number as string ?? "—"}</span></p>
                      <p className="text-slate-500"><span className="font-medium text-slate-400">Submitted:</span> <span className="text-slate-700">{new Date(v.created_at as string).toLocaleString()}</span></p>
                      <p className="text-slate-500"><span className="font-medium text-slate-400">Reviewed:</span> <span className="text-slate-700">{v.reviewed_at ? new Date(v.reviewed_at as string).toLocaleString() : "—"}</span></p>
                      <p className="text-slate-500"><span className="font-medium text-slate-400">User ID:</span> <span className="font-mono text-slate-700">{(v.user_id as string) ?? "—"}</span></p>
                      {(v.admin_note as string | null) && (
                        <p className="text-slate-500"><span className="font-medium text-slate-400">Admin note:</span> <span className="text-slate-700">{v.admin_note as string}</span></p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <FileText className="h-3.5 w-3.5" aria-hidden="true" /> Documents
                      </span>
                      <a
                        href={v.document_front_url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-brand-600 transition hover:bg-brand-50"
                      >
                        Front <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                      {(v.document_back_url as string | null) && (
                        <a
                          href={v.document_back_url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-brand-600 transition hover:bg-brand-50"
                        >
                          Back <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                      )}
                    </div>

                    {status === "pending" && (
                      <div className="space-y-2 border-t border-slate-200 pt-3">
                        <input
                          type="text"
                          placeholder="Note for the customer (optional) — shown on rejection"
                          value={notes[id] ?? ""}
                          onChange={(e) => setNotes((n) => ({ ...n, [id]: e.target.value }))}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none"
                          aria-label="Admin note"
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="rounded-lg border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                            onClick={() => void handleReview(id, "approved")}
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
                            Approving unlocks Tier 1 order limits; the customer is notified instantly
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <p className="text-xs text-slate-400">
        Showing {filtered.length} of {total} total submissions
      </p>
    </div>
  );
}
