"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center dark:bg-[#221b1e]">
      <h1 className="font-display text-2xl text-charcoal dark:text-beige">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-charcoal/60 dark:text-beige/60">
        An unexpected error occurred. Please try again.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}
