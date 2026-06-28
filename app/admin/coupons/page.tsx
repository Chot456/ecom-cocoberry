"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCoupons, useDeleteCoupon } from "@/lib/hooks/use-admin-coupons";
import { formatDate, formatPrice } from "@/lib/utils";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";

export default function AdminCouponsPage() {
  const { data: coupons, isLoading } = useCoupons();
  const deleteCoupon = useDeleteCoupon();

  function handleDelete(id: string) {
    deleteCoupon.mutate(id, {
      onSuccess: () => toast.success("Coupon deleted."),
      onError: () => toast.error("Couldn't delete this coupon."),
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-3xl text-charcoal dark:text-beige">Coupons</h1>
        <Link href="/admin/coupons/new">
          <Button size="sm">
            <Plus size={16} />
            New Coupon
          </Button>
        </Link>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Code</TableHeaderCell>
            <TableHeaderCell>Discount</TableHeaderCell>
            <TableHeaderCell>Min Order</TableHeaderCell>
            <TableHeaderCell>Uses</TableHeaderCell>
            <TableHeaderCell>Expires</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell></TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coupons?.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
              <TableCell>
                {coupon.discount_type === "percent"
                  ? `${coupon.discount_value}%`
                  : formatPrice(Number(coupon.discount_value))}
              </TableCell>
              <TableCell>{formatPrice(Number(coupon.min_order_amount))}</TableCell>
              <TableCell>
                {coupon.used_count}
                {coupon.max_uses ? ` / ${coupon.max_uses}` : ""}
              </TableCell>
              <TableCell>{coupon.expires_at ? formatDate(coupon.expires_at) : "—"}</TableCell>
              <TableCell>
                <Badge variant={coupon.active ? "rose" : "outline"}>
                  {coupon.active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-4">
                  <Link
                    href={`/admin/coupons/${coupon.id}/edit`}
                    className="text-sm font-medium text-rose-600 dark:text-rose-300"
                  >
                    Edit
                  </Link>
                  <ConfirmDeleteButton
                    onConfirm={() => handleDelete(coupon.id)}
                    confirmText={`Delete "${coupon.code}"? This cannot be undone.`}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
          {!isLoading && coupons?.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-charcoal/50 dark:text-beige/50">
                No coupons yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
