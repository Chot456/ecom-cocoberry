import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().min(3, "Enter a coupon code."),
  discountType: z.enum(["percent", "fixed"]),
  discountValue: z.coerce.number().positive("Discount value must be greater than 0."),
  minOrderAmount: z.coerce.number().min(0),
  maxUses: z.coerce.number().int().positive().optional(),
  active: z.boolean(),
  expiresAt: z.string().optional(),
});

export type CouponFormInput = z.input<typeof couponSchema>;
export type CouponFormOutput = z.output<typeof couponSchema>;
