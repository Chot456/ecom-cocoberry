import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { Order } from "@/types";

type Client = SupabaseClient<Database>;

export interface DashboardStats {
  productCount: number;
  categoryCount: number;
  pendingOrderCount: number;
  revenue: number;
  recentOrders: Order[];
}

export async function getDashboardStats(supabase: Client): Promise<DashboardStats> {
  const [{ count: productCount }, { count: categoryCount }, { count: pendingOrderCount }, { data: paidOrders }, { data: recentOrders }] =
    await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("categories").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("orders").select("total").eq("payment_status", "paid"),
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
    ]);

  const revenue = (paidOrders ?? []).reduce((sum, o) => sum + Number(o.total), 0);

  return {
    productCount: productCount ?? 0,
    categoryCount: categoryCount ?? 0,
    pendingOrderCount: pendingOrderCount ?? 0,
    revenue,
    recentOrders: (recentOrders ?? []) as Order[],
  };
}

export interface RevenuePoint {
  date: string;
  revenue: number;
  orders: number;
}

export async function getRevenueTimeSeries(supabase: Client, days = 14): Promise<RevenuePoint[]> {
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("orders")
    .select("created_at, total, payment_status")
    .gte("created_at", since.toISOString());
  if (error) throw error;

  const buckets = new Map<string, RevenuePoint>();
  for (let i = 0; i < days; i++) {
    const day = new Date(since);
    day.setDate(since.getDate() + i);
    const key = day.toISOString().slice(0, 10);
    buckets.set(key, { date: key, revenue: 0, orders: 0 });
  }

  for (const order of data ?? []) {
    const bucket = buckets.get(order.created_at.slice(0, 10));
    if (!bucket) continue;
    bucket.orders += 1;
    if (order.payment_status === "paid") bucket.revenue += Number(order.total);
  }

  return Array.from(buckets.values());
}
