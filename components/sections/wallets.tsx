"use client";

import { Container } from "@/components/layout/container";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion-section";
import { MetaMaskIcon, TrustWalletIcon, CoinbaseIcon, PhantomIcon, RainbowIcon, WalletConnectIcon, BinanceIcon, OKXIcon } from "@/components/ui/wallet-icons";

const wallets = [
  { name: "MetaMask", icon: MetaMaskIcon },
  { name: "Trust Wallet", icon: TrustWalletIcon },
  { name: "Coinbase", icon: CoinbaseIcon },
  { name: "Phantom", icon: PhantomIcon },
  { name: "Rainbow", icon: RainbowIcon },
  { name: "WalletConnect", icon: WalletConnectIcon },
  { name: "Binance", icon: BinanceIcon },
  { name: "OKX", icon: OKXIcon },
];

export function Wallets() {
  return (
    <section id="wallets" className="relative py-16 lg:py-20 bg-white">
      <Container>
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm">
              <span className="text-brand-700 font-medium">Supported Wallets</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-surface-900">
              Connect your wallet
            </h2>
            <p className="mt-4 text-surface-500">
              Works with every major self-custodial wallet. Your keys, your control.
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {wallets.map((wallet) => {
            const Icon = wallet.icon;
            return (
              <StaggerItem key={wallet.name}>
                <div className="group flex flex-col items-center rounded-2xl border border-surface-200 bg-white p-6 transition-all hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center transition-transform group-hover:scale-110">
                    <Icon className="h-12 w-12" />
                  </div>
                  <span className="text-xs font-semibold text-surface-700">{wallet.name}</span>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </Container>
    </section>
  );
}
