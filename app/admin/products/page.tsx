"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useProducts, useDeleteProduct } from "@/lib/hooks/use-products";
import { formatPrice } from "@/lib/utils";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";

const PAGE_SIZE = 12;

export default function AdminProductsPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProducts({ query, page, pageSize: PAGE_SIZE });
  const deleteProduct = useDeleteProduct();

  const totalPages = data ? Math.max(1, Math.ceil(data.count / PAGE_SIZE)) : 1;

  function handleDelete(id: string) {
    deleteProduct.mutate(id, {
      onSuccess: () => toast.success("Product deleted."),
      onError: () => toast.error("Couldn't delete this product."),
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-3xl text-charcoal dark:text-beige">Products</h1>
        <Link href="/admin/products/new">
          <Button size="sm">
            <Plus size={16} />
            New Product
          </Button>
        </Link>
      </div>

      <Input
        placeholder="Search products..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1);
        }}
        className="mb-6 max-w-sm"
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Product</TableHeaderCell>
            <TableHeaderCell>Category</TableHeaderCell>
            <TableHeaderCell>Price</TableHeaderCell>
            <TableHeaderCell>Stock</TableHeaderCell>
            <TableHeaderCell></TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-rose-50">
                    {product.image_urls[0] && (
                      <Image src={product.image_urls[0]} alt="" fill className="object-cover" />
                    )}
                  </div>
                  <span className="font-medium">{product.name}</span>
                </div>
              </TableCell>
              <TableCell>{product.category?.name ?? "—"}</TableCell>
              <TableCell>{formatPrice(Number(product.price))}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-4">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-sm font-medium text-rose-600 dark:text-rose-300"
                  >
                    Edit
                  </Link>
                  <ConfirmDeleteButton
                    onConfirm={() => handleDelete(product.id)}
                    confirmText={`Delete "${product.name}"? This cannot be undone.`}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
          {!isLoading && data?.products.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-charcoal/50 dark:text-beige/50">
                No products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-charcoal/60 dark:text-beige/60">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
