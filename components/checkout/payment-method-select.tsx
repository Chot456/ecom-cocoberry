"use client";

import { Banknote, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/types";

const OPTIONS: { value: PaymentMethod; label: string; description: string; icon: typeof Banknote }[] = [
  {
    value: "cod",
    label: "Cash on Delivery",
    description: "Pay with cash when your order arrives.",
    icon: Banknote,
  },
  {
    value: "bank_transfer",
    label: "Bank Transfer",
    description: "Transfer payment to our bank account after placing your order.",
    icon: Landmark,
  },
];

export function PaymentMethodSelect({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}) {
  return (
    <div className="space-y-3">
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors cursor-pointer",
              value === option.value
                ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
                : "border-rose-200 dark:border-white/10 hover:bg-rose-50/50 dark:hover:bg-white/5"
            )}
          >
            <Icon size={20} className="mt-0.5 text-rose-600 dark:text-rose-300" />
            <div>
              <p className="text-sm font-medium text-charcoal dark:text-beige">{option.label}</p>
              <p className="text-xs text-charcoal/60 dark:text-beige/60">{option.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
