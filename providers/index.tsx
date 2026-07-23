"use client";

import { ReactNode, useEffect } from "react";
import { Toaster } from "sonner";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { mainnet, sepolia, polygon, base, arbitrum, optimism } from "wagmi/chains";

const queryClient = new QueryClient();

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID";

const metadata = {
  name: "TWALLET",
  description: "Premium crypto-funded card platform",
  url: "https://twalletservices.com",
  icons: ["/icon.png"],
};

const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet, sepolia, polygon, base, arbitrum, optimism],
  projectId,
  metadata,
  enableEIP6963: true,
  enableCoinbase: true,
  enableInjected: true,
  enableWalletConnect: true,
  auth: {
    email: true,
    showWallets: true,
    walletFeatures: true,
  },
});

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    createWeb3Modal({
      wagmiConfig,
      projectId,
      themeMode: "dark",
      themeVariables: {
        "--w3m-color-mix": "#2563eb",
        "--w3m-color-mix-strength": 20,
      },
    });
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
