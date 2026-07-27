"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ArrowLeft, CreditCard, Smartphone, Network, Coins, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { getCardProducts } from "@/features/cards/server/actions";
import { createOrder } from "@/features/orders/server/actions";
import { useActionState } from "react";
import { useWalletConnect } from "@/lib/hooks/use-wallet-connect";

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

  const { isConnected } = useAccount();
  const { openWallet, connecting } = useWalletConnect();

  const [state, formAction, pending] = useActionState(createOrder, undefined);

  useEffect(() => {
    getCardProducts().then((result) => {
      if (result.data) setProducts(result.data as CardProduct[]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (state?.success && state?.order?.id) {
      router.push(`/dashboard/orders/${state.order.id}/confirmation`);
    }
  }, [state, router]);

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
          <p className="mt-1 text-sm text-surface-400">Choose your card and configure payment.</p>
        </div>
      </div>

      {state?.error && (
        <Alert variant="error">{state.error}</Alert>
      )}

      {!isConnected && (
        <Alert variant="warning" className="flex items-center justify-between">
          <span>Connect Trust Wallet to place orders and make crypto payments</span>
          <Button size="sm" variant="primary" onClick={() => openWallet()} disabled={connecting}>
            {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />}
            {connecting ? "Connecting..." : "Connect Trust Wallet"}
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
              <CardTitle className="flex items-center gap-2 text-white">
                <CreditCard className="h-5 w-5" aria-hidden="true" />Select Card
              </CardTitle>
              <CardDescription>Choose a card type to order.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-surface-400" />
                </div>
              ) : products.length === 0 ? (
                <p className="text-sm text-surface-400">No cards available at this time.</p>
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
                        className="h-4 w-4 accent-brand-500"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-surface-200">{product.name}</p>
                        <p className="text-sm text-surface-400">{product.description}</p>
                        <p className="mt-1 text-sm font-medium text-brand-400">{product.price_usdc} USDC</p>
                      </div>
                      <span className="rounded-full bg-surface-800 px-3 py-1 text-xs text-surface-400">
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
                      <span className="text-surface-200">{networks.find((n) => n.id === selectedNetwork)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-400">Token</span>
                      <span className="text-surface-200">{tokens.find((t) => t.id === selectedToken)?.name}</span>
                    </div>
                    <div className="border-t border-surface-800 pt-3">
                      <div className="flex justify-between text-base">
                        <span className="font-semibold text-surface-200">Total</span>
                        <span className="font-bold text-brand-400">{selected.price_usdc} USDC</span>
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
