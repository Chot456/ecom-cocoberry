import type { Database } from "./database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type Address = Database["public"]["Tables"]["addresses"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Wishlist = Database["public"]["Tables"]["wishlists"]["Row"];
export type Coupon = Database["public"]["Tables"]["coupons"]["Row"];

export type ProductWithCategory = Product & {
  category: Category | null;
};

export type ReviewWithAuthor = Review & {
  profiles: Pick<Profile, "full_name" | "avatar_url"> | null;
};

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export type SortOption = "newest" | "best-selling" | "price-asc" | "price-desc";

export interface ProductFilters {
  query?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface ShippingAddressInput {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export type PaymentMethod = "cod" | "bank_transfer";
