"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";
import { useUser } from "@/lib/hooks/use-user";
import { useDefaultAddress } from "@/lib/hooks/use-addresses";
import { useCreateOrder } from "@/lib/hooks/use-orders";
import { useCartStore, useCartTotals } from "@/store/cart-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PaymentMethodSelect } from "@/components/checkout/payment-method-select";
import { OrderSummary } from "@/components/cart/order-summary";
import { CartItemRow } from "@/components/cart/cart-item-row";

export function CheckoutForm() {
  const router = useRouter();
  const { user } = useUser();
  const items = useCartStore((s) => s.items);
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);
  const clear = useCartStore((s) => s.clear);
  const { subtotal, discount, shippingFee, total } = useCartTotals();

  const { data: defaultAddress } = useDefaultAddress(user?.id);
  const createOrder = useCreateOrder();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: {
        fullName: "",
        phone: "",
        address: "",
        city: "",
        province: "",
        postalCode: "",
        country: "Philippines",
      },
      paymentMethod: "cod",
    },
  });

  useEffect(() => {
    if (defaultAddress) {
      reset({
        shippingAddress: {
          fullName: defaultAddress.full_name,
          phone: defaultAddress.phone,
          address: defaultAddress.address,
          city: defaultAddress.city,
          province: defaultAddress.province,
          postalCode: defaultAddress.postal_code,
          country: defaultAddress.country,
        },
        paymentMethod: "cod",
      });
    }
  }, [defaultAddress, reset]);

  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      router.replace("/cart");
    }
  }, [items.length, orderPlaced, router]);

  function onSubmit(data: CheckoutInput) {
    if (!user) {
      toast.error("Please sign in to place your order.");
      return;
    }

    createOrder.mutate(
      {
        userId: user.id,
        items,
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
        subtotal,
        shippingFee,
        discount,
        total,
      },
      {
        onSuccess: (orderId) => {
          setOrderPlaced(true);
          clear();
          router.push(`/checkout/confirmation/${orderId}`);
        },
        onError: (error) => {
          console.error("Failed to place order:", error);
          const code = (error as { code?: string }).code;
          if (code === "23503") {
            toast.error("One or more items in your cart are no longer available. Please remove them and try again.");
            return;
          }
          toast.error("Couldn't place your order. Please try again.");
        },
      }
    );
  }

  if (items.length === 0) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        <section>
          <h2 className="font-display text-xl text-charcoal dark:text-beige">Shipping Address</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" {...register("shippingAddress.fullName")} />
              {errors.shippingAddress?.fullName && (
                <p className="mt-1 text-xs text-rose-500">{errors.shippingAddress.fullName.message}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" {...register("shippingAddress.phone")} />
              {errors.shippingAddress?.phone && (
                <p className="mt-1 text-xs text-rose-500">{errors.shippingAddress.phone.message}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="address">Street address</Label>
              <Input id="address" {...register("shippingAddress.address")} />
              {errors.shippingAddress?.address && (
                <p className="mt-1 text-xs text-rose-500">{errors.shippingAddress.address.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("shippingAddress.city")} />
              {errors.shippingAddress?.city && (
                <p className="mt-1 text-xs text-rose-500">{errors.shippingAddress.city.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="province">Province</Label>
              <Input id="province" {...register("shippingAddress.province")} />
              {errors.shippingAddress?.province && (
                <p className="mt-1 text-xs text-rose-500">{errors.shippingAddress.province.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="postalCode">Postal code</Label>
              <Input id="postalCode" {...register("shippingAddress.postalCode")} />
              {errors.shippingAddress?.postalCode && (
                <p className="mt-1 text-xs text-rose-500">{errors.shippingAddress.postalCode.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("shippingAddress.country")} />
              {errors.shippingAddress?.country && (
                <p className="mt-1 text-xs text-rose-500">{errors.shippingAddress.country.message}</p>
              )}
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl text-charcoal dark:text-beige">Payment Method</h2>
          <div className="mt-4">
            <Controller
              control={control}
              name="paymentMethod"
              render={({ field }) => <PaymentMethodSelect value={field.value} onChange={field.onChange} />}
            />
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl text-charcoal dark:text-beige">Review Your Order</h2>
          <div className="mt-4 divide-y divide-rose-100 dark:divide-white/10 rounded-2xl border border-rose-100 dark:border-white/10 px-4">
            {items.map((item) => (
              <CartItemRow key={item.productId} item={item} compact />
            ))}
          </div>
        </section>
      </div>

      <div>
        <div className="sticky top-24">
          <OrderSummary>
            {appliedCoupon && (
              <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                Coupon {appliedCoupon.code} applied
              </p>
            )}
            <Button type="submit" size="lg" className="mt-5 w-full" disabled={createOrder.isPending}>
              {createOrder.isPending ? "Placing Order..." : "Place Order"}
            </Button>
            <Link
              href="/cart"
              className="mt-3 block text-center text-sm font-medium text-rose-600 dark:text-rose-300"
            >
              Back to bag
            </Link>
          </OrderSummary>
        </div>
      </div>
    </form>
  );
}
