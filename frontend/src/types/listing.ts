export interface Listing {
  id: string;
  slug: string;
  price: number;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  images?: string[];
  status: string;
  propertyType: string;
  propertySubType?: string;
  transactionType?: "Sale" | "Lease";
  yearBuilt?: number;
  lotSize?: number;
  description?: string;
  listOfficeName?: string;
  listAgentName?: string;
  originalListPrice?: number;
  latitude?: number | null;
  longitude?: number | null;
  // Features
  heating?: string[];
  cooling?: string[];
  parkingTotal?: number;
  garageSpaces?: number;
  hasGarage?: boolean;
  attachedGarage?: boolean;
  fireplaces?: number;
  hasFireplace?: boolean;
  stories?: number;
  architecturalStyle?: string[];
  constructionMaterials?: string[];
  roof?: string[];
  basement?: string[];
  exteriorFeatures?: string[];
  interiorFeatures?: string[];
  flooring?: string[];
  appliances?: string[];
  laundryFeatures?: string[];
  waterSource?: string[];
  sewer?: string[];
  hasPool?: boolean;
  hasWaterfront?: boolean;
  view?: string[];

  // Room breakdown
  bathroomsFull?: number;
  bathroomsHalf?: number;

  // Financial
  taxAnnualAmount?: number;
  taxYear?: number;
  associationFee?: number;
  associationFeeFrequency?: string;
  hasAssociation?: boolean;

  // Lot & Land
  lotSizeDimensions?: string;
  lotFeatures?: string[];
  zoning?: string;
  directionFaces?: string;

  // Dates & Market
  onMarketDate?: string;
  daysOnMarket?: number;
  closeDate?: string;
  closePrice?: number;

  listingKey: string;
  modificationTimestamp: string;
  lastSeen: string;
  addressSuppressed?: boolean;
}
