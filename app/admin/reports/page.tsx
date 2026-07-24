"use client";

import { useState, useCallback } from "react";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAdminReports } from "@/lib/admin/actions";
import type { ReportType, ReportFormat, GeneratedReport } from "@/lib/admin/types";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const REPORT_TYPES: { id: ReportType; label: string; description: string }[] = [
  { id: "revenue", label: "Revenue", description: "Confirmed payment transactions and totals" },
  { id: "order_summary", label: "Order Summary", description: "Card order statuses and counts" },
  { id: "user_growth", label: "User Growth", description: "New user registrations over time" },
  { id: "transaction_volume", label: "Transaction Volume", description: "Transaction counts and amounts" },
  { id: "payment_summary", label: "Payment Summary", description: "Payment methods and network usage" },
  { id: "card_product_stats", label: "Card Product Stats", description: "Card product distribution and sales" },
  { id: "support_metrics", label: "Support Metrics", description: "Ticket volume and resolution rates" },
];

const FORMATS: { id: ReportFormat; label: string }[] = [
  { id: "csv", label: "CSV" },
  { id: "excel", label: "Excel" },
  { id: "pdf", label: "PDF" },
];

const REPORT_LABELS: Record<ReportType, string> = {
  revenue: "Revenue",
  order_summary: "Order Summary",
  user_growth: "User Growth",
  transaction_volume: "Transaction Volume",
  payment_summary: "Payment Summary",
  card_product_stats: "Card Product Stats",
  support_metrics: "Support Metrics",
};

const BADGE_VARIANTS: Record<ReportType, "default" | "secondary" | "success" | "warning" | "error" | "info"> = {
  revenue: "success",
  order_summary: "info",
  user_growth: "default",
  transaction_volume: "warning",
  payment_summary: "secondary",
  card_product_stats: "info",
  support_metrics: "error",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getDefaultDateRange() {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 1);
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
}

function escapeCsvCell(val: unknown): string {
  const str = String(val ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, "\"\"")}"`;
  }
  return str;
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function AdminReportsPage() {
  const { startDate: defaultStart, endDate: defaultEnd } = getDefaultDateRange();
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [format, setFormat] = useState<ReportFormat>("csv");
  const [generating, setGenerating] = useState<ReportType | null>(null);
  const [reports, setReports] = useState<GeneratedReport[]>([]);

  const handleGenerate = useCallback(
    async (type: ReportType) => {
      setGenerating(type);
      try {
        const report = await getAdminReports({ type, format, startDate: startDate!, endDate: endDate! });
        setReports((prev) => [report, ...prev]);
        toast.success(`${REPORT_LABELS[type]} report generated`);
      } catch {
        toast.error("Failed to generate report");
      } finally {
        setGenerating(null);
      }
    },
    [format, startDate, endDate],
  );

  const handleDownload = useCallback((report: GeneratedReport) => {
    if (report.data.length === 0) {
      toast.error("Report has no data to download");
      return;
    }

    const headers = Object.keys(report.data[0] ?? {});
    const csvContent = [
      headers.join(","),
      ...report.data.map((row) => headers.map((h) => escapeCsvCell(row[h])).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = report.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Downloading ${report.fileName}`);
  }, []);

  return (
    <div className="space-y-6">
      {/* ---- Header ---------------------------------------------------- */}
      <div>
        <h1 className="text-2xl font-bold text-heading">Reports</h1>
        <p className="mt-1 text-sm text-body">Generate and download platform reports</p>
      </div>

      {/* ---- Date Range & Format Filters ------------------------------- */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-heading" htmlFor="start-date">
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1.5 bg-white border border-surface-200 rounded-lg text-sm text-body"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-heading" htmlFor="end-date">
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1.5 bg-white border border-surface-200 rounded-lg text-sm text-body"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-heading" htmlFor="report-format">
                Format
              </label>
              <select
                id="report-format"
                value={format}
                onChange={(e) => setFormat(e.target.value as ReportFormat)}
                className="px-3 py-1.5 bg-white border border-surface-200 rounded-lg text-sm text-body"
              >
                {FORMATS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---- Report Type Cards ----------------------------------------- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {REPORT_TYPES.map((rt) => (
          <Card key={rt.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-heading">{rt.label}</CardTitle>
                <FileText className="h-5 w-5 text-surface-400" aria-hidden="true" />
              </div>
              <CardDescription>{rt.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleGenerate(rt.id)}
                loading={generating === rt.id}
                className="w-full"
                size="sm"
                variant="primary"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                Generate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ---- Generated Reports List ----------------------------------- */}
      <div>
        <h2 className="text-lg font-semibold text-heading mb-4">Generated Reports</h2>

        {reports.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-body">
              <FileText className="mx-auto h-8 w-8 mb-2 opacity-50" aria-hidden="true" />
              <p>
                No reports generated yet. Select a date range and click Generate on a report type
                above.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50">
                  <th className="text-left px-4 py-3 text-sm font-medium text-heading">
                    Report Type
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-heading">Format</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-heading">
                    Date Range
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-heading">
                    Generated
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-heading">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Badge variant={BADGE_VARIANTS[report.type]}>
                        {REPORT_LABELS[report.type]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-body uppercase">{report.format}</td>
                    <td className="px-4 py-3 text-sm text-body">
                      {report.startDate} &mdash; {report.endDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-body">
                      {new Date(report.generatedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleDownload(report)}
                        disabled={report.data.length === 0}
                      >
                        <Download className="h-3.5 w-3.5" aria-hidden="true" />
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
