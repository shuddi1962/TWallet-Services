import { getCardProducts } from "@/features/cards/server/actions";
import {
  getIssuedCards,
  syncIssuedCardsFromOrders,
} from "@/features/cards/server/issued-actions";
import { CardsPageClient } from "@/components/cards/cards-page-client";
import type { CatalogProduct } from "@/components/cards/card-catalog";
import type { IssuedCardRow } from "@/components/cards/my-cards";

export const dynamic = "force-dynamic";

export default async function CardsPage() {
  let catalog: CatalogProduct[] = [];
  let myCards: IssuedCardRow[] = [];
  let notice: string | null = null;

  try {
    // never revalidate during RSC render — sync is best-effort
    await syncIssuedCardsFromOrders().catch(() => null);

    const [productsRes, issuedRes] = await Promise.all([
      getCardProducts().catch((e: unknown) => ({
        data: null,
        error: e instanceof Error ? e.message : "products failed",
      })),
      getIssuedCards().catch((e: unknown) => ({
        data: null,
        error: e instanceof Error ? e.message : "issued cards failed",
      })),
    ]);

    catalog = (productsRes.data ?? []) as CatalogProduct[];
    myCards = (issuedRes.data ?? []) as IssuedCardRow[];

    const errs = [productsRes.error, issuedRes.error].filter(Boolean);
    if (errs.length) notice = errs.join(" · ");
  } catch (e) {
    notice = e instanceof Error ? e.message : "Failed to load cards";
  }

  return (
    <div>
      {notice && (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {notice}
        </div>
      )}

      <CardsPageClient myCards={myCards} catalog={catalog} />
    </div>
  );
}
