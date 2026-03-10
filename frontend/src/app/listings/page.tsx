import type { Metadata } from "next";
import { PropertyCard } from "@/components/ui/property-card";
import { getListings } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: "Listings",
  description:
    "Browse all available property listings from Drenova Group. Filter by location, price, bedrooms, and more.",
};

export default async function ListingsPage() {
  const listings = await getListings();
  return (
    <div className="pt-20 lg:pt-24">
      {/* ─── Page Header ─── */}
      <section className="bg-surface py-12 px-6 lg:py-16 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-widest font-medium text-accent mb-2">
            Properties
          </p>
          <h1 className="font-display text-3xl lg:text-5xl font-bold tracking-tight mb-2">
            All Listings
          </h1>
          <p className="text-muted">
            Showing {listings.length} properties across all markets
          </p>
        </div>
      </section>

      {/* ─── Filter Bar (UI only) ─── */}
      <section className="bg-surface-alt border-b border-border py-4 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
          <select
            className="h-10 px-3 bg-background border border-border rounded-lg text-sm appearance-none"
            aria-label="Property type"
            defaultValue=""
          >
            <option value="">All Types</option>
            <option value="single-family">Single Family</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
          </select>
          <select
            className="h-10 px-3 bg-background border border-border rounded-lg text-sm appearance-none"
            aria-label="Bedrooms"
            defaultValue=""
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
            defaultValue=""
          >
            <option value="">Price</option>
            <option value="0-300000">Under $300k</option>
            <option value="300000-500000">$300k – $500k</option>
            <option value="500000-750000">$500k – $750k</option>
            <option value="750000+">$750k+</option>
          </select>
          <select
            className="h-10 px-3 bg-background border border-border rounded-lg text-sm appearance-none"
            aria-label="Sort by"
            defaultValue=""
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </section>

      {/* ─── Property Grid ─── */}
      <section className="bg-background py-12 px-6 lg:py-16 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {listings.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
