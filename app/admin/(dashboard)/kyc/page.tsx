import { getAdminKycSubmissions } from "@/lib/admin/actions";
import { AdminKycTable } from "./table";

export const dynamic = "force-dynamic";

export default async function AdminKycPage() {
  const { submissions, count } = await getAdminKycSubmissions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">KYC Reviews</h1>
          <p className="text-sm text-body">{count} submission{count === 1 ? "" : "s"}</p>
        </div>
      </div>
      <AdminKycTable submissions={submissions} count={count} />
    </div>
  );
}
