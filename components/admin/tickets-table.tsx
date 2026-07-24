"use client";

import { useState } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  open: "bg-yellow-500/10 text-yellow-400",
  pending: "bg-blue-500/10 text-blue-400",
  resolved: "bg-green-500/10 text-green-400",
  closed: "bg-surface-700 text-surface-400",
};

const priorityColors: Record<string, string> = {
  low: "bg-surface-700 text-surface-400",
  medium: "bg-yellow-500/10 text-yellow-400",
  high: "bg-red-500/10 text-red-400",
  urgent: "bg-red-500/20 text-red-300",
};

interface Ticket {
  id: string;
  subject: string;
  priority: string;
  status: string;
  created_at: string;
  profiles?: { full_name: string; email: string } | null;
}

export function AdminTicketsTable({ tickets }: { tickets: Ticket[]; count?: number }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filtered = tickets.filter((t) => {
    if (search && !t.subject?.toLowerCase().includes(search.toLowerCase()) && !t.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortField === "created_at") return (a.created_at < b.created_at ? -1 : 1) * dir;
    if (sortField === "priority") return (a.priority < b.priority ? -1 : 1) * dir;
    return 0;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-surface-700 bg-surface-800 pl-10 pr-4 py-2 text-sm text-surface-100 placeholder-surface-500 focus:border-brand-500 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-surface-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-surface-800">
        <table className="w-full text-sm">
          <thead className="bg-surface-900 text-surface-400">
            <tr>
              <th className="px-4 py-3 text-left font-medium cursor-pointer select-none" onClick={() => toggleSort("subject")}>
                Subject <ArrowUpDown className="inline h-3 w-3 ml-1" />
              </th>
              <th className="px-4 py-3 text-left font-medium">
                From
              </th>
              <th className="px-4 py-3 text-left font-medium cursor-pointer select-none" onClick={() => toggleSort("priority")}>
                Priority <ArrowUpDown className="inline h-3 w-3 ml-1" />
              </th>
              <th className="px-4 py-3 text-left font-medium">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium cursor-pointer select-none" onClick={() => toggleSort("created_at")}>
                Created <ArrowUpDown className="inline h-3 w-3 ml-1" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800">
            {filtered.map((ticket) => (
              <tr key={ticket.id} className="bg-surface-950 transition hover:bg-surface-900/50">
                <td className="px-4 py-3 font-medium text-surface-200">{ticket.subject}</td>
                <td className="px-4 py-3 text-surface-400">{ticket.profiles?.full_name ?? ticket.profiles?.email ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge className={priorityColors[ticket.priority] ?? ""}>{ticket.priority}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge className={statusColors[ticket.status] ?? ""}>{ticket.status}</Badge>
                </td>
                <td className="px-4 py-3 text-surface-400">{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-surface-500">No tickets found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
