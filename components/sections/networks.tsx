"use client";

import { Container } from "@/components/layout/container";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion-section";

const networks = [
  { name: "Ethereum", chainId: 1, symbol: "ETH", color: "#627EEA" },
  { name: "Polygon", chainId: 137, symbol: "MATIC", color: "#8247E5" },
  { name: "Arbitrum", chainId: 42161, symbol: "ARB", color: "#28A0F0" },
  { name: "Optimism", chainId: 10, symbol: "OP", color: "#FF0420" },
  { name: "Base", chainId: 8453, symbol: "ETH", color: "#0052FF" },
  { name: "BNB Chain", chainId: 56, symbol: "BNB", color: "#F0B90B" },
  { name: "Avalanche", chainId: 43114, symbol: "AVAX", color: "#E84142" },
];

export function Networks() {
  return (
    <section id="networks" className="py-20 lg:py-28">
      <Container>
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm">
              <span className="text-brand-300">Supported Chains</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Supported networks
            </h2>
            <p className="mt-4 text-lg text-surface-400">
              Pay on 7 major EVM networks. More coming soon.
            </p>
          </div>
        </FadeIn>

        <StaggerChildren className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {networks.map((network) => (
            <StaggerItem key={network.name}>
              <div className="group flex flex-col items-center rounded-xl border border-white/5 bg-surface-900/50 p-6 transition-all hover:border-white/10 hover:bg-surface-900 hover:shadow-lg hover:shadow-brand-600/5">
                <div
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-full text-base font-bold text-white shadow-lg transition-transform group-hover:scale-110"
                  style={{ backgroundColor: network.color }}
                >
                  {network.name.charAt(0)}
                </div>
                <span className="text-sm font-semibold text-white">{network.name}</span>
                <span className="mt-1 text-xs text-surface-500">{network.symbol}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  );
}
