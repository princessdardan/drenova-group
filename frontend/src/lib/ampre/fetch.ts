import { KV_LISTINGS_KEY } from "./compliance";
import type { Listing } from "@/types/listing";

/**
 * KV-backed fetch layer for AMPRE listings.
 *
 * All functions read from Vercel KV — NEVER from AMPRE directly.
 * This ensures compliance with the 24-hour retrieval limit (C1).
 *
 * Filtering, sorting, and pagination are performed in-memory.
 * This is efficient because the dataset is small (brokerage's own listings).
 *
 * When KV env vars aren't configured (local dev without KV), returns empty results.
 */

function isKvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export interface ListingFilters {
  propertyType?: string;
  minBeds?: number;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  sort?: "price-asc" | "price-desc" | "newest";
  page?: number;
  pageSize?: number;
}

export interface PaginatedListings {
  listings: Listing[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const DEFAULT_PAGE_SIZE = 12;

async function getAllListingsFromKV(): Promise<Listing[]> {
  if (!isKvConfigured()) return [];

  const { kv } = await import("@vercel/kv");
  return (await kv.get<Listing[]>(KV_LISTINGS_KEY)) ?? [];
}

function applyFilters(listings: Listing[], filters: ListingFilters): Listing[] {
  let result = listings;

  if (filters.propertyType) {
    result = result.filter(
      (l) => l.propertyType.toLowerCase() === filters.propertyType!.toLowerCase()
    );
  }

  if (filters.minBeds) {
    result = result.filter((l) => l.beds >= filters.minBeds!);
  }

  if (filters.minPrice) {
    result = result.filter((l) => l.price >= filters.minPrice!);
  }

  if (filters.maxPrice) {
    result = result.filter((l) => l.price <= filters.maxPrice!);
  }

  if (filters.city) {
    result = result.filter(
      (l) => l.city.toLowerCase() === filters.city!.toLowerCase()
    );
  }

  return result;
}

function applySort(
  listings: Listing[],
  sort?: ListingFilters["sort"]
): Listing[] {
  if (!sort) return listings;

  const sorted = [...listings];
  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      sorted.sort(
        (a, b) =>
          new Date(b.modificationTimestamp).getTime() -
          new Date(a.modificationTimestamp).getTime()
      );
      break;
  }
  return sorted;
}

/**
 * Get AMPRE listings with optional filtering, sorting, and pagination.
 * Reads from Vercel KV, never from AMPRE.
 */
export async function getAmpreListings(
  filters: ListingFilters = {}
): Promise<PaginatedListings> {
  const all = await getAllListingsFromKV();
  const filtered = applyFilters(all, filters);
  const sorted = applySort(filtered, filters.sort);

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const listings = sorted.slice(start, start + pageSize);

  return { listings, total, page, pageSize, totalPages };
}

/**
 * Get a single AMPRE listing by its listing key.
 * Reads from Vercel KV, never from AMPRE.
 */
export async function getAmpreListingByKey(
  key: string
): Promise<Listing | null> {
  const all = await getAllListingsFromKV();
  return all.find((l) => l.listingKey === key) ?? null;
}

/**
 * Get a single AMPRE listing by its slug.
 * Reads from Vercel KV, never from AMPRE.
 */
export async function getAmpreListingBySlug(
  slug: string
): Promise<Listing | null> {
  const all = await getAllListingsFromKV();
  return all.find((l) => l.slug === slug) ?? null;
}

/**
 * Get all unique cities from current listings (for filter dropdowns).
 */
export async function getAmpreListingCities(): Promise<string[]> {
  const all = await getAllListingsFromKV();
  const cities = [...new Set(all.map((l) => l.city))];
  return cities.sort();
}

/**
 * Get all unique property types from current listings (for filter dropdowns).
 */
export async function getAmpreListingPropertyTypes(): Promise<string[]> {
  const all = await getAllListingsFromKV();
  const types = [...new Set(all.map((l) => l.propertyType))];
  return types.sort();
}
