"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useProducts } from "@/lib/hooks/use-products";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/product-grid";
import { PriceFilter } from "@/components/shop/price-filter";
import { SortSelect } from "@/components/shop/sort-select";
import { Pagination } from "@/components/shop/pagination";
import type { SortOption } from "@/types";

const PAGE_SIZE = 12;

export function CategoryContent({ categorySlug }: { categorySlug: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    categorySlug,
    minPrice,
    maxPrice,
    sort,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <PriceFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onApply={(min, max) =>
                updateParams({ min: min?.toString(), max: max?.toString() })
              }
            />
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
                No products in this category yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
