import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full h-11 rounded-xl border border-rose-200 bg-white/70 dark:bg-white/5 px-4 text-sm text-charcoal dark:text-beige placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
