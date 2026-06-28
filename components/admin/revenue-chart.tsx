"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RevenuePoint } from "@/services/admin";
import { formatPrice } from "@/lib/utils";

function formatDay(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatCompactPrice(value: number) {
  if (value >= 1000) return `₱${(value / 1000).toFixed(1)}k`;
  return `₱${value}`;
}

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <div className="h-80 w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="currentColor" className="text-slate-100 dark:text-white/10" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDay}
            tick={{ fontSize: 12 }}
            stroke="currentColor"
            className="text-slate-400"
          />
          <YAxis
            yAxisId="orders"
            allowDecimals={false}
            tick={{ fontSize: 12 }}
            stroke="currentColor"
            className="text-slate-400"
          />
          <YAxis
            yAxisId="revenue"
            orientation="right"
            tickFormatter={formatCompactPrice}
            tick={{ fontSize: 12 }}
            stroke="currentColor"
            className="text-slate-400"
          />
          <Tooltip
            labelFormatter={(label) => formatDay(label as string)}
            formatter={(value, name) => [name === "Revenue" ? formatPrice(Number(value)) : value, name]}
            contentStyle={{ borderRadius: 12, fontSize: 13, border: "1px solid #e2e8f0" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar yAxisId="orders" dataKey="orders" name="Orders" fill="#c7d2fe" radius={[4, 4, 0, 0]} barSize={18} />
          <Line
            yAxisId="revenue"
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#4f46e5"
            strokeWidth={2.5}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
