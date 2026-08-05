"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Check, CheckCheck, ExternalLink, X, Mail, MailOpen } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { markAdminNotificationRead, markAdminNotificationUnread, type ActionResult } from "@/lib/admin/actions";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

interface AdminNotification {
  id: string;
  admin_id: string;
  type: string;
  title: string;
  message?: string | null;
  related_type?: string | null;
  related_id?: string | null;
  read: boolean;
  created_at: string;
  updated_at: string;
}

const NOTIFICATION_TYPES = [
  { value: "all", label: "All Types" },
  { value: "notice", label: "Notice" },
  { value: "new_order", label: "New Order" },
  { value: "new_payment", label: "New Payment" },
  { value: "payment_confirmed", label: "Payment Confirmed" },
  { value: "payment_failed", label: "Failed Payment" },
  { value: "shipping_update", label: "Shipping Update" },
  { value: "support_reply", label: "Support Reply" },
  { value: "ticket_created", label: "New Support Ticket" },
  { value: "kyc_submitted", label: "KYC Submitted" },
  { value: "kyc_reviewed", label: "KYC Reviewed" },
  { value: "system", label: "System Alert" },
  { value: "promotion", label: "Promotion" },
];

const READ_FILTERS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

const typeVariants: Record<string, string> = {
  notice: "secondary",
  new_order: "default",
  new_payment: "success",
  payment_confirmed: "success",
  payment_failed: "error",
  shipping_update: "info",
  support_reply: "info",
  ticket_created: "warning",
  kyc_submitted: "warning",
  kyc_reviewed: "info",
  system: "warning",
  promotion: "secondary",
};

const typeLabels: Record<string, string> = {
  notice: "Notice",
  new_order: "New Order",
  new_payment: "New Payment",
  payment_confirmed: "Payment Confirmed",
  payment_failed: "Failed Payment",
  shipping_update: "Shipping Update",
  support_reply: "Support Reply",
  ticket_created: "New Support Ticket",
  kyc_submitted: "KYC Submitted",
  kyc_reviewed: "KYC Reviewed",
  system: "System Alert",
  promotion: "Promotion",
};

const relatedLinks: Record<string, string> = {
  order: "/admin/orders",
  payment: "/admin/payments",
  ticket: "/admin/support",
  user: "/admin/users",
  kyc_submissions: "/admin/kyc",
};

