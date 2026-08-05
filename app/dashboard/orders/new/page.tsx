"use client";

import { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ArrowLeft, CreditCard, Smartphone, Network, Coins, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { getCardProducts } from "@/features/cards/server/actions";
import { createOrder } from "@/features/orders/server/actions";
import { openConnectDialog } from "@/lib/utils/connect";
import { useAssignedWallet } from "@/lib/hooks/use-assigned-wallet";

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

  // wagmi hooks are client-only — defer them until after hydration so the
  // server render can never throw and produce a 500 page.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { wallet, ready } = useAssignedWallet();
  const needsWallet = mounted && ready && !wallet;

  const [state, formAction, pending] = useActionState(createOrder, undefined);

  useEffect(() => {
    getCardProducts().then((result) => {
      if (result.data) setProducts(result.data as CardProduct[]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (state?.success && state?.order?.id) {
      router.push(`/dashboard/orders/${state.order.id}/payment`);
    }
  }, [state, router]);

  // If the server rejects the order because no validated wallet exists,
  // surface the connect dialog immediately (same gate as the card catalog).
  useEffect(() => {
    if (state && !state.success && state.error && /wallet|connect/i.test(state.error)) {
      openConnectDialog();
    }
  }, [state]);

  const selected = products.find((p) => p.id === selectedProduct);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">New Order</h1>
          <p className="mt-1 text-sm text-slate-500">Choose your card and configure payment.</p>
        </div>
      </div>

      {state?.error && (
        <Alert variant="error">{state.error}</Alert>
      )}

      {needsWallet && (
        <Alert variant="warning" className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>Validate your wallet to place orders and make crypto payments</span>
          <Button size="sm" variant="dark" onClick={() => openConnectDialog()}>
            <Smartphone className="h-4 w-4" />
            Validate Wallet
          </Button>
        </Alert>
      )}

      <form action={formAction}>
        <input type="hidden" name="productId" value={selectedProduct} />
        <input type="hidden" name="network" value={selectedNetwork} />
        <input type="hidden" name="token" value={selectedToken} />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <CreditCard className="h-5 w-5" aria-hidden="true" />Select Card
              </CardTitle>
              <CardDescription>Choose a card type to order.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                </div>
              ) : products.length === 0 ? (
                <p className="text-sm text-slate-500">No cards available at this time.</p>
              ) : (
                <div className="space-y-3">
                  {products.map((product) => (
                    <label
                      key={product.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition sm:gap-4 ${
                        selectedProduct === product.id
                          ? "border-black bg-neutral-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="_product"
                        value={product.id}
                        checked={selectedProduct === product.id}
                        onChange={() => setSelectedProduct(product.id)}
                        className="h-4 w-4 shrink-0 accent-brand-500"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-700">{product.name}</p>
                        <p className="text-sm text-slate-500">{product.description}</p>
                        <p className="mt-1 text-sm font-medium text-brand-600">{product.price_usdc} USDC</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
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
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Network className="h-5 w-5" aria-hidden="true" />Network
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
                      className={`flex min-w-0 items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition ${
                        selectedNetwork === network.id
                          ? "border-black bg-neutral-50 text-black"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <span className="shrink-0">{network.icon}</span>
                      <span className="truncate">{network.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Coins className="h-5 w-5" aria-hidden="true" />Token
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
                          ? "border-black bg-neutral-50 text-black"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
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
                  <CardTitle className="text-slate-900">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Card</span>
                      <span className="min-w-0 text-right font-medium text-slate-700">{selected.name}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Type</span>
                      <span className="capitalize text-slate-700">{selected.type}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Network</span>
                      <span className="text-slate-700">{networks.find((n) => n.id === selectedNetwork)?.name}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Token</span>
                      <span className="text-slate-700">{tokens.find((t) => t.id === selectedToken)?.name}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-3">
                      <div className="flex justify-between gap-3 text-base">
                        <span className="font-semibold text-slate-700">Total</span>
                        <span className="font-bold text-brand-600">{selected.price_usdc} USDC</span>
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
                    <Smartphone className="h-4 w-4" aria-hidden="true" />
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
