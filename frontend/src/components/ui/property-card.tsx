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
    <article className="group dimensional-card overflow-hidden cursor-pointer">
      <Link
        href={`/listings/${listing.slug}`}
        className="block"
      >
        <div className="aspect-[4/3] relative bg-muted/10 overflow-hidden">
          {hasImage ? (
            <Image
              src={listing.image}
              alt={
                listing.addressSuppressed
                  ? `Property in ${listing.city}, ${listing.province}`
                  : `${listing.address}, ${listing.city}, ${listing.province}`
              }
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
          {listing.status !== "Active" && (
            <span className="absolute top-3 left-3 glass-strong px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold">
              {listing.status}
            </span>
          )}
        </div>
        
        <div className="p-5 lg:p-6">
          <p className="text-xl font-semibold text-foreground">{formatPrice(listing.price)}</p>
          {listing.addressSuppressed ? (
            <p className="text-base font-medium mt-1 text-muted italic">
              Address withheld
            </p>
          ) : (
            <p className="text-base font-medium mt-1 text-foreground">{listing.address}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            {listing.city}, {listing.province} {listing.postalCode}
          </p>
          <p className="text-sm text-muted mt-3 pt-3 border-t border-border">
            {listing.beds} bed · {listing.baths} bath ·{" "}
            {formatNumber(listing.sqft)} sqft
          </p>
        </div>
      </Link>
    </article>
  );
}
