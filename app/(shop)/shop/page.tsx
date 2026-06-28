import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopContent } from "@/components/shop/shop-content";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse the full Cocoberry collection of skincare, makeup, hair care, body care, and beauty bundles.",
};

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}
