"use client";

import { ReactNode, useEffect, useState } from "react";
import { Toaster } from "sonner";
import { WagmiProvider, createConfig, http, type Config } from "wagmi";
import { mainnet, sepolia, polygon, base, arbitrum, optimism } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletLinker } from "@/components/wallet/wallet-linker";
import { SessionTimeout } from "@/components/session-timeout";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

const metadata = {
  name: "TWALLET",
  description: "Non-custodial crypto card platform — pay on-chain to the platform receiving wallet",
  url: "https://twalletservices.com",
  icons: ["https://twalletservices.com/opengraph-image.png"],
};

/** Stable wagmi config — always available so hooks never run outside provider */
export const wagmiConfig = createConfig({
  chains: [mainnet, polygon, base, arbitrum, optimism, sepolia],
  connectors: [
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
}) as Config;

let appKitReady = false;

async function initAppKit() {
  if (appKitReady || !projectId || typeof window === "undefined") return;
  try {
    const { createAppKit } = await import("@reown/appkit/react");
    const { WagmiAdapter } = await import("@reown/appkit-adapter-wagmi");
    const networks = await import("@reown/appkit/networks");

    const appNetworks = [
      networks.mainnet,
      networks.polygon,
      networks.base,
      networks.arbitrum,
      networks.optimism,
      networks.sepolia,
    ] as [typeof networks.mainnet, ...typeof networks.mainnet[]];

    const adapter = new WagmiAdapter({
      networks: appNetworks,
      projectId,
      ssr: true,
    });

    createAppKit({
      adapters: [adapter],
      networks: appNetworks,
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

    appKitReady = true;
    window.dispatchEvent(new Event("twallet:appkit-ready"));
  } catch (e) {
    console.error("[AppKit] init failed — falling back to wagmi connectors", e);
    window.dispatchEvent(new Event("twallet:appkit-failed"));
  }
}

function AppKitBootstrap() {
  useEffect(() => {
    void initAppKit();
  }, []);
  return null;
}

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
        <AppKitBootstrap />
        {children}
        <WalletLinker />
        <SessionTimeout />
        <Toaster richColors position="top-right" closeButton />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
