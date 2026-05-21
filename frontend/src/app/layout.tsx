import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Playfair_Display, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { DraftBanner } from "@/components/ui/draft-banner";
import { getSiteSettings } from "@/lib/sanity/fetch";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Drenova Group | Real Estate",
    template: "%s | Drenova Group",
  },
  description:
    "Drenova Group is a modern real estate team serving buyers and sellers across Toronto, the GTA, York Region, and surrounding Ontario communities.",
  openGraph: {
    type: "website",
    siteName: "Drenova Group",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ isEnabled: isDraftMode }, siteSettings] = await Promise.all([
    draftMode(),
    getSiteSettings(),
  ]);

  const navigationLinks = siteSettings?.navigationLinks;
  const headerLinks = navigationLinks
    ?.filter((link) => link.showInHeader !== false)
    .map(({ label, href }) => ({ label, href }));
  const footerLinks = navigationLinks
    ?.filter((link) => link.showInFooter !== false)
    .map(({ label, href }) => ({ label, href }));

  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body
        className={`${playfairDisplay.variable} ${plusJakartaSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent focus:text-accent-foreground focus:px-4 focus:py-2 focus:rounded-md"
        >
          Skip to main content
        </a>
        {isDraftMode && <DraftBanner />}
        <Header
          navigationLinks={headerLinks}
          phone={siteSettings?.phone}
          email={siteSettings?.email}
        />
        <main id="main-content">{children}</main>
        <Footer
          navigationLinks={footerLinks}
          officeHours={siteSettings?.officeHours}
        />
        <Analytics />
      </body>
    </html>
  );
}
