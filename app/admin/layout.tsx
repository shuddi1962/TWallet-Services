import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib";
import { AdminLayout } from "@/components/admin/layout";

export const dynamic = "force-dynamic";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: role } = await supabase
    .from("user_roles")
    .select("role, admins!inner(profile_id)")
    .eq("user_id", user.id)
    .single();

  if (!role) {
    redirect("/dashboard");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
