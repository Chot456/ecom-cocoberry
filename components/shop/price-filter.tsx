"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PriceFilter({
  minPrice,
  maxPrice,
  onApply,
}: {
  minPrice?: number;
  maxPrice?: number;
  onApply: (min?: number, max?: number) => void;
}) {
  const [min, setMin] = useState(minPrice?.toString() ?? "");
  const [max, setMax] = useState(maxPrice?.toString() ?? "");

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-charcoal dark:text-beige">Price Range</p>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          placeholder="Min"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="h-10"
        />
        <span className="text-charcoal/40">&ndash;</span>
        <Input
          type="number"
          min={0}
          placeholder="Max"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="h-10"
        />
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3 w-full"
        onClick={() => onApply(min ? Number(min) : undefined, max ? Number(max) : undefined)}
      >
        Apply
      </Button>
    </div>
  );
}
