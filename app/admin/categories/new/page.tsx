import type { Metadata } from "next";
import { CategoryForm } from "@/components/admin/category-form";

export const metadata: Metadata = {
  title: "New Category",
};

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal dark:text-beige mb-8">New Category</h1>
      <CategoryForm />
    </div>
  );
}
