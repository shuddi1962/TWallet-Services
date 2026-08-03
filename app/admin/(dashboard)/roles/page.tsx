import { getAdminRoles, getRolePermissions } from "@/lib/admin/actions";
import { RolesPanel } from "@/components/admin/roles-panel";

export const dynamic = "force-dynamic";

export default async function AdminRolesPage() {
  const [{ admins }, initialPermissions] = await Promise.all([getAdminRoles(), getRolePermissions()]);

  return <RolesPanel admins={admins} initialPermissions={initialPermissions} />;
}
