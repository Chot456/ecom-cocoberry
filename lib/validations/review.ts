import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.number().min(1, "Select a rating.").max(5),
  comment: z.string().max(1000).optional(),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;
