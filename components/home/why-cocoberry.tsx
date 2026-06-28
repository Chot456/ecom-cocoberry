import { Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react";

const REASONS = [
  {
    icon: Leaf,
    title: "Nature-Inspired Formulas",
    description: "Coconut and berry-powered ingredients chosen for real, visible results.",
  },
  {
    icon: ShieldCheck,
    title: "Dermatologically Mindful",
    description: "Gentle, effective formulations crafted for everyday use.",
  },
  {
    icon: Sparkles,
    title: "Radiance You Can See",
    description: "Designed to help you look and feel naturally radiant, every day.",
  },
  {
    icon: Truck,
    title: "Fast, Reliable Delivery",
    description: "Quick fulfillment so your glow-up never has to wait.",
  },
];

export function WhyCocoberry() {
  return (
    <section className="bg-beige/60 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display text-2xl text-charcoal sm:text-3xl dark:text-beige">Why Choose Cocoberry</h2>
          <p className="mt-2 text-sm text-charcoal/60 dark:text-beige/60">
            Premium beauty essentials, made with intention.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason) => (
            <div key={reason.title} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300">
                <reason.icon size={24} />
              </div>
              <h3 className="font-medium text-charcoal dark:text-beige">{reason.title}</h3>
              <p className="mt-2 text-sm text-charcoal/60 dark:text-beige/60">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
