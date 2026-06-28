"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function RatingStars({
  rating,
  size = 16,
  interactive = false,
  onChange,
  className,
}: RatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(value)}
          className={cn(!interactive && "cursor-default", interactive && "cursor-pointer")}
          aria-label={`${value} star`}
        >
          <Star
            size={size}
            className={cn(
              value <= Math.round(rating) ? "fill-gold-500 text-gold-500" : "fill-transparent text-rose-200"
            )}
          />
        </button>
      ))}
    </div>
  );
}
