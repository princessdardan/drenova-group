import type { AmpreProperty, AmpreMedia } from "./types";
import type { Listing } from "@/types/listing";
import { buildSafeListingSlug } from "./sanitize";

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

function mapTransactionType(raw: string | undefined): "Sale" | "Lease" {
  if (!raw) return "Sale";
  if (raw.toLowerCase().includes("lease")) return "Lease";
  return "Sale";
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
 * Extract the primary image URL from pre-sorted media records.
 * Media is filtered to 'Large' size at the query level and sorted by Order.
 */
function getPrimaryImage(media: AmpreMedia[]): string {
  return media[0]?.MediaURL ?? "";
}

function getAllImages(media: AmpreMedia[]): string[] {
  if (!media.length) return [];
  return media.map((m) => m.MediaURL).filter(Boolean);
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
    slug: buildSafeListingSlug(property.ListingKey),
    price: property.ListPrice,
    originalListPrice: property.OriginalListPrice,
    address: suppressAddress ? "" : buildAddress(property),
    city: property.City,
    province: property.StateOrProvince,
    postalCode: suppressAddress ? undefined : property.PostalCode,
    beds: property.BedroomsTotal ?? 0,
    baths: property.BathroomsTotalInteger ?? 0,
    sqft: parseSqft(property),
    lotSize: property.LotSizeArea ?? undefined,
    image: getPrimaryImage(media),
    images: getAllImages(media),
    status: property.StandardStatus,
    propertyType: property.PropertyType ?? "Other",
    propertySubType: property.PropertySubType,
    transactionType: mapTransactionType(property.TransactionType),
    yearBuilt: property.YearBuilt ?? undefined,
    description: property.PublicRemarks,
    listOfficeName: property.ListOfficeName,
    listAgentName: property.ListAgentFullName,
    latitude: suppressAddress ? null : (property.Latitude ?? null),
    longitude: suppressAddress ? null : (property.Longitude ?? null),

    // Features (field names mapped from AMPRE schema to internal Listing type)
    heating: property.HeatType ? [property.HeatType] : undefined,
    cooling: normalizeStringArray(property.Cooling),
    parkingTotal: property.ParkingTotal ?? undefined,
    garageSpaces: property.GarageParkingSpaces ? parseInt(property.GarageParkingSpaces, 10) || undefined : undefined,
    hasGarage: property.GarageYN ?? undefined,
    attachedGarage: property.AttachedGarageYN ?? undefined,
    fireplaces: property.FireplacesTotal ?? undefined,
    hasFireplace: property.FireplaceYN ?? undefined,
    stories: property.LegalStories ? parseInt(property.LegalStories, 10) || undefined : undefined,
    architecturalStyle: normalizeStringArray(property.ArchitecturalStyle),
    constructionMaterials: normalizeStringArray(property.ConstructionMaterials),
    roof: normalizeStringArray(property.Roof),
    basement: normalizeStringArray(property.Basement),
    exteriorFeatures: normalizeStringArray(property.ExteriorFeatures),
    interiorFeatures: normalizeStringArray(property.InteriorFeatures),
    laundryFeatures: normalizeStringArray(property.LaundryFeatures),
    waterSource: normalizeStringArray(property.WaterSource),
    sewer: normalizeStringArray(property.Sewer),
    hasWaterfront: property.WaterfrontYN ?? undefined,
    view: normalizeStringArray(property.View),

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
    onMarketDate: property.OriginalEntryTimestamp ?? undefined,
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
