"use client";

import { useState, useMemo, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FilterBar } from "@/components/admin/filter-bar";
import { Badge } from "@/components/ui/badge";
import type { WalletRecord } from "@/lib/admin/types";

export function AdminWalletsTable({ wallets }: { wallets: WalletRecord[]; count?: number }) {
  const [search, setSearch] = useState("");
  const [networkFilter, setNetworkFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const pageSize = 15;

  const networkOptions = useMemo(() => {
    const networks = Array.from(new Set(wallets.map((w) => w.network).filter(Boolean)));
    return [
      { value: "all", label: "All Networks" },
      ...networks.map((n) => ({ value: n, label: n })),
    ];
  }, [wallets]);

  const filtered = useMemo(() => {
    return wallets.filter((w) => {
      if (search && !w.address.toLowerCase().includes(search.toLowerCase())) return false;
      if (networkFilter !== "all" && w.network !== networkFilter) return false;
      if (statusFilter === "deleted" && !w.deleted_at) return false;
      if (statusFilter === "active" && w.deleted_at) return false;
      return true;
    });
  }, [wallets, search, networkFilter, statusFilter]);

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
    setStatusFilter("all");
    setPage(0);
  }, []);

  const columns: Column<WalletRecord>[] = [
    {
      key: "address",
      label: "Address",
      render: (row) => (
        <span className="font-mono text-xs text-brand-400">
          {row.address.slice(0, 6)}...{row.address.slice(-4)}
        </span>
      ),
    },
    {
      key: "network",
      label: "Network",
      render: (row) => (
        <Badge variant="outline" className="text-xs border-surface-600 text-surface-300">
          {row.network}
        </Badge>
      ),
    },
    {
      key: "label",
      label: "Label",
      render: (row) => (
        <span className="text-sm text-surface-300">{row.label ?? "\u2014"}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={row.deleted_at ? "error" : "success"} className="text-xs">
          {row.deleted_at ? "Deleted" : "Active"}
        </Badge>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-surface-400">
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
            onClick={() =>
              window.open(
                `https://${row.network}.com/address/${row.address}`,
                "_blank",
                "noopener,noreferrer"
              )
            }
            className="p-1.5 rounded-lg hover:bg-surface-800 text-surface-400 hover:text-surface-200 transition-colors"
            aria-label={`View address on ${row.network} explorer`}
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
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
          {
            key: "status",
            label: "Status",
            options: [
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "deleted", label: "Deleted" },
            ],
            value: statusFilter,
            onChange: (v: string) => { setStatusFilter(v); setPage(0); },
          },
        ]}
        onReset={handleReset}
      />
      <DataTable
        columns={columns}
        data={paginated}
        total={filtered.length}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        keyExtractor={(row) => row.id}
        emptyMessage="No wallet addresses found"
      />
    </div>
  );
}
