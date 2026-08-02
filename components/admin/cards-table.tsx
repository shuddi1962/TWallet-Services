"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Search, Power, Archive, Copy, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { activateCardProduct, archiveCardProduct, duplicateCardProduct } from "@/lib/admin/actions";
import { toast } from "sonner";
import { useRealtime } from "@/lib/hooks/use-realtime";

interface CardProduct {
  id: string;
  name: string;
  type: string;
  price?: number;
  price_usdc?: number | string | null;
  currency?: string;
  active?: boolean;
  archived?: boolean;
  created_at: string;
}

type CardPayload = {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new?: CardProduct | null;
  old?: CardProduct | null;
};

export function AdminCardsTable({ products: initial }: { products: CardProduct[] }) {
  const router = useRouter();
  const [products, setProducts] = useState<CardProduct[]>(initial);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    loaded.current = true;
    setProducts(initial);
  }, [initial]);

  const handleRealtime = useCallback((payload: CardPayload) => {
    if (payload.eventType === "DELETE") {
      setProducts((prev) => prev.filter((p) => p.id !== payload.old?.id));
      return;
    }
    const incoming = payload.new;
    if (!incoming) return;

    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === incoming.id);
      if (idx === -1) return [incoming, ...prev];
      return prev.map((p, i) => (i === idx ? { ...p, ...incoming } : p));
    });
  }, []);

  useRealtime<CardPayload>("admin-cards-live", "*", "card_products", handleRealtime);

  const run = async (id: string, label: string, fn: () => Promise<{ success: boolean; error?: string }>) => {
    setBusy(id);
    const res = await fn();
    setBusy(null);
    if (res.success) {
      toast.success(label);
      router.refresh();
    } else {
      toast.error(res.error);
    }
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="flex items-center gap-2 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm max-w-sm mb-4">
        <Search className="w-4 h-4 text-body" />
        <input
          type="text"
          placeholder="Search cards..."
          className="bg-transparent border-none outline-none w-full text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search card products"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <CreditCard className="w-12 h-12 text-body mx-auto mb-3" />
          <p className="text-body">No card products yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-body bg-surface-50 border-b border-surface-200">
                  <th scope="col" className="py-3 px-4 font-medium">Name</th>
                  <th scope="col" className="py-3 px-4 font-medium">Type</th>
                  <th scope="col" className="py-3 px-4 font-medium">Price</th>
                  <th scope="col" className="py-3 px-4 font-medium">Status</th>
                  <th scope="col" className="py-3 px-4 font-medium">Created</th>
                  <th scope="col" className="py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const price = product.price_usdc ?? product.price;
                  const active = product.active ?? true;
                  return (
                    <tr key={product.id} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-heading">{product.name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {product.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-body">{price != null ? `${Number(price)} ${product.currency ?? "USDC"}` : "—"}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.archived ? "bg-surface-200 text-body" : active ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                        }`}>
                          {product.archived ? "archived" : active ? "active" : "inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-body text-xs">
                        {formatDistanceToNow(new Date(product.created_at), { addSuffix: true })}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => run(product.id, product.archived || !active ? "Card activated" : "Card archived", () =>
                              product.archived || !active ? activateCardProduct(product.id) : archiveCardProduct(product.id),
                            )}
                            disabled={busy === product.id}
                            className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                              product.archived || !active ? "text-success hover:bg-success/10" : "text-warning hover:bg-warning/10"
                            }`}
                            aria-label={product.archived || !active ? "Activate card product" : "Archive card product"}
                            title={product.archived || !active ? "Activate" : "Archive"}
                          >
                            {busy === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => run(product.id, "Card duplicated", () => duplicateCardProduct(product.id))}
                            disabled={busy === product.id}
                            className="p-1.5 rounded-lg hover:bg-surface-100 text-body transition-colors disabled:opacity-50"
                            aria-label="Duplicate card product"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          {product.archived && (
                            <span className="p-1.5 text-body flex items-center gap-1 text-xs" aria-hidden="true">
                              <Archive className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}