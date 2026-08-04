"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "verifying" | "success" | "error";

const OTP_TYPES = ["signup", "recovery", "email", "magiclink", "invite", "email_change"] as const;

export function VerifyCodeForm({
  email: initialEmail = "",
  code: initialCode = "",
  type = "signup",
}: {
  email?: string;
  code?: string;
  type?: string;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState(initialCode);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const router = useRouter();

  const otpType = (OTP_TYPES as readonly string[]).includes(type) ? type : "signup";
  const canSubmit = email.trim().length > 3 && /^\d{6}$/.test(code.trim());

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || status === "verifying") return;
    setStatus("verifying");
    setMessage("");
    setResent(false);

    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: code.trim(),
      type: otpType as "signup",
    });

    if (error) {
      const msg = String(error.message ?? "").toLowerCase();
      setStatus("error");
      setMessage(
        /invalid|expired|not found|no longer/i.test(msg)
          ? "This code is invalid or has expired. Request a new one or try signing in."
          : "We couldn't verify this code. Please try again."
      );
      return;
    }

    setStatus("success");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setTimeout(() => {
      if (user) {
        router.replace("/dashboard");
        router.refresh();
      } else {
        router.replace("/auth/login?confirmed=1");
      }
    }, 1500);
  }

  async function handleResend() {
    if (resending || email.trim().length < 3) {
      if (email.trim().length < 3) setMessage("Enter your email address first to resend the code.");
      return;
    }
    setResending(true);
    setResent(false);
    setStatus("idle");
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim().toLowerCase(),
    });

    setResending(false);
    if (error) {
      setStatus("error");
      setMessage("Couldn't resend the code. Please wait a moment and try again.");
      return;
    }
    setResent(true);
  }

  if (status === "success") {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" aria-hidden="true" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-white">Email confirmed!</h1>
        <p className="mb-6 text-sm text-white/60">
          Your email has been verified and your account is ready. Taking you to your dashboard…
        </p>
        <Button onClick={() => router.replace("/dashboard")}>Go to dashboard</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleVerify} className="w-full max-w-md text-center" noValidate>
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 ring-1 ring-brand-500/20">
        <Loader2 className="h-8 w-8 text-brand-400" aria-hidden="true" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-white">Verify your email</h1>
      <p className="mb-6 text-sm text-white/60">
        Enter the 6-digit code from the email we sent you to activate your account.
      </p>

      <div className="mb-4 text-left">
        <Label htmlFor="vcf-email" className="mb-1.5 block text-sm font-medium text-white/70">
          Email address
        </Label>
        <Input
          id="vcf-email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-surface-900/70 text-white"
        />
      </div>

      <div className="mb-6 text-left">
        <Label htmlFor="vcf-code" className="mb-1.5 block text-sm font-medium text-white/70">
          Confirmation code
        </Label>
        <Input
          id="vcf-code"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          maxLength={6}
          placeholder="••••••"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="bg-surface-900/70 text-center text-xl tracking-[0.4em] text-white"
          aria-describedby="vcf-hint"
        />
        <p id="vcf-hint" className="mt-2 text-xs text-white/40">
          6-digit code — it expires in 1 hour.
        </p>
      </div>

      {status === "error" && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-lg border border-error/20 bg-error/10 p-3 text-left text-sm text-error"
        >
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{message}</span>
        </div>
      )}

      {resent && (
        <p role="status" className="mb-4 text-sm text-emerald-400">
          A new code was sent to your email.
        </p>
      )}

      <Button type="submit" className="w-full" disabled={!canSubmit || status === "verifying"}>
        {status === "verifying" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Verifying…
          </>
        ) : (
          "Verify email"
        )}
      </Button>

      <div className="mt-4 flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 disabled:opacity-50"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          {resending ? "Sending…" : "Resend code"}
        </button>
        <Link href="/auth/login" className="text-white/40 transition-colors hover:text-white">
          Sign in instead
        </Link>
      </div>
    </form>
  );
}
