"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import { WagmiProvider } from "wagmi";
import { mainnet, sepolia, polygon, base, arbitrum, optimism } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

const queryClient = new QueryClient();

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, sepolia, polygon, base, arbitrum, optimism],
  projectId,
  ssr: true,
});

if (projectId) {
  createAppKit({
    adapters: [wagmiAdapter],
    networks: [mainnet, sepolia, polygon, base, arbitrum, optimism],
    defaultNetwork: mainnet,
    projectId,
    themeMode: "dark",
    themeVariables: {
      "--w3m-color-mix": "#2563EB",
      "--w3m-color-mix-strength": 20,
    },
    metadata: {
      name: "TWALLET",
      description: "Non-custodial crypto card platform",
      url: "https://twalletservices.com",
      icons: ["https://twalletservices.com/opengraph-image.png"],
    },
    features: {
      analytics: true,
    },
  });
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
