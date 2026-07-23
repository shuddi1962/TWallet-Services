"use client";

import { useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Payment {
  id: string;
  tx_hash?: string;
  amount?: number;
  status: string;
  created_at: string;
  supported_networks?: { name: string } | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-success/10 text-success",
  failed: "bg-danger/10 text-danger",
  flagged: "bg-danger/10 text-danger",
  refunded: "bg-info/10 text-info",
};

export function AdminPaymentsTable({ payments }: { payments: Payment[]; count: number }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = payments.filter((p) => {
    if (search && !p.tx_hash?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm flex-1 max-w-sm">
          <Search className="w-4 h-4 text-body" />
          <input
            type="text"
            placeholder="Search by tx hash..."
            className="bg-transparent border-none outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search payments"
          />
        </div>
        <select
          className="px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm text-body"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          {Object.keys(statusColors).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <p className="text-body">No payments found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-body bg-surface-50 border-b border-surface-200">
                  <th scope="col" className="py-3 px-4 font-medium">Tx Hash</th>
                  <th scope="col" className="py-3 px-4 font-medium">Amount</th>
                  <th scope="col" className="py-3 px-4 font-medium">Network</th>
                  <th scope="col" className="py-3 px-4 font-medium">Status</th>
                  <th scope="col" className="py-3 px-4 font-medium">Date</th>
                  <th scope="col" className="py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((payment) => (
                  <tr key={payment.id} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-primary">
                      {payment.tx_hash ? `${payment.tx_hash.slice(0, 10)}...` : "—"}
                    </td>
                    <td className="py-3 px-4 font-medium text-heading">{payment.amount ? `${payment.amount} USDC` : "—"}</td>
                    <td className="py-3 px-4 text-body">{payment.supported_networks?.name ?? "—"}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[payment.status] ?? "bg-surface-200 text-body"}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-body text-xs">
                      {formatDistanceToNow(new Date(payment.created_at), { addSuffix: true })}
                    </td>
                    <td className="py-3 px-4">
                      {payment.tx_hash && (
                        <a
                          href={`https://etherscan.io/tx/${payment.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-surface-100 text-body inline-flex transition-colors"
                          aria-label={`View transaction on explorer`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
