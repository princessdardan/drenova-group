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
  yearBuilt?: number;
  lotSize?: number;
  description?: string;
  listOfficeName?: string;
  listAgentName?: string;
  originalListPrice?: number;
  latitude?: number | null;
  longitude?: number | null;
  listingKey: string;
  modificationTimestamp: string;
  lastSeen: string;
  addressSuppressed?: boolean;
}
