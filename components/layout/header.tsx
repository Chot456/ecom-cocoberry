"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Menu, Search, ShieldCheck, ShoppingBag, User } from "lucide-react";
import { useUser } from "@/lib/hooks/use-user";
import { useCartStore, useCartTotals } from "@/store/cart-store";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { useProfile } from "@/lib/hooks/use-profile";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
];

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const { user } = useUser();
  const { totalItems } = useCartTotals();
  const openCartDrawer = useCartStore((s) => s.openDrawer);
  const { data: wishlist } = useWishlist();
  const { data: profile } = useProfile(user?.id);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue("");
    }
  }

  return (
    <>
      <div className="bg-rose-500 text-white text-center text-xs font-medium py-2 px-4">
        Free shipping on orders over ₱999 &middot; Naturally Radiant, Beautifully You
      </div>
      <header className="sticky top-0 z-40 bg-cream/90 dark:bg-[#221b1e]/90 backdrop-blur-md border-b border-rose-100 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="lg:hidden rounded-full p-2 hover:bg-rose-100 dark:hover:bg-white/10 cursor-pointer"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <Link href="/" className="font-display text-2xl sm:text-3xl tracking-wide text-rose-700 dark:text-rose-200">
            Cocoberry
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-charcoal/80 dark:text-beige/80 hover:text-rose-600 dark:hover:text-rose-300 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-full p-2 hover:bg-rose-100 dark:hover:bg-white/10 cursor-pointer"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link
              href="/wishlist"
              className="relative rounded-full p-2 hover:bg-rose-100 dark:hover:bg-white/10"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {Boolean(wishlist?.length) && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] text-white">
                  {wishlist?.length}
                </span>
              )}
            </Link>
            <Link
              href={user ? "/account" : "/login"}
              className="rounded-full p-2 hover:bg-rose-100 dark:hover:bg-white/10"
              aria-label="Account"
            >
              <User size={20} />
            </Link>
            {profile?.role === "admin" && (
              <Link
                href="/admin"
                className="rounded-full p-2 hover:bg-rose-100 dark:hover:bg-white/10"
                aria-label="Admin"
              >
                <ShieldCheck size={20} />
              </Link>
            )}
            <button
              onClick={openCartDrawer}
              className="relative rounded-full p-2 hover:bg-rose-100 dark:hover:bg-white/10 cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] text-white">
                  {totalItems}
                </span>
              )}
            </button>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden border-t border-rose-100 dark:border-white/10 transition-all duration-300",
            searchOpen ? "max-h-20" : "max-h-0"
          )}
        >
          <form onSubmit={handleSearchSubmit} className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <input
              autoFocus={searchOpen}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search for products..."
              className="w-full rounded-full border border-rose-200 bg-white/70 dark:bg-white/5 px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </form>
        </div>
      </header>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
