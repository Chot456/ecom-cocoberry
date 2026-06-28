import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/services/profile";
import { SignOutButton } from "@/components/account/sign-out-button";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Account",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/account");

  const profile = await getProfile(supabase, user.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-rose-100 dark:border-white/10 p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
            <User size={28} className="text-rose-600 dark:text-rose-300" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-charcoal dark:text-beige">
              {profile?.full_name || "Cocoberry Customer"}
            </h1>
            <p className="text-sm text-charcoal/60 dark:text-beige/60">{user.email}</p>
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-rose-100 dark:border-white/10 pt-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-charcoal/50 dark:text-beige/50">Full Name</dt>
            <dd className="mt-1 text-sm text-charcoal dark:text-beige">{profile?.full_name || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-charcoal/50 dark:text-beige/50">Email</dt>
            <dd className="mt-1 text-sm text-charcoal dark:text-beige">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-charcoal/50 dark:text-beige/50">Phone</dt>
            <dd className="mt-1 text-sm text-charcoal dark:text-beige">{profile?.phone || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-charcoal/50 dark:text-beige/50">Member Since</dt>
            <dd className="mt-1 text-sm text-charcoal dark:text-beige">
              {profile ? formatDate(profile.created_at) : "—"}
            </dd>
          </div>
        </dl>

        <div className="mt-8 border-t border-rose-100 dark:border-white/10 pt-6">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
