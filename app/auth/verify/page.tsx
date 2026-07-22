import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function VerifyPage(props: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await props.searchParams;

  return (
    <div className="w-full max-w-sm text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
        <Mail className="h-8 w-8 text-brand-600" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-surface-900">
        Check your email
      </h1>
      <p className="mb-2 text-surface-500">
        We sent a verification link to
      </p>
      <p className="mb-8 font-medium text-surface-900">
        {email ?? "your email"}
      </p>
      <p className="text-sm text-surface-400">
        Click the link in the email to verify your account.
        <br />
        Didn&apos;t receive it?{" "}
        <Link href="/auth/login" className="text-brand-600 hover:underline">
          Try again
        </Link>
      </p>
      <div className="mt-8">
        <Button variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
