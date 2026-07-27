"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia, polygon, base, arbitrum, optimism } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { walletConnect } from "@wagmi/connectors";

const queryClient = new QueryClient();

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, polygon, base, arbitrum, optimism],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
  },
  connectors: [
    walletConnect({ projectId, showQrModal: true }),
  ],
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
