export const CONNECT_EVENT = "tw:open-connect";

declare global {
  interface Window {
    __twConnectReady?: boolean;
  }
}

export function markConnectReady(): void {
  if (typeof window === "undefined") return;
  window.__twConnectReady = true;
}

export function openConnectDialog(): void {
  if (typeof window === "undefined") return;
  if (window.__twConnectReady) {
    window.dispatchEvent(new CustomEvent(CONNECT_EVENT));
    return;
  }
  const redirect = "/dashboard/wallet?connect=1";
  try {
    window.sessionStorage.setItem("tw-pending-connect", "1");
  } catch {
    /* ignore storage errors */
  }
  window.location.href = `/auth/login?redirect=${encodeURIComponent(redirect)}&connect=1`;
}
