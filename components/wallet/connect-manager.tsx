"use client";

import { useEffect, useState } from "react";
import { ConnectDialog } from "./connect-dialog";
import { CONNECT_EVENT, markConnectReady } from "@/lib/utils/connect";

export function ConnectManager() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    markConnectReady();
    const handler = () => setOpen(true);
    window.addEventListener(CONNECT_EVENT, handler);
    return () => window.removeEventListener(CONNECT_EVENT, handler);
  }, []);

  return <ConnectDialog open={open} onClose={() => setOpen(false)} />;
}
