import { getCardProducts } from "@/features/cards/server/actions";
import {
  getIssuedCards,
  syncIssuedCardsFromOrders,
  getCardFundingSetup,
} from "@/features/cards/server/issued-actions";
import { CardsPageClient } from "@/components/cards/cards-page-client";
import type { CatalogProduct } from "@/components/cards/card-catalog";
import type { IssuedCardRow } from "@/components/cards/my-cards";
import type { FundingSetup } from "@/components/cards/funding-setup";

export const dynamic = "force-dynamic";

export default async function CardsPage() {
  let catalog: CatalogProduct[] = [];
  let myCards: IssuedCardRow[] = [];
  let funding: FundingSetup = { networks: [], tokens: [], wallets: [] };
  let notice: string | null = null;

  try {
    // never revalidate during RSC render — sync is best-effort
    await syncIssuedCardsFromOrders().catch(() => null);

    const [productsRes, issuedRes, fundingRes] = await Promise.all([
      getCardProducts().catch((e: unknown) => ({
        data: null,
        error: e instanceof Error ? e.message : "products failed",
      })),
      getIssuedCards().catch((e: unknown) => ({
        data: null,
        error: e instanceof Error ? e.message : "issued cards failed",
      })),
      getCardFundingSetup().catch((e: unknown) => ({
        data: null,
        error: e instanceof Error ? e.message : "funding setup failed",
      })),
    ]);

    catalog = (productsRes.data ?? []) as CatalogProduct[];
    myCards = (issuedRes.data ?? []) as IssuedCardRow[];
    funding = (fundingRes.data ?? funding) as FundingSetup;

    const errs = [productsRes.error, issuedRes.error, fundingRes.error].filter(Boolean);
    if (errs.length) notice = errs.join(" · ");
  } catch (e) {
    notice = e instanceof Error ? e.message : "Failed to load cards";
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b1220] p-4 shadow-xl shadow-black/20 sm:p-6 lg:p-8">
      {notice && (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-[#1a1508] px-4 py-3 text-sm text-amber-200">
          {notice}
        </div>
      )}

      <CardsPageClient myCards={myCards} catalog={catalog} funding={funding} />
    </div>
  );
}
