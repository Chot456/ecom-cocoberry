const POSTS = [
  {
    title: "5 Ways Coconut Extract Transforms Dry Skin",
    excerpt: "Discover why coconut-derived ingredients are a staple in nourishing skincare routines.",
    tag: "Skincare Tips",
  },
  {
    title: "The Berry Antioxidant Glow, Explained",
    excerpt: "How berry extracts help brighten and protect skin from everyday stressors.",
    tag: "Ingredients",
  },
  {
    title: "Building a Simple, Effective Routine",
    excerpt: "A minimalist approach to skincare that still delivers visible results.",
    tag: "Routine",
  },
];

export function BlogPreview() {
  return (
    <section className="bg-beige/60 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-display text-2xl text-charcoal sm:text-3xl dark:text-beige">From the Journal</h2>
          <p className="mt-2 text-sm text-charcoal/60 dark:text-beige/60">
            Beauty tips and stories, coming soon to Cocoberry.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {POSTS.map((post) => (
            <div key={post.title} className="rounded-2xl bg-white/70 p-6 shadow-sm dark:bg-white/5">
              <span className="text-xs font-semibold uppercase tracking-wide text-rose-500">{post.tag}</span>
              <h3 className="font-display mt-3 text-lg text-charcoal dark:text-beige">{post.title}</h3>
              <p className="mt-2 text-sm text-charcoal/60 dark:text-beige/60">{post.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
