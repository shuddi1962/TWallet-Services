"use client";

import { useCallback, useRef } from "react";
import { useAccount } from "wagmi";
import { useWalletConnectionState } from "./wallet-connection-context";

let cachedSignClient: Promise<{
  connect: (opts: {
    requiredNamespaces: Record<string, { chains: string[]; methods: string[]; events: string[] }>;
  }) => Promise<{
    uri: string | undefined;
    approval: () => Promise<{ namespaces: Record<string, { accounts: string[]; chains: string[] }> }>;
  }>;
}> | null = null;

async function getSignClient() {
  if (!cachedSignClient) {
    cachedSignClient = import("@walletconnect/sign-client")
      .then((m) => {
        const SignClient = m.SignClient ?? m.default;
        return SignClient.init({
          projectId: "00e085516112e43f7ba31f5790328b65",
          metadata: {
            name: "TWALLET",
            description: "Non-custodial crypto card platform",
            url: "https://twalletservices.com",
            icons: ["https://twalletservices.com/opengraph-image.png"],
          },
        });
      })
      .catch((err) => {
        cachedSignClient = null;
        throw err;
      });
  }
  return cachedSignClient;
}

export function useWalletConnect() {
  const { isConnected } = useAccount();
  const { setUri, setConnecting } = useWalletConnectionState();
  const busy = useRef(false);

  const openWallet = useCallback(async () => {
    if (isConnected || busy.current) return;
    busy.current = true;
    setConnecting(true);
    setUri(null);

    try {
      const signClient = await getSignClient();
      const { uri, approval } = await signClient.connect({
        requiredNamespaces: {
          eip155: {
            chains: ["eip155:1", "eip155:11155111", "eip155:137", "eip155:8453", "eip155:42161", "eip155:10"],
            methods: ["eth_sendTransaction", "eth_sign", "personal_sign", "eth_signTypedData", "eth_signTypedData_v4"],
            events: ["chainChanged", "accountsChanged"],
          },
        },
      });

      if (!uri) throw new Error("No URI returned from WalletConnect");
      setUri(uri);

      const session = await approval();
      console.log("[WC] session approved:", session);
    } catch (e) {
      console.error("WalletConnect error:", e);
    }

    busy.current = false;
    setUri(null);
    setConnecting(false);
  }, [isConnected, setUri, setConnecting]);

  return {
    openWallet,
    connecting: useWalletConnectionState().connecting,
    isConnected,
  };
}
