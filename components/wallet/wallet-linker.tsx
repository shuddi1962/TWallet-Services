"use client";

import { useEffect, useRef } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { createClient } from "@/lib/supabase/client";

// NOTE: this component deliberately does NOT persist web3 connections to the
// `wallets` table. Web3 connect is "Temporarily unavailable" by product
// decision (see connect-dialog) — the only path that creates a connected
// wallet is the manual validation flow + admin approval. An automatic
// on-mount save would silently "assign" a wallet to any user whose browser
// had a previously-authorized injected wallet. The remaining job here is
// cleanup: when the app session ends, drop the wagmi connection too.

export function WalletLinker() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

  useEffect(() => {
    supabaseRef.current = createClient();
  }, []);

  // Web3 connect is unavailable by product decision — a connection restored
  // from the wagmi store (e.g. a previously-authorized browser wallet on the
  // same machine) is never a legitimate "connected" state here, so drop it
  // the moment it appears. Nothing ever re-connects afterward.
  useEffect(() => {
    if (isConnected) {
      void disconnect();
    }
  }, [isConnected, disconnect]);

  useEffect(() => {
    const supabase = supabaseRef.current;
    if (!supabase) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: string) => {
      if (event === "SIGNED_OUT" && isConnected) {
        disconnect();
      }
    });
    return () => subscription.unsubscribe();
  }, [isConnected, disconnect]);

  return null;
}
