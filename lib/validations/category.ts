import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Enter a category name."),
  slug: z.string().min(2, "Enter a slug."),
  description: z.string().optional(),
  imageUrl: z.string().nullable(),
});

export type CategoryFormInput = z.infer<typeof categorySchema>;
