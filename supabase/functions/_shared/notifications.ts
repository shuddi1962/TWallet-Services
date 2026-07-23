import { supabase } from "./supabase-admin.ts";

export async function createNotification(
  userId: string,
  type: string,
  data: { title: string; message: string },
) {
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title: data.title,
    message: data.message,
    read: false,
  });

  if (error) console.error("Failed to create notification:", error);
}
