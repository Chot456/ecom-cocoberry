import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Enter a product name."),
  slug: z.string().min(2, "Enter a slug."),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be 0 or more."),
  comparePrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0, "Stock must be 0 or more."),
  categoryId: z.string().uuid().nullable(),
  ingredients: z.string().optional(),
  benefits: z.string().optional(),
  usage: z.string().optional(),
  isFeatured: z.boolean(),
  isBestSeller: z.boolean(),
  imageUrls: z.array(z.string()),
});

export type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormOutput = z.output<typeof productSchema>;
