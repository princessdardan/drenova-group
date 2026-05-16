import Image from "next/image";
import { MediaCard } from "@/components/ui/media-card";
import type { Listing } from "@/types/listing";
import { formatPrice, formatNumber } from "@/lib/format";

interface PropertyCardProps {
  listing: Listing;
}

export function PropertyCard({ listing }: PropertyCardProps) {
  const hasImage = listing.image && listing.image.length > 0;

  // AMPRE Compliance: Suppressed addresses must not appear in alt text
  const imageAlt = listing.addressSuppressed
    ? `Property in ${listing.city}, ${listing.province}`
    : `${listing.address}, ${listing.city}, ${listing.province}`;

  // AMPRE Compliance: Suppressed addresses must not be displayed
  const addressLine = listing.addressSuppressed ? (
    <div className="text-base font-medium mt-1 text-muted italic">
      Address withheld
    </div>
  ) : (
    <div className="text-base font-medium mt-1 text-foreground">
      {listing.address}
    </div>
  );

  const locationLine = [
    `${listing.city}, ${listing.province}`,
    listing.addressSuppressed ? null : listing.postalCode,
  ]
    .filter(Boolean)
    .join(" ");

  const statusBadge = listing.status !== "Active" ? (
    <span className="absolute top-3 left-3 glass-strong px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold">
      {listing.status}
    </span>
  ) : null;

  const statsLine = `${listing.beds} bed · ${listing.baths} bath · ${formatNumber(listing.sqft)} sqft`;

  return (
    <MediaCard
      variant="listing"
      href={`/listings/${listing.slug}`}
      mediaClassName="aspect-[4/3] bg-muted/10 overflow-hidden"
      image={
        <>
          {hasImage ? (
            <Image
              src={listing.image}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted text-sm">
              No image available
            </div>
          )}
          
          {/* Glass overlay on hover */}
          <div className="absolute inset-0 glass-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Status badge with glass effect */}
          {statusBadge}
        </>
      }
      title={formatPrice(listing.price)}
      titleClassName="text-xl font-semibold text-foreground"
      subtitle={
        <>
          {addressLine}
          <div className="text-sm text-muted-foreground mt-1">
            {locationLine}
          </div>
        </>
      }
      subtitleClassName="mt-0"
      footer={
        <div className="text-sm text-muted pt-3 border-t border-border -mt-1">
          {statsLine}
        </div>
      }
    />
  );
}
