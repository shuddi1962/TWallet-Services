"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const [qrUri, setQrUri] = useState<string | null>(null);
  const unsubRef = useRef<(() => void) | null>(null);
  const cancelledRef = useRef(false);

  const available = connectors.filter((c) => c && c.id !== "safe");

  const cleanup = useCallback(() => {
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const listenForUri = useCallback(
    (connector: Connector): Promise<string> =>
      new Promise((resolve, reject) => {
        const handler = (event: { type?: string; data?: unknown }) => {
          if (event.type === "display_uri" && typeof event.data === "string") {
            cleanup();
            resolve(event.data);
          }
        };

        const unsub = connector.on("message", handler);
        unsubRef.current = () => {
          unsub();
          connector.off("message", handler);
        };

        setTimeout(() => {
          cleanup();
          reject(new Error("timeout"));
        }, 300_000);
      }),
    [cleanup],
  );

  const cancelQr = useCallback(async () => {
    cancelledRef.current = true;
    cleanup();
    setQrUri(null);
    setBusyId(null);
    try {
      await disconnectAsync();
    } catch {
      // ignore
    }
  }, [cleanup, disconnectAsync]);

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

      const isWc =
        target.id === "walletConnect" ||
        target.name.toLowerCase().includes("walletconnect");

      cancelledRef.current = false;
      setBusyId(target.uid || target.id);
      setSelectOpen(false);
      setQrUri(null);

      try {
        if (isConnected) {
          try {
            await disconnectAsync();
          } catch {
            // ignore
          }
        }

        if (isWc) {
          const uriPromise = listenForUri(target);
          const connectPromise = connectAsync({ connector: target });

          const result = await Promise.race([
            uriPromise.then((uri) => ({ type: "uri" as const, uri })),
            connectPromise.then(() => ({ type: "connected" as const })),
          ]);

          if (cancelledRef.current) return;

          if (result.type === "uri") {
            setQrUri(result.uri);
            await connectPromise;
            if (cancelledRef.current) return;
          }

          toast.success("Wallet connected");
        } else {
          await connectAsync({ connector: target });
          toast.success("Wallet connected");
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Connection failed";
        if (cancelledRef.current) return;
        if (
          /reject|denied|cancel|closed|user/i.test(msg) ||
          (e as { code?: number })?.code === 4001
        ) {
          toast.message("Connection cancelled");
        } else if (/timeout/i.test(msg)) {
          toast.error("WalletConnect timed out. Try again.");
        } else {
          console.error("[wallet] connect error", e);
          toast.error(msg.slice(0, 140));
        }
      } finally {
        if (!cancelledRef.current) {
          setBusyId(null);
          setQrUri(null);
        }
      }
    },
    [available, connectAsync, disconnectAsync, isConnected, listenForUri],
  );

  const openWallet = useCallback(async () => {
    if (isConnected) {
      setSelectOpen(true);
      return;
    }

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
    cleanup();
    cancelledRef.current = true;
    try {
      await disconnectAsync();
      toast.message("Wallet disconnected");
    } catch (e) {
      console.error(e);
    }
  }, [cleanup, disconnectAsync]);

  return {
    openWallet,
    connectWith,
    disconnect: handleDisconnect,
    cancelQr,
    connecting: isPending || !!busyId || status === "connecting",
    busyId,
    isConnected,
    address,
    chainId,
    connectors: available,
    selectOpen,
    setSelectOpen,
    qrUri,
    setQrUri,
    error: connectError,
  };
}
