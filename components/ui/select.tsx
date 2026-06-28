import { type SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "w-full h-11 appearance-none rounded-xl border border-rose-200 bg-white/70 dark:bg-white/5 px-4 pr-10 text-sm text-charcoal dark:text-beige focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal/50"
        />
      </div>
    );
  }
);
Select.displayName = "Select";
