"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function DashboardRealtime() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;

    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase
        .channel(`dash-live-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "card_orders",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const row = payload.new as { status?: string; order_number?: string };
            if (row?.status) {
              toast.info(`Order ${row.order_number ?? ""} → ${row.status}`, {
                description: "Live update",
              });
              router.refresh();
            }
          },
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const n = payload.new as { title?: string; message?: string };
            toast(n.title ?? "Notification", { description: n.message });
            router.refresh();
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "payment_transactions",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const p = payload.new as { status?: string; amount?: number };
            if (p?.status === "confirmed") {
              toast.success("Payment confirmed", {
                description: p.amount != null ? `${p.amount} USDC verified on-chain` : undefined,
              });
              router.refresh();
            }
          },
        )
        .subscribe();
    })();

    return () => {
      if (channel) void supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
