"use client";

import { ReactNode, useState } from "react";
import { Toaster } from "sonner";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia, polygon, base, arbitrum, optimism } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { walletConnect } from "@wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletLinker } from "@/components/wallet/wallet-linker";
import { SessionTimeout } from "@/components/session-timeout";

function makeConfig() {
  return createConfig({
    chains: [mainnet, polygon, base, arbitrum, optimism, sepolia],
    connectors: [
      injected({ shimDisconnect: true }),
      walletConnect({
        projectId:
          process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
          "00e085516112e43f7ba31f5790328b65",
        showQrModal: false,
        metadata: {
          name: "TWALLET",
          description: "Non-custodial crypto card platform",
          url: "https://twalletservices.com",
          icons: ["https://twalletservices.com/opengraph-image.png"],
        },
      }),
    ],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [polygon.id]: http(),
      [base.id]: http(),
      [arbitrum.id]: http(),
      [optimism.id]: http(),
    },
    ssr: true,
  });
}

let _config: ReturnType<typeof makeConfig> | null = null;
export function getWagmiConfig() {
  if (!_config) _config = makeConfig();
  return _config;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
      }),
  );
  const [config] = useState(() => getWagmiConfig());

  return (
    <WagmiProvider config={config} reconnectOnMount>
      <QueryClientProvider client={queryClient}>
        {children}
        <WalletLinker />
        <SessionTimeout />
        <Toaster richColors position="top-right" closeButton />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
