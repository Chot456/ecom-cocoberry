"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCategories, useDeleteCategory } from "@/lib/hooks/use-categories";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();

  function handleDelete(id: string) {
    deleteCategory.mutate(id, {
      onSuccess: () => toast.success("Category deleted."),
      onError: () => toast.error("Couldn't delete this category."),
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-3xl text-charcoal dark:text-beige">Categories</h1>
        <Link href="/admin/categories/new">
          <Button size="sm">
            <Plus size={16} />
            New Category
          </Button>
        </Link>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Category</TableHeaderCell>
            <TableHeaderCell>Slug</TableHeaderCell>
            <TableHeaderCell></TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories?.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-rose-50">
                    {category.image_url && (
                      <Image src={category.image_url} alt="" fill className="object-cover" />
                    )}
                  </div>
                  <span className="font-medium">{category.name}</span>
                </div>
              </TableCell>
              <TableCell>{category.slug}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-4">
                  <Link
                    href={`/admin/categories/${category.id}/edit`}
                    className="text-sm font-medium text-rose-600 dark:text-rose-300"
                  >
                    Edit
                  </Link>
                  <ConfirmDeleteButton
                    onConfirm={() => handleDelete(category.id)}
                    confirmText={`Delete "${category.name}"? This cannot be undone.`}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
          {!isLoading && categories?.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-charcoal/50 dark:text-beige/50">
                No categories yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
