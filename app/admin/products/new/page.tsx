import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "New Product",
};

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal dark:text-beige mb-8">New Product</h1>
      <ProductForm />
    </div>
  );
}
