"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/product-grid";
import type { ProductWithCategory } from "@/types";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products?: ProductWithCategory[];
  isLoading: boolean;
  viewAllHref: string;
  tint?: "cream" | "blush";
}

export function ProductSection({
  title,
  subtitle,
  products,
  isLoading,
  viewAllHref,
  tint = "cream",
}: ProductSectionProps) {
  if (!isLoading && (!products || products.length === 0)) return null;

  return (
    <section className={tint === "blush" ? "bg-blush/40 dark:bg-white/[0.02]" : ""}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-charcoal sm:text-3xl dark:text-beige">{title}</h2>
            {subtitle && <p className="mt-2 text-sm text-charcoal/60 dark:text-beige/60">{subtitle}</p>}
          </div>
          <Link
            href={viewAllHref}
            className="flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-300"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {isLoading ? <ProductGridSkeleton /> : <ProductGrid products={products ?? []} />}
      </div>
    </section>
  );
}
