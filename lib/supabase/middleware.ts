import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const LAST_ACTIVE_COOKIE = "tw-last-active";
const DEFAULT_IDLE_MINUTES = 30;

function parseLastActive(value: string | undefined): { lastActive: number; idleMinutes: number } | null {
  if (!value) return null;
  const [epoch, mins] = value.split(":");
  const lastActive = Number(epoch);
  const idleMinutes = Number(mins);
  if (!Number.isFinite(lastActive) || !Number.isFinite(idleMinutes) || idleMinutes < 1) return null;
  return { lastActive, idleMinutes };
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Capture the country Vercel geo-IP detects, so the auth actions can persist
  // it into the user profile instead of the hardcoded 'US' default.
  const country = request.headers.get("x-vercel-ip-country");
  if (country && country.length === 2) {
    supabaseResponse.cookies.set("tw-country", country, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) supabaseResponse.cookies.set(name, value, options);
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin");
  const isAdminAuthPage = request.nextUrl.pathname.startsWith("/admin/login") ||
    request.nextUrl.pathname.startsWith("/admin/forgot-password") ||
    request.nextUrl.pathname.startsWith("/admin/reset-password");
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");
  const isProtected = isDashboardPage || (isAdminPage && !isAdminAuthPage);

  // Server-side inactivity enforcement: the `tw-last-active` cookie (set at
  // sign-in with the configured idle timeout) must have been refreshed by a
  // protected request within the idle window. If it has lapsed — e.g. the tab
  // was closed or the laptop was asleep — the session is revoked server-side,
  // not just in the client.
  if (user && isProtected) {
    const parsed = parseLastActive(request.cookies.get(LAST_ACTIVE_COOKIE)?.value);
    const now = Date.now();

    if (parsed) {
      const idleMs = parsed.idleMinutes * 60 * 1000;
      if (now - parsed.lastActive > idleMs) {
        await supabase.auth.signOut();
        const url = request.nextUrl.clone();
        url.pathname = "/auth/login";
        url.searchParams.set("expired", "1");
        url.searchParams.set("redirect", request.nextUrl.pathname);
        const res = NextResponse.redirect(url);
        res.cookies.set(LAST_ACTIVE_COOKIE, "", {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 0,
        });
        // Carry the sign-out cookie deletions from the session client onto the
        // redirect response (same header the framework applies for responses).
        const setCookie = supabaseResponse.headers.get("x-middleware-set-cookie");
        if (setCookie) res.headers.append("x-middleware-set-cookie", setCookie);
        return res;
      }
      // Active within the window — slide it forward.
      supabaseResponse.cookies.set(LAST_ACTIVE_COOKIE, `${now}:${parsed.idleMinutes}`, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: parsed.idleMinutes * 60,
      });
    } else {
      // Session that predates the cookie (or first visit since deploy): start
      // the window now instead of force-logging-out.
      supabaseResponse.cookies.set(LAST_ACTIVE_COOKIE, `${now}:${DEFAULT_IDLE_MINUTES}`, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: DEFAULT_IDLE_MINUTES * 60,
      });
    }
  }

  if (!user && isDashboardPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (!user && isAdminPage && !isAdminAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (user && isAdminPage) {
    const { data: admin } = await supabase
      .from("admins")
      .select("profile_id")
      .eq("profile_id", user.id)
      .maybeSingle();

    if (!admin) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
