"use client";

import { useParams } from "next/navigation";
import { useOrder } from "@/lib/hooks/use-orders";
import { formatDate, formatPrice } from "@/lib/utils";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_BADGE_CLASS, PAYMENT_STATUS_BADGE_CLASS } from "@/lib/order-status";

const PAYMENT_LABELS: Record<string, string> = {
  cod: "Cash on Delivery",
  bank_transfer: "Bank Transfer",
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) return <p className="text-charcoal/60 dark:text-beige/60">Loading...</p>;
  if (!order) return <p className="text-charcoal/60 dark:text-beige/60">Order not found.</p>;

  const shippingAddress = order.shipping_address as {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-charcoal dark:text-beige mb-2">Order #{order.id.slice(0, 8)}</h1>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <p className="text-sm text-charcoal/60 dark:text-beige/60">Placed on {formatDate(order.created_at)}</p>
        <Badge className={ORDER_STATUS_BADGE_CLASS[order.status]}>{order.status}</Badge>
        <Badge className={PAYMENT_STATUS_BADGE_CLASS[order.payment_status]}>{order.payment_status}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <div className="rounded-2xl border border-rose-100 dark:border-white/10 p-6">
          <div className="grid grid-cols-1 gap-6 pb-6 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-charcoal/50 dark:text-beige/50">
                Shipping Address
              </p>
              <p className="text-sm text-charcoal dark:text-beige">{shippingAddress.fullName}</p>
              <p className="text-sm text-charcoal/70 dark:text-beige/70">
                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.province}{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              <p className="text-sm text-charcoal/70 dark:text-beige/70">{shippingAddress.phone}</p>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-charcoal/50 dark:text-beige/50">
                Payment Method
              </p>
              <p className="text-sm text-charcoal dark:text-beige">
                {PAYMENT_LABELS[order.payment_method] ?? order.payment_method}
              </p>
            </div>
          </div>

          <div className="divide-y divide-rose-100 dark:divide-white/10 border-t border-rose-100 dark:border-white/10">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-charcoal dark:text-beige">
                  {item.product_name} &times; {item.quantity}
                </span>
                <span className="font-medium text-charcoal dark:text-beige">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1.5 border-t border-rose-100 dark:border-white/10 pt-4 text-sm">
            <div className="flex justify-between text-charcoal/70 dark:text-beige/70">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Discount</span>
                <span>&minus;{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-charcoal/70 dark:text-beige/70">
              <span>Shipping</span>
              <span>{order.shipping_fee === 0 ? "Free" : formatPrice(order.shipping_fee)}</span>
            </div>
            <div className="flex justify-between border-t border-rose-100 dark:border-white/10 pt-2 text-base font-semibold text-charcoal dark:text-beige">
              <span>Total</span>
              <span className="text-rose-700 dark:text-rose-300">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-rose-100 dark:border-white/10 p-6">
          <h2 className="font-display text-lg text-charcoal dark:text-beige mb-4">Update Order</h2>
          <OrderStatusForm order={order} />
        </div>
      </div>
    </div>
  );
}
