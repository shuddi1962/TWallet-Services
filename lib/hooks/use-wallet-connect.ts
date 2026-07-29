"use client";

import { useCallback, useMemo, useState } from "react";
import { useAccount, useConnect, useDisconnect, useConnectors, type Connector } from "wagmi";
import { toast } from "sonner";

export function useWalletConnect() {
  const { isConnected, address, chainId, status } = useAccount();
  const { connectAsync, isPending } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const connectors = useConnectors();
  const [selectOpen, setSelectOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const available = useMemo(() => connectors.filter((c) => c && c.id !== "safe"), [connectors]);

  const connectWC = useCallback(async () => {
    setBusyId("walletconnect");
    setSelectOpen(false);

    try {
      if (isConnected) {
        try { await disconnectAsync(); } catch { /* ok */ }
      }

      const { EthereumProvider } = await import("@walletconnect/ethereum-provider");
      const provider = await EthereumProvider.init({
        projectId:
          process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
          "00e085516112e43f7ba31f5790328b65",
        showQrModal: true,
        chains: [1, 137, 8453, 42161, 10, 11155111],
        metadata: {
          name: "TWALLET",
          description: "Non-custodial crypto card platform",
          url: "https://twalletservices.com",
          icons: ["https://twalletservices.com/opengraph-image.png"],
        },
        optionalChains: [1, 137, 8453, 42161, 10, 11155111],
      });

      await provider.connect();
      const accounts = provider.accounts as string[];
      if (!accounts?.length) throw new Error("No accounts returned");
      toast.success("Wallet connected");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Connection failed";
      if (
        /reject|denied|cancel|closed|user/i.test(msg) ||
        (e as { code?: number })?.code === 4001
      ) {
        toast.message("Connection cancelled");
      } else {
        console.error("[wallet] WC error", e);
        toast.error(msg.slice(0, 140));
      }
    } finally {
      setBusyId(null);
    }
  }, [disconnectAsync, isConnected]);

  const connectInjected = useCallback(
    async (connector?: Connector) => {
      const target = connector || available.find((c) => c.id === "injected");
      if (!target) {
        toast.error("No browser wallet found");
        return;
      }

      setBusyId(target.uid || target.id);
      setSelectOpen(false);

      try {
        if (isConnected) {
          try { await disconnectAsync(); } catch { /* ok */ }
        }
        await connectAsync({ connector: target });
        toast.success("Wallet connected");
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Connection failed";
        if (
          /reject|denied|cancel|closed|user/i.test(msg) ||
          (e as { code?: number })?.code === 4001
        ) {
          toast.message("Connection cancelled");
        } else {
          console.error("[wallet] injected error", e);
          toast.error(msg.slice(0, 140));
        }
      } finally {
        setBusyId(null);
      }
    },
    [available, connectAsync, disconnectAsync, isConnected],
  );

  // connectWith is a compat wrapper (used by payment-form and wallet-select-modal)
  const connectWith = useCallback(
    async (connectorOrType: Connector | "walletconnect") => {
      if (connectorOrType === "walletconnect") {
        await connectWC();
      } else {
        await connectInjected(connectorOrType);
      }
    },
    [connectWC, connectInjected],
  );

  const openWallet = useCallback(async () => {
    if (isConnected) {
      setSelectOpen(true);
      return;
    }

    if (available.length >= 1) {
      setSelectOpen(true);
      return;
    }

    await connectWC();
  }, [available, connectWC, isConnected]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnectAsync();
      toast.message("Wallet disconnected");
    } catch (e) {
      console.error(e);
    }
  }, [disconnectAsync]);

  return {
    openWallet,
    connectWith,
    connectInjected,
    connectWC,
    disconnect: handleDisconnect,
    connecting: isPending || !!busyId || status === "connecting",
    busyId,
    isConnected,
    address,
    chainId,
    connectors: available,
    selectOpen,
    setSelectOpen,
    error: null,
  };
}
