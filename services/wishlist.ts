import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { ProductWithCategory } from "@/types";

type Client = SupabaseClient<Database>;

export async function getWishlist(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("wishlists")
    .select("id, product_id, created_at, products(*, category:categories(*))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as {
    id: string;
    product_id: string;
    created_at: string;
    products: ProductWithCategory;
  }[];
}

export async function isInWishlist(supabase: Client, userId: string, productId: string) {
  const { data, error } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function addToWishlist(supabase: Client, userId: string, productId: string) {
  const { error } = await supabase
    .from("wishlists")
    .insert({ user_id: userId, product_id: productId });
  if (error && error.code !== "23505") throw error;
}

export async function removeFromWishlist(supabase: Client, userId: string, productId: string) {
  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
  if (error) throw error;
}
