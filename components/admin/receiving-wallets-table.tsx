"use client";

import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Plus, Power, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FilterBar } from "@/components/admin/filter-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRealtime } from "@/lib/hooks/use-realtime";
import {
  createAdminReceivingWallet,
  getSupportedNetworks,
  toggleReceivingWallet,
  type ActionResult,
  type ReceivingWalletRecord,
} from "@/lib/admin/actions";

type WalletPayload = {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new?: ReceivingWalletRecord | null;
  old?: ReceivingWalletRecord | null;
};

export function AdminReceivingWalletsTable({ wallets }: { wallets: ReceivingWalletRecord[]; count?: number }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [networkFilter, setNetworkFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [records, setRecords] = useState<ReceivingWalletRecord[]>(wallets);
  const [busy, setBusy] = useState<string | null>(null);

  // Add wallet modal
  const [addOpen, setAddOpen] = useState(false);
  const [networks, setNetworks] = useState<{ id: string; name: string; chain_id: number }[]>([]);
  const [form, setForm] = useState({ network_id: "", address: "", label: "" });
  const [saving, setSaving] = useState(false);

  const pageSize = 15;
  const loaded = useRef(false);

  useEffect(() => {
    loaded.current = true;
    setRecords(wallets);
  }, [wallets]);

  useEffect(() => {
    if (addOpen && networks.length === 0) {
      getSupportedNetworks().then((res) => {
        setNetworks(res);
        if (res.length > 0) setForm((f) => ({ ...f, network_id: f.network_id || (res[0]?.id ?? "") }));
      });
    }
  }, [addOpen, networks.length]);

  const handleRealtime = useCallback((payload: WalletPayload) => {
    if (payload.eventType === "DELETE") {
      setRecords((prev) => prev.filter((w) => w.id !== payload.old?.id));
      return;
    }
    const incoming = payload.new;
    if (!incoming) return;

    setRecords((prev) => {
      const idx = prev.findIndex((w) => w.id === incoming.id);
      if (idx === -1) return [incoming, ...prev];
      return prev.map((w, i) => (i === idx ? { ...w, ...incoming } : w));
    });
  }, []);

  useRealtime<WalletPayload>("admin-wallets-live", "*", "supported_wallet_addresses", handleRealtime);

  const networkOptions = useMemo(() => {
    const networksSet = Array.from(new Set(records.map((w) => w.network_name).filter(Boolean)));
    return [
      { value: "all", label: "All Networks" },
      ...networksSet.map((n) => ({ value: n, label: n })),
    ];
  }, [records]);

  const filtered = useMemo(() => {
    return records.filter((w) => {
      if (search && !w.address.toLowerCase().includes(search.toLowerCase())) return false;
      if (networkFilter !== "all" && w.network_name !== networkFilter) return false;
      return true;
    });
  }, [records, search, networkFilter]);

  const paginated = useMemo(() => {
    const start = page * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleReset = useCallback(() => {
    setSearch("");
    setNetworkFilter("all");
    setPage(0);
  }, []);

  const handleToggle = async (row: ReceivingWalletRecord) => {
    setBusy(row.id);
    const res: ActionResult = await toggleReceivingWallet(row.id, !row.active);
    setBusy(null);
    if (res.success) {
      toast.success(row.active ? "Wallet deactivated" : "Wallet activated");
      router.refresh();
    } else {
      toast.error(res.error);
    }
  };

  const handleAdd = async () => {
    if (!form.network_id) return toast.error("Select a network");
    if (!form.address.trim()) return toast.error("Address is required");
    setSaving(true);
    const res: ActionResult = await createAdminReceivingWallet({
      network_id: form.network_id,
      address: form.address.trim(),
      label: form.label.trim() || undefined,
    });
    setSaving(false);
    if (res.success) {
      toast.success("Wallet added");
      setAddOpen(false);
      setForm({ network_id: networks[0]?.id ?? "", address: "", label: "" });
      router.refresh();
    } else {
      toast.error(res.error);
    }
  };

  const columns: Column<ReceivingWalletRecord>[] = [
    {
      key: "address",
      label: "Address",
      render: (row) => (
        <span className="font-mono text-xs text-brand-600">
          {row.address.slice(0, 6)}...{row.address.slice(-4)}
        </span>
      ),
    },
    {
      key: "network_name",
      label: "Network",
      render: (row) => (
        <Badge variant="outline" className="text-xs border-slate-300 text-slate-600">
          {row.network_name}
        </Badge>
      ),
    },
    {
      key: "label",
      label: "Label",
      render: (row) => (
        <span className="text-sm text-slate-600">{row.label ?? "\u2014"}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={row.active ? "success" : "error"} className="text-xs">
          {row.active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "total_received",
      label: "Received",
      render: (row) => (
        <span className="text-xs text-slate-600">${Number(row.total_received).toFixed(2)}</span>
      ),
    },
    {
      key: "created_at",
      label: "Added",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-slate-500">
          {formatDistanceToNow(new Date(row.created_at), { addSuffix: true })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleToggle(row)}
            disabled={busy === row.id}
            className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
              row.active ? "text-warning hover:bg-warning/10" : "text-success hover:bg-success/10"
            }`}
            aria-label={row.active ? "Deactivate wallet" : "Activate wallet"}
            title={row.active ? "Deactivate" : "Activate"}
          >
            {busy === row.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
          </button>
          <button
            onClick={() =>
              window.open(
                `https://${row.network_name.toLowerCase()}.com/address/${row.address}`,
                "_blank",
                "noopener,noreferrer"
              )
            }
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            aria-label={`View address on ${row.network_name} explorer`}
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <FilterBar
          search={search}
          onSearchChange={handleSearch}
          searchPlaceholder="Search by address..."
          filters={[
            {
              key: "network",
              label: "Network",
              options: networkOptions,
              value: networkFilter,
              onChange: (v: string) => { setNetworkFilter(v); setPage(0); },
            },
          ]}
          onReset={handleReset}
        />
        <Button size="sm" className="shrink-0" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Wallet
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={paginated}
        total={filtered.length}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        keyExtractor={(row) => row.id}
        emptyMessage="No receiving wallets configured"
      />

      {addOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setAddOpen(false)} aria-hidden="true" />
          <div
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-slate-200 bg-white shadow-xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Add receiving wallet"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Add Wallet</h2>
              <button onClick={() => setAddOpen(false)} className="rounded-lg p-2 text-slate-400 hover:text-slate-800" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <label className="block">
                <span className="text-xs text-slate-400">Network</span>
                <select
                  value={form.network_id}
                  onChange={(e) => setForm((f) => ({ ...f, network_id: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {networks.map((n) => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-slate-400">Wallet address</span>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="0x..."
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </label>
              <label className="block">
                <span className="text-xs text-slate-400">Label (optional)</span>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  placeholder="e.g. Primary USDC wallet"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </label>
              <p className="text-xs text-slate-400">
                Customers send crypto to this address. It becomes available immediately for new orders and card funding.
              </p>
              <button
                onClick={handleAdd}
                disabled={saving}
                className="w-full py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? "Adding..." : "Add Wallet"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}