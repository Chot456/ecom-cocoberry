"use client";

import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConfirmDeleteButton({
  onConfirm,
  confirmText = "Are you sure you want to delete this? This cannot be undone.",
  disabled,
  className,
}: {
  onConfirm: () => void;
  confirmText?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (window.confirm(confirmText)) onConfirm();
      }}
      className={cn(
        "inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 dark:text-rose-300 text-sm font-medium cursor-pointer disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      aria-label="Delete"
    >
      <Trash2 size={16} />
      Delete
    </button>
  );
}
