import { WalletConnect } from "@/components/wallet/wallet-connect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Wallet</h1>
        <p className="mt-1 text-sm text-surface-400">
          Connect your crypto wallet to make payments
        </p>
      </div>

      <WalletConnect />

      <Card>
        <CardHeader>
          <CardTitle>Supported Wallets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["MetaMask", "WalletConnect", "Coinbase Wallet", "Trust Wallet"].map(
              (wallet) => (
                <div
                  key={wallet}
                  className="flex flex-col items-center rounded-lg border border-white/5 bg-surface-900/50 p-4 text-center transition-all hover:border-white/10 hover:bg-surface-900"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 ring-1 ring-brand-500/20">
                    <Wallet className="h-6 w-6 text-brand-400" />
                  </div>
                  <span className="text-sm font-medium text-white">
                    {wallet}
                  </span>
                </div>
              ),
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
