"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { Eye, Send, CheckCircle2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogHeader,
} from "@/components/ui/dialog";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FilterBar, type FilterOption } from "@/components/admin/filter-bar";
import type { AdminTicket, AdminInfo, TicketMessage } from "@/lib/admin/types";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  replyToTicket,
  resolveTicket,
  closeTicket,
  getTicketMessages,
  getCurrentAdminId,
  type ActionResult,
} from "@/lib/admin/actions";

const statusColors: Record<string, string> = {
  open: "bg-yellow-50 text-yellow-700",
  pending: "bg-blue-50 text-blue-700",
  resolved: "bg-green-50 text-green-700",
  closed: "bg-slate-100 text-slate-500",
  escalated: "bg-red-50 text-red-600",
};

const priorityColors: Record<string, string> = {
  low: "bg-slate-100 text-slate-500",
  medium: "bg-yellow-50 text-yellow-700",
  high: "bg-red-50 text-red-600",
  urgent: "bg-red-50 text-red-600",
};

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: "order", label: "Order Card" },
  { value: "payment", label: "Payment" },
  { value: "transaction", label: "Transaction" },
  { value: "card", label: "Card" },
  { value: "shipping", label: "Shipping" },
  { value: "claims", label: "Claims" },
  { value: "account", label: "Account" },
  { value: "security", label: "Security" },
  { value: "token", label: "Token / NFT" },
  { value: "restore_wallet", label: "Restore Wallet" },
  { value: "wallet_connect", label: "WalletConnect / DApps" },
  { value: "browser", label: "Browser / Extension" },
  { value: "buy_crypto", label: "Buy Crypto" },
  { value: "swap", label: "Swap" },
  { value: "staking", label: "Staking" },
  { value: "gas_fee", label: "Gas Fee" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
];

interface SupportTableProps {
  tickets: AdminTicket[];
  count: number;
  admins: AdminInfo[];
}

