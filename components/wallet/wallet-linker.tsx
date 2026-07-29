"use client";

import { useEffect, useRef } from "react";
import { useAccount, useDisconnect, useChainId } from "wagmi";
import { createClient } from "@/lib/supabase/client";

const NETWORK_BY_CHAIN: Record<number, string> = {
  1: "ethereum",
  11155111: "sepolia",
  137: "polygon",
  8453: "base",
  42161: "arbitrum",
  10: "optimism",
};

export function WalletLinker() {
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  const lastSaved = useRef<string | null>(null);

  useEffect(() => {
    supabaseRef.current = createClient();
  }, []);

  useEffect(() => {
    const supabase = supabaseRef.current;
    if (!supabase) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string) => {
      if (event === "SIGNED_OUT" && isConnected) {
        disconnect();
      }
    });
    return () => subscription.unsubscribe();
  }, [isConnected, disconnect]);

  useEffect(() => {
    if (!address || !isConnected) return;
    const key = `${address.toLowerCase()}:${chainId}`;
    if (lastSaved.current === key) return;

    const supabase = supabaseRef.current;
    if (!supabase) return;

    const saveWallet = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const network = NETWORK_BY_CHAIN[chainId] ?? "ethereum";
      const label = connector?.name ?? "Wallet";

      const { data: existing } = await supabase
        .from("wallets")
        .select("id")
        .eq("user_id", user.id)
        .eq("address", address)
        .eq("network_id", chainId)
        .is("deleted_at", null)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("wallets")
          .update({ last_used_at: new Date().toISOString(), label, network })
          .eq("id", existing.id);
      } else {
        await supabase.from("wallets").insert({
          user_id: user.id,
          address,
          network,
          network_id: chainId,
          label,
          signature: "wc-connect",
          message: `Connected via ${label} at ${new Date().toISOString()}`,
          is_default: true,
          connected_at: new Date().toISOString(),
        });
      }
      lastSaved.current = key;
    };

    void saveWallet();
  }, [address, isConnected, connector, chainId]);

  return null;
}
