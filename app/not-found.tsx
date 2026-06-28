import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-7xl text-rose-300">404</p>
      <h1 className="font-display mt-4 text-2xl text-charcoal dark:text-beige">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-charcoal/60 dark:text-beige/60">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link href="/" className="mt-6">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
