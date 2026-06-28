import type { Order } from "@/types";

export const ORDER_STATUS_BADGE_CLASS: Record<Order["status"], string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  processing: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  shipped: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300",
  delivered: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300",
};

export const PAYMENT_STATUS_BADGE_CLASS: Record<Order["payment_status"], string> = {
  unpaid: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300",
  paid: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300",
  refunded: "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
};