export function AdminSupportTable({ tickets, admins }: SupportTableProps) {
  const [rows, setRows] = useState<AdminTicket[]>(tickets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const pageSize = 15;

  const [selected, setSelected] = useState<AdminTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [replying, setReplying] = useState(false);
  const [updating, setUpdating] = useState<"resolve" | "close" | null>(null);

  useEffect(() => {
    setRows(tickets);
  }, [tickets]);

  const applyRealtime = useCallback(
    (payload: {
      eventType: "INSERT" | "UPDATE" | "DELETE";
      new?: Record<string, unknown> | null;
      old?: Record<string, unknown> | null;
      id?: string;
    }) => {
      const row = payload.eventType === "DELETE" ? payload.old : payload.new;
      if (!row?.id) return;
      const next = row as unknown as AdminTicket;
      setRows((prev) => {
        if (payload.eventType === "DELETE") {
          return prev.filter((t) => t.id !== row.id);
        }
        const exists = prev.some((t) => t.id === row.id);
        const merged = exists
          ? prev.map((t) => (t.id === row.id ? { ...t, ...next } : t))
          : [next, ...prev];
        return merged.sort(
          (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
        );
      });
    },
    [],
  );

  const applyRealtimeRef = useRef(applyRealtime);
  applyRealtimeRef.current = applyRealtime;

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-support-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "support_tickets" },
        (payload: unknown) => {
          applyRealtimeRef.current?.(
            payload as Parameters<typeof applyRealtime>[0],
          );
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const openTicket = (ticket: AdminTicket) => {
    setSelected(ticket);
    setReply("");
    setMessages([]);
  };

  const closeTicketDialog = () => {
    setSelected(null);
    setMessages([]);
    setReply("");
  };

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    const id = selected.id;
    setMsgLoading(true);
    void (async () => {
      const [{ messages: m }, currentAdminId] = await Promise.all([
        getTicketMessages(id),
        getCurrentAdminId(),
      ]);
      if (cancelled) return;
      setMessages(m);
      setAdminId(currentAdminId);
      setMsgLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [selected]);

  const selectedIdRef = useRef<string | null>(null);
  selectedIdRef.current = selected?.id ?? null;

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-support-messages-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "ticket_messages" },
        (payload: unknown) => {
          const p = payload as { new?: Record<string, unknown> | null };
          const row = p.new;
          if (!row?.ticket_id || !row?.id) return;
          if (row.ticket_id !== selectedIdRef.current) return;
          if (row.internal === true) return;
          const item: TicketMessage = {
            id: String(row.id),
            ticket_id: String(row.ticket_id),
            author: (String(row.author) === "admin" ? "admin" : "customer") as TicketMessage["author"],
            admin_id: (row.admin_id as string | null) ?? null,
            message: String(row.message),
            internal: Boolean(row.internal),
            created_at: String(row.created_at),
          };
          setMessages((prev) => {
            if (prev.some((m) => m.id === item.id)) return prev;
            return [...prev, item];
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const patchTicket = (id: string, patch: Partial<AdminTicket>) => {
    setRows((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev));
  };

  const handleReply = async () => {
    if (!selected || !adminId || !reply.trim()) return;
    setReplying(true);
    const res: ActionResult = await replyToTicket(selected.id, reply.trim(), adminId);
    setReplying(false);
    if (res.success) {
      toast.success("Reply sent to customer");
      setReply("");
      patchTicket(selected.id, { status: "pending" });
      const { messages: m } = await getTicketMessages(selected.id);
      setMessages(m);
    } else {
      toast.error(res.error);
    }
  };

  const handleResolve = async () => {
    if (!selected) return;
    setUpdating("resolve");
    const res: ActionResult = await resolveTicket(selected.id);
    setUpdating(null);
    if (res.success) {
      toast.success("Ticket resolved");
      patchTicket(selected.id, { status: "resolved" });
    } else {
      toast.error(res.error);
    }
  };

  const handleClose = async () => {
    if (!selected) return;
    setUpdating("close");
    const res: ActionResult = await closeTicket(selected.id);
    setUpdating(null);
    if (res.success) {
      toast.success("Ticket closed");
      patchTicket(selected.id, { status: "closed" });
    } else {
      toast.error(res.error);
    }
  };

  const handleSort = (field: string, dir: "asc" | "desc") => {
    setSortField(field);
    setSortDir(dir);
  };

  const filtered = useMemo(() => {
    const f = rows.filter((t) => {
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
  }, [rows, search, statusFilter, priorityFilter, categoryFilter, assignedFilter, sortField, sortDir]);

  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const columns: Column<AdminTicket>[] = [
    {
      key: "ticket_number",
      label: "Ticket #",
      sortable: true,
      className: "w-[110px]",
      render: (ticket) => (
        <span className="font-mono text-xs text-brand-600">{ticket.ticket_number}</span>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      sortable: true,
      render: (ticket) => (
        <span className="font-medium text-slate-700 line-clamp-1">{ticket.subject}</span>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      render: (ticket) => (
        <div>
          <p className="font-medium text-slate-700 text-sm">{ticket.profiles?.full_name ?? "—"}</p>
          <p className="text-xs text-slate-500">{ticket.profiles?.email}</p>
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
        <span className="text-sm text-slate-500">
          {ticket.assigned_admin?.profiles?.full_name ?? (
            <span className="text-slate-400 italic">Unassigned</span>
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
        <span className="text-sm text-slate-500">
          {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-[70px]",
      render: (ticket) => (
        <button
          onClick={() => openTicket(ticket)}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label={`View ticket ${ticket.ticket_number}`}
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
        ...CATEGORY_OPTIONS.map((c) => ({ value: c.value, label: c.label })),
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

      <Dialog open={!!selected} onOpenChange={(open) => !open && closeTicketDialog()}>
        {selected && (
          <div>
            <DialogHeader
              title={`${selected.ticket_number} — ${selected.subject}`}
              description={`${selected.profiles?.full_name ?? "Customer"} · ${selected.profiles?.email ?? ""} · ${selected.category} · ${selected.priority} priority`}
              onClose={closeTicketDialog}
            />

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={statusColors[selected.status] ?? ""}>{selected.status}</Badge>
              <span className="text-xs text-slate-400">
                Created {formatDistanceToNow(new Date(selected.created_at), { addSuffix: true })}
              </span>
            </div>

            <div className="max-h-[45vh] space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
              {msgLoading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">No messages yet.</p>
              ) : (
                messages
                  .filter((m) => !m.internal)
                  .map((m) => (
                    <div
                      key={m.id}
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                        m.author === "admin"
                          ? "ml-auto bg-brand-600 text-white"
                          : "bg-white text-slate-700 border border-slate-200"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{m.message}</p>
                      <p className={`mt-1 text-[10px] ${m.author === "admin" ? "text-brand-100" : "text-slate-400"}`}>
                        {m.author === "admin" ? "Support" : selected.profiles?.full_name ?? "Customer"} ·{" "}
                        {formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  ))
              )}
            </div>

            <div className="mt-4 space-y-2">
              <Textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write a reply to the customer..."
                rows={3}
                aria-label="Reply message"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={handleResolve}
                    loading={updating === "resolve"}
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Resolve
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleClose}
                    loading={updating === "close"}
                  >
                    Close
                  </Button>
                </div>
                <Button
                  onClick={handleReply}
                  loading={replying}
                  disabled={!reply.trim() || !adminId}
                >
                  <Send className="h-4 w-4" aria-hidden="true" /> Send Reply
                </Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}