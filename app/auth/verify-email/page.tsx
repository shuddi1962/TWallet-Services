import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Mail } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center bg-surface-950 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10">
            <Mail className="h-8 w-8 text-brand-400" aria-hidden="true" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-surface-50">Verify your email</h1>
          <p className="mt-2 text-surface-400">
            We sent a verification link to your email address. Click the link to activate your account.
          </p>
          <div className="mt-8 rounded-xl border border-surface-800 bg-surface-900/50 p-4 text-sm text-surface-400">
            <p>Did not receive the email? Check your spam folder or try signing up again.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}