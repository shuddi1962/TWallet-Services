"use client";

import { ReactNode, useState } from "react";
import { Toaster } from "sonner";
import { WagmiProvider, cookieToInitialState, type Config } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  mainnet,
  sepolia,
  polygon,
  base,
  arbitrum,
  optimism,
  type AppKitNetwork,
} from "@reown/appkit/networks";
import { WalletLinker } from "@/components/wallet/wallet-linker";
import { AppKitBridge } from "@/components/wallet/appkit-bridge";
import { SessionTimeout } from "@/components/session-timeout";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  mainnet,
  polygon,
  base,
  arbitrum,
  optimism,
  sepolia,
];

const metadata = {
  name: "TWALLET",
  description: "Non-custodial crypto card platform — pay on-chain to the platform receiving wallet",
  url: "https://twalletservices.com",
  icons: ["https://twalletservices.com/opengraph-image.png"],
};

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

if (projectId) {
  createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    metadata,
    themeMode: "dark",
    themeVariables: {
      "--w3m-accent": "#2563eb",
      "--w3m-border-radius-master": "16px",
    },
    features: {
      analytics: false,
      email: false,
      socials: false,
    },
    allWallets: "SHOW",
    enableWalletConnect: true,
    enableInjected: true,
    enableCoinbase: true,
  });
}

export function Providers({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies?: string | null;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1 },
        },
      }),
  );

  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies ?? undefined);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
        <AppKitBridge />
        <WalletLinker />
        <SessionTimeout />
        <Toaster richColors position="top-right" closeButton />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
