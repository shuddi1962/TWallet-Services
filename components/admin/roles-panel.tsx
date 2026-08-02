"use client";

import { useActionState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Plus, UserPlus, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { addAdminUser, updateAdminRole } from "@/lib/admin/actions";
import type { AdminRoleUser } from "@/lib/admin/types";

const roleDefinitions = [
  {
    id: "super_admin",
    label: "Super Admin",
    description: "Full system access. Manage users, orders, payments, cards, tickets, settings, audit logs, and analytics.",
    badgeVariant: "default" as const,
    permissions: [
      "dashboard", "users_view", "users_manage",
      "orders_view", "orders_manage",
      "payments_view", "payments_manage",
      "cards_view", "cards_manage",
      "tickets_view", "tickets_manage",
      "settings_view", "settings_manage",
      "audit_logs", "analytics",
    ],
  },
  {
    id: "operations",
    label: "Operations",
    description: "Manage orders, cards, shipping, and support tickets. View user information.",
    badgeVariant: "info" as const,
    permissions: [
      "dashboard", "users_view",
      "orders_view", "orders_manage",
      "cards_view", "cards_manage",
      "tickets_view",
    ],
  },
  {
    id: "finance",
    label: "Finance",
    description: "Handle payments, refunds, revenue reporting, and analytics dashboards.",
    badgeVariant: "success" as const,
    permissions: [
      "dashboard",
      "orders_view",
      "payments_view", "payments_manage",
      "analytics",
    ],
  },
  {
    id: "support",
    label: "Support",
    description: "Manage support tickets and view user profiles and order details.",
    badgeVariant: "warning" as const,
    permissions: [
      "dashboard", "users_view",
      "orders_view",
      "tickets_view", "tickets_manage",
    ],
  },
  {
    id: "viewer",
    label: "Viewer",
    description: "Read-only access to dashboards, users, orders, payments, cards, tickets, and analytics.",
    badgeVariant: "secondary" as const,
    permissions: [
      "dashboard", "users_view",
      "orders_view",
      "payments_view",
      "cards_view",
      "tickets_view",
      "analytics",
    ],
  },
] as const;

export function RolesPanel({ admins }: { admins: AdminRoleUser[] }) {
  const [addState, addAction, addPending] = useActionState(addAdminUser, undefined);
  const [isUpdating, startTransition] = useTransition();

  const roleCounts: Record<string, number> = {};
  for (const a of admins) {
    roleCounts[a.role] = (roleCounts[a.role] ?? 0) + 1;
  }

  const handleRoleChange = (adminId: string, role: string) => {
    startTransition(async () => {
      const res = await updateAdminRole(adminId, role);
      if (res.success) toast.success("Role updated");
      else toast.error(res.error);
    });
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-heading">Roles &amp; Permissions</h1>
          <p className="text-sm text-body">
            {admins.length} admin user{admins.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Badge variant="default" className="gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Super admins manage roles from here
        </Badge>
      </div>

      {/* Add admin */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Grant admin access
          </CardTitle>
          <p className="text-xs text-body">
            The person must already have a TWallet account. Use their registered email.
          </p>
        </CardHeader>
        <CardContent>
          <form action={addAction} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="email"
              name="email"
              required
              placeholder="admin@example.com"
              aria-label="Admin email to grant access"
              className="min-w-0 flex-1 rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-heading outline-none focus:border-primary"
            />
            <select
              name="role"
              aria-label="Role to assign"
              className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm text-body outline-none focus:border-primary"
              defaultValue="viewer"
            >
              {roleDefinitions.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={addPending}
              className="flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/80 disabled:opacity-50"
            >
              {addPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
              Add admin
            </button>
          </form>
          {addState?.error ? (
            <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {addState.error}
            </p>
          ) : null}
          {addState?.success ? (
            <p role="status" className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {addState.success}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {roleDefinitions.map((roleDef) => {
          const count = roleCounts[roleDef.id] ?? 0;
          return (
            <Card key={roleDef.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant={roleDef.badgeVariant}>{roleDef.label}</Badge>
                  <span className="text-xs font-medium text-body">
                    {count} admin{count !== 1 ? "s" : ""}
                  </span>
                </div>
                <CardTitle className="sr-only">{roleDef.label}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4 pt-0">
                <p className="text-xs text-body leading-relaxed">
                  {roleDef.description}
                </p>

                <div className="border-t border-slate-200 pt-3 mt-auto">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-body mb-2">
                    Permissions
                  </p>
                  <div className="space-y-1">
                    {roleDef.permissions.map((perm) => (
                      <div key={perm} className="flex items-center gap-2 text-xs">
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-sm text-[10px] font-bold leading-none text-primary bg-primary/10" aria-hidden="true">
                          {"\u2713"}
                        </span>
                        <span className="text-heading font-medium">{perm}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Admin Users Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100">
          <h2 className="text-lg font-semibold text-heading">Admin Users</h2>
          <p className="text-xs text-body mt-0.5">
            {admins.length} user{admins.length !== 1 ? "s" : ""} with administrative access
          </p>
        </div>

        {admins.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-body text-sm">No admin users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Change role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => {
                  const profile = admin.profiles;
                  const roleDef = roleDefinitions.find((r) => r.id === admin.role);
                  return (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                            {profile?.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-heading truncate">
                              {profile?.full_name ?? "Unknown"}
                            </p>
                            <p className="text-xs text-body truncate">
                              {profile?.email ?? "\u2014"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={roleDef?.badgeVariant ?? "secondary"}>
                          {roleDef?.label ?? admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <select
                          value={admin.role}
                          onChange={(e) => handleRoleChange(admin.id, e.target.value)}
                          disabled={isUpdating}
                          aria-label={`Change role for ${profile?.email ?? "admin"}`}
                          className="rounded-lg border border-surface-200 bg-white px-2 py-1.5 text-xs text-heading outline-none focus:border-primary disabled:opacity-50"
                        >
                          {roleDefinitions.map((r) => (
                            <option key={r.id} value={r.id}>{r.label}</option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          profile?.status === "active"
                            ? "bg-success/10 text-success"
                            : profile?.status === "suspended"
                              ? "bg-warning/10 text-warning"
                              : "bg-surface-200 text-body"
                        }`}>
                          {profile?.status ?? "unknown"}
                        </span>
                      </TableCell>
                      <TableCell className="text-body text-xs whitespace-nowrap">
                        {formatDistanceToNow(new Date(admin.created_at), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}