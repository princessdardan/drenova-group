import test from "node:test";
import assert from "node:assert/strict";

import { findPublicListingBySlug } from "./fetch";
import { sanitizeListingForPublicRead } from "./sanitize";
import type { Listing } from "@/types/listing";

function makeListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "W1234567",
    listingKey: "W1234567",
    slug: "123-main-street-toronto-on",
    price: 1250000,
    address: "123 Main Street",
    city: "Toronto",
    province: "ON",
    postalCode: "M5V 2T6",
    beds: 3,
    baths: 2,
    sqft: 1200,
    image: "",
    status: "Active",
    propertyType: "Residential",
    latitude: 43.6426,
    longitude: -79.3871,
    modificationTimestamp: "2026-05-01T12:00:00.000Z",
    lastSeen: "2026-05-01T12:00:00.000Z",
    ...overrides,
  };
}

test("sanitizeListingForPublicRead strips legacy suppressed address precision", () => {
  const sanitized = sanitizeListingForPublicRead(
    makeListing({ addressSuppressed: true })
  );

  assert.equal(sanitized.slug, "listing-w1234567");
  assert.equal(sanitized.address, "");
  assert.equal(sanitized.postalCode, undefined);
  assert.equal(sanitized.latitude, null);
  assert.equal(sanitized.longitude, null);
});

test("findPublicListingBySlug does not resolve old address-bearing slugs", () => {
  const listing = makeListing({ addressSuppressed: true });

  assert.equal(findPublicListingBySlug([listing], listing.slug), null);
  assert.equal(
    findPublicListingBySlug([listing], "listing-w1234567")?.listingKey,
    "W1234567"
  );
});
