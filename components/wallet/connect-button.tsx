"use client";

import { useCallback, useState } from "react";
import { Smartphone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { useWalletConnectionState } from "@/lib/hooks/wallet-connection-context";

let providerSingleton: Promise<any> | null = null;

function getOrCreateProvider() {
  if (!providerSingleton) {
    providerSingleton = import("@walletconnect/ethereum-provider")
      .then((m) => {
        console.log("[WC] module loaded:", Object.keys(m));
        const EthereumProvider = m.EthereumProvider ?? m.default;
        if (!EthereumProvider) throw new Error("EthereumProvider class not found");
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
      })
      .catch((err) => {
        console.error("[WC] provider init failed:", err);
        providerSingleton = null;
        throw err;
      });
  }
  return providerSingleton;
}

export function ConnectButton() {
  const { isConnected, address } = useAccount();
  const { uri, connecting, setUri, setConnecting } = useWalletConnectionState();
  const [localConnecting, setLocalConnecting] = useState(false);

  const handleConnect = useCallback(async () => {
    if (isConnected) return;
    setConnecting(true);
    setLocalConnecting(true);
    setUri(null);

    try {
      const provider = await getOrCreateProvider();
      console.log("[WC] provider created");
      const onUri = (u: string) => {
        console.log("[WC] display_uri received");
        setUri(u);
      };
      provider.on("display_uri", onUri);
      const session = await provider.connect();
      console.log("[WC] connected:", session);
      provider.off("display_uri", onUri);
    } catch (e) {
      console.error("[WC] connection failed:", e);
    }

    setLocalConnecting(false);
    setConnecting(false);
    setUri(null);
  }, [isConnected, setUri, setConnecting]);

  const isWorking = localConnecting || connecting;

  if (isConnected && address) {
    return (
      <Button disabled className="cursor-default">
        <Smartphone className="h-4 w-4" />
        <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
      </Button>
    );
  }

  return (
    <Button onClick={handleConnect} disabled={isWorking}>
      {isWorking ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Smartphone className="h-4 w-4" />
      )}
      <span>{isWorking ? "Connecting..." : "Connect Wallet"}</span>
    </Button>
  );
}
