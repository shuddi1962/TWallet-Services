"use client";

import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/ui/motion-section";
import { TrustWalletIcon, WalletConnectIcon } from "@/components/ui/wallet-icons";

export function Wallets() {
  return (
    <section id="wallets" className="relative py-16 lg:py-20 bg-white">
      <Container>
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm">
              <span className="text-brand-700 font-medium">Optimized for Trust Wallet</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-surface-900">
              The recommended wallet for TWallet Services
            </h2>
            <p className="mt-4 text-surface-500">
              Securely connected using WalletConnect technology.
            </p>
          </div>
        </FadeIn>

        <div className="mt-12 flex items-center justify-center">
          <div className="group flex flex-col items-center rounded-2xl border border-brand-200 bg-brand-50 p-8 transition-all hover:shadow-xl hover:shadow-brand-500/10 sm:p-10">
            <div className="mb-4 flex h-16 w-16 items-center justify-center transition-transform group-hover:scale-110">
              <TrustWalletIcon className="h-16 w-16" />
            </div>
            <span className="text-lg font-bold text-surface-900">Trust Wallet</span>
            <p className="mt-2 text-sm text-surface-500 text-center max-w-xs">
              The official recommended wallet for TWallet Services.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-surface-400 flex items-center justify-center gap-2">
            <WalletConnectIcon className="h-4 w-4 inline-block" />
            WalletConnect powers the secure connection between Trust Wallet and TWallet Services.
          </p>
        </div>
      </Container>
    </section>
  );
}
