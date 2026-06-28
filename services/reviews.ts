import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { ReviewWithAuthor } from "@/types";

type Client = SupabaseClient<Database>;

export async function getReviewsForProduct(supabase: Client, productId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(full_name, avatar_url)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as ReviewWithAuthor[];
}

export function summarizeRatings(reviews: { rating: number }[]) {
  const count = reviews.length;
  if (count === 0) return { average: 0, count: 0 };
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / count;
  return { average, count };
}

export async function createReview(
  supabase: Client,
  input: { productId: string; userId: string; rating: number; comment?: string }
) {
  const { error } = await supabase.from("reviews").insert({
    product_id: input.productId,
    user_id: input.userId,
    rating: input.rating,
    comment: input.comment ?? null,
  });
  if (error) throw error;
}
