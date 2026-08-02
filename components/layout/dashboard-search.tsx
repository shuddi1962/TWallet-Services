"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, Loader2, X, CreditCard, ShoppingCart, ArrowLeftRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";

type SearchHit = {
  kind: "order" | "card" | "transaction";
  id: string;
  title: string;
  subtitle: string;
  href: string;
};

interface OrderRow {
  id: string;
  order_number: string;
  amount_usdc: number;
  status: string;
  tx_hash: string | null;
  card_products?: { name?: string } | null;
}

interface CardRow {
  id: string;
  label: string;
  pan_last4: string;
  status: string;
  card_products?: { name?: string } | null;
}

interface TxRow {
  id: string;
  order_id: string | null;
  tx_hash: string | null;
  status: string;
  card_id?: string | null;
}

export function DashboardSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "/") {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA") {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Debounced search across orders, cards and transactions (my rows only via RLS)
  useEffect(() => {
    if (!query.trim()) {
      setHits([]);
      return;
    }
    const q = query.trim().toLowerCase();
    let cancelled = false;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user || cancelled) return;

        const results: SearchHit[] = [];

        const [ordersRes, cardsRes, txsRes] = await Promise.all([
          supabase
            .from("card_orders")
            .select("id, order_number, status, tx_hash, card_products(name)")
            .or(`order_number.ilike.%${q}%,tx_hash.ilike.%${q}%`)
            .order("created_at", { ascending: false })
            .limit(6),
          supabase
            .from("issued_cards")
            .select("id, label, pan_last4, status, card_products(name)")
            .or(`label.ilike.%${q}%,pan_last4.ilike.%${q}%`)
            .order("created_at", { ascending: false })
            .limit(6),
          supabase
            .from("payment_transactions")
            .select("id, order_id, tx_hash, status")
            .or(`tx_hash.ilike.%${q}%`)
            .order("created_at", { ascending: false })
            .limit(6),
        ]);

        if (cancelled) return;

        for (const o of (ordersRes.data ?? []) as OrderRow[]) {
          results.push({
            kind: "order",
            id: `${o.id}`,
            title: o.order_number,
            subtitle: `${o.card_products?.name ?? "Card order"} · ${o.status}`,
            href: `/dashboard/orders/${o.id}`,
          });
        }
        for (const c of (cardsRes.data ?? []) as CardRow[]) {
          results.push({
            kind: "card",
            id: c.id,
            title: c.label || "Card",
            subtitle: `Card ···· ${c.pan_last4} · ${c.status}`,
            href: `/dashboard/cards`,
          });
        }
        for (const t of (txsRes.data ?? []) as TxRow[]) {
          if (!t.tx_hash) continue;
          results.push({
            kind: "transaction",
            id: t.id,
            title: `${t.tx_hash.slice(0, 10)}…${t.tx_hash.slice(-6)}`,
            subtitle: `${t.status}${t.order_id ? " · attached to order" : ""}`,
            href: t.order_id ? `/dashboard/orders/${t.order_id}` : "/dashboard/transactions",
          });
        }

        setHits(results.slice(0, 12));
      } catch {
        setHits([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 220);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const clear = () => {
    setQuery("");
    setHits([]);
    setOpen(false);
  };

  return (
    <div ref={boxRef} className="relative hidden min-w-[220px] max-w-[340px] flex-1 md:block">
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 transition focus-within:border-brand-400 focus-within:bg-white focus-within:ring-1 focus-within:ring-brand-500/30">
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search orders, cards…"
          aria-label="Search orders, cards and transactions"
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden="true" />
        ) : query ? (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="shrink-0 rounded-md p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {loading && hits.length === 0 ? (
            <div className="flex items-center gap-3 px-4 py-6 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Searching…
            </div>
          ) : hits.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-slate-400">
              {query.trim().length < 2
                ? "Keep typing to search your orders, cards and payments."
                : `No results for “${query.trim()}”`}
            </div>
          ) : (
            <ul className="max-h-[360px] overflow-y-auto py-1">
              {hits.map((hit) => {
                const Icon =
                  hit.kind === "order"
                    ? ShoppingCart
                    : hit.kind === "card"
                      ? CreditCard
                      : ArrowLeftRight;
                return (
                  <li key={`${hit.kind}-${hit.id}`}>
                    <Link
                      href={hit.href}
                      onClick={clear}
                      className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-slate-50"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className={cn("block truncate text-sm font-medium text-slate-900")}>
                          {hit.title}
                        </span>
                        <span className="block truncate text-xs text-slate-400">{hit.subtitle}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}