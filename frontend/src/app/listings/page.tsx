import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { PropertyCard } from "@/components/ui/property-card";
import { ListingFilters } from "@/components/ui/listing-filters";
import {
  getAmpreListings,
  getAmpreListingCities,
  getAmpreListingPropertyTypes,
  type ListingFilters as Filters,
} from "@/lib/ampre/fetch";
import { getListingsPage } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: "Listings",
  description:
    "Browse all available property listings from Drenova Group. Filter by location, price, bedrooms, and more.",
};

interface ListingsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseFilters(
  params: Record<string, string | string[] | undefined>
): Filters {
  const get = (key: string): string | undefined => {
    const v = params[key];
    return typeof v === "string" ? v : undefined;
  };

  const rawTxType = get("transactionType");
  const transactionType =
    rawTxType === "Sale" || rawTxType === "Lease" || rawTxType === "All"
      ? rawTxType
      : undefined;

  return {
    propertyType: get("propertyType"),
    transactionType,
    minBeds: get("minBeds") ? Number(get("minBeds")) : undefined,
    maxPrice: get("maxPrice") ? Number(get("maxPrice")) : undefined,
    minPrice: get("minPrice") ? Number(get("minPrice")) : undefined,
    city: get("city"),
    sort: get("sort") as Filters["sort"],
    page: get("page") ? Number(get("page")) : 1,
  };
}

async function ListingsGrid({ filters }: { filters: Filters }) {
  const [result, cities, propertyTypes] = await Promise.all([
    getAmpreListings(filters),
    getAmpreListingCities(filters.transactionType),
    getAmpreListingPropertyTypes(filters.transactionType),
  ]);

  return (
    <>
      <ListingFilters
        cities={cities}
        propertyTypes={propertyTypes}
        total={result.total}
      />

      <section className="bg-background section-md">
        <div className="swiss-container">
          {result.listings.length === 0 ? (
            <div className="text-center py-16 dimensional-card">
              <p className="text-lg text-muted mb-2">
                No properties match your filters.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Try adjusting your search criteria.
              </p>
              <Link
                href="/listings"
                className="inline-flex items-center justify-center h-12 px-8 text-sm font-semibold uppercase tracking-wider border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background transition-all duration-200"
              >
                Clear all filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {result.listings.map((listing) => (
                <PropertyCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          {result.totalPages > 1 && (
            <nav
              className="mt-12 flex justify-center gap-2"
              aria-label="Pagination"
            >
              {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <a
                    key={pageNum}
                    href={`/listings?${new URLSearchParams({
                      ...(filters.transactionType
                        ? { transactionType: filters.transactionType }
                        : {}),
                      ...(filters.propertyType
                        ? { propertyType: filters.propertyType }
                        : {}),
                      ...(filters.minBeds
                        ? { minBeds: String(filters.minBeds) }
                        : {}),
                      ...(filters.maxPrice
                        ? { maxPrice: String(filters.maxPrice) }
                        : {}),
                      ...(filters.city ? { city: filters.city } : {}),
                      ...(filters.sort ? { sort: filters.sort } : {}),
                      page: String(pageNum),
                    }).toString()}`}
                    aria-label={`Go to page ${pageNum}`}
                    aria-current={pageNum === result.page ? "page" : undefined}
                    className={`inline-flex items-center justify-center h-12 w-12 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                      pageNum === result.page
                        ? "bg-accent text-white shadow-md"
                        : "dimensional-card hover:shadow-lg"
                    }`}
                  >
                    {pageNum}
                  </a>
                )
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}

export default async function ListingsPage(props: ListingsPageProps) {
  const searchParams = await props.searchParams;
  const filters = parseFilters(searchParams);
  const listingsPage = await getListingsPage();

  return (
    <div className="pt-20 lg:pt-24">
      {/* Page Header */}
      <section className="bg-surface section-md">
        <div className="swiss-container">
          <p className="text-xs uppercase tracking-[0.15em] font-medium text-accent mb-3">
            {listingsPage?.overline ?? "Properties"}
          </p>
          <h1 className="font-display text-display-sm font-bold tracking-tight">
            {listingsPage?.title ?? "All Listings"}
          </h1>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="section-md text-center text-muted swiss-container">
            <div className="dimensional-card p-12">
              <p className="text-lg">Loading listings...</p>
            </div>
          </div>
        }
      >
        <ListingsGrid filters={filters} />
      </Suspense>
    </div>
  );
}
