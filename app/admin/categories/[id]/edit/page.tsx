"use client";

import { useParams } from "next/navigation";
import { useAdminCategory } from "@/lib/hooks/use-categories";
import { CategoryForm } from "@/components/admin/category-form";

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { data: category, isLoading } = useAdminCategory(id);

  if (isLoading) return <p className="text-charcoal/60 dark:text-beige/60">Loading...</p>;
  if (!category) return <p className="text-charcoal/60 dark:text-beige/60">Category not found.</p>;

  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal dark:text-beige mb-8">Edit Category</h1>
      <CategoryForm category={category} />
    </div>
  );
}
