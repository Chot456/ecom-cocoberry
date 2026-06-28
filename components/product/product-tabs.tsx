"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type TabKey = "description" | "ingredients" | "benefits" | "usage";

export function ProductTabs({ product }: { product: Product }) {
  const tabs = (
    [
      { key: "description", label: "Description", content: product.description },
      { key: "ingredients", label: "Ingredients", content: product.ingredients },
      { key: "benefits", label: "Benefits", content: product.benefits },
      { key: "usage", label: "How to Use", content: product.usage },
    ] as { key: TabKey; label: string; content: string | null }[]
  ).filter((tab) => Boolean(tab.content));

  const [active, setActive] = useState<TabKey>(tabs[0]?.key ?? "description");

  if (tabs.length === 0) return null;

  const activeContent = tabs.find((tab) => tab.key === active)?.content;

  return (
    <div className="mt-16">
      <div className="flex gap-6 border-b border-rose-100 dark:border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={cn(
              "pb-3 text-sm font-medium transition-colors cursor-pointer",
              active === tab.key
                ? "border-b-2 border-rose-500 text-rose-600 dark:text-rose-300"
                : "text-charcoal/50 dark:text-beige/50 hover:text-charcoal dark:hover:text-beige"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-charcoal/80 dark:text-beige/80">
        {activeContent}
      </div>
    </div>
  );
}
