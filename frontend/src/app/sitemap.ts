import type { MetadataRoute } from "next";
import { getTeamMembers } from "@/lib/sanity/fetch";
import { getAmpreListings } from "@/lib/ampre/fetch";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://drenovagroup.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/buy`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/sell`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/listings`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/team`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const [{ listings }, teamMembers] = await Promise.all([
    getAmpreListings({ pageSize: 1000 }),
    getTeamMembers(),
  ]);

  const listingPages: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${BASE_URL}/listings/${listing.slug}`,
    lastModified: listing.modificationTimestamp,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const teamPages: MetadataRoute.Sitemap = teamMembers.map((member) => ({
    url: `${BASE_URL}/team/${member.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...listingPages, ...teamPages];
}
