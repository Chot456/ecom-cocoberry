"use client";

import { useParams } from "next/navigation";
import { useAdminCoupon } from "@/lib/hooks/use-admin-coupons";
import { CouponForm } from "@/components/admin/coupon-form";

export default function EditCouponPage() {
  const { id } = useParams<{ id: string }>();
  const { data: coupon, isLoading } = useAdminCoupon(id);

  if (isLoading) return <p className="text-charcoal/60 dark:text-beige/60">Loading...</p>;
  if (!coupon) return <p className="text-charcoal/60 dark:text-beige/60">Coupon not found.</p>;

  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal dark:text-beige mb-8">Edit Coupon</h1>
      <CouponForm coupon={coupon} />
    </div>
  );
}
