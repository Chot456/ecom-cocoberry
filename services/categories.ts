import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type Client = SupabaseClient<Database>;

export async function getCategories(supabase: Client) {
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return data;
}

export async function getCategoryBySlug(supabase: Client, slug: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getCategoryById(supabase: Client, id: string) {
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export interface CategoryInput {
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
}

function toCategoryRow(input: CategoryInput) {
  return {
    name: input.name,
    slug: input.slug,
    description: input.description || null,
    image_url: input.imageUrl,
  };
}

export async function createCategory(supabase: Client, input: CategoryInput): Promise<string> {
  const { data, error } = await supabase
    .from("categories")
    .insert(toCategoryRow(input))
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateCategory(supabase: Client, id: string, input: CategoryInput): Promise<void> {
  const { error } = await supabase.from("categories").update(toCategoryRow(input)).eq("id", id);
  if (error) throw error;
}

export async function deleteCategory(supabase: Client, id: string): Promise<void> {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}
