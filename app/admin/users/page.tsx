import { getUsers } from "@/lib/admin/actions";
import { Suspense } from "react";
import { AdminUsersTable } from "@/components/admin/users-table";

export default async function AdminUsersPage(props: {
  searchParams?: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const sp = await props.searchParams;
  const { users, count } = await getUsers({
    search: sp?.search,
    status: sp?.status,
    page: Number(sp?.page) || 0,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Users</h1>
          <p className="text-sm text-body">{count} total users</p>
        </div>
      </div>

      <Suspense fallback={<div className="bg-white rounded-2xl shadow-md p-8 text-center text-body">Loading users...</div>}>
        <AdminUsersTable users={users} count={count} />
      </Suspense>
    </div>
  );
}
