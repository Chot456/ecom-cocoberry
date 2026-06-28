"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="text-center">
      <h1 className="font-display text-xl text-charcoal dark:text-beige">Something went wrong</h1>
      <p className="mt-2 text-sm text-charcoal/60 dark:text-beige/60">Please try again.</p>
      <Button className="mt-5" onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}
