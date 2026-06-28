import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "rose" | "gold" | "outline";

const variantClasses: Record<Variant, string> = {
  rose: "bg-rose-500 text-white",
  gold: "bg-gold-500 text-white",
  outline: "border border-rose-300 text-rose-700 dark:text-rose-200",
};

export function Badge({
  className,
  variant = "rose",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
