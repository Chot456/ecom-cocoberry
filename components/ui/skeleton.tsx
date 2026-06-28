import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-rose-100/70 dark:bg-white/10", className)}
    />
  );
}
