import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { Product, ProductFilters, ProductWithCategory } from "@/types";

type Client = SupabaseClient<Database>;

const PRODUCT_SELECT = "*, category:categories(*)";

export interface ProductInput {
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  categoryId: string | null;
  ingredients: string;
  benefits: string;
  usage: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  imageUrls: string[];
}

function toProductRow(input: ProductInput) {
  return {
    name: input.name,
    slug: input.slug,
    description: input.description || null,
    price: input.price,
    compare_price: input.comparePrice,
    stock: input.stock,
    category_id: input.categoryId,
    image_urls: input.imageUrls,
    ingredients: input.ingredients || null,
    benefits: input.benefits || null,
    usage: input.usage || null,
    is_featured: input.isFeatured,
    is_best_seller: input.isBestSeller,
  };
}

export async function getProducts(
  supabase: Client,
  filters: ProductFilters = {}
): Promise<{ products: ProductWithCategory[]; count: number }> {
  const { query, categorySlug, minPrice, maxPrice, sort = "newest", page = 1, pageSize = 12 } =
    filters;

  let request = supabase.from("products").select(PRODUCT_SELECT, { count: "exact" });

  if (query) {
    request = request.ilike("name", `%${query}%`);
  }
  if (categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    if (category) {
      request = request.eq("category_id", category.id);
    } else {
      return { products: [], count: 0 };
    }
  }
  if (typeof minPrice === "number") {
    request = request.gte("price", minPrice);
  }
  if (typeof maxPrice === "number") {
    request = request.lte("price", maxPrice);
  }

  switch (sort) {
    case "best-selling":
      request = request.order("is_best_seller", { ascending: false }).order("created_at", { ascending: false });
      break;
    case "price-asc":
      request = request.order("price", { ascending: true });
      break;
    case "price-desc":
      request = request.order("price", { ascending: false });
      break;
    default:
      request = request.order("created_at", { ascending: false });
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  request = request.range(from, to);

  const { data, error, count } = await request;
  if (error) throw error;

  return { products: (data ?? []) as unknown as ProductWithCategory[], count: count ?? 0 };
}

export async function getProductBySlug(
  supabase: Client,
  slug: string
): Promise<ProductWithCategory | null> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as ProductWithCategory | null;
}

export async function getFeaturedProducts(supabase: Client, limit = 8) {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as ProductWithCategory[];
}

export async function getBestSellers(supabase: Client, limit = 8) {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_best_seller", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as ProductWithCategory[];
}

export async function getNewArrivals(supabase: Client, limit = 8) {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as ProductWithCategory[];
}

export async function getProductById(supabase: Client, id: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createProduct(supabase: Client, input: ProductInput): Promise<string> {
  const { data, error } = await supabase
    .from("products")
    .insert(toProductRow(input))
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateProduct(supabase: Client, id: string, input: ProductInput): Promise<void> {
  const { error } = await supabase.from("products").update(toProductRow(input)).eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(supabase: Client, id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function getRelatedProducts(
  supabase: Client,
  categoryId: string | null,
  excludeProductId: string,
  limit = 4
) {
  if (!categoryId) return [];
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("category_id", categoryId)
    .neq("id", excludeProductId)
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as ProductWithCategory[];
}
