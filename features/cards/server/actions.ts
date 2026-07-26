"use server";

import { createServerSupabaseClient } from "@/lib";

export async function getCardProducts() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("card_products")
      .select("*")
      .eq("active", true)
      .order("price_usdc", { ascending: true });

    if (error) {
      console.error("[getCardProducts] Supabase error:", error.message);
      return { error: error.message, data: null };
    }
    return { data, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[getCardProducts] Exception:", msg);
    return { error: msg, data: null };
  }
}

export async function getCardProduct(slug: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("card_products")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (error) {
      console.error("[getCardProduct] Supabase error:", error.message);
      return { error: error.message, data: null };
    }
    return { data, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[getCardProduct] Exception:", msg);
    return { error: msg, data: null };
  }
}
