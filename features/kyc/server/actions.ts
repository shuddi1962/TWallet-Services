"use server";

import { createServerSupabaseClient } from "@/lib";
import { revalidatePath } from "next/cache";

export type KycSubmissionRecord = {
  id: string;
  full_name: string;
  document_type: string;
  document_number: string | null;
  document_front_url: string;
  document_back_url: string | null;
  status: "pending" | "approved" | "rejected";
  admin_note: string | null;
  reviewed_at: string | null;
  created_at: string;
};

export async function getMyKycSubmissions() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", data: null };

  const { data, error } = await supabase
    .from("kyc_submissions")
    .select("id, full_name, document_type, document_number, document_front_url, document_back_url, status, admin_note, reviewed_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message, data: null };
  return { data: (data ?? []) as KycSubmissionRecord[], error: null };
}

const DOCUMENT_TYPES = ["passport", "drivers_license", "national_id"] as const;

export async function submitKycApplication(_prev: unknown, formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, kyc_tier")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.kyc_tier && profile.kyc_tier !== "none") {
    return { error: "Your identity is already verified" };
  }

  const fullName = String(formData.get("fullName") ?? profile?.full_name ?? "").trim();
  const documentType = String(formData.get("documentType") ?? "passport").trim() as (typeof DOCUMENT_TYPES)[number];
  const documentNumber = String(formData.get("documentNumber") ?? "").trim();
  const front = formData.get("front") as File | null;
  const back = formData.get("back") as File | null;

  if (!fullName) return { error: "Full name is required" };
  if (!DOCUMENT_TYPES.includes(documentType)) return { error: "Select a valid document type" };
  if (!front || front.size === 0) return { error: "Front of document is required" };
  if (front.size > 10 * 1024 * 1024) return { error: "Document image must be smaller than 10MB" };
  if (back && back.size > 10 * 1024 * 1024) return { error: "Document image must be smaller than 10MB" };

  // Block duplicate pending submissions — one review at a time.
  const { data: existing } = await supabase
    .from("kyc_submissions")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("status", "pending")
    .maybeSingle();
  if (existing) return { error: "You already have a pending submission — wait for the review result" };

  const allowed = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
  const extOf = (file: File) => file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "jpg";

  const uploadDoc = async (file: File, side: "front" | "back") => {
    if (!allowed.includes(file.type)) return { error: `${side === "front" ? "Front" : "Back"} document must be PNG, JPG, WEBP or PDF` };
    const path = `${user.id}/kyc-${Date.now()}-${side}.${extOf(file)}`;
    const { error } = await supabase.storage.from("documents").upload(path, file, { upsert: true });
    if (error) return { error: error.message };
    const { data: urlData } = supabase.storage.from("documents").getPublicUrl(path);
    return { url: urlData?.publicUrl ?? null };
  };

  const frontUpload = await uploadDoc(front, "front");
  if ("error" in frontUpload) return { error: frontUpload.error };
  let backUrl: string | null = null;
  if (back && back.size > 0) {
    const backUpload = await uploadDoc(back, "back");
    if ("error" in backUpload) return { error: backUpload.error };
    backUrl = backUpload.url;
  }

  const { data, error } = await supabase
    .from("kyc_submissions")
    .insert({
      user_id: user.id,
      full_name: fullName,
      document_type: documentType,
      document_number: documentNumber || null,
      document_front_url: frontUpload.url,
      document_back_url: backUrl,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await supabase.from("audit_logs").insert({
    action: "kyc_submitted",
    target_type: "kyc_submissions",
    target_id: data.id,
    details: { document_type: documentType, user_email: user.email },
  });

  revalidatePath("/dashboard/profile");
  return { success: "KYC documents submitted — our team will review them within 24 hours" };
}
