import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAmpreListingBySlug } from "@/lib/ampre/fetch";
import {
  formatPrice,
  formatNumber,
  formatDate,
  formatList,
  formatFee,
} from "@/lib/format";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { ListingInquiryForm } from "@/components/sections/listing-inquiry-form";
import { canonicalUrl } from "@/lib/seo";

interface ListingDetailProps {
  params: Promise<{ slug: string }>;
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <dl className="divide-y divide-border">{children}</dl>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-3 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-right max-w-[60%]">{value}</dd>
    </div>
  );
}

function formatListingLocation(listing: {
  city: string;
  province: string;
  postalCode?: string;
  addressSuppressed?: boolean;
}): string {
  return [
    `${listing.city}, ${listing.province}`,
    listing.addressSuppressed ? null : listing.postalCode,
  ]
    .filter(Boolean)
    .join(" ");
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

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl(`/listings/${listing.slug}`),
    },
    openGraph: listing.image
      ? {
          url: canonicalUrl(`/listings/${listing.slug}`),
          images: [{ url: listing.image, alt: title }],
        }
      : { url: canonicalUrl(`/listings/${listing.slug}`) },
  };
}

export default async function ListingDetailPage(props: ListingDetailProps) {
  const { slug } = await props.params;
  const listing = await getAmpreListingBySlug(slug);

  if (!listing) notFound();

  const bathLabel =
    listing.bathroomsFull != null || listing.bathroomsHalf != null
      ? [
          listing.bathroomsFull != null ? `${listing.bathroomsFull} Full` : null,
          listing.bathroomsHalf != null ? `${listing.bathroomsHalf} Half` : null,
        ]
          .filter(Boolean)
          .join(", ")
      : null;

  const garageType =
    listing.hasGarage && listing.attachedGarage != null
      ? listing.attachedGarage
        ? "Attached"
        : "Detached"
      : null;

  const hasPriceChange =
    listing.originalListPrice != null &&
    listing.originalListPrice !== listing.price;

  // Determine which detail sections have data
  const hasGeneralDetails =
    listing.propertyType ||
    listing.propertySubType ||
    listing.architecturalStyle?.length ||
    listing.yearBuilt ||
    listing.stories ||
    listing.directionFaces;

  const hasInteriorFeatures =
    listing.interiorFeatures?.length ||
    listing.flooring?.length ||
    listing.appliances?.length ||
    listing.laundryFeatures?.length ||
    listing.hasFireplace ||
    listing.fireplaces ||
    listing.heating?.length ||
    listing.cooling?.length;

  const hasExteriorFeatures =
    listing.constructionMaterials?.length ||
    listing.roof?.length ||
    listing.basement?.length ||
    listing.exteriorFeatures?.length ||
    listing.hasPool != null ||
    listing.hasWaterfront != null ||
    listing.view?.length;

  const hasParking =
    listing.parkingTotal != null ||
    listing.garageSpaces != null ||
    listing.hasGarage != null;

  const hasLotLand =
    listing.lotSize ||
    listing.lotSizeDimensions ||
    listing.lotFeatures?.length ||
    listing.zoning;

  const hasUtilities =
    listing.waterSource?.length || listing.sewer?.length;

  const hasFinancials =
    listing.taxAnnualAmount != null ||
    listing.associationFee != null ||
    listing.hasAssociation != null;

  const hasMarketInfo =
    listing.daysOnMarket != null ||
    listing.onMarketDate ||
    listing.closeDate ||
    listing.closePrice != null;

  const displayLocation = formatListingLocation(listing);

  const listingContext = {
    listingSlug: listing.slug,
    listingMlsNumber: listing.listingKey,
    listingTitle: listing.addressSuppressed
      ? `Property in ${listing.city}, ${listing.province}`
      : `${listing.address}, ${listing.city}, ${listing.province}`,
    listingPrice: listing.price,
    listingUrl: `/listings/${listing.slug}`,
    listingCity: listing.city,
    listingPropertyType: listing.propertyType,
  };

  return (
    <div className="pt-20 lg:pt-24 pb-20 lg:pb-0">
      <ImageCarousel
        images={listing.images?.length ? listing.images : [listing.image]}
        alt={
          listing.addressSuppressed
            ? `Property in ${listing.city}, ${listing.province}`
            : `${listing.address}, ${listing.city}, ${listing.province}`
        }
      />

      {/* Listing Details */}
      <section className="py-12 px-6 lg:py-16 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
            <Link href="/listings" className="hover:text-accent transition-colors">
              Listings
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">
              {listing.addressSuppressed
                ? `Property in ${listing.city}`
                : listing.address}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold">
                    {listing.addressSuppressed
                      ? formatPrice(listing.price)
                      : `${listing.address} — ${formatPrice(listing.price)}`}
                  </h1>
                  <p className="text-muted mt-1">
                    {listing.addressSuppressed ? `Address withheld — ${displayLocation}` : displayLocation}
                  </p>
                </div>
                {listing.status !== "Active" && (
                  <span className="bg-foreground text-background text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded shrink-0">
                    {listing.status}
                  </span>
                )}
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mt-8 py-6 border-t border-b border-border">
                <div>
                  <p className="text-2xl font-semibold">{listing.beds}</p>
                  <p className="text-sm text-muted">Bedrooms</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold">{listing.baths}</p>
                  <p className="text-sm text-muted">
                    {bathLabel ? `Baths (${bathLabel})` : "Bathrooms"}
                  </p>
                </div>
                {listing.sqft > 0 && (
                  <div>
                    <p className="text-2xl font-semibold">
                      {formatNumber(listing.sqft)}
                    </p>
                    <p className="text-sm text-muted">Sq Ft</p>
                  </div>
                )}
                {listing.lotSize != null && listing.lotSize > 0 && (
                  <div>
                    <p className="text-2xl font-semibold">
                      {formatNumber(listing.lotSize)}
                    </p>
                    <p className="text-sm text-muted">Lot Sq Ft</p>
                  </div>
                )}
                {listing.yearBuilt != null && (
                  <div>
                    <p className="text-2xl font-semibold">{listing.yearBuilt}</p>
                    <p className="text-sm text-muted">Year Built</p>
                  </div>
                )}
                {listing.parkingTotal != null && (
                  <div>
                    <p className="text-2xl font-semibold">{listing.parkingTotal}</p>
                    <p className="text-sm text-muted">Parking</p>
                  </div>
                )}
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

              {/* General Details */}
              {hasGeneralDetails && (
                <DetailSection title="General Details">
                  {listing.propertyType && (
                    <DetailRow label="Property Type" value={listing.propertyType} />
                  )}
                  {listing.propertySubType && (
                    <DetailRow label="Sub Type" value={listing.propertySubType} />
                  )}
                  {listing.architecturalStyle?.length && (
                    <DetailRow
                      label="Architectural Style"
                      value={formatList(listing.architecturalStyle)}
                    />
                  )}
                  {listing.yearBuilt != null && (
                    <DetailRow label="Year Built" value={listing.yearBuilt} />
                  )}
                  {listing.stories != null && (
                    <DetailRow label="Stories" value={listing.stories} />
                  )}
                  {listing.directionFaces && (
                    <DetailRow label="Faces" value={listing.directionFaces} />
                  )}
                </DetailSection>
              )}

              {/* Interior Features */}
              {hasInteriorFeatures && (
                <DetailSection title="Interior Features">
                  {listing.interiorFeatures?.length && (
                    <DetailRow
                      label="Interior"
                      value={formatList(listing.interiorFeatures)}
                    />
                  )}
                  {listing.flooring?.length && (
                    <DetailRow
                      label="Flooring"
                      value={formatList(listing.flooring)}
                    />
                  )}
                  {listing.appliances?.length && (
                    <DetailRow
                      label="Appliances"
                      value={formatList(listing.appliances)}
                    />
                  )}
                  {listing.laundryFeatures?.length && (
                    <DetailRow
                      label="Laundry"
                      value={formatList(listing.laundryFeatures)}
                    />
                  )}
                  {(listing.hasFireplace || (listing.fireplaces != null && listing.fireplaces > 0)) && (
                    <DetailRow
                      label="Fireplace"
                      value={
                        listing.fireplaces != null && listing.fireplaces > 0
                          ? `Yes (${listing.fireplaces})`
                          : "Yes"
                      }
                    />
                  )}
                  {listing.heating?.length && (
                    <DetailRow
                      label="Heating"
                      value={formatList(listing.heating)}
                    />
                  )}
                  {listing.cooling?.length && (
                    <DetailRow
                      label="Cooling"
                      value={formatList(listing.cooling)}
                    />
                  )}
                </DetailSection>
              )}

              {/* Exterior & Construction */}
              {hasExteriorFeatures && (
                <DetailSection title="Exterior & Construction">
                  {listing.constructionMaterials?.length && (
                    <DetailRow
                      label="Construction"
                      value={formatList(listing.constructionMaterials)}
                    />
                  )}
                  {listing.roof?.length && (
                    <DetailRow label="Roof" value={formatList(listing.roof)} />
                  )}
                  {listing.basement?.length && (
                    <DetailRow
                      label="Basement"
                      value={formatList(listing.basement)}
                    />
                  )}
                  {listing.exteriorFeatures?.length && (
                    <DetailRow
                      label="Exterior"
                      value={formatList(listing.exteriorFeatures)}
                    />
                  )}
                  {listing.hasPool != null && (
                    <DetailRow
                      label="Pool"
                      value={listing.hasPool ? "Yes" : "No"}
                    />
                  )}
                  {listing.hasWaterfront != null && (
                    <DetailRow
                      label="Waterfront"
                      value={listing.hasWaterfront ? "Yes" : "No"}
                    />
                  )}
                  {listing.view?.length && (
                    <DetailRow label="View" value={formatList(listing.view)} />
                  )}
                </DetailSection>
              )}

              {/* Parking */}
              {hasParking && (
                <DetailSection title="Parking">
                  {listing.parkingTotal != null && (
                    <DetailRow
                      label="Total Spaces"
                      value={listing.parkingTotal}
                    />
                  )}
                  {listing.garageSpaces != null && (
                    <DetailRow
                      label="Garage Spaces"
                      value={listing.garageSpaces}
                    />
                  )}
                  {garageType && (
                    <DetailRow label="Garage Type" value={garageType} />
                  )}
                </DetailSection>
              )}

              {/* Lot & Land */}
              {hasLotLand && (
                <DetailSection title="Lot & Land">
                  {listing.lotSize != null && (
                    <DetailRow
                      label="Lot Size"
                      value={`${formatNumber(listing.lotSize)} sqft`}
                    />
                  )}
                  {listing.lotSizeDimensions && (
                    <DetailRow
                      label="Dimensions"
                      value={listing.lotSizeDimensions}
                    />
                  )}
                  {listing.lotFeatures?.length && (
                    <DetailRow
                      label="Features"
                      value={formatList(listing.lotFeatures)}
                    />
                  )}
                  {listing.zoning && (
                    <DetailRow label="Zoning" value={listing.zoning} />
                  )}
                </DetailSection>
              )}

              {/* Utilities */}
              {hasUtilities && (
                <DetailSection title="Utilities">
                  {listing.waterSource?.length && (
                    <DetailRow
                      label="Water Source"
                      value={formatList(listing.waterSource)}
                    />
                  )}
                  {listing.sewer?.length && (
                    <DetailRow
                      label="Sewer"
                      value={formatList(listing.sewer)}
                    />
                  )}
                </DetailSection>
              )}

              {/* Financial Information */}
              {hasFinancials && (
                <DetailSection title="Financial Information">
                  {listing.taxAnnualAmount != null && (
                    <DetailRow
                      label={
                        listing.taxYear
                          ? `Property Tax (${listing.taxYear})`
                          : "Property Tax"
                      }
                      value={formatPrice(listing.taxAnnualAmount)}
                    />
                  )}
                  {listing.hasAssociation && listing.associationFee != null && (
                    <DetailRow
                      label="HOA / Condo Fee"
                      value={formatFee(
                        listing.associationFee,
                        listing.associationFeeFrequency
                      )}
                    />
                  )}
                  {listing.hasAssociation != null &&
                    listing.associationFee == null && (
                      <DetailRow
                        label="HOA / Condo"
                        value={listing.hasAssociation ? "Yes" : "No"}
                      />
                    )}
                </DetailSection>
              )}

              {/* Market Information */}
              {hasMarketInfo && (
                <DetailSection title="Market Information">
                  {listing.daysOnMarket != null && (
                    <DetailRow
                      label="Days on Market"
                      value={listing.daysOnMarket}
                    />
                  )}
                  {listing.onMarketDate && (
                    <DetailRow
                      label="Listed Date"
                      value={formatDate(listing.onMarketDate)}
                    />
                  )}
                  {listing.closeDate && (
                    <DetailRow
                      label="Close Date"
                      value={formatDate(listing.closeDate)}
                    />
                  )}
                  {listing.closePrice != null && (
                    <DetailRow
                      label="Sold Price"
                      value={formatPrice(listing.closePrice)}
                    />
                  )}
                </DetailSection>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6 max-h-[calc(100vh-7rem)] overflow-y-auto pb-4 overscroll-contain">
                <div className="bg-surface-alt border border-border rounded-lg p-6 space-y-5">
                  {/* Price */}
                  <div>
                    <p className="text-2xl font-bold">
                      {formatPrice(listing.price)}
                    </p>
                    {hasPriceChange && listing.originalListPrice != null && (
                      <p className="text-sm text-muted mt-1">
                        <span className="line-through">
                          {formatPrice(listing.originalListPrice)}
                        </span>
                        <span className="ml-2">
                          {listing.price < listing.originalListPrice
                            ? `${formatPrice(listing.originalListPrice - listing.price)} below`
                            : `${formatPrice(listing.price - listing.originalListPrice)} above`}
                          {" "}original
                        </span>
                      </p>
                    )}
                  </div>

                  {/* MLS # */}
                  <div className="py-3 border-t border-border">
                    <p className="text-sm text-muted">MLS #</p>
                    <p className="font-mono text-xs mt-0.5">
                      {listing.listingKey}
                    </p>
                  </div>

                  {/* Agent Info */}
                  {listing.listAgentName && (
                    <div className="py-3 border-t border-border">
                      <p className="text-sm text-muted">Listed by</p>
                      <p className="font-medium mt-0.5">
                        {listing.listAgentName}
                      </p>
                      {listing.listOfficeName && (
                        <p className="text-sm text-muted">
                          {listing.listOfficeName}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <ListingInquiryForm
                  listingContext={listingContext}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile sticky price/CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-sm border-t border-border px-6 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-bold">{formatPrice(listing.price)}</p>
            {!listing.addressSuppressed && (
              <p className="text-xs text-muted truncate max-w-[180px]">
                {listing.address}
              </p>
            )}
          </div>
          <Link
            href="#listing-inquiry"
            className="shrink-0 bg-accent text-white font-semibold py-2.5 px-5 rounded-lg text-sm hover:bg-accent/90 transition-colors"
          >
            Request Info
          </Link>
        </div>
      </div>
    </div>
  );
}
