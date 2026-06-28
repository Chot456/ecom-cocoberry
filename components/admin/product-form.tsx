"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { productSchema, type ProductFormInput, type ProductFormOutput } from "@/lib/validations/product";
import { useCreateProduct, useUpdateProduct } from "@/lib/hooks/use-products";
import { useCategories } from "@/lib/hooks/use-categories";
import { slugify } from "@/lib/utils";
import type { Product } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const slugEditedRef = useRef(Boolean(product));

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormOutput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      comparePrice: product?.compare_price ?? undefined,
      stock: product?.stock ?? 0,
      categoryId: product?.category_id ?? null,
      ingredients: product?.ingredients ?? "",
      benefits: product?.benefits ?? "",
      usage: product?.usage ?? "",
      isFeatured: product?.is_featured ?? false,
      isBestSeller: product?.is_best_seller ?? false,
      imageUrls: product?.image_urls ?? [],
    },
  });

  const isPending = createProduct.isPending || updateProduct.isPending;

  function onSubmit(data: ProductFormOutput) {
    const input = {
      name: data.name,
      slug: data.slug,
      description: data.description ?? "",
      price: data.price,
      comparePrice: data.comparePrice ?? null,
      stock: data.stock,
      categoryId: data.categoryId,
      ingredients: data.ingredients ?? "",
      benefits: data.benefits ?? "",
      usage: data.usage ?? "",
      isFeatured: data.isFeatured,
      isBestSeller: data.isBestSeller,
      imageUrls: data.imageUrls,
    };

    const onError = () => toast.error("Couldn't save this product. Please try again.");

    if (product) {
      updateProduct.mutate(
        { id: product.id, input },
        {
          onSuccess: () => {
            toast.success("Product updated.");
            router.push("/admin/products");
          },
          onError,
        }
      );
    } else {
      createProduct.mutate(input, {
        onSuccess: () => {
          toast.success("Product created.");
          router.push("/admin/products");
        },
        onError,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register("name")}
            onChange={(e) => {
              setValue("name", e.target.value);
              if (!slugEditedRef.current) setValue("slug", slugify(e.target.value));
            }}
          />
          {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            {...register("slug")}
            onChange={(e) => {
              slugEditedRef.current = true;
              setValue("slug", e.target.value);
            }}
          />
          {errors.slug && <p className="mt-1 text-xs text-rose-500">{errors.slug.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} />
        </div>

        <div>
          <Label htmlFor="price">Price (₱)</Label>
          <Input id="price" type="number" step="0.01" {...register("price")} />
          {errors.price && <p className="mt-1 text-xs text-rose-500">{errors.price.message}</p>}
        </div>

        <div>
          <Label htmlFor="comparePrice">Compare-at Price (₱)</Label>
          <Input id="comparePrice" type="number" step="0.01" {...register("comparePrice")} />
        </div>

        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" {...register("stock")} />
          {errors.stock && <p className="mt-1 text-xs text-rose-500">{errors.stock.message}</p>}
        </div>

        <div>
          <Label htmlFor="categoryId">Category</Label>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select
                id="categoryId"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value || null)}
              >
                <option value="">No category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            )}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg text-charcoal dark:text-beige">Product Details</h2>
        <div>
          <Label htmlFor="ingredients">Ingredients</Label>
          <Textarea id="ingredients" {...register("ingredients")} />
        </div>
        <div>
          <Label htmlFor="benefits">Benefits</Label>
          <Textarea id="benefits" {...register("benefits")} />
        </div>
        <div>
          <Label htmlFor="usage">Usage</Label>
          <Textarea id="usage" {...register("usage")} />
        </div>
      </section>

      <section>
        <Label>Images</Label>
        <Controller
          control={control}
          name="imageUrls"
          render={({ field }) => <ImageUpload images={field.value} onChange={field.onChange} />}
        />
      </section>

      <section className="flex flex-wrap gap-6">
        <Controller
          control={control}
          name="isFeatured"
          render={({ field }) => (
            <Checkbox
              id="isFeatured"
              label="Featured"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />
        <Controller
          control={control}
          name="isBestSeller"
          render={({ field }) => (
            <Checkbox
              id="isBestSeller"
              label="Best Seller"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />
      </section>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : product ? "Save Changes" : "Create Product"}
      </Button>
    </form>
  );
}
