import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getCategoryBySlug } from "@/services/categories";
import { CategoryContent } from "@/components/shop/category-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const category = await getCategoryBySlug(supabase, slug);

  if (!category) return { title: "Category Not Found" };

  return {
    title: category.name,
    description: category.description ?? `Shop Cocoberry ${category.name}.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const category = await getCategoryBySlug(supabase, slug);

  if (!category) notFound();

  return (
    <div>
      <div className="relative h-48 w-full overflow-hidden sm:h-64">
        <Image
          src={category.image_url ?? "/images/categories/skincare.svg"}
          alt={category.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-charcoal/40 text-center px-4">
          <h1 className="font-display text-3xl text-white sm:text-4xl">{category.name}</h1>
          {category.description && (
            <p className="mt-2 max-w-xl text-sm text-white/80">{category.description}</p>
          )}
        </div>
      </div>

      <Suspense>
        <CategoryContent categorySlug={slug} />
      </Suspense>
    </div>
  );
}
