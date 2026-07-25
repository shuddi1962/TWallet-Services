export const dynamic = "force-dynamic";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="w-full max-w-sm text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 ring-1 ring-brand-500/20">
        <svg className="h-8 w-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-white">Check your email</h1>
      <p className="mb-2 text-white/60">
        We sent a verification link to{" "}
        <strong className="text-white/80">{email ? decodeURIComponent(email) : "your email"}</strong>
      </p>
      <p className="text-sm text-white/40">
        Click the link in the email to verify your account. You&apos;ll be automatically signed in.
      </p>
      <p className="mt-6 text-xs text-white/30">
        Didn&apos;t receive it? Check your spam folder or try registering again.
      </p>
    </div>
  );
}
