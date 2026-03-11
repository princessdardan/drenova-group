"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface ListingFiltersProps {
  cities: string[];
  propertyTypes: string[];
  total: number;
}

export function ListingFilters({
  cities,
  propertyTypes,
  total,
}: ListingFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 when filters change
      if (key !== "page") params.delete("page");
      router.push(`/listings?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <section className="bg-surface-alt border-b border-border py-4 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
        <select
          className="h-10 px-3 bg-background border border-border rounded-lg text-sm appearance-none"
          aria-label="Property type"
          value={searchParams.get("propertyType") ?? ""}
          onChange={(e) => updateParam("propertyType", e.target.value)}
        >
          <option value="">All Types</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          className="h-10 px-3 bg-background border border-border rounded-lg text-sm appearance-none"
          aria-label="Bedrooms"
          value={searchParams.get("minBeds") ?? ""}
          onChange={(e) => updateParam("minBeds", e.target.value)}
        >
          <option value="">Beds</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>

        <select
          className="h-10 px-3 bg-background border border-border rounded-lg text-sm appearance-none"
          aria-label="Price range"
          value={searchParams.get("maxPrice") ?? ""}
          onChange={(e) => updateParam("maxPrice", e.target.value)}
        >
          <option value="">Price</option>
          <option value="300000">Under $300k</option>
          <option value="500000">Under $500k</option>
          <option value="750000">Under $750k</option>
          <option value="1000000">Under $1M</option>
        </select>

        {cities.length > 0 && (
          <select
            className="h-10 px-3 bg-background border border-border rounded-lg text-sm appearance-none"
            aria-label="City"
            value={searchParams.get("city") ?? ""}
            onChange={(e) => updateParam("city", e.target.value)}
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        )}

        <select
          className="h-10 px-3 bg-background border border-border rounded-lg text-sm appearance-none"
          aria-label="Sort by"
          value={searchParams.get("sort") ?? ""}
          onChange={(e) => updateParam("sort", e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>

        <span className="ml-auto text-sm text-muted">
          {total} {total === 1 ? "property" : "properties"}
        </span>
      </div>
    </section>
  );
}
