<!-- Context: development/lookup/select-fields | Priority: medium | Version: 1.0 | Updated: 2026-04-08 -->

# Lookup: OData $select Fields

**Core Idea**: The 27 fields selected from AMPRE API for sync queries, organized by category.

**Full Field List**:

| Category | Fields |
|----------|--------|
| **Identity** | `ListingKey`, `ListingId` |
| **Price** | `ListPrice`, `OriginalListPrice` |
| **Address** | `UnparsedAddress`, `StreetNumber`, `StreetName`, `StreetSuffix`, `City`, `StateOrProvince`, `PostalCode`, `Country` |
| **Location** | `Latitude`, `Longitude` |
| **Details** | `BedroomsTotal`, `BathroomsTotalInteger`, `LivingArea`, `LotSizeArea`, `PropertyType`, `PropertySubType`, `YearBuilt`, `PublicRemarks` |
| **Status** | `StandardStatus`, `MlsStatus`, `ListingContractDate`, `ModificationTimestamp` |
| **Media** | `Media` (nested array) |
| **Brokerage** | `ListOfficeName`, `ListAgentFullName` |
| **Compliance** | `perm_adv`, `disp_addr`, `ModificationTimestamp` |

**Query Builder** (`frontend/src/lib/ampre/queries.ts`):
```typescript
const PROPERTY_SELECT_FIELDS = [
  "ListingKey", "ListingId",
  "ListPrice", "OriginalListPrice",
  "UnparsedAddress", "StreetNumber", "StreetName", "StreetSuffix",
  "City", "StateOrProvince", "PostalCode", "Country",
  "Latitude", "Longitude",
  "BedroomsTotal", "BathroomsTotalInteger", "LivingArea", "LotSizeArea",
  "PropertyType", "PropertySubType", "YearBuilt", "PublicRemarks",
  "StandardStatus", "MlsStatus", "ListingContractDate", "ModificationTimestamp",
  "Media",
  "ListOfficeName", "ListAgentFullName",
  // Compliance fields (always included)
  "perm_adv", "disp_addr", "ModificationTimestamp"
];

export function buildSyncQuery(): string {
  const select = [...new Set([...PROPERTY_SELECT_FIELDS, ...REQUIRED_SELECT_FIELDS])];
  const params = new URLSearchParams({
    $select: select.join(","),
    $filter: "StandardStatus eq 'Active'",
    $orderby: "ModificationTimestamp desc"
  });
  return params.toString();
}
```

**Notes**:
- `ModificationTimestamp` appears twice (Status + Compliance) — deduplicated in query
- `REQUIRED_SELECT_FIELDS` = `["perm_adv", "disp_addr", "ModificationTimestamp"]`
- All 27 fields are required for compliance and display logic

**Reference**: [Listings Implementation](/Users/dardan/Documents/drenova-group/docs/listings-implementation.md)

**Related**:
- [type-definitions.md](type-definitions.md) — TypeScript interfaces
- [data-mapping.md](../concepts/data-mapping.md) — Field transformation
