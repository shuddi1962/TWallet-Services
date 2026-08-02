"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Activity,
  Database,
  Lock,
  HardDrive,
  Server,
  Link,
  Mail,
  Box,
  Radio,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminHealth, getAdminIncidents } from "@/lib/admin/actions";
import type { ServiceHealth, HealthIncident, HealthStatus } from "@/lib/admin/types";

/* ------------------------------------------------------------------ */
/*  Maps                                                                */
/* ------------------------------------------------------------------ */

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  API:            <Activity className="h-5 w-5" aria-hidden="true" />,
  Database:       <Database className="h-5 w-5" aria-hidden="true" />,
  Auth:           <Lock className="h-5 w-5" aria-hidden="true" />,
  Storage:        <HardDrive className="h-5 w-5" aria-hidden="true" />,
  "Edge Functions": <Server className="h-5 w-5" aria-hidden="true" />,
  "Blockchain RPC": <Link className="h-5 w-5" aria-hidden="true" />,
  Email:          <Mail className="h-5 w-5" aria-hidden="true" />,
  Redis:          <Box className="h-5 w-5" aria-hidden="true" />,
  Realtime:       <Radio className="h-5 w-5" aria-hidden="true" />,
};

const SERVICE_ORDER = [
  "API",
  "Database",
  "Auth",
  "Storage",
  "Edge Functions",
  "Blockchain RPC",
  "Email",
  "Redis",
  "Realtime",
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function statusBadgeVariant(status: HealthStatus): "success" | "warning" | "error" {
  switch (status) {
    case "healthy":  return "success";
    case "degraded": return "warning";
    case "down":     return "error";
  }
}

function severityBadgeVariant(severity: "minor" | "major" | "critical"): "info" | "warning" | "error" {
  switch (severity) {
    case "critical": return "error";
    case "major":    return "warning";
    case "minor":    return "info";
  }
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return sec + "s ago";
  const min = Math.floor(sec / 60);
  if (min < 60) return min + "m ago";
  const hr = Math.floor(min / 60);
  if (hr < 24) return hr + "h ago";
  return Math.floor(hr / 24) + "d ago";
}

function getOverallStatus(services: ServiceHealth[]): {
  label: string;
  icon: React.ReactNode;
  className: string;
} {
  const hasDown = services.some((s) => s.status === "down");
  const hasDegraded = services.some((s) => s.status === "degraded");

  if (hasDown) {
    return {
      label: "Partial Outage",
      icon: <XCircle className="h-6 w-6" aria-hidden="true" />,
      className: "bg-error/10 text-error border-error/20",
    };
  }
  if (hasDegraded) {
    return {
      label: "Degraded Performance",
      icon: <AlertTriangle className="h-6 w-6" aria-hidden="true" />,
      className: "bg-warning/10 text-warning border-warning/20",
    };
  }
  return {
    label: "All Systems Operational",
    icon: <CheckCircle className="h-6 w-6" aria-hidden="true" />,
    className: "bg-success/10 text-success border-success/20",
  };
}

/* ------------------------------------------------------------------ */
/*  Page component                                                      */
/* ------------------------------------------------------------------ */

export default function AdminHealthPage() {
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [incidents, setIncidents] = useState<HealthIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [healthRes, incidentsRes] = await Promise.all([
        getAdminHealth(),
        getAdminIncidents(),
      ]);
      setServices(healthRes);
      setIncidents(incidentsRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch health data");
    } finally {
      setLoading(false);
    }
  }, []);

  /* Initial fetch + auto-refresh every 30 s */
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  /* Derive overall status */
  const overall = getOverallStatus(services);

  /* Sort services into the canonical order */
  const sortedServices = SERVICE_ORDER
    .map((name) => services.find((s) => s.service === name))
    .filter(Boolean) as ServiceHealth[];

  const healthyCount = services.filter((s) => s.status === "healthy").length;
  const degradedCount = services.filter((s) => s.status === "degraded").length;
  const downCount = services.filter((s) => s.status === "down").length;

  /* ---------------------------------------------------------------- */
  /*  Render                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <div className="space-y-6">
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">System Health</h1>
          <p className="mt-1 text-sm text-body">
            Real-time status of all platform services
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          loading={loading}
          aria-label="Check all services now"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Check Now
        </Button>
      </div>

      {/* ---- Overall Status Banner ---- */}
      {services.length > 0 && (
        <div
          className={"rounded-xl border px-6 py-4 " + overall.className}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3">
            {overall.icon}
            <div>
              <p className="text-lg font-semibold">{overall.label}</p>
              <p className="text-sm opacity-80">
                {services.length} services tracked &middot;{" "}
                {healthyCount} healthy &middot; {degradedCount} degraded
                &middot; {downCount} down
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---- Error Banner ---- */}
      {error && (
        <div
          className="rounded-xl border border-error/20 bg-error/5 px-6 py-3 text-sm text-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* ---- Loading Skeleton ---- */}
      {loading && services.length === 0 && (
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Loading health data"
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 w-24 rounded bg-slate-200" />
                  <div className="h-3 w-32 rounded bg-slate-200" />
                  <div className="h-3 w-20 rounded bg-slate-200" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ---- Service Cards ---- */}
      {!loading && sortedServices.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedServices.map((svc) => (
            <Card key={svc.service}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                    {SERVICE_ICONS[svc.service] ?? (
                      <Activity className="h-5 w-5 text-slate-500" aria-hidden="true" />
                    )}
                  </div>
                  <CardTitle className="text-sm font-medium text-heading">
                    {svc.service}
                  </CardTitle>
                </div>
                <Badge variant={statusBadgeVariant(svc.status)}>
                  {svc.status === "healthy"
                    ? "Healthy"
                    : svc.status === "degraded"
                      ? "Degraded"
                      : "Down"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-body">Response Time</span>
                    <span className="font-mono text-xs text-heading">
                      {svc.responseTime}ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-body">Last Checked</span>
                    <span className="text-xs text-body">
                      <time dateTime={svc.lastChecked}>
                        {formatRelativeTime(svc.lastChecked)}
                      </time>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ---- Incidents ---- */}
      <section aria-labelledby="incidents-heading">
        <h2
          id="incidents-heading"
          className="text-lg font-semibold text-heading mb-4"
        >
          Recent Incidents (Past 24h)
        </h2>

        {incidents.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-body text-sm">
              No incidents reported in the last 24 hours.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {incidents.map((inc) => (
              <Card key={inc.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <Badge variant={severityBadgeVariant(inc.severity)}>
                          {inc.severity}
                        </Badge>
                        <Badge
                          variant={inc.status === "resolved" ? "success" : "warning"}
                        >
                          {inc.status === "resolved" ? "Resolved" : "Ongoing"}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-heading">
                        {inc.title}
                      </p>
                      <p className="mt-0.5 text-xs text-body">
                        Service: {inc.service}
                      </p>
                    </div>
                    <div className="shrink-0 text-right text-xs text-body">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        <time dateTime={inc.created_at}>
                          {formatRelativeTime(inc.created_at)}
                        </time>
                      </div>
                      {inc.resolved_at && (
                        <div className="mt-0.5 flex items-center gap-1">
                          <CheckCircle
                            className="h-3 w-3 text-success"
                            aria-hidden="true"
                          />
                          <time dateTime={inc.resolved_at}>
                            {formatRelativeTime(inc.resolved_at)}
                          </time>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}