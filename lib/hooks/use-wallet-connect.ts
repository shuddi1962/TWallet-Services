"use client";

import { useCallback, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useConnectors,
  type Connector,
} from "wagmi";
import { toast } from "sonner";

export function useWalletConnect() {
  const { isConnected, address, chainId, status } = useAccount();
  const { connectAsync, isPending, error: connectError } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const connectors = useConnectors();
  const [selectOpen, setSelectOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const available = connectors.filter((c) => {
    // hide duplicates / broken
    if (!c) return false;
    if (c.id === "safe") return false;
    return true;
  });

  const connectWith = useCallback(
    async (connector: Connector | string) => {
      const target =
        typeof connector === "string"
          ? available.find((c) => c.uid === connector || c.id === connector)
          : connector;

      if (!target) {
        toast.error("Wallet connector not available");
        return;
      }

      setBusyId(target.uid || target.id);
      setSelectOpen(false);

      try {
        // If already connected to something else, disconnect first
        if (isConnected) {
          try {
            await disconnectAsync();
          } catch {
            // ignore
          }
        }

        await connectAsync({ connector: target });
        toast.success("Wallet connected");
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Connection failed";
        // User rejected is normal
        if (
          /reject|denied|cancel|closed/i.test(msg) ||
          (e as { code?: number })?.code === 4001
        ) {
          toast.message("Connection cancelled");
        } else {
          console.error("[wallet] connect error", e);
          toast.error(msg.slice(0, 120));
        }
      } finally {
        setBusyId(null);
      }
    },
    [available, connectAsync, disconnectAsync, isConnected],
  );

  const openWallet = useCallback(async () => {
    if (isConnected) {
      setSelectOpen(true);
      return;
    }

    // Prefer showing picker when multiple options
    if (available.length > 1) {
      setSelectOpen(true);
      return;
    }

    const only = available[0];
    if (only) {
      await connectWith(only);
      return;
    }

    toast.error("No wallet connectors loaded. Refresh and try again.");
  }, [available, connectWith, isConnected]);

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
    disconnect: handleDisconnect,
    connecting: isPending || !!busyId || status === "connecting",
    busyId,
    isConnected,
    address,
    chainId,
    connectors: available,
    selectOpen,
    setSelectOpen,
    error: connectError,
  };
}
