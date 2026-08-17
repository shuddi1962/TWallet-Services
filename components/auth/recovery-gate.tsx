"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Status = "verifying" | "ready" | "code" | "error";

/**
 * Exchanges the recovery token carried by a password-reset link (token_hash
 * or 6-digit code) for a session before the reset form is shown. Without this
 * step `supabase.auth.updateUser()` fails with "Auth session missing".
 */
export function RecoveryGate({
  children,
  email = "",
  admin = false,
}: {
  children: React.ReactNode;
  email?: string;
  admin?: boolean;
}) {
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("");
  const [codeEmail, setCodeEmail] = useState(email);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const firedRef = useRef(false);
  const supabase = createClient();

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const tokenHash = params.get("token_hash") ?? "";
    const type = params.get("type") ?? "recovery";
    const token = params.get("token") ?? "";
    const mail = params.get("email") ?? email;

    if (!tokenHash && !(token && mail)) {
      setStatus("code");
      setMessage("Open the reset link from your email, or enter the 6-digit code below.");
      return;
    }

    (async () => {
      const { error } = tokenHash
        ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as "recovery" })
        : await supabase.auth.verifyOtp({ email: mail, token, type: type as "recovery" });

      if (!error) {
        setStatus("ready");
        return;
      }
      const msg = String(error.message ?? "").toLowerCase();
      if (/invalid|expired|not found|no longer|already/i.test(msg)) {
        setStatus("code");
        setMessage("This reset link is invalid or has expired. Enter the 6-digit code from the email instead.");
      } else {
        setStatus("error");
        setMessage("We couldn't start the password reset. Please request a new link.");
      }
    })();
  }, [supabase, email]);

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{6}$/.test(code) || codeEmail.trim().length < 3 || submitting) return;
    setSubmitting(true);
    setMessage("");
    const { error } = await supabase.auth.verifyOtp({
      email: codeEmail.trim().toLowerCase(),
      token: code,
      type: "recovery",
    });
    setSubmitting(false);
    if (error) {
      setMessage("That code is invalid or has expired. Please request a new one.");
      return;
    }
    setStatus("ready");
  }

  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" aria-hidden="true" />
        <p className="text-sm text-surface-400">Preparing your password reset…</p>
      </div>
    );
  }

  if (status === "ready") {
    return <>{children}</>;
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <XCircle className="h-8 w-8 text-error" aria-hidden="true" />
        <p className="text-sm text-surface-300">{message}</p>
        <Button asChild variant="outline">
          <a href={admin ? "/admin/forgot-password" : "/auth/forgot-password"}>Request a new reset link</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {message && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-lg border border-error/20 bg-error/10 p-3 text-sm text-error"
        >
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{message}</span>
        </div>
      )}
      <form onSubmit={handleCodeSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rg-email" className="text-surface-200">Email address</Label>
          <Input
            id="rg-email"
            type="email"
            autoComplete="email"
            required
            value={codeEmail}
            onChange={(e) => setCodeEmail(e.target.value)}
            placeholder="you@example.com"
            className="border-white/10 bg-surface-800 text-white placeholder:text-surface-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rg-code" className="text-surface-200">6-digit reset code</Label>
          <Input
            id="rg-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="••••••"
            className="border-white/10 bg-surface-800 text-center text-xl tracking-[0.4em] text-white placeholder:text-surface-500"
          />
          <p className="text-xs text-surface-400">The code is in the reset email. It expires in 1 hour.</p>
        </div>
        <Button type="submit" fullWidth loading={submitting}>
          {submitting ? "Verifying…" : "Continue"}
        </Button>
      </form>
    </div>
  );
}