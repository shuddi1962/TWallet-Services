"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/features/orders/server/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { TwalletCard, finishForSlug, networkForSlug } from "@/components/cards/twallet-card";

export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  type: "physical" | "virtual";
  description: string | null;
  price_usdc: number;
  annual_fee_usdc: number | null;
  features: string[] | string | null;
}

type OrderResult =
  | { error: string }
  | { success: true; order: { id: string; order_number: string; amount_usdc: number } };

function parseFeatures(features: CatalogProduct["features"]): string[] {
  if (!features) return [];
  if (Array.isArray(features)) return features.map(String);
  try {
    const parsed = JSON.parse(features);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function CardCatalog({ products }: { products: CatalogProduct[] }) {
  const router = useRouter();
  const [ordering, setOrdering] = useState<string | null>(null);

  const handleOrder = async (product: CatalogProduct) => {
    setOrdering(product.id);
    const formData = new FormData();
    formData.set("productId", product.id);
    formData.set("network", "ethereum");
    formData.set("token", "USDC");

    try {
      const result = (await createOrder(null, formData)) as OrderResult;
      if ("error" in result) {
        toast.error(result.error);
        setOrdering(null);
      } else if (result.success && result.order) {
        toast.success("Order created — redirecting to payment…");
        router.push(`/dashboard/orders/${result.order.id}/payment`);
      } else {
        setOrdering(null);
      }
    } catch {
      toast.error("Failed to create order");
      setOrdering(null);
    }
  };

  if (!products.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-surface-900/60 px-6 py-16 text-center">
        <p className="text-lg font-medium text-white">No cards available</p>
        <p className="mt-2 text-sm text-surface-400">Check back soon or contact support.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-900 via-surface-900 to-brand-950/50 p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300">
            <Sparkles className="h-3.5 w-3.5" />
            Order catalog
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Choose Your Card</h2>
          <p className="mt-3 max-w-xl text-surface-400">
            Real Trust debit designs. Pay with crypto on-chain — virtual cards activate after payment verification.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product, idx) => {
          const features = parseFeatures(product.features);
          const isPopular = product.slug === "physical-standard" || product.slug === "virtual-premium";
          const finish = finishForSlug(product.slug);
          const network = networkForSlug(product.slug);
          const annual = Number(product.annual_fee_usdc ?? 0);
          const first4 = "4532";
          const last4 = String(4200 + idx).slice(-4);

          return (
            <div
              key={product.id}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-3xl border bg-surface-900/70 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-500/10",
                isPopular ? "border-brand-500/40 ring-1 ring-brand-500/20" : "border-white/10",
              )}
            >
              {isPopular && (
                <div className="absolute right-4 top-4 z-10">
                  <Badge className="bg-brand-600 text-white shadow-lg shadow-brand-600/30">Popular</Badge>
                </div>
              )}

              <div className="p-4 pb-0">
                <TwalletCard
                  finish={finish}
                  holderName="YOUR NAME"
                  panDisplay={`${first4} •••• •••• ${last4}`}
                  expiry="08/29"
                  cvv="•••"
                  network={network}
                  isVirtual={product.type === "virtual"}
                  interactive
                  className="max-w-none"
                />
              </div>

              <div className="flex flex-1 flex-col px-5 pb-5 pt-2">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                  <Badge variant="outline" className="capitalize text-[10px]">
                    {product.type}
                  </Badge>
                </div>
                <p className="line-clamp-2 text-sm text-surface-400">{product.description}</p>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">
                    ${Number(product.price_usdc).toFixed(2)}
                  </span>
                  <span className="text-xs text-surface-500">USDC one-time</span>
                </div>
                {annual > 0 && (
                  <p className="mt-1 text-xs text-surface-500">+ ${annual.toFixed(2)} annual fee</p>
                )}

                <ul className="mt-5 flex-1 space-y-2.5">
                  {features.slice(0, 5).map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                        <Check className="h-3 w-3 text-emerald-400" />
                      </span>
                      <span className="text-sm text-surface-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  fullWidth
                  className="mt-6 rounded-xl"
                  variant={isPopular ? "primary" : "outline"}
                  disabled={ordering === product.id}
                  onClick={() => void handleOrder(product)}
                >
                  {ordering === product.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating order…
                    </>
                  ) : (
                    "Order Now"
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
