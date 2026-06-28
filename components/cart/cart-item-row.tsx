"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types";

export function CartItemRow({ item, compact = false }: { item: CartItem; compact?: boolean }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-4 py-4">
      <Link
        href={`/product/${item.slug}`}
        className={compact ? "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-blush" : "relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-blush"}
      >
        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="120px" />
      </Link>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${item.slug}`} className="font-medium text-charcoal dark:text-beige hover:text-rose-600 line-clamp-2">
            {item.name}
          </Link>
          <button
            onClick={() => removeItem(item.productId)}
            aria-label="Remove item"
            className="text-charcoal/40 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-full border border-rose-200">
            <button
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              className="p-2 hover:bg-rose-50 dark:hover:bg-white/10 rounded-full cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="p-2 hover:bg-rose-50 dark:hover:bg-white/10 rounded-full disabled:opacity-30 cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="font-semibold text-rose-700 dark:text-rose-300">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
