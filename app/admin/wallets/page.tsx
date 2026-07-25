import { getAdminReceivingWallets } from "@/lib/admin/actions";
import { AdminReceivingWalletsTable } from "@/components/admin/receiving-wallets-table";

export default async function AdminWalletsPage() {
  const { wallets, count } = await getAdminReceivingWallets();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Receiving Wallets</h1>
          <p className="text-sm text-body">{count} wallets — users send crypto here</p>
        </div>
      </div>
      <AdminReceivingWalletsTable wallets={wallets} count={count} />
    </div>
  );
}