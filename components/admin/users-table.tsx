"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Eye, Ban, CheckCircle, ArrowUpDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { suspendUser, reactivateUser, type ActionResult } from "@/lib/admin/actions";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  status: string;
  country: string;
  created_at: string;
  user_roles?: { role: string }[];
  wallets?: { address: string }[];
}

export function AdminUsersTable({ users }: { users: User[]; count: number }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (userId: string, action: "suspend" | "reactivate") => {
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
                  <th scope="col" className="py-3 px-4 font-medium"><ArrowUpDown className="w-3 h-3 inline mr-1" />User</th>
                  <th scope="col" className="py-3 px-4 font-medium">Status</th>
                  <th scope="col" className="py-3 px-4 font-medium">Role</th>
                  <th scope="col" className="py-3 px-4 font-medium">Country</th>
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
                    <td className="py-3 px-4 text-body">{user.country}</td>
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
                            className="p-1.5 rounded-lg hover:bg-warning/10 text-warning transition-colors"
                            aria-label="Suspend user"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : user.status === "suspended" ? (
                          <button
                            onClick={() => handleAction(user.id, "reactivate")}
                            disabled={loading === user.id}
                            className="p-1.5 rounded-lg hover:bg-success/10 text-success transition-colors"
                            aria-label="Reactivate user"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        ) : null}
                        <button className="p-1.5 rounded-lg hover:bg-surface-100 text-body transition-colors" aria-label="View user">
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
    </div>
  );
}
