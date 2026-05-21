import type { MetadataRoute } from "next";
import { getTeamMembers } from "@/lib/sanity/fetch";
import { getAmpreListings } from "@/lib/ampre/fetch";
import { canonicalUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: canonicalUrl(), changeFrequency: "weekly", priority: 1 },
    { url: canonicalUrl("/about"), changeFrequency: "monthly", priority: 0.8 },
    { url: canonicalUrl("/buy"), changeFrequency: "monthly", priority: 0.8 },
    { url: canonicalUrl("/sell"), changeFrequency: "monthly", priority: 0.8 },
    { url: canonicalUrl("/home-evaluation"), changeFrequency: "monthly", priority: 0.8 },
    { url: canonicalUrl("/buyers-guide"), changeFrequency: "monthly", priority: 0.7 },
    { url: canonicalUrl("/sellers-guide"), changeFrequency: "monthly", priority: 0.7 },
    { url: canonicalUrl("/listings"), changeFrequency: "daily", priority: 0.9 },
    { url: canonicalUrl("/team"), changeFrequency: "monthly", priority: 0.7 },
    { url: canonicalUrl("/contact"), changeFrequency: "monthly", priority: 0.7 },
    { url: canonicalUrl("/privacy"), changeFrequency: "yearly", priority: 0.3 },
    { url: canonicalUrl("/terms"), changeFrequency: "yearly", priority: 0.3 },
  ];

  const [{ listings }, teamMembers] = await Promise.all([
    getAmpreListings({ pageSize: 1000 }),
    getTeamMembers(),
  ]);

  const listingPages: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: canonicalUrl(`/listings/${listing.slug}`),
    lastModified: listing.modificationTimestamp,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const teamPages: MetadataRoute.Sitemap = teamMembers.map((member) => ({
    url: canonicalUrl(`/team/${member.slug}`),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...listingPages, ...teamPages];
}
