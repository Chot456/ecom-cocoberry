"use client";

import { useCategories } from "@/lib/hooks/use-categories";
import { cn } from "@/lib/utils";

export function CategoryFilter({
  selected,
  onChange,
}: {
  selected?: string;
  onChange: (slug?: string) => void;
}) {
  const { data: categories, isLoading } = useCategories();

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-charcoal dark:text-beige">Category</p>
      <div className="flex flex-col gap-1">
        <button
          onClick={() => onChange(undefined)}
          className={cn(
            "rounded-lg px-3 py-2 text-left text-sm transition-colors cursor-pointer",
            !selected
              ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200"
              : "text-charcoal/70 hover:bg-rose-50 dark:text-beige/70 dark:hover:bg-white/5"
          )}
        >
          All Products
        </button>
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 rounded-lg bg-rose-50 dark:bg-white/5 animate-pulse" />
          ))}
        {categories?.map((category) => (
          <button
            key={category.id}
            onClick={() => onChange(category.slug)}
            className={cn(
              "rounded-lg px-3 py-2 text-left text-sm transition-colors cursor-pointer",
              selected === category.slug
                ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200"
                : "text-charcoal/70 hover:bg-rose-50 dark:text-beige/70 dark:hover:bg-white/5"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
