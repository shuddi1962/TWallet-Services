import { Wallet, Connect } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Wallet</h1>
        <p className="mt-1 text-sm text-surface-500">
          Connect your crypto wallet to make payments
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Wallet</CardTitle>
          <CardDescription>
            Connect MetaMask, WalletConnect, Coinbase Wallet, or Trust Wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Wallet}
            title="No wallet connected"
            description="Connect your self-custody wallet to start ordering cards and making crypto payments."
            action={
              <Button>
                <Connect className="h-4 w-4" />
                Connect Wallet
              </Button>
            }
          />
        </CardContent>
      </Card>

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
                  className="flex flex-col items-center rounded-lg border border-surface-200 p-4 text-center transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
                    <Wallet className="h-6 w-6 text-brand-600" />
                  </div>
                  <span className="text-sm font-medium text-surface-900">
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
