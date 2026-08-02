import "server-only";
import { cookies } from "next/headers";

/**
 * Returns the ISO 3166-1 alpha-2 country code for the current request, as
 * detected by Vercel's edge geo-IP (captured into a cookie in middleware).
 * Returns undefined when no geo signal is available (e.g. local dev).
 */
export async function detectCountry(): Promise<string | undefined> {
  try {
    const store = await cookies();
    const c = store.get("tw-country")?.value;
    return c && c.length === 2 ? c.toUpperCase() : undefined;
  } catch {
    return undefined;
  }
}

/** Vercel geo headers that may be present even beyond the cookie. */
export function geoCountryFromHeaders(headers: { get(name: string): string | null }): string | null {
  const fromCookie = headers.get("x-vercel-country");
  const fromIp = headers.get("x-vercel-ip-country");
  const v = fromCookie ?? fromIp ?? null;
  return v && v.length === 2 ? v.toUpperCase() : null;
}