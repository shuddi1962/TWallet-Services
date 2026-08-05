"use client";

import { useEffect, useState } from "react";
import { ConnectDialog } from "./connect-dialog";
import { CONNECT_EVENT, CONNECT_CLOSE_EVENT, markConnectReady } from "@/lib/utils/connect";

export function ConnectManager() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    markConnectReady();
    const handler = () => setOpen(true);
    window.addEventListener(CONNECT_EVENT, handler);
    return () => window.removeEventListener(CONNECT_EVENT, handler);
  }, []);

  const handleClose = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent(CONNECT_CLOSE_EVENT));
  };

  return <ConnectDialog open={open} onClose={handleClose} />;
}
