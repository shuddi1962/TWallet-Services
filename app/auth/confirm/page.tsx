export const dynamic = "force-dynamic";

import { ConfirmEmail } from "@/components/auth/confirm-email";

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; token_hash?: string; type?: string; email?: string }>;
}) {
  const { token, token_hash, type, email } = await searchParams;

  return (
    <ConfirmEmail
      token={token ?? token_hash ?? ""}
      type={type ?? ""}
      email={email ? decodeURIComponent(email) : ""}
    />
  );
}
