import "server-only";
import { cookies, headers } from "next/headers";

/**
 * Returns the ISO 3166-1 alpha-2 country code for the current request, as
 * detected by Vercel's edge geo-IP. First tries the `tw-country` cookie set by
 * middleware, then falls back to the request geo headers directly so even the
 * very first request (no cookie yet) resolves the correct country.
 * Returns undefined when no geo signal is available (e.g. local dev).
 */
export async function detectCountry(): Promise<string | undefined> {
  try {
    const store = await cookies();
    const cookieCountry = store.get("tw-country")?.value;
    if (cookieCountry && cookieCountry.length === 2) return cookieCountry.toUpperCase();
  } catch {
    /* cookie store unavailable */
  }

  try {
    const h = await headers();
    const headerCountry = geoCountryFromHeaders(h);
    if (headerCountry) return headerCountry;
  } catch {
    /* headers unavailable */
  }

  return undefined;
}

/** Vercel geo headers that may be present even beyond the cookie. */
export function geoCountryFromHeaders(headers: { get(name: string): string | null }): string | null {
  const fromCookie = headers.get("x-vercel-country");
  const fromIp = headers.get("x-vercel-ip-country");
  const v = fromCookie ?? fromIp ?? null;
  return v && v.length === 2 ? v.toUpperCase() : null;
}