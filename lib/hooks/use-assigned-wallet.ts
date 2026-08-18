"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createClient } from "@/lib/supabase/client";

export type AssignedWallet = {
  id: string;
  address: string;
  network: string;
  label: string;
};

type WalletState = { wallet: AssignedWallet | null; ready: boolean };

// Module-level singleton store.
//
// IMPORTANT: `createBrowserClient` (@supabase/ssr) returns a SINGLE cached
// client instance in the browser. Opening a realtime channel with the same
// topic twice on that client throws "cannot add postgres_changes callbacks …
// after subscribe()", which crashes React (500 page) whenever two components
// on one screen use this hook (e.g. dashboard header ConnectButton + card
// catalog). Keeping ONE subscription at module scope and broadcasting the
// state to every consumer avoids that entirely.

let state: WalletState = { wallet: null, ready: false };
let started = false;
const listeners = new Set<() => void>();

function setState(patch: Partial<WalletState>) {
  state = { ...state, ...patch };
  for (const listener of listeners) listener();
}

async function refresh() {
  const supabase = createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setState({ wallet: null, ready: true });
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

    setState({
      wallet: data
        ? {
            id: data.id as string,
            address: data.address as string,
            network: ((data.network as string) ?? "") as string,
            label: ((data.label as string) ?? "Wallet") as string,
          }
        : null,
      ready: true,
    });
  } catch {
    // Auth/session hiccups must never take down the page — degrade to
    // "no wallet, ready" and let the caller prompt the user to connect.
    setState({ wallet: null, ready: true });
  }
}

function ensureStarted() {
  if (started) return;
  started = true;
  void refresh();

  const supabase = createClient();
  const channel = supabase
    .channel("assigned-wallet-live")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "wallet_validations" },
      () => {
        void refresh();
      },
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "wallets" },
      () => {
        void refresh();
      },
    )
    .subscribe();
  // The subscription intentionally lives for the app session — every hook
  // consumer shares it, so it must never be torn down by a single unmount.
  void channel;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function useAssignedWallet() {
  // getServerSnapshot: during SSR/prerender the store always starts in its
  // initial state (no wallet, not ready) — the real query only runs client-side.
  const { wallet, ready } = useSyncExternalStore(subscribe, () => state, () => state);
  useEffect(() => {
    ensureStarted();
  }, []);

  return { wallet, ready, reload: refresh };
}
