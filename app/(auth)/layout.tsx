import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blush via-cream to-beige px-4 py-12 dark:from-[#221b1e] dark:via-[#221b1e] dark:to-[#2a2024]">
      <Link href="/" className="font-display mb-8 text-3xl text-rose-700 dark:text-rose-200">
        Cocoberry
      </Link>
      <div className="w-full max-w-md rounded-3xl bg-white/80 dark:bg-white/5 p-8 shadow-xl backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}
