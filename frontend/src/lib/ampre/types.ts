/**
 * Raw AMPRE OData property representation.
 *
 * Field names follow AMPRE's OData schema (validated against $metadata).
 *
 * Compliance display-control fields (PropTx DLA):
 *   DLA name   → AMPRE OData field (boolean)
 *   perm_adv   → DDFYN, InternetEntireListingDisplayYN
 *   disp_addr  → InternetAddressDisplayYN
 */
export interface AmpreProperty {
  // Identity
  ListingKey: string;
  ListingId?: string;

  // Price
  ListPrice: number;
  OriginalListPrice?: number;

  // Address
  UnparsedAddress?: string;
  StreetNumber?: string;
  StreetName?: string;
  StreetSuffix?: string;
  City: string;
  StateOrProvince: string;
  PostalCode: string;
  Country?: string;

  // Location (null for many records — may need separate geocoding)
  Latitude?: number | null;
  Longitude?: number | null;

  // Details
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  LivingAreaRange?: string; // String range e.g. "1100-1500", not a number
  AboveGradeFinishedArea?: number | null; // Numeric sqft (14% populated)
  BuildingAreaTotal?: number | null; // Numeric sqft fallback
  LotSizeArea?: number | null;
  PropertyType?: string;
  PropertySubType?: string;
  TransactionType?: string; // RESO DD: "For Sale", "For Lease", "For Sale or Lease"
  YearBuilt?: number | null;
  PublicRemarks?: string;

  // Property Features (names match AMPRE $metadata, not RESO DD)
  HeatType?: string;
  Cooling?: string | string[];
  ParkingTotal?: number | null;
  GarageParkingSpaces?: string; // String in AMPRE (e.g. "2"), not number
  GarageYN?: boolean;
  AttachedGarageYN?: boolean;
  FireplacesTotal?: number | null;
  FireplaceYN?: boolean;
  LegalStories?: string; // String in AMPRE (e.g. "2"), not number
  ArchitecturalStyle?: string | string[];
  ConstructionMaterials?: string | string[];
  Roof?: string | string[];
  Basement?: string | string[];
  ExteriorFeatures?: string | string[];
  InteriorFeatures?: string | string[];
  LaundryFeatures?: string | string[];
  WaterSource?: string | string[];
  Sewer?: string | string[];
  WaterfrontYN?: boolean;
  View?: string | string[];

  // Financial
  TaxAnnualAmount?: number | null;
  TaxYear?: number | null;
  AssociationFee?: number | null;
  AssociationFeeFrequency?: string;
  AssociationYN?: boolean;

  // Lot & Land
  LotSizeDimensions?: string;
  LotFeatures?: string | string[];
  Zoning?: string;
  DirectionFaces?: string;

  // Dates & Market
  OriginalEntryTimestamp?: string;
  DaysOnMarket?: number | null;
  CloseDate?: string;
  ClosePrice?: number | null;

  // Status
  StandardStatus: string;
  MlsStatus?: string;
  ListingContractDate?: string;
  ModificationTimestamp: string;

  // Compliance — AMPRE equivalents of PropTx DLA perm_adv / disp_addr
  DDFYN?: boolean;
  InternetEntireListingDisplayYN?: boolean;
  InternetAddressDisplayYN?: boolean;

  // Brokerage
  ListOfficeName?: string;
  ListAgentFullName?: string;
}

/**
 * AMPRE Media resource — fetched separately from /odata/Media,
 * linked to Property via ResourceRecordKey = ListingKey.
 */
export interface AmpreMedia {
  MediaKey: string;
  ResourceRecordKey: string;
  MediaURL: string;
  ImageSizeDescription?: string;
  MediaModificationTimestamp?: string;
  MediaStatus?: string;
  Order?: number;
}

/** Generic OData response envelope */
export interface AmpreODataResponse<T> {
  "@odata.context"?: string;
  "@odata.count"?: number;
  "@odata.nextLink"?: string;
  value: T[];
}

/** Property-specific response (backward compat alias) */
export type AmpreResponse = AmpreODataResponse<AmpreProperty>;

/** Details about a failed media batch */
export interface BatchError {
  batch: number;
  listingCount: number;
  error: string;
}

/** Sync log entry stored in Redis */
export interface SyncLogEntry {
  timestamp: string;
  durationMs: number;
  fetched: number;
  stored: number;
  purged: number;
  filteredDdf: number;
  filteredNonResidential: number;
  mediaFetched: number;
  mediaErrors: number;
  /** Number of listings that received at least one image */
  listingsWithImages: number;
  success: boolean;
  error?: string;
  batchErrors?: BatchError[];
}
