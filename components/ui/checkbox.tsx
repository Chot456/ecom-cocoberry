import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkbox = (
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border border-rose-300 text-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer",
          className
        )}
        {...props}
      />
    );

    if (!label) return checkbox;

    return (
      <label htmlFor={id} className="flex items-center gap-2 text-sm text-charcoal dark:text-beige cursor-pointer">
        {checkbox}
        {label}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
