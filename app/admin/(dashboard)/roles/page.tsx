import { getAdminRoles } from "@/lib/admin/actions";
import { RolesPanel } from "@/components/admin/roles-panel";

export default async function AdminRolesPage() {
  const { admins } = await getAdminRoles();

  return <RolesPanel admins={admins} />;
}