"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { VerifyCodeForm } from "@/components/auth/verify-code-form";

type Status = "verifying" | "success" | "error";

const ALLOWED_TYPES = ["signup", "email", "magiclink", "invite", "recovery", "email_change"];

const VERIFY_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://smkckhsvzyjttzqhpzhv.supabase.co"}/auth/v1/verify`;

function isPkceError(msg: string) {
  return /pkce|verifier/i.test(msg);
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function ConfirmEmail({
  token,
  type,
  email = "",
}: {
  token: string;
  type: string;
  email?: string;
}) {
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("");
  const [needsCode, setNeedsCode] = useState(false);
  const router = useRouter();
  const firedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trimmedToken = token.trim();
  const numericCode = /^\d{6}$/.test(trimmedToken);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    if (!trimmedToken) {
      setStatus("error");
      setMessage(
        "This confirmation link is missing required parameters. Please try signing in instead."
      );
      return;
    }

    if (!ALLOWED_TYPES.includes(type)) {
      setStatus("error");
      setMessage(
        `This confirmation link has an unsupported type ("${type}"). Please sign in instead.`
      );
      return;
    }

    const supabase = createClient();
    let cancelled = false;

    const succeed = () => {
      if (cancelled) return;
      setStatus("success");
      timerRef.current = setTimeout(() => {
        router.replace("/dashboard");
        router.refresh();
      }, 1800);
    };

    const fail = (msg: string) => {
      if (cancelled) return;
      setStatus("error");
      setMessage(msg);
    };

    (async () => {
      // The branded email embeds the 6-digit code ({{ .Token }}), not the link
      // hash. A code can only be verified together with the email address.
      if (numericCode) {
        if (!email) {
          setNeedsCode(true);
          return;
        }
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: trimmedToken,
          type: type as "signup",
        });
        if (cancelled) return;
        if (!error) {
          succeed();
          return;
        }
        const msg = String(error.message ?? "").toLowerCase();
        if (/invalid|expired|not found|no longer/i.test(msg)) {
          fail("This code is invalid or has expired. You can request a new one or enter it manually.");
          return;
        }
        fail("We couldn't confirm this link. Please try entering the code manually.");
        return;
      }

      // Full link-hash flow: try the raw token, then its SHA-256 form.
      const candidates = [trimmedToken];
      const hash = await sha256Hex(trimmedToken).catch(() => "");
      if (hash && hash !== trimmedToken) candidates.push(hash);

      for (const candidate of candidates) {
        const { error } = await supabase.auth.verifyOtp({
          type,
          token_hash: candidate,
        });
        if (cancelled) return;

        if (!error) {
          succeed();
          return;
        }

        const msg = String(error.message ?? "").toLowerCase();

        if (isPkceError(msg)) {
          // Cross-device PKCE: hand off to Supabase's own verify endpoint,
          // which completes the exchange and redirects to our callback.
          if (type === "signup" || type === "email") {
            window.location.assign(
              `${VERIFY_BASE}?token=${encodeURIComponent(trimmedToken)}&type=signup&redirect_to=${encodeURIComponent(
                `${window.location.origin}/auth/callback`
              )}`
            );
            return;
          }
          fail("We couldn't confirm this link. Please try signing in instead.");
          return;
        }

        const invalidToken = /already|expired|invalid/i.test(msg);
        if (!invalidToken) {
          fail("We couldn't confirm this link. Please try signing in instead.");
          return;
        }

        // Invalid token: try the next candidate (the hashed form).
      }

      fail("Your email was already confirmed, or this link has expired. You can sign in now.");
    })();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [trimmedToken, type, email, numericCode, router]);

  if (needsCode) {
    return <VerifyCodeForm code={trimmedToken} type={type} />;
  }

  return (
    <div className="w-full max-w-md text-center">
      {status === "verifying" && (
        <>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 ring-1 ring-brand-500/20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-400" aria-hidden="true" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">Confirming your email…</h1>
          <p className="text-sm text-white/60">
            Verifying your email address and preparing your account. One moment.
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" aria-hidden="true" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">Email confirmed!</h1>
          <p className="mb-6 text-sm text-white/60">
            Your email has been verified and your account is ready. Taking you to your dashboard…
          </p>
          <Button onClick={() => router.replace("/dashboard")}>Go to dashboard</Button>
        </>
      )}

      {status === "error" && (
        <>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10 ring-1 ring-error/20">
            <XCircle className="h-8 w-8 text-error" aria-hidden="true" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">Confirmation failed</h1>
          <p className="mb-6 text-sm text-white/60">{message}</p>
          <div className="flex flex-col items-center gap-2">
            {numericCode && (
              <Button variant="outline" onClick={() => setNeedsCode(true)} className="w-full">
                Enter code manually
              </Button>
            )}
            <Button asChild>
              <Link href="/auth/login">Go to sign in</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
