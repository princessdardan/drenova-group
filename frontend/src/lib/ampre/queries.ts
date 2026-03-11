import { REQUIRED_SELECT_FIELDS } from "./compliance";

/**
 * AMPRE OData query builder for the daily sync job.
 *
 * Unlike a typical OData query builder that translates user-facing filters,
 * this builder creates a single "fetch all brokerage listings" query. User
 * filters are applied in-memory after reading from Vercel KV.
 *
 * Every query MUST include `perm_adv`, `disp_addr`, and `ModificationTimestamp`
 * in $select per PropTx Data License requirements.
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
  "LivingArea",
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
  // Media
  "Media",
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

  // Select only the fields we need
  params.set("$select", PROPERTY_SELECT_FIELDS.join(","));

  // Filter to active listings only
  params.set("$filter", "StandardStatus eq 'Active'");

  // Order by modification timestamp for consistent pagination
  params.set("$orderby", "ModificationTimestamp desc");

  return params.toString();
}
