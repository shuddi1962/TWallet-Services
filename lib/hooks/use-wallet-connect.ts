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

type Providerish = {
  on: (e: string, fn: (...args: unknown[]) => void) => void;
  off: (e: string, fn: (...args: unknown[]) => void) => void;
};

function getProvider(connector: Connector): Promise<Providerish | null> {
  const c = connector as Record<string, unknown>;
  if (typeof c.getProvider !== "function") return Promise.resolve(null);
  try {
    const p = c.getProvider() as unknown;
    const resolved = p instanceof Promise ? p : Promise.resolve(p);
    return resolved.then(
      (prov: unknown) => {
        const p2 = prov as Record<string, unknown>;
        if (p2 && typeof p2.on === "function" && typeof p2.off === "function") {
          return p2 as unknown as Providerish;
        }
        return null;
      },
      () => null,
    );
  } catch {
    return Promise.resolve(null);
  }
}

export function useWalletConnect() {
  const { isConnected, address, chainId, status } = useAccount();
  const { connectAsync, isPending, error: connectError } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const connectors = useConnectors();
  const [selectOpen, setSelectOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [qrUri, setQrUri] = useState<string | null>(null);
  const providerRef = useRef<{
    prov: Providerish;
    handler: (...args: unknown[]) => void;
  } | null>(null);

  const available = connectors.filter((c) => c && c.id !== "safe");

  useEffect(() => {
    return () => {
      const p = providerRef.current;
      if (p) {
        try { p.prov.off("display_uri", p.handler); } catch { /* ok */ }
      }
    };
  }, []);

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

      setBusyId(target.uid || target.id);
      setSelectOpen(false);
      setQrUri(null);

      try {
        if (isConnected) {
          try { await disconnectAsync(); } catch { /* ok */ }
        }

        if (isWc) {
          // Get the WalletConnect provider BEFORE connectAsync to catch display_uri
          const provider = await getProvider(target);

          if (!provider) {
            toast.error("WalletConnect provider unavailable. Try Browser Wallet instead.");
            return;
          }

          const uriPromise = new Promise<string>((resolve, reject) => {
            const handler = (...args: unknown[]) => {
              const uri = args[0];
              if (typeof uri === "string" && uri.startsWith("wc:")) {
                providerRef.current = null;
                try { provider.off("display_uri", handler); } catch { /* ok */ }
                resolve(uri);
              }
            };
            providerRef.current = { prov: provider, handler };
            provider.on("display_uri", handler);

            setTimeout(() => {
              providerRef.current = null;
              try { provider.off("display_uri", handler); } catch { /* ok */ }
              reject(new Error("timeout"));
            }, 300_000);
          });

          const connectPromise = connectAsync({ connector: target });

          const result = await Promise.race([
            uriPromise.then((uri) => ({ type: "uri" as const, uri })),
            connectPromise.then(() => ({ type: "connected" as const })),
          ]);

          providerRef.current = null;

          if (result.type === "uri") {
            setQrUri(result.uri);
            await connectPromise;
            setQrUri(null);
          }

          toast.success("Wallet connected");
        } else {
          await connectAsync({ connector: target });
          toast.success("Wallet connected");
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Connection failed";
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
        setBusyId(null);
        setQrUri(null);
      }
    },
    [available, connectAsync, disconnectAsync, isConnected],
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
    try {
      await disconnectAsync();
      toast.message("Wallet disconnected");
    } catch (e) {
      console.error(e);
    }
  }, [disconnectAsync]);

  const cancelQr = useCallback(async () => {
    const p = providerRef.current;
    if (p) {
      try { p.prov.off("display_uri", p.handler); } catch { /* ok */ }
      providerRef.current = null;
    }
    setQrUri(null);
    setBusyId(null);
    try { await disconnectAsync(); } catch { /* ok */ }
  }, [disconnectAsync]);

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
    error: connectError,
  };
}