export function AdminNotificationsTable({ notifications, count }: { notifications: AdminNotification[]; count: number }) {
  const router = useRouter();
  const [rows, setRows] = useState<AdminNotification[]>(notifications);
  const [liveCount, setLiveCount] = useState(count);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    setRows(notifications);
    setLiveCount(count);
  }, [notifications, count]);

  const rowsRef = useRef<AdminNotification[]>(notifications);
  rowsRef.current = rows;

  const applyRealtime = useCallback((payload: { eventType?: string; new?: Record<string, unknown> | null; old?: Record<string, unknown> | null }) => {
    const toItem = (row: Record<string, unknown>): AdminNotification => ({
      id: String(row.id),
      admin_id: String(row.admin_id ?? ""),
      type: String(row.type ?? "system"),
      title: String(row.title ?? ""),
      message: (row.message as string | null) ?? null,
      related_type: (row.related_type as string | null) ?? null,
      related_id: (row.related_id as string | null) ?? null,
      read: Boolean(row.read),
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
    });

    if (payload.eventType === "INSERT" && payload.new?.id) {
      const item = toItem(payload.new);
      setRows((prev) => {
        const exists = prev.some((n) => n.id === item.id);
        const next = exists ? prev.map((n) => (n.id === item.id ? item : n)) : [item, ...prev];
        return next.slice(0, 200);
      });
      setLiveCount((prev) => prev + 1);
      toast.info(item.title, { description: item.message ?? undefined });
    } else if (payload.eventType === "UPDATE" && payload.new?.id) {
      const item = toItem(payload.new);
      const existed = rowsRef.current.some((n) => n.id === item.id);
      setRows((prev) => {
        const exists = prev.some((n) => n.id === item.id);
        return exists ? prev.map((n) => (n.id === item.id ? item : n)) : [item, ...prev].slice(0, 200);
      });
      if (!existed) setLiveCount((prev) => prev + 1);
    } else if (payload.eventType === "DELETE" && payload.old?.id) {
      const id = String(payload.old.id);
      const existed = rowsRef.current.some((n) => n.id === id);
      setRows((prev) => prev.filter((n) => n.id !== id));
      if (existed) setLiveCount((prev) => Math.max(0, prev - 1));
    }
  }, []);

  const applyRealtimeRef = useRef(applyRealtime);
  applyRealtimeRef.current = applyRealtime;

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-notifications-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "admin_notifications" },
        (payload: unknown) => {
          applyRealtimeRef.current?.(payload as { eventType?: string; new?: Record<string, unknown> | null; old?: Record<string, unknown> | null });
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const filtered = rows.filter((n) => {
    if (search && !n.title?.toLowerCase().includes(search.toLowerCase()) && !n.message?.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && n.type !== typeFilter) return false;
    if (readFilter !== "all" && n.read !== (readFilter === "read")) return false;
    if (dateFrom && new Date(n.created_at) < new Date(dateFrom)) return false;
    if (dateTo) {
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      if (new Date(n.created_at) > endOfDay) return false;
    }
    return true;
  });

  const handleMarkRead = async (id: string) => {
    setUpdating(id);
    const result: ActionResult = await markAdminNotificationRead(id);
    setUpdating(null);
    if (result.success) {
      toast.success("Notification marked as read");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  const handleMarkUnread = async (id: string) => {
    setUpdating(id);
    const result: ActionResult = await markAdminNotificationUnread(id);
    setUpdating(null);
    if (result.success) {
      toast.success("Notification marked as unread");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  const hasActiveFilters = search || typeFilter !== "all" || readFilter !== "all" || dateFrom || dateTo;

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setReadFilter("all");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div>
      {/* Filter bar */}
      <Card className="p-4 mb-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm w-full lg:w-auto lg:flex-1 lg:min-w-[200px]">
            <Search className="w-4 h-4 text-body shrink-0" />
            <input
              type="text"
              placeholder="Search title or message..."
              className="bg-transparent border-none outline-none w-full text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search notifications"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="shrink-0 rounded-md p-0.5 text-slate-400 hover:bg-surface-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 lg:flex lg:items-center lg:gap-3">
            <select
              className="w-full px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm text-body lg:w-auto"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by type"
            >
              {NOTIFICATION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            <select
              className="w-full px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm text-body lg:w-auto"
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value)}
              aria-label="Filter by read status"
            >
              {READ_FILTERS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="min-w-0 flex-1 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm text-body lg:w-auto lg:flex-none"
              aria-label="From date"
            />
            <span className="text-body text-sm shrink-0">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="min-w-0 flex-1 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm text-body lg:w-auto lg:flex-none"
              aria-label="To date"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="self-start lg:self-auto text-sm text-primary hover:text-primary/80 font-medium"
            >
              Reset
            </button>
          )}
        </div>
      </Card>

      {/* Notifications count */}
      <p className="text-sm text-body mb-4">
        {filtered.length === liveCount
          ? `${liveCount} notification${liveCount === 1 ? "" : "s"}`
          : `${filtered.length} of ${liveCount} notification${liveCount === 1 ? "" : "s"}`}
      </p>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center">
          <div className="flex flex-col items-center gap-2">
            <CheckCheck className="w-12 h-12 text-success/60" aria-hidden="true" />
            <p className="text-lg font-medium text-heading">
              {rows.length === 0 ? "No notifications yet" : "All caught up!"}
            </p>
            <p className="text-sm text-body">
              {rows.length === 0
                ? "Admin notifications will appear here when events occur."
                : "No notifications match the current filters."}
            </p>
          </div>
        </Card>
      ) : (
        /* Table */
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-body bg-surface-50 border-b border-surface-200">
                  <th scope="col" className="py-3 px-4 font-medium">Type</th>
                  <th scope="col" className="py-3 px-4 font-medium">Message</th>
                  <th scope="col" className="py-3 px-4 font-medium">Related To</th>
                  <th scope="col" className="py-3 px-4 font-medium">Read</th>
                  <th scope="col" className="py-3 px-4 font-medium">Created</th>
                  <th scope="col" className="py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((notification) => (
                  <tr
                    key={notification.id}
                    className={`border-b border-surface-100 hover:bg-surface-50 transition-colors ${!notification.read ? "bg-primary/[0.02]" : ""}`}
                  >
                    {/* Type */}
                    <td className="py-3 px-4">
                      <Badge
                        variant={(typeVariants[notification.type] as "default" | "secondary" | "success" | "warning" | "error" | "info") ?? "secondary"}
                        className="whitespace-nowrap"
                      >
                        {typeLabels[notification.type] ?? notification.type}
                      </Badge>
                    </td>

                    {/* Message */}
                    <td className="py-3 px-4 max-w-xs">
                      <div>
                        <p className={`text-sm ${!notification.read ? "font-semibold text-heading" : "text-body"}`}>
                          {notification.title}
                        </p>
                        {notification.message && (
                          <p className="text-xs text-body mt-0.5 truncate">{notification.message}</p>
                        )}
                      </div>
                    </td>

                    {/* Related To */}
                    <td className="py-3 px-4">
                      {notification.related_type && notification.related_id ? (
                        <a
                          href={`${relatedLinks[notification.related_type] ?? "#"}?id=${notification.related_id}`}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium"
                        >
                          {notification.related_type}
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                      ) : (
                        <span className="text-xs text-body">—</span>
                      )}
                    </td>

                    {/* Read status */}
                    <td className="py-3 px-4">
                      {notification.read ? (
                        <span className="inline-flex items-center gap-1 text-xs text-success">
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          Read
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-warning font-medium">
                          <span className="w-2 h-2 rounded-full bg-warning" aria-hidden="true" />
                          New
                        </span>
                      )}
                    </td>

                    {/* Created */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <time className="text-xs text-body" dateTime={notification.created_at}>
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </time>
                        <span className="text-[11px] text-slate-500">
                          {format(new Date(notification.created_at), "MMM d, yyyy HH:mm")}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4">
                      {notification.read ? (
                        <button
                          onClick={() => handleMarkUnread(notification.id)}
                          disabled={updating === notification.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-100 text-slate-600 hover:bg-surface-200 transition-colors disabled:opacity-50"
                          aria-label="Mark as unread"
                          title="Mark as unread"
                        >
                          <MailOpen className="w-3.5 h-3.5" aria-hidden="true" />
                          {updating === notification.id ? "..." : "Unread"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkRead(notification.id)}
                          disabled={updating === notification.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                          aria-label="Mark as read"
                          title="Mark as read"
                        >
                          {updating === notification.id ? (
                            "..."
                          ) : (
                            <>
                              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                              Read
                            </>
                          )}
                        </button>
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