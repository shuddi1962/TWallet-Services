"use client";

import { ReactNode, useState } from "react";
import { Toaster } from "sonner";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia, polygon, base, arbitrum, optimism } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected, walletConnect } from "wagmi/connectors";
import { WalletConnectionProvider } from "@/lib/hooks/wallet-connection-context";
import { WalletQRModal } from "@/components/wallet/qr-modal";
import { WalletLinker } from "@/components/wallet/wallet-linker";
import { SessionTimeout } from "@/components/session-timeout";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

const metadata = {
  name: "TWALLET",
  description: "Non-custodial crypto card platform",
  url: typeof window !== "undefined" ? window.location.origin : "https://twalletservices.com",
  icons: ["https://twalletservices.com/opengraph-image.png"],
};

const connectors = [
  injected({ shimDisconnect: true }),
  ...(projectId
    ? [
        walletConnect({
          projectId,
          showQrModal: true,
          metadata,
        }),
      ]
    : []),
];

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
  connectors,
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
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletConnectionProvider>
          {children}
          <WalletQRModal />
          <WalletLinker />
          <SessionTimeout />
        </WalletConnectionProvider>
        <Toaster richColors position="top-right" closeButton />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
