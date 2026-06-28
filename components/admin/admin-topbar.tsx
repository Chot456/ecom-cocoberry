"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Menu, User as UserIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AdminTopbarProps {
  fullName: string | null;
  email: string;
  avatarUrl: string | null;
  onOpenSidebar: () => void;
}

export function AdminTopbar({ fullName, email, avatarUrl, onOpenSidebar }: AdminTopbarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const initials = (fullName || email).charAt(0).toUpperCase();

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-3 sm:px-6 lg:px-10">
      <button
        onClick={onOpenSidebar}
        className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 cursor-pointer lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <span className="font-display text-lg text-slate-900 dark:text-white lg:hidden">Cocoberry Admin</span>

      <div className="relative ml-auto">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
          aria-label="Account menu"
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- avatar comes from arbitrary OAuth provider hosts not covered by next/image remotePatterns
            <img src={avatarUrl} alt={fullName ?? email} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
              {initials}
            </span>
          )}
          <ChevronDown size={16} className="text-slate-400" />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <div className="absolute right-0 z-40 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 shadow-xl py-2">
              <div className="border-b border-slate-200 dark:border-white/10 px-4 py-2">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{fullName || "Admin"}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{email}</p>
              </div>
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <UserIcon size={16} />
                View Profile
              </Link>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer disabled:opacity-60"
              >
                <LogOut size={16} />
                {signingOut ? "Signing out..." : "Log Out"}
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
