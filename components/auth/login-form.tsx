"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { getProfile } from "@/services/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/account";
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setSubmitting(true);
    const supabase = createClient();
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setSubmitting(false);
      toast.error(error.message);
      return;
    }

    const profile = authData.user ? await getProfile(supabase, authData.user.id) : null;
    setSubmitting(false);

    toast.success("Welcome back!");
    router.push(profile?.role === "admin" ? "/admin" : redirectTo);
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal dark:text-beige">Welcome back</h1>
      <p className="mt-1 text-sm text-charcoal/60 dark:text-beige/60">
        Sign in to continue your Cocoberry glow.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs font-medium text-rose-600 dark:text-rose-300 mb-1.5">
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
          {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-5">
        <OAuthButtons />
      </div>

      <p className="mt-6 text-center text-sm text-charcoal/70 dark:text-beige/70">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-rose-600 dark:text-rose-300">
          Sign up
        </Link>
      </p>
    </div>
  );
}
