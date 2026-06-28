"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { categorySchema, type CategoryFormInput } from "@/lib/validations/category";
import { useCreateCategory, useUpdateCategory } from "@/lib/hooks/use-categories";
import { slugify } from "@/lib/utils";
import type { Category } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const slugEditedRef = useRef(Boolean(category));

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      imageUrl: category?.image_url ?? null,
    },
  });

  const isPending = createCategory.isPending || updateCategory.isPending;

  function onSubmit(data: CategoryFormInput) {
    const input = {
      name: data.name,
      slug: data.slug,
      description: data.description ?? "",
      imageUrl: data.imageUrl,
    };

    const onError = () => toast.error("Couldn't save this category. Please try again.");

    if (category) {
      updateCategory.mutate(
        { id: category.id, input },
        {
          onSuccess: () => {
            toast.success("Category updated.");
            router.push("/admin/categories");
          },
          onError,
        }
      );
    } else {
      createCategory.mutate(input, {
        onSuccess: () => {
          toast.success("Category created.");
          router.push("/admin/categories");
        },
        onError,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      <div>
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

      <div>
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

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
      </div>

      <div>
        <Label>Image</Label>
        <Controller
          control={control}
          name="imageUrl"
          render={({ field }) => (
            <ImageUpload
              images={field.value ? [field.value] : []}
              onChange={(images) => field.onChange(images[0] ?? null)}
              multiple={false}
            />
          )}
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : category ? "Save Changes" : "Create Category"}
      </Button>
    </form>
  );
}
