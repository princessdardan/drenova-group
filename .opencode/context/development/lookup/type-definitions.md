<!-- Context: development/lookup/type-definitions | Priority: critical | Version: 1.0 | Updated: 2026-04-08 -->

# Lookup: Type Definitions

**Core Idea**: Key TypeScript interfaces for listings, AMPRE properties, and filter/sort parameters.

**Listing Type** (`frontend/src/types/listing.ts`):
```typescript
interface Listing {
  id: string;                    // Same as listingKey
  slug: string;                  // Computed from address+city+province
  listingKey: string;            // AMPRE unique ID
  price: number;
  address: string;               // Empty if suppressed
  city: string;
  province: string;              // Canadian: "ON", "BC", etc.
  postalCode: string;
  beds: number;                  // Default 0
  baths: number;                 // Default 0
  sqft: number;                  // Default 0
  image: string;                 // Primary image URL
  images?: string[];             // All image URLs
  status: string;                // "Active", "Pending", "Sold"
  propertyType: string;          // Default "Residential"
  propertySubType?: string;
  yearBuilt?: number;
  lotSize?: number;
  description?: string;            // PublicRemarks
  listOfficeName?: string;
  listAgentName?: string;
  originalListPrice?: number;
  latitude?: number | null;      // Null if suppressed
  longitude?: number | null;     // Null if suppressed
  modificationTimestamp: string; // ISO 8601
  lastSeen: string;              // Sync timestamp
  addressSuppressed?: boolean;   // True if disp_addr="N"
}
```

**AMPRE Property Type** (`frontend/src/lib/ampre/types.ts`):
```typescript
interface AmpreProperty {
  ListingKey: string;
  ListingId: string;
  ListPrice: number;
  OriginalListPrice?: number;
  UnparsedAddress?: string;
  StreetNumber?: string;
  StreetName?: string;
  StreetSuffix?: string;
  City: string;
  StateOrProvince: string;
  PostalCode: string;
  Latitude?: number;
  Longitude?: number;
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  LivingArea?: number;
  LotSizeArea?: number;
  PropertyType?: string;
  PropertySubType?: string;
  YearBuilt?: number;
  PublicRemarks?: string;
  StandardStatus: string;
  MlsStatus?: string;
  ListingContractDate?: string;
  ModificationTimestamp: string;
  Media?: AmpreMedia[];
  ListOfficeName?: string;
  ListAgentFullName?: string;
  // Compliance fields
  perm_adv?: string;   // "Y" or "N"
  disp_addr?: string;  // "Y" or "N"
}

interface AmpreMedia {
  MediaURL: string;
  MediaCategory?: string;
  Order?: number;
  ShortDescription?: string;
}
```

**Filter Types** (`frontend/src/lib/ampre/fetch.ts`):
```typescript
interface ListingFilters {
  propertyType?: string;
  minBeds?: number;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  sort?: "price-asc" | "price-desc" | "newest";
  page?: number;        // 1-indexed, default 1
  pageSize?: number;    // Default 12
}

interface PaginatedListings {
  listings: Listing[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

**Sync Log Type**:
```typescript
interface SyncLogEntry {
  timestamp: string;       // ISO 8601
  durationMs: number;
  fetched: number;       // Raw from AMPRE
  stored: number;          // Saved to Redis
  purged: number;          // Removed (stale)
  filteredPermAdv: number; // Excluded (perm_adv=N)
  success: boolean;
  error?: string;
}
```

**Reference**: [Listings Implementation](/Users/dardan/Documents/drenova-group/docs/listings-implementation.md)

**Related**:
- [select-fields.md](select-fields.md) — OData $select fields
- [filter-mapping.md](filter-mapping.md) — URL to OData mapping
