"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useConnect, type Connector } from "wagmi";
import { WalletSelectModal } from "@/components/wallet/wallet-select-modal";

interface WalletModalContextValue {
  open: (connectors: readonly Connector[]) => void;
  close: () => void;
}

const WalletModalContext = createContext<WalletModalContextValue | null>(null);

export function useWalletModal() {
  const ctx = useContext(WalletModalContext);
  if (!ctx) throw new Error("useWalletModal must be used within WalletModalProvider");
  return ctx;
}

export function WalletModalProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [connectors, setConnectors] = useState<readonly Connector[]>([]);
  const { connectAsync } = useConnect();

  const open = useCallback((cs: readonly Connector[]) => {
    setConnectors(cs);
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  const handleSelect = useCallback(
    async (connectorOrType: Connector | "walletconnect") => {
      setVisible(false);
      try {
        if (connectorOrType === "walletconnect") {
          const wc = connectors.find((c) => c.id === "walletConnect");
          if (wc) await connectAsync({ connector: wc });
        } else {
          await connectAsync({ connector: connectorOrType });
        }
      } catch {}
    },
    [connectAsync, connectors],
  );

  return (
    <WalletModalContext.Provider value={{ open, close }}>
      {children}
      <WalletSelectModal
        open={visible}
        onClose={close}
        connectors={connectors}
        onSelect={handleSelect}
      />
    </WalletModalContext.Provider>
  );
}
