import type { Metadata } from "next";
import { CouponForm } from "@/components/admin/coupon-form";

export const metadata: Metadata = {
  title: "New Coupon",
};

export default function NewCouponPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal dark:text-beige mb-8">New Coupon</h1>
      <CouponForm />
    </div>
  );
}
