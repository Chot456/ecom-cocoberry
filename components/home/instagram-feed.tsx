import { InstagramIcon } from "@/components/icons/social-icons";

const TILES = [
  "from-rose-200 to-rose-300",
  "from-gold-300 to-gold-400",
  "from-beige to-rose-200",
  "from-rose-300 to-rose-400",
  "from-blush to-beige",
  "from-gold-400 to-rose-300",
];

export function InstagramFeed() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="font-display text-2xl text-charcoal sm:text-3xl dark:text-beige">Follow Our Glow</h2>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-charcoal/60 dark:text-beige/60">
          <InstagramIcon size={14} /> @cocoberrybeauty
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-6">
        {TILES.map((gradient, i) => (
          <div
            key={i}
            className={`aspect-square rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <InstagramIcon size={20} className="text-white/70" />
          </div>
        ))}
      </div>
    </section>
  );
}
