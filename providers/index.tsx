"use client";

import { ReactNode, useState } from "react";
import { Toaster } from "sonner";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia, polygon, base, arbitrum, optimism } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletLinker } from "@/components/wallet/wallet-linker";
import { SessionTimeout } from "@/components/session-timeout";

// Note: WalletConnect is NOT handled by wagmi v3.
// We use @walletconnect/ethereum-provider directly with showQrModal:true
// which shows its own standalone QR modal (no SSR issues).
// Injected (MetaMask etc.) goes through wagmi normally.

function makeConfig() {
  return createConfig({
    chains: [mainnet, polygon, base, arbitrum, optimism, sepolia],
    connectors: [injected({ shimDisconnect: true })],
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
