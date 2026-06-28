import { z } from "zod";

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Enter your full name."),
  phone: z.string().min(7, "Enter a valid phone number."),
  address: z.string().min(5, "Enter your street address."),
  city: z.string().min(2, "Enter your city."),
  province: z.string().min(2, "Enter your province."),
  postalCode: z.string().min(3, "Enter your postal code."),
  country: z.string().min(2, "Enter your country."),
});
export type ShippingAddressFormInput = z.infer<typeof shippingAddressSchema>;

export const checkoutSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(["cod", "bank_transfer"]),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;
