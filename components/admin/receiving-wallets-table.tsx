"use client";

import { useMemo, useCallback, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Plus } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { FilterBar } from "@/components/admin/filter-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ReceivingWalletRecord } from "@/lib/admin/actions";

export function AdminReceivingWalletsTable({ wallets }: { wallets: ReceivingWalletRecord[]; count?: number }) {
  const [search, setSearch] = useState("");
  const [networkFilter, setNetworkFilter] = useState("all");
  const [page, setPage] = useState(0);
  const pageSize = 15;

  const networkOptions = useMemo(() => {
    const networks = Array.from(new Set(wallets.map((w) => w.network_name).filter(Boolean)));
    return [
      { value: "all", label: "All Networks" },
      ...networks.map((n) => ({ value: n, label: n })),
    ];
  }, [wallets]);

  const filtered = useMemo(() => {
    return wallets.filter((w) => {
      if (search && !w.address.toLowerCase().includes(search.toLowerCase())) return false;
      if (networkFilter !== "all" && w.network_name !== networkFilter) return false;
      return true;
    });
  }, [wallets, search, networkFilter]);

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

  const columns: Column<ReceivingWalletRecord>[] = [
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
      key: "network_name",
      label: "Network",
      render: (row) => (
        <Badge variant="outline" className="text-xs border-surface-600 text-surface-300">
          {row.network_name}
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
        <Badge variant={row.active ? "success" : "error"} className="text-xs">
          {row.active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "total_received",
      label: "Received",
      render: (row) => (
        <span className="text-xs text-surface-300">${Number(row.total_received).toFixed(2)}</span>
      ),
    },
    {
      key: "created_at",
      label: "Added",
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
                `https://${row.network_name.toLowerCase()}.com/address/${row.address}`,
                "_blank",
                "noopener,noreferrer"
              )
            }
            className="p-1.5 rounded-lg hover:bg-surface-800 text-surface-400 hover:text-surface-200 transition-colors"
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
        <Button size="sm" className="shrink-0">
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
    </div>
  );
}