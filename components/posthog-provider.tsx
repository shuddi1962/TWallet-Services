"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense, type ReactNode } from "react";
import posthog from "posthog-js";
import { createClient } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session } from "@supabase/auth-js";

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    posthog.capture("$pageview", { path: pathname, search: searchParams?.toString() });
  }, [pathname, searchParams]);

  return null;
}

function PostHogIdentify() {
  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        posthog.identify(session.user.id, {
          email: session.user.email,
          name: (session.user.user_metadata?.full_name as string | undefined) ?? undefined,
        });
      } else if (event === "SIGNED_OUT") {
        posthog.reset();
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return null;
}

export function PostHogProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      <PostHogIdentify />
      {children}
    </>
  );
}
