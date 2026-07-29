import { getCardProducts } from "@/features/cards/server/actions";
import { CardCatalog, type CatalogProduct } from "@/components/cards/card-catalog";

export const dynamic = "force-dynamic";

export default async function CardsPage() {
  const { data, error } = await getCardProducts();
  const products = (data ?? []) as CatalogProduct[];

  if (error && !products.length) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
        <p className="font-medium text-red-300">Could not load card products</p>
        <p className="mt-2 text-sm text-surface-400">{error}</p>
      </div>
    );
  }

  return <CardCatalog products={products} />;
}
