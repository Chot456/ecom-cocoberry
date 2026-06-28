"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tags, ShoppingCart, Ticket, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export const ADMIN_NAV_LINKS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Coupons", href: "/admin/coupons", icon: Ticket },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 flex-col bg-slate-950 px-4 py-6 lg:flex">
      <Link href="/admin" className="font-display text-2xl tracking-wide text-white px-2 mb-8">
        Cocoberry Admin
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {ADMIN_NAV_LINKS.map((link) => {
          const isActive = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-white/10 hover:text-white"
              )}
            >
              <link.icon size={18} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-2">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white">
          <ArrowLeft size={16} />
          Back to Store
        </Link>
      </div>
    </aside>
  );
}
