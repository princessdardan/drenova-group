import type { AmpreProperty, AmpreMedia } from "./types";
import type { Listing } from "@/types/listing";

/**
 * Maps raw AMPRE properties to our internal Listing type.
 *
 * Compliance logic:
 * - Properties with DDFYN=false or InternetEntireListingDisplayYN=false are
 *   filtered out BEFORE this function is called (in the sync job).
 * - When InternetAddressDisplayYN=false: address is set to empty string,
 *   lat/lng are nulled, and `addressSuppressed` is set to true.
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

/**
 * Parse LivingAreaRange (e.g. "1100-1500") into a numeric midpoint.
 * Falls back to AboveGradeFinishedArea or BuildingAreaTotal if available.
 */
function parseSqft(property: AmpreProperty): number {
  // Prefer numeric fields if available
  if (property.AboveGradeFinishedArea != null && property.AboveGradeFinishedArea > 0) {
    return property.AboveGradeFinishedArea;
  }
  if (property.BuildingAreaTotal != null && property.BuildingAreaTotal > 0) {
    return property.BuildingAreaTotal;
  }

  // Parse range string — e.g. "1100-1500" → midpoint 1300
  if (property.LivingAreaRange) {
    const match = property.LivingAreaRange.match(/^(\d+)\s*-\s*(\d+)$/);
    if (match) {
      const low = parseInt(match[1], 10);
      const high = parseInt(match[2], 10);
      return Math.round((low + high) / 2);
    }
    // Single number (e.g. "1500+")
    const single = parseInt(property.LivingAreaRange, 10);
    if (!isNaN(single)) return single;
  }

  return 0;
}

/**
 * Extract images from separately-fetched media records.
 * Media is joined by ResourceRecordKey = ListingKey BEFORE calling this.
 */
function getPrimaryImage(media: AmpreMedia[]): string {
  if (!media.length) return "";
  const sorted = [...media].sort((a, b) => (a.Order ?? 999) - (b.Order ?? 999));
  return sorted[0].MediaURL ?? "";
}

function getAllImages(media: AmpreMedia[]): string[] {
  if (!media.length) return [];
  return [...media]
    .sort((a, b) => (a.Order ?? 999) - (b.Order ?? 999))
    .map((m) => m.MediaURL)
    .filter(Boolean);
}

export function mapAmpreToListing(
  property: AmpreProperty,
  media: AmpreMedia[] = []
): Listing {
  const suppressAddress = property.InternetAddressDisplayYN === false;
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
    sqft: parseSqft(property),
    lotSize: property.LotSizeArea ?? undefined,
    image: getPrimaryImage(media),
    images: getAllImages(media),
    status: property.StandardStatus,
    propertyType: property.PropertyType ?? "Residential",
    propertySubType: property.PropertySubType,
    yearBuilt: property.YearBuilt ?? undefined,
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
 * Filter out properties that must not be advertised.
 * Properties with DDFYN=false or InternetEntireListingDisplayYN=false
 * are excluded from storage entirely (PropTx DLA compliance).
 */
export function filterPermittedProperties(
  properties: AmpreProperty[]
): { permitted: AmpreProperty[]; filteredCount: number } {
  const permitted = properties.filter(
    (p) => p.DDFYN !== false && p.InternetEntireListingDisplayYN !== false
  );
  return {
    permitted,
    filteredCount: properties.length - permitted.length,
  };
}
