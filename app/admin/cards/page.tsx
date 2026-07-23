import { getCardProducts } from "@/lib/admin/actions";
import { AdminCardsTable } from "@/components/admin/cards-table";

export default async function AdminCardsPage() {
  const products = await getCardProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Card Products</h1>
          <p className="text-sm text-body">{products.length} products</p>
        </div>
      </div>
      <AdminCardsTable products={products} />
    </div>
  );
}
