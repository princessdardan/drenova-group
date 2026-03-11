/**
 * Raw AMPRE OData property representation.
 *
 * These fields follow the CREA Data Distribution Facility (DDF) / RESO standard.
 * `perm_adv` and `disp_addr` are mandatory display-control fields per the
 * PropTx Data License Addendum — they MUST be included in every $select.
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

  // Location
  Latitude?: number;
  Longitude?: number;

  // Details
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  LivingArea?: number;
  LotSizeArea?: number;
  PropertyType?: string;
  PropertySubType?: string;
  YearBuilt?: number;
  PublicRemarks?: string;

  // Status
  StandardStatus: string;
  MlsStatus?: string;
  ListingContractDate?: string;
  ModificationTimestamp: string;

  // Media
  Media?: AmpreMedia[];

  // Compliance — PropTx Data License display fields (REQUIRED)
  perm_adv: "Y" | "N";
  disp_addr: "Y" | "N";

  // Brokerage
  ListOfficeName?: string;
  ListAgentFullName?: string;
}

export interface AmpreMedia {
  MediaURL: string;
  MediaCategory?: string;
  Order?: number;
  ShortDescription?: string;
}

/** OData response envelope */
export interface AmpreResponse {
  "@odata.context"?: string;
  "@odata.count"?: number;
  "@odata.nextLink"?: string;
  value: AmpreProperty[];
}

/** Sync log entry stored in KV */
export interface SyncLogEntry {
  timestamp: string;
  durationMs: number;
  fetched: number;
  stored: number;
  purged: number;
  filteredPermAdv: number;
  success: boolean;
  error?: string;
}
