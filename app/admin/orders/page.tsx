"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminOrders } from "@/lib/hooks/use-orders";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order } from "@/types";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/components/ui/table";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS_BADGE_CLASS, PAYMENT_STATUS_BADGE_CLASS } from "@/lib/order-status";

const PAGE_SIZE = 20;
const STATUSES: Order["status"][] = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [status, setStatus] = useState<Order["status"] | "">("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminOrders({ status: status || undefined, page, pageSize: PAGE_SIZE });

  const totalPages = data ? Math.max(1, Math.ceil(data.count / PAGE_SIZE)) : 1;

  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal dark:text-beige mb-6">Orders</h1>

      <Select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value as Order["status"] | "");
          setPage(1);
        }}
        className="mb-6 max-w-xs"
      >
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Select>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Order</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Payment</TableHeaderCell>
            <TableHeaderCell>Total</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Link href={`/admin/orders/${order.id}`} className="font-medium text-rose-600 dark:text-rose-300">
                  #{order.id.slice(0, 8)}
                </Link>
              </TableCell>
              <TableCell>{formatDate(order.created_at)}</TableCell>
              <TableCell>
                <Badge className={ORDER_STATUS_BADGE_CLASS[order.status]}>{order.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={PAYMENT_STATUS_BADGE_CLASS[order.payment_status]}>{order.payment_status}</Badge>
              </TableCell>
              <TableCell>{formatPrice(Number(order.total))}</TableCell>
            </TableRow>
          ))}
          {!isLoading && data?.orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-charcoal/50 dark:text-beige/50">
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-charcoal/60 dark:text-beige/60">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
