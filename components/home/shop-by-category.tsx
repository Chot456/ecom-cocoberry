"use client";

import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/lib/hooks/use-categories";
import { Skeleton } from "@/components/ui/skeleton";

export function ShopByCategory() {
  const { data: categories, isLoading } = useCategories();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="font-display text-2xl text-charcoal sm:text-3xl dark:text-beige">Shop by Category</h2>
        <p className="mt-2 text-sm text-charcoal/60 dark:text-beige/60">
          Find exactly what your routine needs.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="aspect-square w-full" />)
          : categories?.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-lg"
              >
                <Image
                  src={category.image_url ?? "/images/categories/skincare.svg"}
                  alt={category.name}
                  fill
                  sizes="(min-width: 1024px) 20vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-charcoal/50 via-transparent to-transparent p-4">
                  <span className="font-medium text-white">{category.name}</span>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}
