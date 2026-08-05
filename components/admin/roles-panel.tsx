"use client";

import { useActionState, useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import type { BadgeProps } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  UserPlus,
  Loader2,
  ShieldCheck,
  Check,
  ChevronDown,
  Lock,
  Crown,
  ClipboardList,
  Wallet,
  LifeBuoy,
  Eye,
  RotateCcw,
  X,
} from "lucide-react";
import { addAdminUser, updateAdminRole, updateRolePermissions, updateAdminPermissions } from "@/lib/admin/actions";
import type { AdminRoleUser } from "@/lib/admin/types";
import {
  ALL_PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
  ROLE_DEFINITIONS,
  type AdminRoleId,
  type Permission,
} from "@/lib/admin/permissions";
import { useRealtime } from "@/lib/hooks/use-realtime";
import { cn } from "@/lib/utils/cn";

const ROLE_ICONS: Record<AdminRoleId, typeof Crown> = {
  super_admin: Crown,
  operations: ClipboardList,
  finance: Wallet,
  support: LifeBuoy,
  viewer: Eye,
};

const ROLE_GRADIENTS: Record<AdminRoleId, string> = {
  super_admin: "from-blue-600 to-indigo-700",
  operations: "from-cyan-500 to-blue-600",
  finance: "from-emerald-500 to-teal-600",
  support: "from-amber-500 to-orange-600",
  viewer: "from-slate-500 to-slate-700",
};

const PERM_GROUPS: { key: string; label: string; perms: Permission[] }[] = [
  { key: "dashboard", label: "Dashboard", perms: ["dashboard"] },
  { key: "users", label: "Users", perms: ["users_view", "users_manage"] },
  { key: "orders", label: "Orders", perms: ["orders_view", "orders_manage"] },
  { key: "payments", label: "Payments", perms: ["payments_view", "payments_manage"] },
  { key: "cards", label: "Cards", perms: ["cards_view", "cards_manage"] },
  { key: "tickets", label: "Support", perms: ["tickets_view", "tickets_manage"] },
  { key: "settings", label: "Settings", perms: ["settings_view", "settings_manage"] },
  { key: "audit", label: "Audit Logs", perms: ["audit_logs"] },
  { key: "analytics", label: "Analytics", perms: ["analytics"] },
];

function labelForPermission(permission: string): string {
  return permission.replace(/_/g, " ").replace(/(^|\s)\S/g, (m) => m.toUpperCase());
}

function roleLabel(role: string): string {
  return ROLE_DEFINITIONS.find((r) => r.id === role)?.label ?? role;
}

type PermPayload = {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new?: { role: string; permission: string } | null;
  old?: { role: string; permission: string } | null;
};

function buildInitialPerms(initial?: Record<string, string[]>): Record<string, string[]> {
  const base: Record<string, string[]> = {};
  for (const def of ROLE_DEFINITIONS) {
    base[def.id] = [...DEFAULT_ROLE_PERMISSIONS[def.id]];
  }
  if (initial) {
    for (const [role, perms] of Object.entries(initial)) {
      if (role in base) base[role] = [...new Set(perms)].filter((p) => (ALL_PERMISSIONS as readonly string[]).includes(p));
    }
  }
  return base;
}

function PermissionCheck({
  checked,
  disabled,
  saving,
  label,
  onToggle,
}: {
  checked: boolean;
  disabled?: boolean;
  saving?: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled || saving}
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition",
        disabled ? "cursor-not-allowed opacity-55" : "cursor-pointer hover:bg-slate-50",
      )}
    >
      {saving ? (
        <span className="inline-flex h-5 w-5 items-center justify-center">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-500" aria-hidden="true" />
        </span>
      ) : (
        <span
          className={cn(
            "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition",
            checked ? "border-emerald-600 bg-emerald-600 text-white shadow-sm" : "border-slate-300 bg-white text-transparent",
          )}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
        </span>
      )}
      <span className="font-medium capitalize text-slate-800">{label}</span>
    </button>
  );
}

