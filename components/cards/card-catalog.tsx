"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/features/orders/server/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Check, Smartphone } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  slug: string;
  name: string;
  type: "physical" | "virtual";
  description: string;
  price_usdc: number;
  annual_fee_usdc: number;
  features: string[] | null;
}

const products: Product[] = [
  {
    id: "virtual-card",
    slug: "virtual-card",
    name: "Virtual Card",
    type: "virtual",
    description: "Perfect for online shopping and subscriptions",
    price_usdc: 5,
    annual_fee_usdc: 0,
    features: ["Instant issuance", "Online purchases", "Subscription payments", "No monthly fee"],
  },
  {
    id: "physical-card",
    slug: "physical-card",
    name: "Physical Card",
    type: "physical",
    description: "For in-store purchases and ATM withdrawals",
    price_usdc: 25,
    annual_fee_usdc: 36,
    features: ["Global shipping", "Contactless payments", "ATM withdrawals", "In-store purchases"],
  },
  {
    id: "premium-card",
    slug: "premium-card",
    name: "Premium Bundle",
    type: "physical",
    description: "Both virtual + physical cards with premium benefits",
    price_usdc: 50,
    annual_fee_usdc: 96,
    features: ["Virtual + Physical cards", "Priority verification", "Higher spending limits", "Dedicated support", "Zero top-up fees"],
  },
];

export function CardCatalog() {
  const router = useRouter();
  const [ordering, setOrdering] = useState<string | null>(null);

  const handleOrder = async (product: Product) => {
    setOrdering(product.id);
    const formData = new FormData();
    formData.set("productId", product.id);
    formData.set("network", "ethereum");
    formData.set("token", "USDC");

    const result = await createOrder(null, formData);

    if (result?.error) {
      toast.error(result.error);
      setOrdering(null);
    } else if (result?.success && result.order) {
      toast.success("Order created! Redirecting to payment...");
      router.push(`/dashboard/orders/${result.order.id}/payment`);
    } else {
      setOrdering(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Choose Your Card
        </h1>
        <p className="mt-4 text-lg text-surface-400">
          Select a card type to get started. Pay with crypto, receive your card.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {products.map((product) => {
          const isPopular = product.slug === "physical-card";
          return (
            <Card
              key={product.id}
              className={
                isPopular
                  ? "border-brand-500/50 ring-2 ring-brand-500/30"
                  : ""
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {product.type === "virtual" ? (
                      <Smartphone className="h-6 w-6 text-brand-600" />
                    ) : (
                      <CreditCard className="h-6 w-6 text-brand-600" />
                    )}
                    <CardTitle className="text-white">{product.name}</CardTitle>
                  </div>
                  {isPopular && <Badge variant="default">Most Popular</Badge>}
                </div>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    ${product.price_usdc}
                  </span>
                  <span className="ml-2 text-sm text-surface-400">one-time</span>
                  {product.annual_fee_usdc > 0 && (
                    <span className="ml-2 text-sm text-surface-400">
                      + ${product.annual_fee_usdc}/year
                    </span>
                  )}
                </div>

                <ul className="mb-8 space-y-3">
                  {(product.features ?? []).map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                      <span className="text-sm text-surface-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  fullWidth
                  variant={isPopular ? "primary" : "outline"}
                  loading={ordering === product.id}
                  onClick={() => handleOrder(product)}
                >
                  Order Now
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
