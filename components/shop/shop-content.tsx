"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { useProducts } from "@/lib/hooks/use-products";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/product-grid";
import { SearchInput } from "@/components/shop/search-input";
import { CategoryFilter } from "@/components/shop/category-filter";
import { PriceFilter } from "@/components/shop/price-filter";
import { SortSelect } from "@/components/shop/sort-select";
import { Pagination } from "@/components/shop/pagination";
import type { SortOption } from "@/types";

const PAGE_SIZE = 12;

export function ShopContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const query = searchParams.get("q") ?? undefined;
  const categorySlug = searchParams.get("category") ?? undefined;
  const minPrice = searchParams.get("min") ? Number(searchParams.get("min")) : undefined;
  const maxPrice = searchParams.get("max") ? Number(searchParams.get("max")) : undefined;
  const sort = (searchParams.get("sort") as SortOption) || "newest";
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  function updateParams(updates: Record<string, string | undefined>, resetPage = true) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    if (resetPage) params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const { data, isLoading } = useProducts({
    query,
    categorySlug,
    minPrice,
    maxPrice,
    sort,
    page,
    pageSize: PAGE_SIZE,
  });

  const hasActiveFilters = Boolean(categorySlug || minPrice || maxPrice || query);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-charcoal dark:text-beige">Shop All</h1>
          {query && (
            <p className="mt-1 text-sm text-charcoal/60 dark:text-beige/60">
              Search results for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 rounded-full border border-rose-200 dark:border-white/10 px-4 py-2 text-sm lg:hidden cursor-pointer"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-8">
            <SearchInput value={query} onSearch={(value) => updateParams({ q: value || undefined })} />
            <CategoryFilter selected={categorySlug} onChange={(slug) => updateParams({ category: slug })} />
            <PriceFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onApply={(min, max) =>
                updateParams({ min: min?.toString(), max: max?.toString() })
              }
            />
            {hasActiveFilters && (
              <button
                onClick={() => router.push(pathname)}
                className="text-sm font-medium text-rose-600 dark:text-rose-300 cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-charcoal/60 dark:text-beige/60">
              {isLoading ? "Loading..." : `${data?.count ?? 0} products`}
            </p>
            <SortSelect value={sort} onChange={(value) => updateParams({ sort: value }, false)} />
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={PAGE_SIZE} />
          ) : data && data.products.length > 0 ? (
            <>
              <ProductGrid products={data.products} />
              <Pagination
                page={page}
                pageSize={PAGE_SIZE}
                count={data.count}
                onPageChange={(p) => updateParams({ page: p.toString() }, false)}
              />
            </>
          ) : (
            <div className="rounded-2xl bg-blush/40 dark:bg-white/5 py-20 text-center">
              <p className="text-charcoal/60 dark:text-beige/60">
                No products found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-xs overflow-y-auto bg-cream dark:bg-[#221b1e] p-6">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-display text-xl text-charcoal dark:text-beige">Filters</p>
              <button onClick={() => setMobileFiltersOpen(false)} className="cursor-pointer" aria-label="Close filters">
                <X size={22} />
              </button>
            </div>
            <div className="space-y-8">
              <SearchInput value={query} onSearch={(value) => updateParams({ q: value || undefined })} />
              <CategoryFilter selected={categorySlug} onChange={(slug) => updateParams({ category: slug })} />
              <PriceFilter
                minPrice={minPrice}
                maxPrice={maxPrice}
                onApply={(min, max) =>
                  updateParams({ min: min?.toString(), max: max?.toString() })
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
