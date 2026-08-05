"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type AssignedWallet = {
  id: string;
  address: string;
  network: string;
  label: string;
};

export function useAssignedWallet() {
  const [wallet, setWallet] = useState<AssignedWallet | null>(null);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setWallet(null);
      setReady(true);
      return;
    }
    const { data } = await supabase
      .from("wallets")
      .select("id, address, network, label")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    setWallet(
      data
        ? {
            id: data.id as string,
            address: data.address as string,
            network: ((data.network as string) ?? "") as string,
            label: ((data.label as string) ?? "Wallet") as string,
          }
        : null,
    );
    setReady(true);
  }, []);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    void load();

    const supabase = createClient();
    const channel = supabase
      .channel("assigned-wallet-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wallet_validations" },
        () => {
          void load();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wallets" },
        () => {
          void load();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [load]);

  return { wallet, ready, reload: load };
}
