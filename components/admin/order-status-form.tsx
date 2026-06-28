"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useUpdateOrderStatus } from "@/lib/hooks/use-orders";
import type { Order } from "@/types";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const STATUSES: Order["status"][] = ["pending", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES: Order["payment_status"][] = ["unpaid", "paid", "refunded"];

export function OrderStatusForm({ order }: { order: Order }) {
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
  const updateOrderStatus = useUpdateOrderStatus();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateOrderStatus.mutate(
      { orderId: order.id, status, paymentStatus },
      {
        onSuccess: () => toast.success("Order updated."),
        onError: () => toast.error("Couldn't update this order."),
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="status">Order Status</Label>
        <Select id="status" value={status} onChange={(e) => setStatus(e.target.value as Order["status"])}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="paymentStatus">Payment Status</Label>
        <Select
          id="paymentStatus"
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value as Order["payment_status"])}
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>
      <Button type="submit" size="sm" disabled={updateOrderStatus.isPending}>
        {updateOrderStatus.isPending ? "Saving..." : "Update Order"}
      </Button>
    </form>
  );
}
