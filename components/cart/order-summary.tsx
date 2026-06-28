"use client";

import { useCartTotals } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

export function OrderSummary({ children }: { children?: React.ReactNode }) {
  const { subtotal, discount, shippingFee, total } = useCartTotals();

  return (
    <div className="rounded-2xl bg-blush/40 dark:bg-white/5 p-6">
      <h2 className="font-display text-lg text-charcoal dark:text-beige">Order Summary</h2>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-charcoal/70 dark:text-beige/70">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Discount</span>
            <span>&minus;{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-charcoal/70 dark:text-beige/70">
          <span>Shipping</span>
          <span>{shippingFee === 0 ? "Free" : formatPrice(shippingFee)}</span>
        </div>
      </div>
      <div className="mt-4 flex justify-between border-t border-rose-200 dark:border-white/10 pt-4 text-base font-semibold text-charcoal dark:text-beige">
        <span>Total</span>
        <span className="text-rose-700 dark:text-rose-300">{formatPrice(total)}</span>
      </div>
      {children}
    </div>
  );
}
