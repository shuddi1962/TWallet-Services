"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function AdminRealtime() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "card_orders" },
        (payload: { new: Record<string, unknown> }) => {
          const o = payload.new as { order_number?: string };
          toast.info("New order", { description: o.order_number ?? "Incoming order" });
          router.refresh();
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "payment_transactions" },
        (payload: { new: Record<string, unknown> }) => {
          const p = payload.new as { status?: string; amount?: number };
          if (p.status === "confirmed") {
            toast.success("Payment confirmed", {
              description: p.amount != null ? `${p.amount} USDC` : undefined,
            });
            router.refresh();
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "support_tickets" },
        () => {
          toast.warning("New support ticket");
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
