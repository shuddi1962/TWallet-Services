"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { openConnectDialog } from "@/lib/utils/connect";

export function AutoConnect() {
  const searchParams = useSearchParams();
  const { isConnected } = useAccount();
  const openedRef = useRef(false);

  useEffect(() => {
    if (openedRef.current || isConnected) return;

    const fromParam = searchParams.get("connect") === "1";
    const fromStorage = typeof window !== "undefined" && window.sessionStorage.getItem("tw-pending-connect") === "1";

    if (fromParam || fromStorage) {
      openedRef.current = true;
      window.sessionStorage.removeItem("tw-pending-connect");
      setTimeout(() => openConnectDialog(), 600);
    }
  }, [searchParams, isConnected]);

  return null;
}
