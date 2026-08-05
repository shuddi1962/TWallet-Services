import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/layout/page-hero";
import { TwalletCard } from "@/components/cards/twallet-card";
import { cardFinishes, cardOrder, sampleCards } from "@/lib/cards";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import type { CardFinish } from "@/lib/cards";

const cardPrices: Record<CardFinish, { price: string; note: string; badge?: string }> = {
  sapphire: { price: "$5", note: "Virtual · issued instantly", badge: "Most Popular" },
  obsidian: { price: "$10", note: "Metal · ships worldwide" },
  cyber: { price: "$15", note: "Virtual · issued instantly", badge: "Limited" },
  gold: { price: "$25", note: "Metal · premium finish" },
  holographic: { price: "$50", note: "Metal · limited edition", badge: "Premium" },
};

const features = ["Worldwide acceptance", "Contactless payments", "ATM access", "On-chain verified"];

export default function CardsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface-950">
        <PageHero
          badge="Cards"
          title={
            <>
              Choose your <span className="text-gradient-blue">perfect card</span>
            </>
          }
          subtitle="Premium virtual & metal cards, funded straight from your wallet. Issued in minutes, accepted anywhere."
        />

        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cardOrder.map((finish, i) => {
              const visual = cardFinishes[finish];
              const card = sampleCards[finish];
              const price = cardPrices[finish];
              const featured = i === 0;

              return (
                <div
                  key={finish}
                  className={`group relative flex flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                    featured
                      ? "border-brand-500/50 bg-gradient-to-b from-brand-500/[0.12] to-white/[0.03] shadow-xl shadow-brand-500/10"
                      : "border-white/10 bg-white/[0.03] hover:border-brand-500/30"
                  }`}
                >
                  {price.badge && (
                    <span className="absolute right-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full border border-brand-400/30 bg-brand-500/15 px-3 py-1 text-[11px] font-semibold text-brand-300 backdrop-blur-sm">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      {price.badge}
                    </span>
                  )}

                  <div className="card-shine rounded-2xl">
                    <TwalletCard
                      finish={finish}
                      holderName="ALEX JOHNSON"
                      panDisplay="4532 •••• •••• 4281"
                      expiry="08/29"
                      network={finish === "obsidian" || finish === "cyber" ? "mastercard" : "visa"}
                      isVirtual={card.isVirtual}
                    />
                  </div>

                  <h2 className="mt-6 text-xl font-bold text-white">{visual.label}</h2>
                  <p className="mt-1 text-sm text-surface-400">{visual.tagline}</p>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">{price.price}</span>
                    <span className="text-xs text-surface-500">{price.note}</span>
                  </div>

                  <ul className="mt-5 space-y-2.5">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-sm text-surface-300">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/15 ring-1 ring-brand-400/30">
                          <Check className="h-3 w-3 text-brand-300" aria-hidden="true" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/dashboard/orders/new"
                    className={`mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition ${
                      featured
                        ? "bg-gradient-to-r from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/30 hover:brightness-110"
                        : "border border-white/15 text-white hover:border-brand-400/40 hover:bg-brand-500/10"
                    }`}
                  >
                    Order now
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 sm:flex-row sm:p-8">
            <div>
              <h3 className="text-lg font-semibold text-white">Not sure which card to pick?</h3>
              <p className="mt-1 text-sm text-surface-400">Start with a virtual card — issued instantly, upgrade anytime.</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl border border-white/15 px-6 text-sm font-medium text-white transition hover:border-brand-400/40 hover:bg-white/5"
            >
              Talk to us
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
