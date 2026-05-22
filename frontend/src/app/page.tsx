import type { Metadata } from "next";
import { getHomePage } from "@/lib/sanity/fetch";
import { makeMetadata } from "@/lib/seo";
import { HomePageTemplate } from "@/components/sections/home-page-template";

export const metadata: Metadata = makeMetadata({
  title: "Luxury Real Estate Across GTA and York Region",
  description:
    "Drenova Group — a modern real estate brokerage offering expert buying and selling services with a personal approach. Start your home journey today.",
  path: "/",
});

export default async function HomePage() {
  const homePage = await getHomePage();

  return <HomePageTemplate page={homePage} leadSource="homepage" />;
}
