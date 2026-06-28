"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  title?: string;
  children: React.ReactNode;
  widthClassName?: string;
}

export function Sheet({
  open,
  onClose,
  side = "right",
  title,
  children,
  widthClassName = "max-w-md",
}: SheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: side === "right" ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: side === "right" ? "100%" : "-100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className={cn(
              "fixed top-0 z-50 h-full w-full bg-cream dark:bg-[#221b1e] shadow-2xl flex flex-col",
              side === "right" ? "right-0" : "left-0",
              widthClassName
            )}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-rose-100 dark:border-white/10">
              {title && <h2 className="font-display text-lg text-charcoal dark:text-beige">{title}</h2>}
              <button
                onClick={onClose}
                aria-label="Close"
                className="ml-auto rounded-full p-2 hover:bg-rose-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
