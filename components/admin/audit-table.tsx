"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface AuditLog {
  id: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
  admins?: { profile_id: string; profiles?: { full_name: string } } | null;
}

const actionColors: Record<string, string> = {
  user_suspended: "bg-warning/10 text-warning",
  user_reactivated: "bg-success/10 text-success",
  user_deleted: "bg-danger/10 text-danger",
  order_status_changed: "bg-info/10 text-info",
  payment_confirmed: "bg-success/10 text-success",
  payment_flagged: "bg-danger/10 text-danger",
  settings_updated: "bg-primary/10 text-primary",
  admin_created: "bg-primary/10 text-primary",
  login: "bg-surface-200 text-body",
  logout: "bg-surface-200 text-body",
};

export function AdminAuditTable({ logs }: { logs: AuditLog[]; count: number }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = logs.filter((log) => {
    if (search && !log.action?.toLowerCase().includes(search.toLowerCase()) && !log.target_id?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center gap-2 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm max-w-sm mb-4">
        <Search className="w-4 h-4 text-body" />
        <input
          type="text"
          placeholder="Search by action or target ID..."
          className="bg-transparent border-none outline-none w-full text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search audit logs"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <p className="text-body">No audit logs found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((log) => (
            <div key={log.id} className="bg-white rounded-xl shadow-sm border border-surface-100 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${actionColors[log.action] ?? "bg-surface-200 text-body"}`}>
                    {log.action?.replace(/_/g, " ")}
                  </span>
                  <span className="text-sm text-body">{log.admins?.profiles?.full_name ?? "System"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <time className="text-xs text-body" dateTime={log.created_at}>
                    {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                  </time>
                  {expanded === log.id ? <ChevronUp className="w-4 h-4 text-body" /> : <ChevronDown className="w-4 h-4 text-body" />}
                </div>
              </button>
              {expanded === log.id && (
                <div className="px-4 pb-3 pt-1 border-t border-surface-100 bg-surface-50/50">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-body">Target</p>
                      <p className="text-heading">{log.target_type} / {log.target_id?.slice(0, 8)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-body">IP Address</p>
                      <p className="text-heading font-mono text-xs">{log.ip_address ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-body">Timestamp</p>
                      <p className="text-heading">{format(new Date(log.created_at), "MMM d, yyyy HH:mm:ss")}</p>
                    </div>
                  </div>
                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-body mb-1">Details</p>
                      <pre className="text-xs bg-surface-100 p-2 rounded-lg overflow-x-auto max-h-32">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
