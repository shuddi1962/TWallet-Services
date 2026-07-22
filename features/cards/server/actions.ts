"use server";

import { createServerSupabaseClient } from "@/lib";

export async function getCardProducts() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("card_products")
    .select("*")
    .eq("active", true)
    .order("price_usdc", { ascending: true });

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}

export async function getCardProduct(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("card_products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error) return { error: error.message, data: null };
  return { data, error: null };
}
