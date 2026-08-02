import { getAdminWalletValidations } from "@/lib/admin/actions";
import { AdminWalletValidationsTable } from "./table";

export const dynamic = "force-dynamic";

export default async function AdminWalletValidationsPage() {
  const { validations, count } = await getAdminWalletValidations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Wallet Validations</h1>
          <p className="text-sm text-body">{count} validation records</p>
        </div>
      </div>
      <AdminWalletValidationsTable validations={validations} count={count} />
    </div>
  );
}
