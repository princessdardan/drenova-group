import { REQUIRED_SELECT_FIELDS } from "./compliance";

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
  "YearBuilt",
  "PublicRemarks",
  // Property Features
  "Heating",
  "Cooling",
  "ParkingTotal",
  "GarageSpaces",
  "GarageYN",
  "AttachedGarageYN",
  "FireplacesTotal",
  "FireplaceYN",
  "Stories",
  "ArchitecturalStyle",
  "ConstructionMaterials",
  "Roof",
  "Basement",
  "ExteriorFeatures",
  "InteriorFeatures",
  "Flooring",
  "Appliances",
  "LaundryFeatures",
  "WaterSource",
  "Sewer",
  "PoolPrivateYN",
  "WaterfrontYN",
  "View",
  // Room breakdown
  "BathroomsFull",
  "BathroomsHalf",
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
  "OnMarketDate",
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

  return [
    `$select=${uniqueFields.join(",")}`,
    `$filter=StandardStatus eq 'Active'`,
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
 * Build an OData query to fetch media for a batch of listing keys.
 *
 * Fetches ALL available image sizes — the mapper picks the best size
 * per logical image (grouped by Order). This avoids zero-image results
 * when a listing lacks a specific size like 'Large'.
 */
export function buildMediaBatchQuery(listingKeys: string[]): string {
  // OData `in` operator: ResourceRecordKey in ('key1','key2',...)
  const keyList = listingKeys.map((k) => `'${k}'`).join(",");

  return [
    `$select=${MEDIA_SELECT_FIELDS.join(",")}`,
    `$filter=ResourceRecordKey in (${keyList})`,
    `$orderby=ResourceRecordKey asc,Order asc`,
  ].join("&");
}
