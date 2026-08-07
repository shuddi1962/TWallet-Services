export const CONSENT_KEY = "tw-analytics-consent";
export const CONSENT_EVENT = "tw:consent";

export function getAnalyticsConsent(): "granted" | "denied" | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function setAnalyticsConsent(granted: boolean): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
  } catch {
    // storage unavailable (private mode) — consent just won't persist
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { granted } }));
}
