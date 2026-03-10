import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/types/listing";
import { isSanityImage } from "@/types/sanity";
import { formatPrice, formatNumber } from "@/lib/format";

interface PropertyCardProps {
  listing: Listing;
}

export function PropertyCard({ listing }: PropertyCardProps) {
  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group block bg-surface-alt rounded-lg overflow-hidden border border-border transition-shadow hover:shadow-lg"
    >
      <div className="aspect-[4/3] relative">
        <Image
          src={isSanityImage(listing.image) ? "" : listing.image}
          alt={`${listing.address}, ${listing.city}, ${listing.state}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {listing.status !== "Active" && (
          <span className="absolute top-3 left-3 bg-foreground text-background text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded">
            {listing.status}
          </span>
        )}
      </div>
      <div className="p-4 lg:p-6">
        <p className="text-xl font-semibold">{formatPrice(listing.price)}</p>
        <p className="text-base font-medium mt-1">{listing.address}</p>
        <p className="text-sm text-muted">
          {listing.city}, {listing.state} {listing.zip}
        </p>
        <p className="text-sm text-muted mt-2">
          {listing.beds} bed · {listing.baths} bath · {formatNumber(listing.sqft)} sqft
        </p>
      </div>
    </Link>
  );
}
