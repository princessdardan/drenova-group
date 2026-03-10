import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Playfair_Display, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { DraftBanner } from "@/components/ui/draft-banner";
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
  title: {
    default: "Drenova Group | Real Estate",
    template: "%s | Drenova Group",
  },
  description:
    "Drenova Group is a modern real estate brokerage serving buyers and sellers across Illinois, Arizona, Wisconsin, Indiana, and Michigan.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <head>
        <meta name="color-scheme" content="light" />
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async />
      </head>
      <body
        className={`${playfairDisplay.variable} ${plusJakartaSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {isDraftMode && <DraftBanner />}
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
