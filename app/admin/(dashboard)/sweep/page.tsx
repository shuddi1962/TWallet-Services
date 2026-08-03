import { getAdminReceivingWallets, getAdminSweepTransactions } from "@/lib/admin/actions";
import { AdminSweepPanel } from "@/components/admin/sweep-panel";

export const dynamic = "force-dynamic";

export default async function AdminSweepPage() {
  const { wallets } = await getAdminReceivingWallets();
  const { sweeps } = await getAdminSweepTransactions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading">Sweep to Treasury</h1>
        <p className="text-sm text-body">Move funds from receiving wallets to your treasury wallet</p>
      </div>
      <AdminSweepPanel wallets={wallets} recentSweeps={sweeps} />
    </div>
  );
}