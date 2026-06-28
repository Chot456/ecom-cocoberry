import Link from "next/link";
import { FacebookIcon, InstagramIcon } from "@/components/icons/social-icons";
import { NewsletterForm } from "@/components/home/newsletter-form";

const SHOP_LINKS = [
  { name: "Skincare", href: "/categories/skincare" },
  { name: "Makeup", href: "/categories/makeup" },
  { name: "Hair Care", href: "/categories/hair-care" },
  { name: "Body Care", href: "/categories/body-care" },
  { name: "Beauty Bundles", href: "/categories/beauty-bundles" },
];

const HELP_LINKS = [
  { name: "Shop All", href: "/shop" },
  { name: "My Account", href: "/account" },
  { name: "Wishlist", href: "/wishlist" },
  { name: "Cart", href: "/cart" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-beige">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-2">
            <p className="font-display text-3xl text-rose-200">Cocoberry</p>
            <p className="max-w-sm text-sm text-beige/70">
              Naturally Radiant, Beautifully You. Cocoberry blends the nourishing benefits of
              coconut with the freshness of berries for premium, nature-inspired beauty.
            </p>
            <div className="flex gap-3 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="rounded-full border border-beige/20 p-2 hover:bg-beige/10"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="rounded-full border border-beige/20 p-2 hover:bg-beige/10"
              >
                <FacebookIcon size={18} />
              </a>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-400">Shop</p>
            <ul className="space-y-3 text-sm text-beige/70">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-rose-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-400">Account</p>
            <ul className="space-y-3 text-sm text-beige/70">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-rose-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-beige/10 pt-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold-400">
            Join the Cocoberry Glow List
          </p>
          <p className="mb-4 max-w-md text-sm text-beige/70">
            Get first access to new launches, beauty tips, and exclusive offers.
          </p>
          <NewsletterForm light />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-beige/10 pt-8 text-xs text-beige/50 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Cocoberry. All rights reserved.</p>
          <p>Naturally Radiant, Beautifully You.</p>
        </div>
      </div>
    </footer>
  );
}
