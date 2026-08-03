"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Search, Power, Copy, Loader2, Trash2, Plus, X, Pencil } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  activateCardProduct,
  archiveCardProduct,
  duplicateCardProduct,
  createCardProduct,
  updateCardProduct,
  deleteCardProduct,
} from "@/lib/admin/actions";
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

const emptyForm = { name: "", type: "virtual", price: "", currency: "USD", description: "" };

export function AdminCardsTable({ products: initial }: { products: CardProduct[] }) {
  const router = useRouter();
  const [products, setProducts] = useState<CardProduct[]>(initial);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const loaded = useRef(false);

  // Add card modal
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Edit card modal
  const [editing, setEditing] = useState<CardProduct | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editActive, setEditActive] = useState(true);
  const [editBusy, setEditBusy] = useState(false);

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

  const handleAdd = async () => {
    if (!form.name.trim()) return toast.error("Card name is required");
    const price = Number(form.price);
    if (!price || price <= 0) return toast.error("Price must be greater than 0");
    setSaving(true);
    const res = await createCardProduct({
      name: form.name,
      type: form.type,
      price,
      currency: form.currency || "USD",
      description: form.description.trim() || undefined,
    });
    setSaving(false);
    if (res.success) {
      toast.success("Card added");
      setAddOpen(false);
      setForm(emptyForm);
      router.refresh();
    } else {
      toast.error(res.error);
    }
  };

  const openEdit = (product: CardProduct) => {
    const price = product.price_usdc ?? product.price;
    setEditing(product);
    setEditForm({
      name: product.name,
      type: product.type === "physical" ? "physical" : "virtual",
      price: price != null ? String(price) : "",
      currency: product.currency ?? "USD",
      description: "",
    });
    setEditActive(product.active ?? true);
  };

  const handleEdit = async () => {
    if (!editing) return;
    if (!editForm.name.trim()) return toast.error("Card name is required");
    const price = Number(editForm.price);
    if (!price || price <= 0) return toast.error("Price must be greater than 0");
    setEditBusy(true);
    const res = await updateCardProduct(editing.id, {
      name: editForm.name,
      type: editForm.type,
      price,
      currency: editForm.currency || "USD",
      active: editActive,
    });
    setEditBusy(false);
    if (res.success) {
      toast.success("Card updated");
      setEditing(null);
      router.refresh();
    } else {
      toast.error(res.error);
    }
  };

  const handleDelete = (product: CardProduct) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    void run(product.id, "Card deleted", () => deleteCardProduct(product.id));
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm max-w-sm">
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
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Card
        </button>
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
                            onClick={() => openEdit(product)}
                            disabled={busy === product.id}
                            className="p-1.5 rounded-lg hover:bg-surface-100 text-body transition-colors disabled:opacity-50"
                            aria-label="Edit card product"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
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
                          <button
                            onClick={() => handleDelete(product)}
                            disabled={busy === product.id}
                            className="p-1.5 rounded-lg hover:bg-error/10 text-error transition-colors disabled:opacity-50"
                            aria-label="Delete card product"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {addOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setAddOpen(false)} aria-hidden="true" />
          <div
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-surface-200 bg-white shadow-xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Add card product"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-200 bg-white px-6 py-4">
              <h2 className="text-lg font-semibold text-heading">Add Card</h2>
              <button onClick={() => setAddOpen(false)} className="rounded-lg p-2 text-body hover:text-heading" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <label className="block">
                <span className="text-xs text-body">Card name *</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Virtual Platinum"
                  className="w-full mt-1 px-3 py-2 border border-surface-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </label>
              <label className="block">
                <span className="text-xs text-body">Type *</span>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-surface-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="virtual">Virtual</option>
                  <option value="physical">Physical</option>
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-body">Price (USD) *</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="29.99"
                    className="w-full mt-1 px-3 py-2 border border-surface-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-body">Currency</span>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-surface-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="USD">USD</option>
                    <option value="USDC">USDC</option>
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="text-xs text-body">Description</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Short description shown on the public catalog"
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border border-surface-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </label>
              <button
                onClick={() => void handleAdd()}
                disabled={saving}
                className="w-full py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? "Adding..." : "Add Card"}
              </button>
            </div>
          </div>
        </>
      )}

      {editing && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setEditing(null)} aria-hidden="true" />
          <div
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-surface-200 bg-white shadow-xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label={`Edit ${editing.name}`}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-200 bg-white px-6 py-4">
              <h2 className="text-lg font-semibold text-heading">Edit Card</h2>
              <button onClick={() => setEditing(null)} className="rounded-lg p-2 text-body hover:text-heading" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <label className="block">
                <span className="text-xs text-body">Card name *</span>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-surface-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </label>
              <label className="block">
                <span className="text-xs text-body">Type *</span>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-surface-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="virtual">Virtual</option>
                  <option value="physical">Physical</option>
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs text-body">Price (USD) *</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={editForm.price}
                    onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-surface-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-body">Currency</span>
                  <select
                    value={editForm.currency}
                    onChange={(e) => setEditForm((f) => ({ ...f, currency: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-surface-200 rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="USD">USD</option>
                    <option value="USDC">USDC</option>
                  </select>
                </label>
              </div>
              <label className="flex items-center gap-2 text-sm text-heading cursor-pointer">
                <input
                  type="checkbox"
                  checked={editActive}
                  onChange={(e) => setEditActive(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                Active — visible to users in the order catalog
              </label>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => void handleEdit()}
                  disabled={editBusy}
                  className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {editBusy ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded-lg border border-surface-200 text-sm text-body hover:bg-surface-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
