"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useIsWishlisted, useToggleWishlist } from "@/lib/hooks/use-wishlist";
import { useUser } from "@/lib/hooks/use-user";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, cn } from "@/lib/utils";
import type { ProductWithCategory } from "@/types";

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const { user } = useUser();
  const { data: isWishlisted } = useIsWishlisted(product.id);
  const toggleWishlist = useToggleWishlist();
  const addItem = useCartStore((s) => s.addItem);

  const image = product.image_urls[0] ?? "/images/categories/skincare.svg";
  const onSale = Boolean(product.compare_price && product.compare_price > product.price);

  function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("Sign in to save items to your wishlist.");
      return;
    }
    toggleWishlist.mutate({ productId: product.id, isWishlisted: Boolean(isWishlisted) });
  }

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (product.stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image,
      quantity: 1,
      stock: product.stock,
    });
    toast.success(`${product.name} added to your bag.`);
  }

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-blush">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {onSale && <Badge variant="gold">Sale</Badge>}
          {product.is_best_seller && <Badge variant="rose">Best Seller</Badge>}
        </div>
        <button
          onClick={handleToggleWishlist}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm transition-transform hover:scale-110 cursor-pointer"
        >
          <Heart
            size={16}
            className={cn(isWishlisted ? "fill-rose-600 text-rose-600" : "text-charcoal/60")}
          />
        </button>
        <button
          onClick={handleQuickAdd}
          className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-charcoal/90 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer"
        >
          Quick Add
        </button>
      </div>
      <div className="mt-3 space-y-1">
        {product.category && (
          <p className="text-xs uppercase tracking-wide text-rose-500">{product.category.name}</p>
        )}
        <h3 className="text-sm font-medium text-charcoal dark:text-beige line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-rose-700 dark:text-rose-300">{formatPrice(product.price)}</span>
          {onSale && (
            <span className="text-sm text-charcoal/40 line-through">
              {formatPrice(product.compare_price!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
