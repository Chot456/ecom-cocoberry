"use client";

import Link from "next/link";
import { Sheet } from "@/components/ui/sheet";
import { useUser } from "@/lib/hooks/use-user";
import { useProfile } from "@/lib/hooks/use-profile";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useUser();
  const { data: profile } = useProfile(user?.id);
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    onClose();
    router.push("/");
    router.refresh();
  }

  return (
    <Sheet open={open} onClose={onClose} side="left" title="Cocoberry" widthClassName="max-w-xs">
      <nav className="flex flex-col px-6 py-4">
        <Link href="/" onClick={onClose} className="py-3 text-charcoal dark:text-beige border-b border-rose-100 dark:border-white/10">
          Home
        </Link>
        <Link href="/shop" onClick={onClose} className="py-3 text-charcoal dark:text-beige border-b border-rose-100 dark:border-white/10">
          Shop All
        </Link>
        <Link href="/about" onClick={onClose} className="py-3 text-charcoal dark:text-beige border-b border-rose-100 dark:border-white/10">
          About
        </Link>
        {user ? (
          <>
            <Link href="/account" onClick={onClose} className="py-3 text-charcoal dark:text-beige border-b border-rose-100 dark:border-white/10">
              My Account
            </Link>
            {profile?.role === "admin" && (
              <Link href="/admin" onClick={onClose} className="py-3 text-charcoal dark:text-beige border-b border-rose-100 dark:border-white/10">
                Admin Dashboard
              </Link>
            )}
            <button onClick={handleSignOut} className="py-3 text-left text-rose-600 cursor-pointer">
              Sign Out
            </button>
          </>
        ) : (
          <Link href="/login" onClick={onClose} className="py-3 text-rose-600 font-medium">
            Login / Sign Up
          </Link>
        )}
      </nav>
    </Sheet>
  );
}
