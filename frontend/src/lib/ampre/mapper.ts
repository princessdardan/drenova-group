import type { AmpreProperty } from "./types";
import type { Listing } from "@/types/listing";

/**
 * Maps raw AMPRE properties to our internal Listing type.
 *
 * Compliance logic (C2 fix):
 * - Properties with `perm_adv === "N"` are filtered out BEFORE this function
 *   is called (in the sync job). They must never be stored.
 * - When `disp_addr === "N"`: address is set to empty string, lat/lng are
 *   nulled, and `addressSuppressed` is set to true. This happens server-side
 *   so suppressed addresses never reach the client, page source, or meta tags.
 */

function buildAddress(property: AmpreProperty): string {
  if (property.UnparsedAddress) return property.UnparsedAddress;

  const parts = [
    property.StreetNumber,
    property.StreetName,
    property.StreetSuffix,
  ].filter(Boolean);

  return parts.join(" ");
}

function buildSlug(property: AmpreProperty): string {
  const address = buildAddress(property);
  const parts = [address, property.City, property.StateOrProvince].filter(
    Boolean
  );
  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getPrimaryImage(property: AmpreProperty): string {
  if (!property.Media?.length) return "";

  const sorted = [...property.Media].sort(
    (a, b) => (a.Order ?? 999) - (b.Order ?? 999)
  );
  return sorted[0].MediaURL ?? "";
}

function getAllImages(property: AmpreProperty): string[] {
  if (!property.Media?.length) return [];

  return [...property.Media]
    .sort((a, b) => (a.Order ?? 999) - (b.Order ?? 999))
    .map((m) => m.MediaURL)
    .filter(Boolean);
}

export function mapAmpreToListing(property: AmpreProperty): Listing {
  const suppressAddress = property.disp_addr === "N";
  const now = new Date().toISOString();

  return {
    id: property.ListingKey,
    listingKey: property.ListingKey,
    slug: buildSlug(property),
    price: property.ListPrice,
    originalListPrice: property.OriginalListPrice,
    address: suppressAddress ? "" : buildAddress(property),
    city: property.City,
    province: property.StateOrProvince,
    postalCode: property.PostalCode,
    beds: property.BedroomsTotal ?? 0,
    baths: property.BathroomsTotalInteger ?? 0,
    sqft: property.LivingArea ?? 0,
    lotSize: property.LotSizeArea,
    image: getPrimaryImage(property),
    images: getAllImages(property),
    status: property.StandardStatus,
    propertyType: property.PropertyType ?? "Residential",
    propertySubType: property.PropertySubType,
    yearBuilt: property.YearBuilt,
    description: property.PublicRemarks,
    listOfficeName: property.ListOfficeName,
    listAgentName: property.ListAgentFullName,
    latitude: suppressAddress ? null : (property.Latitude ?? null),
    longitude: suppressAddress ? null : (property.Longitude ?? null),
    modificationTimestamp: property.ModificationTimestamp,
    lastSeen: now,
    addressSuppressed: suppressAddress || undefined,
  };
}

/**
 * Filter out properties that must not be advertised (C2 fix).
 * Properties with `perm_adv === "N"` are excluded from storage entirely.
 */
export function filterPermittedProperties(
  properties: AmpreProperty[]
): { permitted: AmpreProperty[]; filteredCount: number } {
  const permitted = properties.filter((p) => p.perm_adv !== "N");
  return {
    permitted,
    filteredCount: properties.length - permitted.length,
  };
}
