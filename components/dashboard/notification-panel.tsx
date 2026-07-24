"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Bell,
  ShoppingCart,
  Wallet,
  CreditCard,
  Truck,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  CheckCheck,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface Notification {
  id: string;
  type: string;
  title: string;
  message?: string | null;
  read: boolean;
  created_at: string;
}

interface NotificationPanelProps {
  notifications: Notification[];
}

const NOTIFICATION_ICONS: Record<string, typeof Bell> = {
  new_order: ShoppingCart,
  payment_confirmed: Wallet,
  payment_failed: AlertTriangle,
  shipping_update: Truck,
  support_reply: MessageSquare,
  card_update: CreditCard,
  system: Bell,
  promotion: Bell,
};

const NOTIFICATION_COLORS: Record<string, string> = {
  new_order: "text-brand-400 bg-brand-500/10 ring-brand-500/20",
  payment_confirmed: "text-success bg-success/10 ring-success/20",
  payment_failed: "text-error bg-error/10 ring-error/20",
  shipping_update: "text-info bg-info/10 ring-info/20",
  support_reply: "text-accent-400 bg-accent-500/10 ring-accent-500/20",
  card_update: "text-brand-400 bg-brand-500/10 ring-brand-500/20",
  system: "text-warning bg-warning/10 ring-warning/20",
  promotion: "text-accent-400 bg-accent-500/10 ring-accent-500/20",
};

export function NotificationPanel({ notifications }: NotificationPanelProps) {
  const recent = notifications.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Notifications</CardTitle>
          {notifications.length > 5 && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/notifications">
                View All
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCheck className="mb-2 h-8 w-8 text-surface-500" aria-hidden="true" />
            <p className="text-sm font-medium text-surface-400">All caught up!</p>
            <p className="mt-1 text-xs text-surface-500">No new notifications.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {recent.map((notification, index) => {
              const Icon = NOTIFICATION_ICONS[notification.type] ?? Bell;
              const colorClass = NOTIFICATION_COLORS[notification.type] ?? "text-surface-400 bg-surface-800 ring-white/10";

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className="group relative flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-800/50"
                >
                  {/* Unread dot */}
                  {!notification.read && (
                    <span
                      className="absolute left-1 top-3 h-1.5 w-1.5 rounded-full bg-brand-400"
                      aria-label="Unread notification"
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1",
                      colorClass,
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-sm leading-snug",
                        notification.read ? "text-surface-400" : "font-medium text-surface-50",
                      )}
                    >
                      {notification.title}
                    </p>
                    {notification.message && (
                      <p className="mt-0.5 text-xs text-surface-500 line-clamp-1">
                        {notification.message}
                      </p>
                    )}
                    <p className="mt-0.5 text-[11px] text-surface-500">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* View All link at bottom when empty */}

        <div className="mt-4 text-center">
          <Button variant="link" size="sm" asChild>
            <Link href="/dashboard/notifications">
              View notification history
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
