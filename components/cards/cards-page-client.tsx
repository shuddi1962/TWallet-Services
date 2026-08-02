"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MyCards, type IssuedCardRow } from "./my-cards";
import { CardCatalog, type CatalogProduct } from "./card-catalog";
import type { FundingSetup } from "./funding-setup";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, ArrowDown } from "lucide-react";

export function CardsPageClient({
  myCards,
  catalog,
  funding,
}: {
  myCards: IssuedCardRow[];
  catalog: CatalogProduct[];
  funding: FundingSetup;
}) {
  const searchParams = useSearchParams();
  const openFromLink = searchParams.get("order") === "1";
  const [showCatalog, setShowCatalog] = useState(myCards.length === 0 || openFromLink);
  const catalogRef = useRef<HTMLDivElement>(null);

  const openCatalog = () => {
    setShowCatalog(true);
    requestAnimationFrame(() => {
      catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="space-y-12">
      <MyCards cards={myCards} funding={funding} onOrderAnother={openCatalog} />

      {!showCatalog && catalog.length > 0 && (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-surface-300 bg-white px-6 py-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 ring-1 ring-brand-300/50">
            <Sparkles className="h-7 w-7 text-brand-600" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-surface-900 sm:text-2xl">Want another card?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-surface-500">
              Browse the full catalog of virtual &amp; metal cards and order in minutes — pay with
              crypto on-chain, activation is automatic after verification.
            </p>
          </div>
          <Button
            className="mt-1 h-12 rounded-xl gap-2 bg-gradient-to-r from-brand-500 to-brand-700 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 hover:brightness-110"
            onClick={openCatalog}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Order Another Card
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      )}

      {showCatalog && (
        <div ref={catalogRef} id="order-catalog" className="scroll-mt-24">
          <CardCatalog products={catalog} />
        </div>
      )}
    </div>
  );
}
