"use client";

import { type ReactNode } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render: (row: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSort?: (field: string, dir: "asc" | "desc") => void;
  sortField?: string;
  sortDir?: "asc" | "desc";
  loading?: boolean;
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns, data, total, page, pageSize, onPageChange, onSort,
  sortField, sortDir, loading, keyExtractor, emptyMessage = "No data found",
}: DataTableProps<T>) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-surface-800">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-900">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`px-4 py-3 text-left font-medium text-surface-400 ${col.sortable ? "cursor-pointer select-none" : ""} ${col.className ?? ""}`}
                  onClick={() => {
                    if (col.sortable && onSort) {
                      const dir = sortField === col.key && sortDir === "asc" ? "desc" : "asc";
                      onSort(col.key, dir);
                    }
                  }}
                >
                  {col.label}
                  {col.sortable && <ArrowUpDown className="inline h-3 w-3 ml-1" />}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className="px-4 py-3">
                      <div className="h-4 w-full animate-pulse rounded bg-surface-800" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="px-4 py-12 text-center text-surface-500">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={keyExtractor(row)} className="bg-surface-950 transition hover:bg-surface-900/50">
                  {columns.map((col) => (
                    <TableCell key={col.key} className={`px-4 py-3 ${col.className ?? ""}`}>
                      {col.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-sm text-surface-400">
            Showing {(page * pageSize) + 1}–{Math.min((page + 1) * pageSize, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
              className="rounded-lg border border-surface-700 bg-surface-900 p-2 text-surface-400 hover:text-surface-200 disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-surface-400">{page + 1} / {totalPages}</span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1}
              className="rounded-lg border border-surface-700 bg-surface-900 p-2 text-surface-400 hover:text-surface-200 disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
