"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { ADMIN_NAV_LINKS } from "@/components/admin/admin-sidebar";
import { cn } from "@/lib/utils";

export function AdminMobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onClose={onClose} side="left" title="Cocoberry Admin" widthClassName="max-w-64">
      <nav className="flex flex-col gap-1 px-4 py-4">
        {ADMIN_NAV_LINKS.map((link) => {
          const isActive = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-rose-500 text-white"
                  : "text-charcoal dark:text-beige hover:bg-rose-100 dark:hover:bg-white/10"
              )}
            >
              <link.icon size={18} />
              {link.name}
            </Link>
          );
        })}
        <Link
          href="/"
          onClick={onClose}
          className="mt-4 flex items-center gap-2 px-3 py-2 text-sm font-medium text-charcoal/70 dark:text-beige/70"
        >
          <ArrowLeft size={16} />
          Back to Store
        </Link>
      </nav>
    </Sheet>
  );
}
