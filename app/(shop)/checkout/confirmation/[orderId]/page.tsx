import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getOrderById } from "@/services/orders";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

const PAYMENT_LABELS: Record<string, string> = {
  cod: "Cash on Delivery",
  bank_transfer: "Bank Transfer",
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const supabase = await createClient();
  const order = await getOrderById(supabase, orderId);

  if (!order) notFound();

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
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <CheckCircle2 size={48} className="mx-auto text-green-500" />
        <h1 className="font-display mt-4 text-3xl text-charcoal dark:text-beige">Order Confirmed!</h1>
        <p className="mt-2 text-sm text-charcoal/60 dark:text-beige/60">
          Thank you for shopping with Cocoberry. We&apos;ve received your order.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-rose-100 dark:border-white/10 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-100 dark:border-white/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-charcoal/50 dark:text-beige/50">Order Number</p>
            <p className="font-mono text-sm text-charcoal dark:text-beige">{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-charcoal/50 dark:text-beige/50">Placed On</p>
            <p className="text-sm text-charcoal dark:text-beige">{formatDate(order.created_at)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2">
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
            <p className="mt-3 mb-1 text-xs uppercase tracking-wide text-charcoal/50 dark:text-beige/50">
              Status
            </p>
            <p className="text-sm capitalize text-charcoal dark:text-beige">{order.status}</p>
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

      <div className="mt-8 flex justify-center gap-3">
        <Link href="/shop">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
        <Link href="/account">
          <Button>View My Account</Button>
        </Link>
      </div>
    </div>
  );
}
