"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia, polygon, base, arbitrum, optimism } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected, walletConnect } from "@wagmi/connectors";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { WalletModalProvider } from "@/lib/wallet-modal-context";

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
    injected({ shimDisconnect: true }),
    walletConnect({ projectId }),
  ],
});

if (projectId) {
  createWeb3Modal({
    wagmiConfig,
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
  });
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </WagmiProvider>
  );
}