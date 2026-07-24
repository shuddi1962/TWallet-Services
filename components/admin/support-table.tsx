"use client";

import { useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FilterBar, type FilterOption } from "@/components/admin/filter-bar";
import type { AdminTicket, AdminInfo } from "@/lib/admin/types";

const statusColors: Record<string, string> = {
  open: "bg-yellow-500/10 text-yellow-400",
  pending: "bg-blue-500/10 text-blue-400",
  resolved: "bg-green-500/10 text-green-400",
  closed: "bg-surface-700 text-surface-400",
  escalated: "bg-red-500/20 text-red-300",
};

const priorityColors: Record<string, string> = {
  low: "bg-surface-700 text-surface-400",
  medium: "bg-yellow-500/10 text-yellow-400",
  high: "bg-red-500/10 text-red-400",
  urgent: "bg-red-500/20 text-red-300",
};

interface SupportTableProps {
  tickets: AdminTicket[];
  count: number;
  admins: AdminInfo[];
}

export function AdminSupportTable({ tickets, admins }: SupportTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const pageSize = 15;

  const handleSort = (field: string, dir: "asc" | "desc") => {
    setSortField(field);
    setSortDir(dir);
  };

  const filtered = useMemo(() => {
    const f = tickets.filter((t) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !t.subject?.toLowerCase().includes(q) &&
          !t.ticket_number?.toLowerCase().includes(q) &&
          !t.profiles?.full_name?.toLowerCase().includes(q)
        )
          return false;
      }
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
      if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
      if (assignedFilter !== "all") {
        if (assignedFilter === "unassigned" && t.assigned_to) return false;
        if (assignedFilter !== "unassigned" && t.assigned_to !== assignedFilter) return false;
      }
      return true;
    });

    // Sort
    f.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      let cmp = 0;
      if (sortField === "created_at" || sortField === "updated_at") {
        cmp = a[sortField] < b[sortField] ? -1 : 1;
      } else if (sortField === "priority") {
        const order = ["low", "medium", "high", "urgent"];
        cmp = order.indexOf(a.priority) - order.indexOf(b.priority);
      } else if (sortField === "ticket_number") {
        cmp = a.ticket_number.localeCompare(b.ticket_number);
      } else if (sortField === "subject") {
        cmp = a.subject.localeCompare(b.subject);
      }
      return cmp * dir;
    });

    return f;
  }, [tickets, search, statusFilter, priorityFilter, categoryFilter, assignedFilter, sortField, sortDir]);

  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const columns: Column<AdminTicket>[] = [
    {
      key: "ticket_number",
      label: "Ticket #",
      sortable: true,
      className: "w-[110px]",
      render: (ticket) => (
        <span className="font-mono text-xs text-brand-400">{ticket.ticket_number}</span>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      sortable: true,
      render: (ticket) => (
        <span className="font-medium text-surface-200 line-clamp-1">{ticket.subject}</span>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      render: (ticket) => (
        <div>
          <p className="font-medium text-surface-200 text-sm">{ticket.profiles?.full_name ?? "—"}</p>
          <p className="text-xs text-surface-400">{ticket.profiles?.email}</p>
        </div>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      sortable: true,
      className: "w-[100px]",
      render: (ticket) => (
        <Badge className={priorityColors[ticket.priority] ?? ""}>{ticket.priority}</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "w-[110px]",
      render: (ticket) => (
        <Badge className={statusColors[ticket.status] ?? ""}>{ticket.status}</Badge>
      ),
    },
    {
      key: "assigned_to",
      label: "Assigned To",
      className: "w-[140px]",
      render: (ticket) => (
        <span className="text-sm text-surface-400">
          {ticket.assigned_admin?.profiles?.full_name ?? (
            <span className="text-surface-500 italic">Unassigned</span>
          )}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      sortable: true,
      className: "w-[130px]",
      render: (ticket) => (
        <span className="text-sm text-surface-400">
          {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-[70px]",
      render: () => (
        <button
          className="p-1.5 rounded-lg hover:bg-surface-800 text-surface-400 hover:text-surface-200 transition-colors"
          aria-label="View ticket"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  const filterOptions: FilterOption[] = [
    {
      key: "status",
      label: "Status",
      value: statusFilter,
      onChange: (v) => {
        setStatusFilter(v);
        setPage(0);
      },
      options: [
        { value: "all", label: "All Status" },
        { value: "open", label: "Open" },
        { value: "pending", label: "Pending" },
        { value: "resolved", label: "Resolved" },
        { value: "closed", label: "Closed" },
        { value: "escalated", label: "Escalated" },
      ],
    },
    {
      key: "priority",
      label: "Priority",
      value: priorityFilter,
      onChange: (v) => {
        setPriorityFilter(v);
        setPage(0);
      },
      options: [
        { value: "all", label: "All Priority" },
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
        { value: "urgent", label: "Urgent" },
      ],
    },
    {
      key: "category",
      label: "Category",
      value: categoryFilter,
      onChange: (v) => {
        setCategoryFilter(v);
        setPage(0);
      },
      options: [
        { value: "all", label: "All Categories" },
        { value: "shipping", label: "Shipping" },
        { value: "payment", label: "Payment" },
        { value: "card", label: "Card" },
        { value: "account", label: "Account" },
        { value: "other", label: "Other" },
      ],
    },
    {
      key: "assigned_to",
      label: "Assigned To",
      value: assignedFilter,
      onChange: (v) => {
        setAssignedFilter(v);
        setPage(0);
      },
      options: [
        { value: "all", label: "All Assignees" },
        { value: "unassigned", label: "Unassigned" },
        ...admins.map((a) => ({
          value: a.id,
          label: a.profiles?.full_name ?? a.profiles?.email ?? "Unknown",
        })),
      ],
    },
  ];

  return (
    <div>
      <FilterBar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(0);
        }}
        searchPlaceholder="Search by ticket #, subject, or customer..."
        filters={filterOptions}
        onReset={() => {
          setSearch("");
          setStatusFilter("all");
          setPriorityFilter("all");
          setCategoryFilter("all");
          setAssignedFilter("all");
          setPage(0);
        }}
      />
      <DataTable
        columns={columns}
        data={paged}
        total={filtered.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onSort={handleSort}
        sortField={sortField}
        sortDir={sortDir}
        keyExtractor={(t) => t.id}
        emptyMessage="No support tickets found"
      />
    </div>
  );
}