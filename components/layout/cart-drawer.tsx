"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { useCartStore, useCartTotals } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const items = useCartStore((s) => s.items);
  const { subtotal } = useCartTotals();

  return (
    <Sheet open={isOpen} onClose={closeDrawer} title="Your Bag">
      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-20 text-center">
          <ShoppingBag size={36} className="text-rose-300" />
          <p className="text-charcoal/60">Your bag is empty.</p>
          <Button onClick={closeDrawer} variant="outline">
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <div className="flex-1 divide-y divide-rose-100 dark:divide-white/10 px-6">
            {items.map((item) => (
              <CartItemRow key={item.productId} item={item} compact />
            ))}
          </div>
          <div className="border-t border-rose-100 dark:border-white/10 px-6 py-5 space-y-4">
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Subtotal</span>
              <span className="text-rose-700 dark:text-rose-300">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-charcoal/50">Shipping and discounts calculated at checkout.</p>
            <div className="flex flex-col gap-2">
              <Link href="/cart" onClick={closeDrawer}>
                <Button variant="outline" className="w-full">
                  View Bag
                </Button>
              </Link>
              <Link href="/checkout" onClick={closeDrawer}>
                <Button className="w-full">Checkout</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </Sheet>
  );
}
