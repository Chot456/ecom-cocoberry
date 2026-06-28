"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { CouponForm } from "@/components/cart/coupon-form";
import { OrderSummary } from "@/components/cart/order-summary";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <ShoppingBag size={40} className="text-rose-300" />
        <h1 className="font-display text-2xl text-charcoal dark:text-beige">Your bag is empty</h1>
        <p className="text-sm text-charcoal/60 dark:text-beige/60">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-charcoal dark:text-beige">Your Bag</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-rose-100 dark:divide-white/10">
          {items.map((item) => (
            <CartItemRow key={item.productId} item={item} />
          ))}
        </div>

        <div className="space-y-4">
          <CouponForm />
          <OrderSummary>
            <Button className="mt-5 w-full" size="lg" onClick={() => router.push("/checkout")}>
              Proceed to Checkout
            </Button>
          </OrderSummary>
        </div>
      </div>
    </div>
  );
}
