"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/ui/rating-stars";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductTabs } from "@/components/product/product-tabs";
import { ProductReviews } from "@/components/product/product-reviews";
import { ProductGrid } from "@/components/product/product-grid";
import { useReviews } from "@/lib/hooks/use-reviews";
import { useRelatedProducts } from "@/lib/hooks/use-products";
import { useIsWishlisted, useToggleWishlist } from "@/lib/hooks/use-wishlist";
import { useUser } from "@/lib/hooks/use-user";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, cn } from "@/lib/utils";
import { summarizeRatings } from "@/services/reviews";
import type { ProductWithCategory } from "@/types";

export function ProductDetail({ product }: { product: ProductWithCategory }) {
  const router = useRouter();
  const { user } = useUser();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const { data: reviews } = useReviews(product.id);
  const { data: relatedProducts } = useRelatedProducts(product.category_id, product.id);
  const { data: isWishlisted } = useIsWishlisted(product.id);
  const toggleWishlist = useToggleWishlist();

  const { average, count } = summarizeRatings(reviews ?? []);
  const image = product.image_urls[0] ?? "/images/categories/skincare.svg";
  const onSale = Boolean(product.compare_price && product.compare_price > product.price);
  const inStock = product.stock > 0;

  function handleAddToCart() {
    if (!inStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image,
      quantity,
      stock: product.stock,
    });
    toast.success(`${product.name} added to your bag.`);
    openDrawer();
  }

  function handleBuyNow() {
    if (!inStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image,
      quantity,
      stock: product.stock,
    });
    router.push("/checkout");
  }

  function handleToggleWishlist() {
    if (!user) {
      toast.error("Sign in to save items to your wishlist.");
      return;
    }
    toggleWishlist.mutate({ productId: product.id, isWishlisted: Boolean(isWishlisted) });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.image_urls} name={product.name} />

        <div>
          {product.category && (
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
              {product.category.name}
            </p>
          )}
          <h1 className="font-display mt-2 text-3xl text-charcoal dark:text-beige">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            {count > 0 ? (
              <>
                <RatingStars rating={average} />
                <span className="text-sm text-charcoal/60 dark:text-beige/60">
                  {average.toFixed(1)} ({count} review{count === 1 ? "" : "s"})
                </span>
              </>
            ) : (
              <span className="text-sm text-charcoal/50 dark:text-beige/50">No reviews yet</span>
            )}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-2xl font-semibold text-rose-700 dark:text-rose-300">
              {formatPrice(product.price)}
            </span>
            {onSale && (
              <span className="text-lg text-charcoal/40 line-through">
                {formatPrice(product.compare_price!)}
              </span>
            )}
            {onSale && <Badge variant="gold">Sale</Badge>}
            {product.is_best_seller && <Badge variant="rose">Best Seller</Badge>}
          </div>

          <p className={cn("mt-4 text-sm font-medium", inStock ? "text-green-600" : "text-rose-500")}>
            {inStock ? `In stock (${product.stock} available)` : "Out of stock"}
          </p>

          {product.description && (
            <p className="mt-4 text-sm leading-relaxed text-charcoal/70 dark:text-beige/70">
              {product.description}
            </p>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-rose-200 dark:border-white/10">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center text-charcoal dark:text-beige cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="flex h-11 w-11 items-center justify-center text-charcoal dark:text-beige cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleToggleWishlist}
              aria-label="Toggle wishlist"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-rose-200 dark:border-white/10 cursor-pointer"
            >
              <Heart size={18} className={cn(isWishlisted ? "fill-rose-600 text-rose-600" : "text-charcoal/60 dark:text-beige/60")} />
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1" disabled={!inStock} onClick={handleAddToCart}>
              Add to Cart
            </Button>
            <Button size="lg" variant="gold" className="flex-1" disabled={!inStock} onClick={handleBuyNow}>
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      <ProductTabs product={product} />
      <ProductReviews productId={product.id} />

      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display mb-6 text-2xl text-charcoal dark:text-beige">You May Also Like</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
