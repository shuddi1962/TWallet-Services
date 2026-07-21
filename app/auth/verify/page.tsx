import Link from "next/link";

export default async function VerifyPage(props: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await props.searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl">
          ✉️
        </div>
        <h1 className="mb-2 text-2xl font-bold">Check your email</h1>
        <p className="mb-2 text-surface-500">
          We sent a verification link to
        </p>
        <p className="mb-8 font-medium">{email ?? "your email"}</p>
        <p className="text-sm text-surface-400">
          Click the link in the email to verify your account.{" "}
          <br />
          Didn&apos;t receive it?{" "}
          <Link href="/auth/login" className="text-brand-600 hover:underline">
            Try again
          </Link>
        </p>
      </div>
    </main>
  );
}
