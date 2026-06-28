"use client";

import { Hero } from "@/components/home/hero";
import { ProductSection } from "@/components/home/product-section";
import { ShopByCategory } from "@/components/home/shop-by-category";
import { WhyCocoberry } from "@/components/home/why-cocoberry";
import { Testimonials } from "@/components/home/testimonials";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { InstagramFeed } from "@/components/home/instagram-feed";
import { BlogPreview } from "@/components/home/blog-preview";
import { useFeaturedProducts, useBestSellers, useNewArrivals } from "@/lib/hooks/use-products";

export default function HomePage() {
  const { data: featured, isLoading: featuredLoading } = useFeaturedProducts();
  const { data: bestSellers, isLoading: bestSellersLoading } = useBestSellers();
  const { data: newArrivals, isLoading: newArrivalsLoading } = useNewArrivals();

  return (
    <>
      <Hero />
      <ProductSection
        title="Featured Products"
        subtitle="Hand-picked favorites for your routine."
        products={featured}
        isLoading={featuredLoading}
        viewAllHref="/shop"
      />
      <ProductSection
        title="Best Sellers"
        subtitle="Loved again and again by the Cocoberry community."
        products={bestSellers}
        isLoading={bestSellersLoading}
        viewAllHref="/shop?sort=best-selling"
        tint="blush"
      />
      <ShopByCategory />
      <ProductSection
        title="New Arrivals"
        subtitle="Just landed in the Cocoberry shop."
        products={newArrivals}
        isLoading={newArrivalsLoading}
        viewAllHref="/shop?sort=newest"
      />
      <WhyCocoberry />
      <Testimonials />
      <NewsletterSection />
      <InstagramFeed />
      <BlogPreview />
    </>
  );
}
