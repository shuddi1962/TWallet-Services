"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type WalletConnectionState = {
  uri: string | null;
  connecting: boolean;
  setUri: (uri: string | null) => void;
  setConnecting: (v: boolean) => void;
};

const WalletConnectionContext = createContext<WalletConnectionState>({
  uri: null,
  connecting: false,
  setUri: () => {},
  setConnecting: () => {},
});

export function WalletConnectionProvider({ children }: { children: ReactNode }) {
  const [uri, setUri] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  return (
    <WalletConnectionContext.Provider value={{ uri, connecting, setUri, setConnecting }}>
      {children}
    </WalletConnectionContext.Provider>
  );
}

export function useWalletConnectionState() {
  return useContext(WalletConnectionContext);
}
