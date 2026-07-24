import { getAdminWallets } from "@/lib/admin/actions";
import { AdminWalletsTable } from "@/components/admin/wallets-table";

export default async function AdminWalletsPage(props: {
  searchParams?: Promise<{ search?: string; network?: string; status?: string }>;
}) {
  const sp = await props.searchParams;
  const { wallets, count } = await getAdminWallets({
    search: sp?.search,
    network: sp?.network,
    status: sp?.status,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Wallet Addresses</h1>
          <p className="text-sm text-body">{count} wallets</p>
        </div>
      </div>
      <AdminWalletsTable wallets={wallets} count={count} />
    </div>
  );
}