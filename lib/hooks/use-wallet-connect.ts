"use client";

import { useCallback } from "react";
import { useConnect, useAccount } from "wagmi";
import { useWalletConnectionState } from "./wallet-connection-context";

let providerSingleton: Promise<any> | null = null;

function getOrCreateProvider() {
  if (!providerSingleton) {
    providerSingleton = import("@walletconnect/ethereum-provider")
      .catch((err) => {
        providerSingleton = null;
        console.error("[WC] import failed:", err);
        throw err;
      })
      .then((m) => {
        const EthereumProvider = m.EthereumProvider ?? m.default;
        if (!EthereumProvider)
          throw new Error("EthereumProvider class not found in module");
        return EthereumProvider.init({
          projectId: "00e085516112e43f7ba31f5790328b65",
          showQrModal: false,
          chains: [1, 11155111, 137, 8453, 42161, 10],
          optionalChains: [1, 11155111, 137, 8453, 42161, 10],
          metadata: {
            name: "TWALLET",
            description: "Non-custodial crypto card platform",
            url: "https://twalletservices.com",
            icons: ["https://twalletservices.com/opengraph-image.png"],
          },
        });
      });
  }
  return providerSingleton;
}

export function useWalletConnect() {
  const { isConnected } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const { setUri, setConnecting } = useWalletConnectionState();

  const openWallet = useCallback(async () => {
    if (isConnected) return;
    const wcConnector = connectors.find((c) => c.id === "walletConnect");
    if (!wcConnector) return;

    setConnecting(true);
    setUri(null);

    try {
      const provider = await getOrCreateProvider();
      console.log("[WC] provider ready, injecting into connector");

      (wcConnector as Record<string, unknown>).getProvider = async () => provider;

      const onUri = (u: string) => setUri(u);
      provider.on("display_uri", onUri);
      await connectAsync({ connector: wcConnector });
      provider.off("display_uri", onUri);
    } catch (e) {
      console.error("WalletConnect error:", e);
    }
    setUri(null);
    setConnecting(false);
  }, [isConnected, connectAsync, connectors, setUri, setConnecting]);

  return {
    openWallet,
    connectors,
    connecting: isConnected ? false : isPending,
    isConnected,
  };
}
