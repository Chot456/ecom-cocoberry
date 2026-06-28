"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { GoogleIcon, FacebookIcon } from "@/components/icons/social-icons";

export function OAuthButtons() {
  const [loadingProvider, setLoadingProvider] = useState<"google" | "facebook" | null>(null);

  async function signInWithProvider(provider: "google" | "facebook") {
    setLoadingProvider(provider);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      toast.error(error.message);
      setLoadingProvider(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative flex items-center py-2">
        <div className="flex-1 border-t border-rose-200 dark:border-white/10" />
        <span className="px-3 text-xs uppercase tracking-wide text-charcoal/50 dark:text-beige/50">
          Or continue with
        </span>
        <div className="flex-1 border-t border-rose-200 dark:border-white/10" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={loadingProvider !== null}
          onClick={() => signInWithProvider("google")}
        >
          <GoogleIcon size={18} /> Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={loadingProvider !== null}
          onClick={() => signInWithProvider("facebook")}
        >
          <FacebookIcon size={18} /> Facebook
        </Button>
      </div>
    </div>
  );
}
