import { RatingStars } from "@/components/ui/rating-stars";

const TESTIMONIALS = [
  {
    name: "Andrea S.",
    rating: 5,
    quote:
      "My skin feels so much softer after switching to the Cocoberry Body Soap. The berry scent is subtle and so lovely.",
  },
  {
    name: "Mikaela R.",
    rating: 5,
    quote:
      "The Face & Body Lotion noticeably brightened my skin in about two weeks, just like it promised. Repurchasing for sure.",
  },
  {
    name: "Joyce T.",
    rating: 4,
    quote:
      "Love that it's lightweight and absorbs fast. It's become a staple in my everyday routine.",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="font-display text-2xl text-charcoal sm:text-3xl dark:text-beige">What Our Customers Say</h2>
        <p className="mt-2 text-sm text-charcoal/60 dark:text-beige/60">
          Real stories from the Cocoberry community.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="rounded-2xl bg-blush/60 p-6 dark:bg-white/5">
            <RatingStars rating={t.rating} />
            <p className="mt-4 text-sm text-charcoal/80 dark:text-beige/80">&ldquo;{t.quote}&rdquo;</p>
            <p className="mt-4 text-sm font-medium text-rose-700 dark:text-rose-300">{t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
