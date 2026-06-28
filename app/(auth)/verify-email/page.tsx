import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { ResendVerificationButton } from "@/components/auth/resend-verification-button";

export const metadata: Metadata = {
  title: "Verify Your Email",
};

export default function VerifyEmailPage() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
        <Mail size={26} className="text-rose-600 dark:text-rose-300" />
      </div>
      <h1 className="font-display mt-4 text-2xl text-charcoal dark:text-beige">Check your inbox</h1>
      <p className="mt-2 text-sm text-charcoal/60 dark:text-beige/60">
        We&apos;ve sent a verification link to your email. Click it to activate your Cocoberry
        account.
      </p>

      <ResendVerificationButton />

      <Link href="/login" className="mt-6 inline-block text-sm font-medium text-rose-600 dark:text-rose-300">
        Back to sign in
      </Link>
    </div>
  );
}
