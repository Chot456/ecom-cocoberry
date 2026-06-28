"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { couponSchema, type CouponFormInput, type CouponFormOutput } from "@/lib/validations/coupon";
import { useCreateCoupon, useUpdateCoupon } from "@/lib/hooks/use-admin-coupons";
import type { Coupon } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export function CouponForm({ coupon }: { coupon?: Coupon }) {
  const router = useRouter();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CouponFormInput, unknown, CouponFormOutput>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: coupon?.code ?? "",
      discountType: coupon?.discount_type ?? "percent",
      discountValue: coupon?.discount_value ?? 0,
      minOrderAmount: coupon?.min_order_amount ?? 0,
      maxUses: coupon?.max_uses ?? undefined,
      active: coupon?.active ?? true,
      expiresAt: coupon?.expires_at ? coupon.expires_at.slice(0, 10) : "",
    },
  });

  const isPending = createCoupon.isPending || updateCoupon.isPending;

  function onSubmit(data: CouponFormOutput) {
    const input = {
      code: data.code.toUpperCase(),
      discountType: data.discountType,
      discountValue: data.discountValue,
      minOrderAmount: data.minOrderAmount,
      maxUses: data.maxUses ?? null,
      active: data.active,
      expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
    };

    const onError = () => toast.error("Couldn't save this coupon. Please try again.");

    if (coupon) {
      updateCoupon.mutate(
        { id: coupon.id, input },
        {
          onSuccess: () => {
            toast.success("Coupon updated.");
            router.push("/admin/coupons");
          },
          onError,
        }
      );
    } else {
      createCoupon.mutate(input, {
        onSuccess: () => {
          toast.success("Coupon created.");
          router.push("/admin/coupons");
        },
        onError,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6">
      <div>
        <Label htmlFor="code">Code</Label>
        <Input id="code" {...register("code")} className="uppercase" />
        {errors.code && <p className="mt-1 text-xs text-rose-500">{errors.code.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="discountType">Discount Type</Label>
          <Select id="discountType" {...register("discountType")}>
            <option value="percent">Percent</option>
            <option value="fixed">Fixed Amount</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="discountValue">Discount Value</Label>
          <Input id="discountValue" type="number" step="0.01" {...register("discountValue")} />
          {errors.discountValue && (
            <p className="mt-1 text-xs text-rose-500">{errors.discountValue.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="minOrderAmount">Minimum Order Amount (₱)</Label>
          <Input id="minOrderAmount" type="number" step="0.01" {...register("minOrderAmount")} />
        </div>
        <div>
          <Label htmlFor="maxUses">Max Uses (optional)</Label>
          <Input id="maxUses" type="number" {...register("maxUses")} />
        </div>
      </div>

      <div>
        <Label htmlFor="expiresAt">Expires On (optional)</Label>
        <Input id="expiresAt" type="date" {...register("expiresAt")} />
      </div>

      <Controller
        control={control}
        name="active"
        render={({ field }) => (
          <Checkbox
            id="active"
            label="Active"
            checked={field.value}
            onChange={(e) => field.onChange(e.target.checked)}
          />
        )}
      />

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : coupon ? "Save Changes" : "Create Coupon"}
      </Button>
    </form>
  );
}
