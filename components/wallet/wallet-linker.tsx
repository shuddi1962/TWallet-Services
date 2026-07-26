"use client";

import { useEffect, useRef } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { createClient } from "@/lib/supabase/client";

export function WalletLinker() {
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

  useEffect(() => {
    supabaseRef.current = createClient();
  }, []);

  useEffect(() => {
    const supabase = supabaseRef.current;
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string) => {
      if (event === "SIGNED_OUT" && isConnected) {
        disconnect();
      }
    });
    return () => subscription.unsubscribe();
  }, [isConnected, disconnect]);

  useEffect(() => {
    if (!address || !isConnected || !connector) return;
    const supabase = supabaseRef.current;
    if (!supabase) return;
    const saveWallet = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: existing } = await supabase
        .from("wallets")
        .select("id")
        .eq("address", address)
        .maybeSingle();
      if (!existing) {
        await supabase.from("wallets").insert({
          user_id: user.id,
          address,
          network: connector.name ?? "unknown",
          network_id: 1,
          label: connector.name ?? "Wallet",
          signature: "",
          message: "",
          is_default: true,
        });
      }
    };
    saveWallet();
  }, [address, isConnected, connector]);

  return null;
}
