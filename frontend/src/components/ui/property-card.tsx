import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/types/listing";
import { formatPrice, formatNumber } from "@/lib/format";

interface PropertyCardProps {
  listing: Listing;
}

export function PropertyCard({ listing }: PropertyCardProps) {
  const hasImage = listing.image && listing.image.length > 0;

  return (
    <article className="group bg-surface-alt rounded-lg overflow-hidden border border-border transition-shadow hover:shadow-lg">
      <Link
        href={`/listings/${listing.slug}`}
        className="block"
      >
        <div className="aspect-[4/3] relative bg-muted/10">
          {hasImage ? (
            <Image
              src={listing.image}
              alt={
                listing.addressSuppressed
                  ? `Property in ${listing.city}, ${listing.province}`
                  : `${listing.address}, ${listing.city}, ${listing.province}`
              }
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted text-sm">
              No image available
            </div>
          )}
          {listing.status !== "Active" && (
            <span className="absolute top-3 left-3 bg-foreground text-background text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded">
              {listing.status}
            </span>
          )}
        </div>
        <div className="p-4 lg:p-6">
          <p className="text-xl font-semibold">{formatPrice(listing.price)}</p>
          {listing.addressSuppressed ? (
            <p className="text-base font-medium mt-1 text-muted italic">
              Address withheld
            </p>
          ) : (
            <p className="text-base font-medium mt-1">{listing.address}</p>
          )}
          <p className="text-sm text-muted">
            {listing.city}, {listing.province} {listing.postalCode}
          </p>
          <p className="text-sm text-muted mt-2">
            {listing.beds} bed · {listing.baths} bath ·{" "}
            {formatNumber(listing.sqft)} sqft
          </p>
        </div>
      </Link>
    </article>
  );
}
