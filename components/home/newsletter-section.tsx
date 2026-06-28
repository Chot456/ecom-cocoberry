import { NewsletterForm } from "@/components/home/newsletter-form";

export function NewsletterSection() {
  return (
    <section className="bg-gradient-to-br from-rose-600 to-rose-700 dark:from-rose-900 dark:to-rose-950">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl text-white sm:text-3xl">Join the Cocoberry Glow List</h2>
        <p className="mt-3 max-w-md text-sm text-white/80">
          Be the first to know about new launches, exclusive offers, and beauty tips delivered
          straight to your inbox.
        </p>
        <div className="mt-6 flex justify-center">
          <NewsletterForm light />
        </div>
      </div>
    </section>
  );
}
