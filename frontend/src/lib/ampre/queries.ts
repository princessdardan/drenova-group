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
  const params = new URLSearchParams();

  // Select only the fields we need (deduplicate in case REQUIRED_SELECT_FIELDS overlaps)
  const uniqueFields = [...new Set(PROPERTY_SELECT_FIELDS)];
  params.set("$select", uniqueFields.join(","));

  // Filter to active listings only
  params.set("$filter", "StandardStatus eq 'Active'");

  // Order by modification timestamp for consistent pagination
  params.set("$orderby", "ModificationTimestamp desc");

  return params.toString();
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
 * Filters to `ImageSizeDescription eq 'Largest'` so we get full-resolution
 * images only (AMPRE stores multiple sizes per photo).
 */
export function buildMediaBatchQuery(listingKeys: string[]): string {
  const params = new URLSearchParams();

  params.set("$select", MEDIA_SELECT_FIELDS.join(","));

  // OData `in` operator: ResourceRecordKey in ('key1','key2',...)
  const keyList = listingKeys.map((k) => `'${k}'`).join(",");
  params.set(
    "$filter",
    `ResourceRecordKey in (${keyList}) and ImageSizeDescription eq 'Largest'`
  );

  params.set("$orderby", "ResourceRecordKey asc,Order asc");

  return params.toString();
}
