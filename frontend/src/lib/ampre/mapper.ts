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

/**
 * Normalize RESO multi-value fields. AMPRE may return either a native
 * string array or a comma-separated string — this handles both.
 * Returns undefined when empty so the field is omitted from Redis JSON.
 */
function normalizeStringArray(
  value: string[] | string | undefined | null
): string[] | undefined {
  if (value == null) return undefined;
  if (Array.isArray(value)) {
    const filtered = value.filter(Boolean);
    return filtered.length > 0 ? filtered : undefined;
  }
  const parts = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : undefined;
}

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
 * Size preference ranking — lower index = higher priority.
 * Large is ideal (good quality, reasonable bandwidth). Larger sizes are
 * next-best fallbacks, then progressively smaller ones.
 */
const SIZE_PREFERENCE: readonly string[] = [
  "Large",
  "X-Large",
  "Largest",
  "Medium",
  "Small",
  "Thumbnail",
] as const;

/**
 * From a set of media records sharing the same logical Order, pick the
 * one with the best available ImageSizeDescription per SIZE_PREFERENCE.
 */
function pickBestSize(group: AmpreMedia[]): AmpreMedia | undefined {
  let best: AmpreMedia | undefined;
  let bestRank = SIZE_PREFERENCE.length; // worse than any known size

  for (const m of group) {
    const rank = SIZE_PREFERENCE.indexOf(m.ImageSizeDescription ?? "");
    const effectiveRank = rank === -1 ? SIZE_PREFERENCE.length : rank;
    if (effectiveRank < bestRank) {
      bestRank = effectiveRank;
      best = m;
    }
  }

  // If no known size matched, fall back to first record with a URL
  return best ?? group.find((m) => m.MediaURL);
}

/**
 * Group media by Order, pick the best size per group, return sorted by Order.
 */
function deduplicateMedia(media: AmpreMedia[]): AmpreMedia[] {
  const groups = new Map<number, AmpreMedia[]>();
  for (const m of media) {
    const order = m.Order ?? 999;
    const group = groups.get(order);
    if (group) {
      group.push(m);
    } else {
      groups.set(order, [m]);
    }
  }

  const result: AmpreMedia[] = [];
  for (const group of groups.values()) {
    const best = pickBestSize(group);
    if (best) result.push(best);
  }

  return result.sort((a, b) => (a.Order ?? 999) - (b.Order ?? 999));
}

/**
 * Extract images from separately-fetched media records.
 * Media is joined by ResourceRecordKey = ListingKey BEFORE calling this.
 * Deduplicates by Order — picks the best size per logical image.
 */
function getPrimaryImage(media: AmpreMedia[]): string {
  if (!media.length) return "";
  const deduped = deduplicateMedia(media);
  return deduped[0]?.MediaURL ?? "";
}

function getAllImages(media: AmpreMedia[]): string[] {
  if (!media.length) return [];
  return deduplicateMedia(media)
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

    // Features
    heating: normalizeStringArray(property.Heating),
    cooling: normalizeStringArray(property.Cooling),
    parkingTotal: property.ParkingTotal ?? undefined,
    garageSpaces: property.GarageSpaces ?? undefined,
    hasGarage: property.GarageYN ?? undefined,
    attachedGarage: property.AttachedGarageYN ?? undefined,
    fireplaces: property.FireplacesTotal ?? undefined,
    hasFireplace: property.FireplaceYN ?? undefined,
    stories: property.Stories ?? undefined,
    architecturalStyle: normalizeStringArray(property.ArchitecturalStyle),
    constructionMaterials: normalizeStringArray(property.ConstructionMaterials),
    roof: normalizeStringArray(property.Roof),
    basement: normalizeStringArray(property.Basement),
    exteriorFeatures: normalizeStringArray(property.ExteriorFeatures),
    interiorFeatures: normalizeStringArray(property.InteriorFeatures),
    flooring: normalizeStringArray(property.Flooring),
    appliances: normalizeStringArray(property.Appliances),
    laundryFeatures: normalizeStringArray(property.LaundryFeatures),
    waterSource: normalizeStringArray(property.WaterSource),
    sewer: normalizeStringArray(property.Sewer),
    hasPool: property.PoolPrivateYN ?? undefined,
    hasWaterfront: property.WaterfrontYN ?? undefined,
    view: normalizeStringArray(property.View),

    // Room breakdown
    bathroomsFull: property.BathroomsFull ?? undefined,
    bathroomsHalf: property.BathroomsHalf ?? undefined,

    // Financial
    taxAnnualAmount: property.TaxAnnualAmount ?? undefined,
    taxYear: property.TaxYear ?? undefined,
    associationFee: property.AssociationFee ?? undefined,
    associationFeeFrequency: property.AssociationFeeFrequency ?? undefined,
    hasAssociation: property.AssociationYN ?? undefined,

    // Lot & Land
    lotSizeDimensions: property.LotSizeDimensions ?? undefined,
    lotFeatures: normalizeStringArray(property.LotFeatures),
    zoning: property.Zoning ?? undefined,
    directionFaces: property.DirectionFaces ?? undefined,

    // Dates & Market
    onMarketDate: property.OnMarketDate ?? undefined,
    daysOnMarket: property.DaysOnMarket ?? undefined,
    closeDate: property.CloseDate ?? undefined,
    closePrice: property.ClosePrice ?? undefined,

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
