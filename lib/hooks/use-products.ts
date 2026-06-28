"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import {
  getProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  getRelatedProducts,
  type ProductInput,
} from "@/services/products";
import type { ProductFilters } from "@/types";

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(createClient(), filters),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(createClient(), slug),
    enabled: Boolean(slug),
  });
}

export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: ["products", "featured", limit],
    queryFn: () => getFeaturedProducts(createClient(), limit),
  });
}

export function useBestSellers(limit = 8) {
  return useQuery({
    queryKey: ["products", "best-sellers", limit],
    queryFn: () => getBestSellers(createClient(), limit),
  });
}

export function useNewArrivals(limit = 8) {
  return useQuery({
    queryKey: ["products", "new-arrivals", limit],
    queryFn: () => getNewArrivals(createClient(), limit),
  });
}

export function useRelatedProducts(categoryId: string | null, excludeProductId: string) {
  return useQuery({
    queryKey: ["products", "related", categoryId, excludeProductId],
    queryFn: () => getRelatedProducts(createClient(), categoryId, excludeProductId),
    enabled: Boolean(excludeProductId),
  });
}

export function useAdminProduct(id: string) {
  return useQuery({
    queryKey: ["admin-product", id],
    queryFn: () => getProductById(createClient(), id),
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductInput) => createProduct(createClient(), input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductInput }) =>
      updateProduct(createClient(), id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(createClient(), id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}
