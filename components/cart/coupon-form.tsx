"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useValidateCoupon } from "@/lib/hooks/use-coupon";
import { useCartStore, useCartTotals } from "@/store/cart-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function CouponForm() {
  const [code, setCode] = useState("");
  const { subtotal } = useCartTotals();
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);
  const setCoupon = useCartStore((s) => s.setCoupon);
  const clearCoupon = useCartStore((s) => s.clearCoupon);
  const validateCoupon = useValidateCoupon();

  function handleApply() {
    if (!code.trim()) return;
    validateCoupon.mutate(
      { code: code.trim().toUpperCase(), orderAmount: subtotal },
      {
        onSuccess: (result) => {
          if (result.valid) {
            setCoupon({ code: code.trim().toUpperCase(), discountAmount: result.discount_amount });
            toast.success(result.message || "Coupon applied!");
            setCode("");
          } else {
            toast.error(result.message || "Invalid coupon code.");
          }
        },
        onError: () => toast.error("Couldn't validate that code. Please try again."),
      }
    );
  }

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between rounded-xl bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm">
        <span className="text-green-700 dark:text-green-300">
          Coupon <strong>{appliedCoupon.code}</strong> applied (&minus;{formatPrice(appliedCoupon.discountAmount)})
        </span>
        <button onClick={clearCoupon} className="text-green-700 dark:text-green-300 underline cursor-pointer">
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Coupon code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApply())}
      />
      <Button type="button" variant="outline" disabled={validateCoupon.isPending} onClick={handleApply}>
        {validateCoupon.isPending ? "Checking..." : "Apply"}
      </Button>
    </div>
  );
}
