export const RESERVED_ROOT_SLUGS = [
  "about",
  "api",
  "buy",
  "buyers-guide",
  "contact",
  "home-evaluation",
  "listings",
  "privacy",
  "sell",
  "sellers-guide",
  "team",
  "terms",
  "robots",
  "sitemap",
  "favicon.ico",
  "opengraph-image",
];

export function isReservedRootSlug(slug: string): boolean {
  return RESERVED_ROOT_SLUGS.includes(slug);
}
