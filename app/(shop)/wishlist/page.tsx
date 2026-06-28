"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useWishlist();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-charcoal dark:text-beige">Your Wishlist</h1>

      {isLoading ? (
        <div className="mt-8">
          <ProductGridSkeleton count={4} />
        </div>
      ) : wishlist && wishlist.length > 0 ? (
        <div className="mt-8">
          <ProductGrid products={wishlist.map((item) => item.products)} />
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded-2xl bg-blush/40 dark:bg-white/5 py-20 text-center">
          <Heart size={36} className="text-rose-300" />
          <p className="text-charcoal/60 dark:text-beige/60">Your wishlist is empty.</p>
          <Link href="/shop">
            <Button>Discover Products</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
