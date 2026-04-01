import { REQUIRED_SELECT_FIELDS, RESIDENTIAL_PROPERTY_TYPES } from "./compliance";

/**
 * AMPRE OData query builder for the daily sync job.
 *
 * Unlike a typical OData query builder that translates user-facing filters,
 * this builder creates a single "fetch all brokerage listings" query. User
 * filters are applied in-memory after reading from Redis.
 *
 * Every query MUST include the compliance display-control fields
 * (DDFYN, InternetEntireListingDisplayYN, InternetAddressDisplayYN)
 * per PropTx Data License requirements.
 *
 * Media is a SEPARATE OData resource — fetched from /odata/Media and joined
 * via ResourceRecordKey = ListingKey. See `buildMediaBatchQuery`.
 */

const PROPERTY_SELECT_FIELDS = [
  // Identity
  "ListingKey",
  "ListingId",
  // Price
  "ListPrice",
  "OriginalListPrice",
  // Address
  "UnparsedAddress",
  "StreetNumber",
  "StreetName",
  "StreetSuffix",
  "City",
  "StateOrProvince",
  "PostalCode",
  "Country",
  // Location
  "Latitude",
  "Longitude",
  // Details
  "BedroomsTotal",
  "BathroomsTotalInteger",
  "LivingAreaRange",
  "AboveGradeFinishedArea",
  "BuildingAreaTotal",
  "LotSizeArea",
  "PropertyType",
  "PropertySubType",
  "TransactionType",
  "YearBuilt",
  "PublicRemarks",
  // Property Features (names validated against AMPRE $metadata)
  "HeatType",
  "Cooling",
  "ParkingTotal",
  "GarageParkingSpaces",
  "GarageYN",
  "AttachedGarageYN",
  "FireplacesTotal",
  "FireplaceYN",
  "LegalStories",
  "ArchitecturalStyle",
  "ConstructionMaterials",
  "Roof",
  "Basement",
  "ExteriorFeatures",
  "InteriorFeatures",
  "LaundryFeatures",
  "WaterSource",
  "Sewer",
  "WaterfrontYN",
  "View",
  // Financial
  "TaxAnnualAmount",
  "TaxYear",
  "AssociationFee",
  "AssociationFeeFrequency",
  "AssociationYN",
  // Lot & Land
  "LotSizeDimensions",
  "LotFeatures",
  "Zoning",
  "DirectionFaces",
  // Dates & Market
  "OriginalEntryTimestamp",
  "DaysOnMarket",
  "CloseDate",
  "ClosePrice",
  // Status
  "StandardStatus",
  "MlsStatus",
  "ListingContractDate",
  "ModificationTimestamp",
  // Brokerage
  "ListOfficeName",
  "ListAgentFullName",
  // Compliance (always required)
  ...REQUIRED_SELECT_FIELDS,
] as const;

/**
 * Build the OData query string for the daily sync.
 * Fetches all active listings for the brokerage.
 */
export function buildSyncQuery(): string {
  // Build OData query string manually — URLSearchParams encodes $, commas,
  // and single quotes which breaks OData parameter parsing.
  const uniqueFields = [...new Set(PROPERTY_SELECT_FIELDS)];

  // Restrict to residential property types only
  const propertyTypeFilter = RESIDENTIAL_PROPERTY_TYPES
    .map((t) => `PropertyType eq '${t}'`)
    .join(" or ");

  return [
    `$select=${uniqueFields.join(",")}`,
    `$filter=StandardStatus eq 'Active' and (${propertyTypeFilter})`,
    `$orderby=ModificationTimestamp desc`,
  ].join("&");
}

/**
 * Fields to select from the Media resource.
 * Kept minimal to reduce payload size — only what the mapper needs.
 */
export const MEDIA_SELECT_FIELDS = [
  "MediaKey",
  "ResourceRecordKey",
  "MediaURL",
  "ImageSizeDescription",
  "Order",
] as const;

/**
 * Maximum records to request per media batch.
 *
 * AMPRE's Media endpoint defaults to 100 records per page and does NOT
 * provide @odata.nextLink for pagination. We must use $top to request
 * all records upfront. With the 'Large' size filter, 25 listings × 40
 * photos × 1 size = ~1000 records max per batch.
 */
const MEDIA_BATCH_TOP = 1500;

/**
 * Build an OData query to fetch media for a batch of listing keys.
 *
 * Filters to ImageSizeDescription='Large' only — good quality for web
 * display at ~1/5th the payload of fetching all size variants. Verified
 * that 'Large' covers 100% of photos across sampled AMPRE listings.
 *
 * Uses $top because AMPRE's Media endpoint does not provide @odata.nextLink
 * and defaults to 100 records per page. $count=true lets us detect truncation.
 */
export function buildMediaBatchQuery(listingKeys: string[]): string {
  // OData `in` operator: ResourceRecordKey in ('key1','key2',...)
  const keyList = listingKeys.map((k) => `'${k}'`).join(",");

  return [
    `$select=${MEDIA_SELECT_FIELDS.join(",")}`,
    `$filter=ResourceRecordKey in (${keyList}) and ImageSizeDescription eq 'Large'`,
    `$orderby=ResourceRecordKey asc,Order asc`,
    `$top=${MEDIA_BATCH_TOP}`,
    `$count=true`,
  ].join("&");
}
