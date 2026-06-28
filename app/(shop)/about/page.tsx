import type { Metadata } from "next";
import { WhyCocoberry } from "@/components/home/why-cocoberry";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Cocoberry blends the nourishing benefits of coconut with the freshness of berries for premium, nature-inspired beauty.",
};

export default function AboutPage() {
  return (
    <div>
      <div className="bg-beige/60 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-300">
            Our Story
          </p>
          <h1 className="font-display mt-3 text-3xl text-charcoal sm:text-4xl dark:text-beige">
            Naturally Radiant, Beautifully You
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-charcoal/70 sm:text-base dark:text-beige/70">
            Cocoberry was born from a simple idea: beauty care should feel as good as it works.
            We blend the nourishing benefits of coconut with the freshness of berries to create
            premium, nature-inspired formulas for skin and hair that real people can rely on every
            day. Every product is crafted with intention &mdash; gentle enough for daily use,
            effective enough to see and feel the difference.
          </p>
        </div>
      </div>

      <WhyCocoberry />

      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl text-charcoal dark:text-beige">Our Promise</h2>
        <p className="mt-4 text-sm leading-relaxed text-charcoal/70 dark:text-beige/70">
          From our first batch of Cocoberry Body Soap to every product since, we hold ourselves to
          the same standard: nature-inspired ingredients, honest formulas, and a glow that speaks
          for itself. Thank you for letting Cocoberry be part of your routine.
        </p>
      </div>
    </div>
  );
}
