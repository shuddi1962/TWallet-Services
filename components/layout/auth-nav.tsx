"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function AuthNav({ mobile = false }: { mobile?: boolean }) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (mounted) setSignedIn(Boolean(data.user));
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: { user: { id: string } | null } | null) => {
      if (mounted) setSignedIn(Boolean(session));
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (mobile) {
    return (
      <Button className="h-11 w-full rounded-xl border-0 bg-brand-500 text-white hover:bg-brand-600" asChild>
        {signedIn ? (
          <Link href="/dashboard">Dashboard</Link>
        ) : (
          <Link href="/auth/login">Login/Signup</Link>
        )}
      </Button>
    );
  }

  if (signedIn === null) {
    return (
      <Button
        className="hidden h-9 items-center rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white/70 sm:flex"
        asChild
      >
        <Link href="/auth/login">Login</Link>
      </Button>
    );
  }

  if (signedIn) {
    return (
      <Button
        className="hidden h-9 items-center rounded-lg border-0 bg-brand-500 px-4 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600 sm:flex"
        asChild
      >
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    );
  }

  return (
    <Button
      className="hidden h-9 items-center rounded-lg border-0 bg-brand-500 px-4 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600 sm:flex"
      asChild
    >
      <Link href="/auth/login">Login/Signup</Link>
    </Button>
  );
}
