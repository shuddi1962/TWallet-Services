"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia, polygon, base, arbitrum, optimism } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { walletConnect } from "wagmi/connectors";
import { WalletConnectionProvider } from "@/lib/hooks/wallet-connection-context";
import { WalletQRModal } from "@/components/wallet/qr-modal";

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
    walletConnect({
      projectId,
      showQrModal: false,
      metadata: {
        name: "TWALLET",
        description: "Non-custodial crypto card platform",
        url: "https://twalletservices.com",
        icons: ["https://twalletservices.com/opengraph-image.png"],
      },
    }),
  ],
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletConnectionProvider>
          {children}
          <WalletQRModal />
        </WalletConnectionProvider>
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
