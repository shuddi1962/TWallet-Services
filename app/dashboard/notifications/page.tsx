"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Bell,
  ShoppingCart,
  Truck,
  Package,
  CheckCircle2,
  CreditCard,
  XCircle,
  Trash2,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";
import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
} from "@/features/dashboard/server/actions";

const TYPE_CONFIG: Record<string, { icon: React.ElementType; label: string }> = {
  order_paid: { icon: ShoppingCart, label: "Order Paid" },
  order_shipped: { icon: Truck, label: "Order Shipped" },
  order_delivered: { icon: Package, label: "Order Delivered" },
  payment_confirmed: { icon: CheckCircle2, label: "Payment Confirmed" },
  card_activated: { icon: CreditCard, label: "Card Activated" },
  card_declined: { icon: XCircle, label: "Card Declined" },
  system: { icon: Bell, label: "System" },
};

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

function getDateGroup(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return "Earlier";
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [marking, setMarking] = useState<Set<string>>(new Set());

  const fetch = useCallback(async () => {
    setLoading(true);
    const result = await getNotifications();
    if (result.error) {
      setError(result.error);
    } else {
      setNotifications(result.data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = useMemo(() => {
    if (!notifications) return [];
    return filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  }, [notifications, filter]);

  const grouped = useMemo(() => {
    const groups: Record<string, Notification[]> = {};
    for (const n of filtered) {
      const g = getDateGroup(n.created_at);
      if (!groups[g]) groups[g] = [];
      groups[g].push(n);
    }
    return groups;
  }, [filtered]);

  const order = ["Today", "Yesterday", "Earlier"];

  const handleMarkRead = async (id: string) => {
    setMarking((prev) => new Set(prev).add(id));
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev
        ? prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        : null,
    );
    setMarking((prev) => { const next = new Set(prev); next.delete(id); return next; });
  };

  const handleDelete = async (id: string) => {
    setDeleting((prev) => new Set(prev).add(id));
    await deleteNotification(id);
    setNotifications((prev) => (prev ? prev.filter((n) => n.id !== id) : null));
    setDeleting((prev) => { const next = new Set(prev); next.delete(id); return next; });
  };

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-white">Notifications</h1><p className="mt-1 text-sm text-surface-400">Stay updated on your orders and account activity.</p></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 rounded-xl border border-surface-800 p-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-96" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-white">Notifications</h1><p className="mt-1 text-sm text-surface-400">Stay updated on your orders and account activity.</p></div>
        <Alert variant="error"><p>Failed to load notifications. Please try again.</p></Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="mt-1 text-sm text-surface-400">Stay updated on your orders and account activity.</p>
        </div>
        {unreadCount > 0 && (
          <span className="rounded-full bg-brand-600/20 px-3 py-1 text-sm font-medium text-brand-400">
            {unreadCount} unread
          </span>
        )}
      </div>

      <div className="flex gap-1" role="tablist">
        <button
          role="tab"
          aria-selected={filter === "all"}
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-lg px-4 py-2 text-sm transition-colors",
            filter === "all" ? "bg-brand-600 text-white" : "text-surface-400 hover:bg-surface-800",
          )}
        >
          All
        </button>
        <button
          role="tab"
          aria-selected={filter === "unread"}
          onClick={() => setFilter("unread")}
          className={cn(
            "rounded-lg px-4 py-2 text-sm transition-colors",
            filter === "unread" ? "bg-brand-600 text-white" : "text-surface-400 hover:bg-surface-800",
          )}
        >
          Unread
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={filter === "unread" ? "No unread notifications" : "No notifications"}
          description="You'll be notified about order updates, payment confirmations, and account activity here."
        />
      ) : (
        <>
          {order.map((group) => {
            const items = grouped[group];
            if (!items) return null;
            return (
              <section key={group} aria-label={group}>
                <h3 className="mb-3 text-sm font-medium text-surface-500">{group}</h3>
                <div className="space-y-2">
                  {items.map((n) => {
                    const config = (TYPE_CONFIG[n.type] || TYPE_CONFIG.system)!;
                    const Icon = config.icon;
                    const isDeleting = deleting.has(n.id);
                    const isMarking = marking.has(n.id);

                    return (
                      <div
                        key={n.id}
                        className={cn(
                          "group flex items-start gap-4 rounded-xl border p-4 transition-all",
                          n.read
                            ? "border-surface-800 bg-surface-950"
                            : "border-brand-500/20 bg-brand-500/5",
                        )}
                      >
                        <div className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                          n.read ? "bg-surface-800 text-surface-400" : "bg-brand-600/20 text-brand-400",
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className={cn(
                              "text-sm",
                              n.read ? "text-surface-300" : "font-medium text-white",
                            )}>
                              {n.title}
                            </p>
                            {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                          </div>
                          <p className="mt-1 text-xs text-surface-500">{n.message}</p>
                          <p className="mt-1 text-xs text-surface-600">
                            {new Date(n.created_at).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!n.read && (
                            <button
                              onClick={() => handleMarkRead(n.id)}
                              disabled={isMarking}
                              className="rounded-md p-2 text-surface-500 hover:bg-surface-800 hover:text-brand-400 disabled:opacity-50"
                              aria-label="Mark as read"
                            >
                              {isMarking ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCheck className="h-4 w-4" />}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(n.id)}
                            disabled={isDeleting}
                            className="rounded-md p-2 text-surface-500 hover:bg-surface-800 hover:text-error disabled:opacity-50"
                            aria-label="Delete notification"
                          >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}
