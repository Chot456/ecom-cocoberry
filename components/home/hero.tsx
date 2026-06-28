"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blush via-cream to-beige dark:from-[#2a2024] dark:via-[#221b1e] dark:to-[#221b1e]">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-rose-200/50 blur-3xl" />
      <div className="absolute -right-16 top-32 h-64 w-64 rounded-full bg-gold-300/40 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-rose-300/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <span className="inline-block rounded-full bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-rose-600 backdrop-blur-sm">
            Coconut &middot; Berry &middot; Beauty
          </span>
          <h1 className="font-display mt-6 text-4xl leading-tight text-charcoal sm:text-5xl lg:text-6xl dark:text-beige">
            Naturally Radiant,
            <br />
            <span className="text-rose-600 dark:text-rose-300">Beautifully You</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base text-charcoal/70 dark:text-beige/70 lg:mx-0">
            Discover premium beauty essentials inspired by nature and crafted to enhance your
            natural glow.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Link href="/shop">
              <Button size="lg">Shop Now</Button>
            </Link>
            <Link href="/categories/skincare">
              <Button size="lg" variant="outline">
                Explore Collection
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto w-full max-w-[22rem] sm:max-w-sm"
        >
          <div className="absolute -inset-4 rounded-[3rem] bg-white/50 shadow-2xl backdrop-blur-sm dark:bg-white/5" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-xl ring-1 ring-rose-200/60 dark:ring-white/10">
            <Image
              src="/images/hero-banner.jpg"
              alt="Cocoberry Body Soap and Instant Whitening Face & Body Lotion, ready to turn the glow all the way up"
              fill
              priority
              quality={100}
              sizes="(min-width: 1024px) 384px, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -left-5 z-10 flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm dark:bg-[#221b1e]/95">
            <Sparkles size={18} className="text-rose-500 dark:text-rose-300" />
            <span className="text-xs font-semibold text-charcoal dark:text-beige">Coconut &times; Berry Glow</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
