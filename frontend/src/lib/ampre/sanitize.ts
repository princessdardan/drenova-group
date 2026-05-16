import type { Listing } from "@/types/listing";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildSafeListingSlug(listingKey: string): string {
  const normalizedKey = slugify(listingKey);
  return normalizedKey ? `listing-${normalizedKey}` : "listing";
}

export function sanitizeListingForPublicRead(listing: Listing): Listing {
  const safeSlug = buildSafeListingSlug(listing.listingKey);

  if (!listing.addressSuppressed) {
    return { ...listing, slug: safeSlug };
  }

  return {
    ...listing,
    slug: safeSlug,
    address: "",
    postalCode: undefined,
    latitude: null,
    longitude: null,
  };
}

export function sanitizeListingsForPublicRead(listings: Listing[]): Listing[] {
  return listings.map(sanitizeListingForPublicRead);
}
