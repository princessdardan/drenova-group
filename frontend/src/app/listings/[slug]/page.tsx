import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAmpreListingBySlug } from "@/lib/ampre/fetch";
import { formatPrice, formatNumber } from "@/lib/format";

interface ListingDetailProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate metadata for listing detail pages.
 * When `addressSuppressed` is true, address is excluded from
 * title and description to comply with disp_addr=N (C2 fix).
 */
export async function generateMetadata(
  props: ListingDetailProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const listing = await getAmpreListingBySlug(slug);

  if (!listing) {
    return { title: "Listing Not Found" };
  }

  const location = `${listing.city}, ${listing.province}`;
  const title = listing.addressSuppressed
    ? `Property in ${location}`
    : `${listing.address}, ${location}`;

  const description = listing.addressSuppressed
    ? `${listing.beds} bed, ${listing.baths} bath property in ${location}. ${formatPrice(listing.price)}.`
    : `${listing.beds} bed, ${listing.baths} bath at ${listing.address}, ${location}. ${formatPrice(listing.price)}.`;

  return { title, description };
}

export default async function ListingDetailPage(props: ListingDetailProps) {
  const { slug } = await props.params;
  const listing = await getAmpreListingBySlug(slug);

  if (!listing) notFound();

  const hasImages = listing.images && listing.images.length > 0;
  const location = listing.addressSuppressed
    ? `${listing.city}, ${listing.province}`
    : `${listing.address}, ${listing.city}, ${listing.province} ${listing.postalCode}`;

  return (
    <div className="pt-20 lg:pt-24">
      {/* Image Gallery */}
      {hasImages && (
        <section className="bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="aspect-[16/9] lg:aspect-[21/9] relative">
              <Image
                src={listing.images![0]}
                alt={
                  listing.addressSuppressed
                    ? `Property in ${listing.city}, ${listing.province}`
                    : `${listing.address}, ${listing.city}, ${listing.province}`
                }
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* Listing Details */}
      <section className="py-12 px-6 lg:py-16 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold">
                    {listing.addressSuppressed
                      ? formatPrice(listing.price)
                      : `${listing.address} — ${formatPrice(listing.price)}`}
                  </h1>
                  <p className="text-muted mt-1">
                    {listing.city}, {listing.province} {listing.postalCode}
                  </p>
                </div>
                {listing.status !== "Active" && (
                  <span className="bg-foreground text-background text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded shrink-0">
                    {listing.status}
                  </span>
                )}
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8 py-6 border-t border-b border-border">
                <div>
                  <p className="text-2xl font-semibold">{listing.beds}</p>
                  <p className="text-sm text-muted">Bedrooms</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold">{listing.baths}</p>
                  <p className="text-sm text-muted">Bathrooms</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold">
                    {formatNumber(listing.sqft)}
                  </p>
                  <p className="text-sm text-muted">Sq Ft</p>
                </div>
              </div>

              {/* Description */}
              {listing.description && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">
                    About this property
                  </h2>
                  <p className="text-muted leading-relaxed">
                    {listing.description}
                  </p>
                </div>
              )}

              {/* Property Details */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted">Property Type</dt>
                    <dd className="font-medium">{listing.propertyType}</dd>
                  </div>
                  {listing.propertySubType && (
                    <div className="flex justify-between">
                      <dt className="text-muted">Sub Type</dt>
                      <dd className="font-medium">{listing.propertySubType}</dd>
                    </div>
                  )}
                  {listing.yearBuilt && (
                    <div className="flex justify-between">
                      <dt className="text-muted">Year Built</dt>
                      <dd className="font-medium">{listing.yearBuilt}</dd>
                    </div>
                  )}
                  {listing.lotSize && (
                    <div className="flex justify-between">
                      <dt className="text-muted">Lot Size</dt>
                      <dd className="font-medium">
                        {formatNumber(listing.lotSize)} sqft
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted">MLS #</dt>
                    <dd className="font-mono text-xs">
                      {listing.listingKey}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-surface-alt border border-border rounded-lg p-6">
                {listing.listAgentName && (
                  <div className="mb-4">
                    <p className="text-sm text-muted">Listed by</p>
                    <p className="font-medium">{listing.listAgentName}</p>
                    {listing.listOfficeName && (
                      <p className="text-sm text-muted">
                        {listing.listOfficeName}
                      </p>
                    )}
                  </div>
                )}
                <Link
                  href="/contact"
                  className="block w-full text-center bg-accent text-white font-semibold py-3 px-6 rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Request Information
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Images */}
      {listing.images && listing.images.length > 1 && (
        <section className="bg-surface py-12 px-6 lg:py-16 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Gallery</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {listing.images.slice(1).map((imageUrl, i) => (
                <div key={i} className="aspect-[4/3] relative rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={`Property photo ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
