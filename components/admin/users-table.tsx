"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, Ban, CheckCircle, X, Trash2, RotateCcw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { suspendUser, reactivateUser, deleteUser, type ActionResult } from "@/lib/admin/actions";
import { DetailDrawer } from "@/components/admin/detail-drawer";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  status: string;
  country: string;
  created_at: string;
  deleted_at?: string | null;
  user_roles?: { role: string }[];
  wallets?: { address: string }[];
}

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

function countryLabel(code?: string): string {
  const c = (code ?? "").toUpperCase();
  if (!c || c.length !== 2) return "—";
  try {
    return countryNames.of(c) ?? c;
  } catch {
    return c;
  }
}

export function AdminUsersTable({ users: initial }: { users: User[]; count: number }) {
  const router = useRouter();
  const [users, setUsers] = useState(initial);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState<string | null>(null);
  const [selected, setSelected] = useState<User | null>(null);

  // Keep the local list in sync with DB changes in real time.
  useEffect(() => {
    setUsers(initial);
  }, [initial]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-users-live")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        (payload) => {
          const next = payload.new as User;
          if (!next?.id) return;
          setUsers((prev) =>
            prev.map((u) => (u.id === next.id ? { ...u, ...next } : u)),
          );
          if (selected?.id === next.id) setSelected((s) => (s ? { ...s, ...next } : s));
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "profiles" },
        (payload) => {
          const next = payload.new as User;
          if (!next?.id) return;
          setUsers((prev) => (prev.some((u) => u.id === next.id) ? prev : [next, ...prev]));
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [selected?.id]);

  const handleAction = async (userId: string, action: "suspend" | "reactivate") => {
    const label = action === "suspend" ? "suspend" : "reactivate";
    if (!confirm(`Are you sure you want to ${label} this user?`)) return;

    setLoading(userId);
    const result: ActionResult = action === "suspend"
      ? await suspendUser(userId)
      : await reactivateUser(userId);
    setLoading(null);
    if (result.success) {
      toast.success(`User ${action === "suspend" ? "suspended" : "reactivated"}`);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Delete ${user.full_name || user.email}? This hides their account and all associated data from the admin list (records are preserved). You can restore them later.`)) return;

    setLoading(user.id);
    const result: ActionResult = await deleteUser(user.id);
    setLoading(null);
    if (result.success) {
      toast.success("User deleted");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  const filtered = users.filter((u) => {
    if (search && !u.full_name?.toLowerCase().includes(search.toLowerCase()) && !u.email?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm flex-1 max-w-sm">
          <Search className="w-4 h-4 text-body" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="bg-transparent border-none outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search users"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="shrink-0 rounded-md p-0.5 text-slate-400 hover:bg-surface-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <select
          className="px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm text-body"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <p className="text-body">No users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-body bg-surface-50 border-b border-surface-200">
                  <th scope="col" className="py-3 px-4 font-medium">User</th>
                  <th scope="col" className="py-3 px-4 font-medium">Status</th>
                  <th scope="col" className="py-3 px-4 font-medium">Role</th>
                  <th scope="col" className="py-3 px-4 font-medium">Location</th>
                  <th scope="col" className="py-3 px-4 font-medium">Wallet</th>
                  <th scope="col" className="py-3 px-4 font-medium">Created</th>
                  <th scope="col" className="py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
                          {user.full_name?.charAt(0) ?? "?"}
                        </div>
                        <div>
                          <p className="font-medium text-heading">{user.full_name}</p>
                          <p className="text-xs text-body">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "active" ? "bg-success/10 text-success" :
                        user.status === "suspended" ? "bg-warning/10 text-warning" :
                        "bg-surface-200 text-body"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {user.user_roles?.[0]?.role ?? "user"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-body">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${user.country && user.country !== "US" ? "bg-emerald-500" : "bg-surface-300"}`} aria-hidden="true" />
                        {countryLabel(user.country)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {user.wallets?.length ? (
                        <span className="text-xs font-mono text-success">Connected</span>
                      ) : (
                        <span className="text-xs text-body">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-body text-xs">
                      {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {user.status === "active" ? (
                          <button
                            onClick={() => handleAction(user.id, "suspend")}
                            disabled={loading === user.id}
                            className="p-1.5 rounded-lg hover:bg-warning/10 text-warning transition-colors disabled:opacity-50"
                            aria-label="Suspend user"
                            title="Suspend user"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : user.status === "suspended" ? (
                          <button
                            onClick={() => handleAction(user.id, "reactivate")}
                            disabled={loading === user.id}
                            className="p-1.5 rounded-lg hover:bg-success/10 text-success transition-colors disabled:opacity-50"
                            aria-label="Reactivate user"
                            title="Reactivate user"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        ) : null}
                        {user.status === "deleted" ? (
                          <button
                            onClick={() => handleAction(user.id, "reactivate")}
                            disabled={loading === user.id}
                            className="p-1.5 rounded-lg hover:bg-success/10 text-success transition-colors disabled:opacity-50"
                            aria-label="Restore user"
                            title="Restore user"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(user)}
                            disabled={loading === user.id}
                            className="p-1.5 rounded-lg hover:bg-error/10 text-error transition-colors disabled:opacity-50"
                            aria-label="Delete user"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelected(user)}
                          className="p-1.5 rounded-lg hover:bg-surface-100 text-body transition-colors"
                          aria-label={`View ${user.full_name}`}
                          title="View user"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <DetailDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? selected.full_name : ""}
        sections={selected
          ? [
              {
                title: "Account",
                content: (
                  <div className="space-y-1">
                    <p><span className="text-slate-500">ID:</span> <span className="font-mono">{selected.id}</span></p>
                    <p><span className="text-slate-500">Email:</span> {selected.email}</p>
                    <p><span className="text-slate-500">Status:</span> {selected.status}</p>
                    <p><span className="text-slate-500">Role:</span> {selected.user_roles?.[0]?.role ?? "user"}</p>
                  </div>
                ),
              },
              {
                title: "Location",
                content: (
                  <div className="space-y-1">
                    <p><span className="text-slate-500">Country:</span> {countryLabel(selected.country)}</p>
                    <p className="text-xs text-slate-400">Detected automatically from the signup/IP location when available.</p>
                  </div>
                ),
              },
              {
                title: "Wallet",
                content: selected.wallets?.length ? (
                  <div className="space-y-1">
                    {selected.wallets.map((w, i) => (
                      <p key={i} className="font-mono text-xs">{w.address}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No wallet connected</p>
                ),
              },
              {
                title: "Activity",
                content: <p className="text-sm text-slate-400">Joined {new Date(selected.created_at).toLocaleDateString()}</p>,
              },
            ]
          : []}
      />
    </div>
  );
}