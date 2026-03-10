import type { SanityImage } from "./sanity";

export interface Listing {
  id: string;
  slug: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string | SanityImage;
  status: "Active" | "Pending" | "Sold";
  propertyType: "Single Family" | "Condo" | "Townhouse" | "Multi-Family" | "Land";
}
