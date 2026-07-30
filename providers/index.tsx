"use client";

import { ReactNode, useState } from "react";
import { Toaster } from "sonner";
import { WagmiProvider, type Config } from "wagmi";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, polygon, base, arbitrum, optimism, sepolia } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletLinker } from "@/components/wallet/wallet-linker";
import { SessionTimeout } from "@/components/session-timeout";
import { config, projectId, wagmiAdapter } from "@/lib/wagmi-config";

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, polygon, base, arbitrum, optimism, sepolia],
  defaultNetwork: mainnet,
  metadata: {
    name: "TWALLET",
    description: "Non-custodial crypto card platform",
    url: "https://twalletservices.com",
    icons: ["https://twalletservices.com/opengraph-image"],
  },
  features: { analytics: false },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
      }),
  );

  return (
    <WagmiProvider config={config as Config}>
      <QueryClientProvider client={queryClient}>
        {children}
        <WalletLinker />
        <SessionTimeout />
        <Toaster richColors position="top-right" closeButton />
      </QueryClientProvider>
    </WagmiProvider>
  );
}