import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cocoberry | Naturally Radiant, Beautifully You",
    template: "%s | Cocoberry",
  },
  description:
    "Cocoberry is a modern beauty brand inspired by the nourishing benefits of coconut and the freshness of berries. Shop premium skincare, body care, and beauty essentials.",
  openGraph: {
    title: "Cocoberry | Naturally Radiant, Beautifully You",
    description:
      "Discover premium beauty essentials inspired by nature and crafted to enhance your natural glow.",
    siteName: "Cocoberry",
    type: "website",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
