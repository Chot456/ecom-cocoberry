import type { Metadata } from "next";
import Link from "next/link";
import { Package, Tags, Clock, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats, getRevenueTimeSeries } from "@/services/admin";
import { formatPrice, formatDate } from "@/lib/utils";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { ORDER_STATUS_BADGE_CLASS } from "@/lib/order-status";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const [stats, revenueSeries] = await Promise.all([
    getDashboardStats(supabase),
    getRevenueTimeSeries(supabase, 14),
  ]);

  const cards = [
    { label: "Products", value: stats.productCount, icon: Package },
    { label: "Categories", value: stats.categoryCount, icon: Tags },
    { label: "Pending Orders", value: stats.pendingOrderCount, icon: Clock },
    { label: "Revenue (Paid)", value: formatPrice(stats.revenue), icon: Wallet },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal dark:text-beige mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-rose-100 dark:border-white/10 p-5 flex items-center gap-4"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
              <card.icon size={20} className="text-rose-600 dark:text-rose-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-charcoal/50 dark:text-beige/50">{card.label}</p>
              <p className="text-xl font-semibold text-charcoal dark:text-beige">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-display text-xl text-charcoal dark:text-beige mb-4">Revenue & Orders (Last 14 Days)</h2>
      <div className="mb-10">
        <RevenueChart data={revenueSeries} />
      </div>

      <h2 className="font-display text-xl text-charcoal dark:text-beige mb-4">Recent Orders</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Order</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Total</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stats.recentOrders.map((order) => (
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
              <TableCell>{formatPrice(Number(order.total))}</TableCell>
            </TableRow>
          ))}
          {stats.recentOrders.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-charcoal/50 dark:text-beige/50">
                No orders yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
