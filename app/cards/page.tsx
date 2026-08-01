import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/layout/page-hero";

const cards = [
  { name: "Midnight Black", color: "from-gray-900 to-black", accent: "text-gray-300", badge: "Most Popular" },
  { name: "Titanium", color: "from-gray-400 to-gray-600", accent: "text-gray-300" },
  { name: "Royal Blue", color: "from-blue-600 to-blue-800", accent: "text-blue-400" },
  { name: "Silver", color: "from-gray-200 to-gray-400", accent: "text-gray-300" },
  { name: "Gold", color: "from-yellow-500 to-yellow-700", accent: "text-yellow-400", badge: "Premium" },
];

export default function CardsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface-950">
        <PageHero
          badge="Cards"
          title="Choose Your Card"
          subtitle="Select from our range of premium card designs."
        />
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.name}
                className="group relative overflow-hidden rounded-2xl border border-surface-800 bg-surface-900 p-6 transition hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/5"
              >
                {card.badge && (
                  <span className="absolute right-4 top-4 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                    {card.badge}
                  </span>
                )}
                <div className={`mb-6 h-48 rounded-xl bg-gradient-to-br ${card.color} shadow-lg`} />
                <h3 className={`text-xl font-bold ${card.accent}`}>{card.name}</h3>
                <p className="mt-2 text-sm text-surface-400">Premium crypto-funded card with worldwide acceptance.</p>
                <ul className="mt-4 space-y-2 text-sm text-surface-400">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                    Contactless payments
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                    ATM access
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                    Online purchases
                  </li>
                </ul>
                <Link
                  href="/dashboard/orders/new"
                  className="mt-6 block w-full rounded-xl bg-brand-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-brand-700"
                >
                  Order Now
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}