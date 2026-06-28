import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full min-h-28 rounded-xl border border-rose-200 bg-white/70 dark:bg-white/5 px-4 py-3 text-sm text-charcoal dark:text-beige placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
