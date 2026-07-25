"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ArrowLeft, CreditCard, Wallet, Network, Coins, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { getCardProducts } from "@/features/cards/server/actions";
import { createOrder } from "@/features/orders/server/actions";
import { useActionState } from "react";
import { trackOrderPlaced } from "@/lib/analytics";

interface CardProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_usdc: number;
  type: "virtual" | "physical";
  active: boolean;
}

const networks = [
  { id: "ethereum", name: "Ethereum", icon: "⟠" },
  { id: "polygon", name: "Polygon", icon: "◆" },
  { id: "arbitrum", name: "Arbitrum", icon: "◈" },
  { id: "optimism", name: "Optimism", icon: "○" },
  { id: "base", name: "Base", icon: "◉" },
  { id: "avalanche", name: "Avalanche", icon: "▲" },
  { id: "bnb", name: "BNB Chain", icon: "◎" },
];

const tokens = [
  { id: "usdc", name: "USDC" },
  { id: "usdt", name: "USDT" },
];

export default function NewOrderPage() {
  const router = useRouter();
  const [products, setProducts] = useState<CardProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedNetwork, setSelectedNetwork] = useState<string>("ethereum");
  const [selectedToken, setSelectedToken] = useState<string>("usdc");
  const [loading, setLoading] = useState(true);

  const [state, formAction, pending] = useActionState(createOrder, undefined);

  useEffect(() => {
    getCardProducts().then((result) => {
      if (result.data) setProducts(result.data as CardProduct[]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (state?.success && state?.order?.id) {
      const product = products.find((p) => p.id === selectedProduct);
      if (product) {
        trackOrderPlaced(product.name, selectedNetwork, selectedToken, product.price_usdc);
      }
      router.push(`/dashboard/orders/${state.order.id}/confirmation`);
    }
  }, [state, router, products, selectedProduct, selectedNetwork, selectedToken]);

  const selected = products.find((p) => p.id === selectedProduct);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">New Order</h1>
          <p className="text-surface-400 mt-1 text-sm">Choose your card and configure payment.</p>
        </div>
      </div>

      {state?.error && <Alert variant="error">{state.error}</Alert>}

      <form action={formAction}>
        <input type="hidden" name="productId" value={selectedProduct} />
        <input type="hidden" name="network" value={selectedNetwork} />
        <input type="hidden" name="token" value={selectedToken} />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CreditCard className="h-5 w-5" aria-hidden="true" />
                Select Card
              </CardTitle>
              <CardDescription>Choose a card type to order.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="text-surface-400 h-6 w-6 animate-spin" />
                </div>
              ) : products.length === 0 ? (
                <p className="text-surface-400 text-sm">No cards available at this time.</p>
              ) : (
                <div className="space-y-3">
                  {products.map((product) => (
                    <label
                      key={product.id}
                      className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                        selectedProduct === product.id
                          ? "border-brand-500 bg-brand-500/5"
                          : "border-surface-800 bg-surface-900/50 hover:border-surface-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="_product"
                        value={product.id}
                        checked={selectedProduct === product.id}
                        onChange={() => setSelectedProduct(product.id)}
                        className="accent-brand-500 h-4 w-4"
                      />
                      <div className="flex-1">
                        <p className="text-surface-200 font-semibold">{product.name}</p>
                        <p className="text-surface-400 text-sm">{product.description}</p>
                        <p className="text-brand-400 mt-1 text-sm font-medium">
                          {product.price_usdc} USDC
                        </p>
                      </div>
                      <span className="bg-surface-800 text-surface-400 rounded-full px-3 py-1 text-xs">
                        {product.type}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Network className="h-5 w-5" aria-hidden="true" />
                  Network
                </CardTitle>
                <CardDescription>Select the network for payment.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {networks.map((network) => (
                    <button
                      key={network.id}
                      type="button"
                      onClick={() => setSelectedNetwork(network.id)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition ${
                        selectedNetwork === network.id
                          ? "border-brand-500 bg-brand-500/5 text-brand-400"
                          : "border-surface-800 text-surface-400 hover:border-surface-700"
                      }`}
                    >
                      <span>{network.icon}</span>
                      <span>{network.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Coins className="h-5 w-5" aria-hidden="true" />
                  Token
                </CardTitle>
                <CardDescription>Select the token for payment.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  {tokens.map((token) => (
                    <button
                      key={token.id}
                      type="button"
                      onClick={() => setSelectedToken(token.id)}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition ${
                        selectedToken === token.id
                          ? "border-brand-500 bg-brand-500/5 text-brand-400"
                          : "border-surface-800 text-surface-400 hover:border-surface-700"
                      }`}
                    >
                      {selectedToken === token.id && <Check className="h-4 w-4" />}
                      <span>{token.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selected && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-surface-400">Card</span>
                      <span className="text-surface-200">{selected.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-400">Type</span>
                      <span className="text-surface-200">{selected.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-400">Network</span>
                      <span className="text-surface-200">
                        {networks.find((n) => n.id === selectedNetwork)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-400">Token</span>
                      <span className="text-surface-200">
                        {tokens.find((t) => t.id === selectedToken)?.name}
                      </span>
                    </div>
                    <div className="border-surface-800 border-t pt-3">
                      <div className="flex justify-between text-base">
                        <span className="text-surface-200 font-semibold">Total</span>
                        <span className="text-brand-400 font-bold">{selected.price_usdc} USDC</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    fullWidth
                    className="mt-6"
                    loading={pending}
                    disabled={!selectedProduct}
                  >
                    <Wallet className="h-4 w-4" aria-hidden="true" />
                    Place Order
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
