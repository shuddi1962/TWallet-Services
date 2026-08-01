import { createServerSupabaseClient } from "@/lib";
import { isAdminUser } from "@/lib/admin-provision";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const destination =
        next !== "/dashboard" && next.startsWith("/")
          ? next
          : user && (await isAdminUser(user.id))
            ? "/admin"
            : "/dashboard";
      return NextResponse.redirect(`${origin}${destination}`);
    }
    return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
  }

  if (token_hash && type) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as "signup" | "email" | "recovery" });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    return NextResponse.redirect(`${origin}/auth/login?error=verification_failed`);
  }

  return NextResponse.redirect(`${origin}/auth/login?error=no_code`);
}
