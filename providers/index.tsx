"use client";

import { ReactNode, useState, useEffect } from "react";
import { Toaster } from "sonner";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, sepolia, polygon, base, arbitrum, optimism, type AppKitNetwork } from "@reown/appkit/networks";

const queryClient = new QueryClient();

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

const networks = [mainnet, sepolia, polygon, base, arbitrum, optimism] as [AppKitNetwork, ...AppKitNetwork[]];

let wagmiConfig: ReturnType<WagmiAdapter["wagmiConfig"]> | null = null;
let appKitInitialized = false;

try {
  const adapter = new WagmiAdapter({ networks, projectId });
  wagmiConfig = adapter.wagmiConfig;
  createAppKit({
    adapters: [adapter],
    networks,
    projectId,
    metadata: {
      name: "TWALLET",
      description: "Non-custodial crypto card platform",
      url: "https://twalletservices.com",
      icons: ["https://twalletservices.com/opengraph-image.png"],
    },
    themeMode: "dark",
    features: { analytics: false },
  });
  appKitInitialized = true;
} catch (e) {
  console.error("[Providers] AppKit init failed:", e);
}

export function Providers({ children }: { children: ReactNode }) {
  if (!wagmiConfig) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    );
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
