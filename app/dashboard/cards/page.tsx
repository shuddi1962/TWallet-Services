import { getCardProducts } from "@/features/cards/server/actions";
import {
  getIssuedCards,
  syncIssuedCardsFromOrders,
} from "@/features/cards/server/issued-actions";
import { CardCatalog, type CatalogProduct } from "@/components/cards/card-catalog";
import { MyCards, type IssuedCardRow } from "@/components/cards/my-cards";

export const dynamic = "force-dynamic";

export default async function CardsPage() {
  await syncIssuedCardsFromOrders();

  const [{ data: products, error: productsError }, { data: issued, error: issuedError }] =
    await Promise.all([getCardProducts(), getIssuedCards()]);

  const catalog = (products ?? []) as CatalogProduct[];
  const myCards = (issued ?? []) as IssuedCardRow[];

  return (
    <div className="space-y-12">
      {(issuedError || productsError) && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-200">
          {issuedError ? `Cards: ${issuedError}` : null}
          {issuedError && productsError ? " · " : null}
          {productsError ? `Catalog: ${productsError}` : null}
        </div>
      )}

      <MyCards cards={myCards} />

      <div id="order-catalog" className="scroll-mt-24">
        <CardCatalog products={catalog} />
      </div>
    </div>
  );
}
