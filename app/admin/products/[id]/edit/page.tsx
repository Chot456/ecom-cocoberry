"use client";

import { useParams } from "next/navigation";
import { useAdminProduct } from "@/lib/hooks/use-products";
import { ProductForm } from "@/components/admin/product-form";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useAdminProduct(id);

  if (isLoading) return <p className="text-charcoal/60 dark:text-beige/60">Loading...</p>;
  if (!product) return <p className="text-charcoal/60 dark:text-beige/60">Product not found.</p>;

  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal dark:text-beige mb-8">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}
