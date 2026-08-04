export const dynamic = "force-dynamic";

import { VerifyCodeForm } from "@/components/auth/verify-code-form";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return <VerifyCodeForm email={email ? decodeURIComponent(email) : ""} />;
}
