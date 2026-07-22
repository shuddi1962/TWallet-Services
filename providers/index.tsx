"use client";

import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { WagmiProvider, http, createConfig } from "wagmi";
import { walletConnect } from "wagmi/connectors";
import { arbitrum, base, bsc, mainnet, optimism, polygon, avalanche } from "wagmi/chains";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "PLACEHOLDER_REPLACE_WITH_REAL_PROJECT_ID";

const chains = [mainnet, polygon, arbitrum, optimism, base, bsc, avalanche] as const;

const metadata = {
  name: "TWallet Card",
  description: "Non-custodial crypto-funded card platform",
  url: "https://twalletservices.com",
  icons: ["https://twalletservices.com/favicon.ico"],
};

const wagmiConfig = createConfig({
  chains,
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
    [bsc.id]: http(),
    [avalanche.id]: http(),
  },
});

createWeb3Modal({
  wagmiConfig,
  projectId,
  metadata,
  themeMode: "dark",
  defaultChain: mainnet,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