export function RolesPanel({
  admins: initialAdmins,
  initialPermissions,
}: {
  admins: AdminRoleUser[];
  initialPermissions?: Record<string, string[]>;
}) {
  const router = useRouter();
  const [addState, addAction, addPending] = useActionState(addAdminUser, undefined);
  const [, startTransition] = useTransition();

  const [users, setUsers] = useState<AdminRoleUser[]>(initialAdmins);
  const [perms, setPerms] = useState<Record<string, string[]>>(() => buildInitialPerms(initialPermissions));
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Per-admin permission override popover
  const [overrideId, setOverrideId] = useState<string | null>(null);
  const [overrideDraft, setOverrideDraft] = useState<Set<string>>(new Set());
  const [overrideSaving, setOverrideSaving] = useState(false);
  const overrideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUsers(initialAdmins);
  }, [initialAdmins]);

  useEffect(() => {
    if (addState && "success" in addState) router.refresh();
  }, [addState, router]);

  // Close override popover on outside click / escape
  useEffect(() => {
    if (!overrideId) return;
    const onDown = (e: MouseEvent) => {
      if (overrideRef.current && !overrideRef.current.contains(e.target as Node)) setOverrideId(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOverrideId(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [overrideId]);

  // Realtime: permission matrix edits broadcast to every dashboard
  const handlePermRealtime = useCallback((payload: PermPayload) => {
    setPerms((prev) => {
      const next: Record<string, string[]> = {};
      for (const [role, arr] of Object.entries(prev)) next[role] = [...arr];
      if (payload.eventType === "INSERT" && payload.new) {
        next[payload.new.role] = [...new Set([...(next[payload.new.role] ?? []), payload.new.permission])];
      } else if (payload.eventType === "DELETE" && payload.old) {
        next[payload.old.role] = (next[payload.old.role] ?? []).filter((p) => p !== payload.old!.permission);
      }
      return next;
    });
  }, []);

  useRealtime<PermPayload>("roles-perms-live", "*", "role_permissions", handlePermRealtime);

  // Realtime: admin membership changes (promotion / role change / removal)
  const handleAdminRealtime = useCallback(() => {
    router.refresh();
  }, [router]);

  useRealtime("roles-admins-live", "*", "admins", handleAdminRealtime);

  const roleCounts: Record<string, number> = {};
  for (const a of users) roleCounts[a.role] = (roleCounts[a.role] ?? 0) + 1;

  const handleRoleChange = (adminId: string, role: string) => {
    startTransition(async () => {
      const res = await updateAdminRole(adminId, role);
      if (res.success) {
        toast.success("Role updated");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };

  const togglePermission = (role: string, permission: string) => {
    if (role === "super_admin" || savingKey) return;
    const nextPerms = (() => {
      const cur = new Set(perms[role] ?? []);
      if (cur.has(permission)) cur.delete(permission);
      else cur.add(permission);
      return [...cur];
    })();
    const previous = perms[role] ?? [];
    const key = `${role}:${permission}`;
    setPerms((prev) => ({ ...prev, [role]: nextPerms }));
    setSavingKey(key);
    startTransition(async () => {
      const res = await updateRolePermissions(role, nextPerms);
      setSavingKey(null);
      if (res.success) {
        toast.success(`${labelForPermission(permission)} ${nextPerms.includes(permission) ? "granted" : "revoked"} for ${roleLabel(role)}`);
      } else {
        setPerms((prev) => ({ ...prev, [role]: previous }));
        toast.error(res.error);
      }
    });
  };

  const effectiveFor = (admin: AdminRoleUser): Permission[] =>
    admin.role === "super_admin"
      ? [...ALL_PERMISSIONS]
      : admin.permissions && admin.permissions.length
        ? (admin.permissions.filter((p): p is Permission => (ALL_PERMISSIONS as readonly string[]).includes(p)))
        : DEFAULT_ROLE_PERMISSIONS[admin.role as AdminRoleId] ?? [];

  const openOverride = (admin: AdminRoleUser) => {
    setOverrideDraft(new Set(admin.permissions ?? []));
    setOverrideId(admin.id);
  };

  const saveOverride = async (adminId: string) => {
    setOverrideSaving(true);
    const res = await updateAdminPermissions(adminId, [...overrideDraft]);
    setOverrideSaving(false);
    if (res.success) {
      toast.success("Admin permissions updated");
      setOverrideId(null);
      router.refresh();
    } else {
      toast.error(res.error);
    }
  };

  const resetOverride = async (adminId: string) => {
    setOverrideSaving(true);
    const res = await updateAdminPermissions(adminId, [], true);
    setOverrideSaving(false);
    if (res.success) {
      toast.success("Inheriting role defaults");
      setOverrideDraft(new Set());
      setOverrideId(null);
      router.refresh();
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Roles &amp; Permissions</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {users.length} admin user{users.length !== 1 ? "s" : ""} · permission changes apply live to every dashboard
          </p>
        </div>
        <Badge variant="info" className="gap-1.5 py-1">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Super admins manage roles from here
        </Badge>
      </div>

      {/* Grant admin access */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200/70">
        <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <UserPlus className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Grant admin access</h2>
            <p className="text-xs text-slate-500">The person must already have a TWallet account — use their registered email.</p>
          </div>
        </div>
        <div className="px-5 py-4">
          <form action={addAction} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="email"
              name="email"
              required
              placeholder="admin@example.com"
              aria-label="Admin email to grant access"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
            <select
              name="role"
              aria-label="Role to assign"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              defaultValue="viewer"
            >
              {ROLE_DEFINITIONS.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={addPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-50"
            >
              {addPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
              Add admin
            </button>
          </form>
          {addState?.error ? (
            <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {addState.error}
            </p>
          ) : null}
          {addState?.success ? (
            <p role="status" className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {addState.success}
            </p>
          ) : null}
        </div>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {ROLE_DEFINITIONS.map((roleDef) => {
          const Icon = ROLE_ICONS[roleDef.id];
          const count = roleCounts[roleDef.id] ?? 0;
          const rolePerms = perms[roleDef.id] ?? [];
          const locked = roleDef.id === "super_admin";
          return (
            <div
              key={roleDef.id}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200/70"
            >
              <div className={cn("h-1.5 w-full bg-gradient-to-r", ROLE_GRADIENTS[roleDef.id])} />
              <div className="flex flex-col gap-4 p-5">
                <div className="flex items-center gap-3">
                  <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm", ROLE_GRADIENTS[roleDef.id])}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{roleDef.label}</h3>
                      {locked && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                          <Lock className="h-2.5 w-2.5" aria-hidden="true" />
                          Full access
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                      {count} admin{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-slate-500">{roleDef.description}</p>

                <div className="mt-auto">
                  <p className="mb-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Permissions
                    <span className="normal-case tracking-normal text-slate-400">{rolePerms.length}/{ALL_PERMISSIONS.length}</span>
                  </p>
                  <div className="space-y-0.5">
                    {PERM_GROUPS.map((group) => (
                      <div key={group.key}>
                        <p className="px-2 pb-0.5 pt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                          {group.label}
                        </p>
                        <div className="space-y-0.5">
                          {group.perms.map((perm) => {
                            const checked = rolePerms.includes(perm);
                            return (
                              <PermissionCheck
                                key={perm}
                                checked={checked}
                                disabled={locked}
                                saving={savingKey === `${roleDef.id}:${perm}`}
                                label={labelForPermission(perm)}
                                onToggle={() => togglePermission(roleDef.id, perm)}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin users table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200/70">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Admin Users</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {users.length} user{users.length !== 1 ? "s" : ""} with administrative access · add an admin above or manage their roles and permissions below
          </p>
        </div>

        {users.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <p className="text-sm text-slate-500">No admin users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Admin</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Permissions</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Added</th>
                </tr>
              </thead>
              <tbody>
                {users.map((admin) => {
                  const profile = admin.profiles;
                  const roleDef = ROLE_DEFINITIONS.find((r) => r.id === admin.role);
                  const isSuper = admin.role === "super_admin";
                  const effective = effectiveFor(admin);
                  const overrideActive = !isSuper && (admin.permissions?.length ?? 0) > 0;
                  return (
                    <tr key={admin.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600/10 text-xs font-bold text-brand-700">
                            {profile?.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-900">
                              {profile?.full_name ?? "Unknown"}
                            </p>
                            <p className="truncate text-xs text-slate-400">{profile?.email ?? "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={(roleDef?.badgeVariant ?? "secondary") as BadgeProps["variant"]}>
                            {roleDef?.label ?? admin.role}
                          </Badge>
                          {isSuper ? (
                            <Lock className="h-3.5 w-3.5 text-slate-300" aria-label="Locked role" />
                          ) : (
                            <select
                              value={admin.role}
                              onChange={(e) => handleRoleChange(admin.id, e.target.value)}
                              aria-label={`Change role for ${profile?.email ?? "admin"}`}
                              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none transition focus:border-brand-500"
                            >
                              {ROLE_DEFINITIONS.filter((r) => r.id !== "super_admin").map((r) => (
                                <option key={r.id} value={r.id}>{r.label}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {isSuper ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            <Crown className="h-3 w-3" aria-hidden="true" />
                            All permissions
                          </span>
                        ) : (
                          <div className="relative" ref={overrideId === admin.id ? overrideRef : undefined}>
                            <button
                              type="button"
                              onClick={() => (overrideId === admin.id ? setOverrideId(null) : openOverride(admin))}
                              aria-expanded={overrideId === admin.id}
                              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 transition hover:border-brand-400 hover:text-brand-600"
                            >
                              {effective.length} of {ALL_PERMISSIONS.length}
                              {overrideActive && (
                                <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700" title="Custom permissions set">
                                  custom
                                </span>
                              )}
                              <ChevronDown className={cn("h-3.5 w-3.5 transition", overrideId === admin.id && "rotate-180")} aria-hidden="true" />
                            </button>

                            {overrideId === admin.id && (
                              <div className="fixed inset-x-4 top-1/2 z-50 max-h-[75dvh] -translate-y-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:absolute sm:inset-x-auto sm:top-full sm:mt-2 sm:w-80 sm:max-h-none sm:translate-y-0">
                                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                                  <p className="text-xs font-semibold text-slate-900">
                                    Permissions · {admin.profiles?.full_name ?? "Custom"}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => setOverrideId(null)}
                                    aria-label="Close permissions"
                                    className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="max-h-72 overflow-y-auto p-3">
                                  {PERM_GROUPS.map((group) => (
                                    <div key={group.key} className="mb-2">
                                      <p className="px-1.5 pb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                        {group.label}
                                      </p>
                                      <div className="space-y-0.5">
                                        {group.perms.map((perm) => {
                                          const checked = overrideDraft.has(perm);
                                          return (
                                            <PermissionCheck
                                              key={perm}
                                              checked={checked}
                                              disabled={overrideSaving}
                                              label={labelForPermission(perm)}
                                              onToggle={() => {
                                                setOverrideDraft((prev) => {
                                                  const next = new Set(prev);
                                                  if (next.has(perm)) next.delete(perm);
                                                  else next.add(perm);
                                                  return next;
                                                });
                                              }}
                                            />
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3">
                                  <button
                                    type="button"
                                    onClick={() => resetOverride(admin.id)}
                                    disabled={overrideSaving}
                                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-white hover:text-slate-700 disabled:opacity-50"
                                  >
                                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                                    Use role defaults
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => saveOverride(admin.id)}
                                    disabled={overrideSaving}
                                    className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-50"
                                  >
                                    {overrideSaving && <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />}
                                    Save
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                            profile?.status === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : profile?.status === "suspended"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-100 text-slate-500",
                          )}
                        >
                          {profile?.status ?? "unknown"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-xs text-slate-500">
                        {formatDistanceToNow(new Date(admin.created_at), { addSuffix: true })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}