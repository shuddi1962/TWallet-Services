"use client";

import { Container } from "@/components/layout/container";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion-section";

const wallets = [
  { name: "MetaMask", color: "#E2761B" },
  { name: "Trust Wallet", color: "#3375BB" },
  { name: "Coinbase", color: "#0052FF" },
  { name: "Phantom", color: "#AB9FF2" },
  { name: "Rainbow", color: "#001A4A" },
  { name: "WalletConnect", color: "#3396FF" },
  { name: "Binance", color: "#F0B90B" },
  { name: "OKX", color: "#1F1F1F" },
];

export function Wallets() {
  return (
    <section id="wallets" className="relative py-16 lg:py-20">
      <Container>
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm">
              <span className="text-brand-300">Supported Wallets</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Connect your wallet
            </h2>
            <p className="mt-4 text-lg text-surface-400">
              Works with every major self-custodial wallet. Your keys, your control.
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {wallets.map((wallet) => (
            <StaggerItem key={wallet.name}>
              <div className="group flex flex-col items-center rounded-2xl border border-white/5 bg-surface-900/30 p-6 transition-all hover:border-brand-500/20 hover:bg-surface-900/60 hover:shadow-lg hover:shadow-brand-500/5">
                <div
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-lg transition-transform group-hover:scale-110"
                  style={{ backgroundColor: wallet.color }}
                >
                  {wallet.name.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-white">{wallet.name}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  );
}
