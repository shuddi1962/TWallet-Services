import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib";
import { AdminLayout } from "@/components/admin/layout";

export const dynamic = "force-dynamic";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("profile_id")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!admin) {
    redirect("/dashboard");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
