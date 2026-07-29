"use client";

import { ReactNode, useState } from "react";
import { Toaster } from "sonner";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia, polygon, base, arbitrum, optimism } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletLinker } from "@/components/wallet/wallet-linker";
import { SessionTimeout } from "@/components/session-timeout";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "00e085516112e43f7ba31f5790328b65";

const metadata = {
  name: "TWALLET",
  description: "Non-custodial crypto card platform",
  url: "https://twalletservices.com",
  icons: ["https://twalletservices.com/opengraph-image.png"],
};

/**
 * Single wagmi config only — no second AppKit adapter (that broke connections).
 * WalletConnect showQrModal:true opens official QR + multi-wallet UI.
 */
export const wagmiConfig = createConfig({
  chains: [mainnet, polygon, base, arbitrum, optimism, sepolia],
  connectors: [
    injected({
      shimDisconnect: true,
      unstable_shimAsyncInject: 2_000,
    }),
    walletConnect({
      projectId,
      showQrModal: true,
      metadata,
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

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1 },
        },
      }),
  );

  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount>
      <QueryClientProvider client={queryClient}>
        {children}
        <WalletLinker />
        <SessionTimeout />
        <Toaster richColors position="top-right" closeButton />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
