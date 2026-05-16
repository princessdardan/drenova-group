import test from "node:test";
import assert from "node:assert/strict";

import { mapAmpreToListing, filterPermittedProperties } from "./mapper";
import type { AmpreProperty } from "./types";

function makeProperty(overrides: Partial<AmpreProperty> = {}): AmpreProperty {
  return {
    ListingKey: "W1234567",
    ListingId: "W1234567",
    ListPrice: 1250000,
    UnparsedAddress: "123 Main Street",
    StreetNumber: "123",
    StreetName: "Main",
    StreetSuffix: "Street",
    City: "Toronto",
    StateOrProvince: "ON",
    PostalCode: "M5V 2T6",
    Latitude: 43.6426,
    Longitude: -79.3871,
    BedroomsTotal: 3,
    BathroomsTotalInteger: 2,
    StandardStatus: "Active",
    ModificationTimestamp: "2026-05-01T12:00:00.000Z",
    DDFYN: true,
    InternetEntireListingDisplayYN: true,
    InternetAddressDisplayYN: true,
    ...overrides,
  };
}

test("mapAmpreToListing suppresses all address precision for display-disabled listings", () => {
  const listing = mapAmpreToListing(
    makeProperty({ InternetAddressDisplayYN: false })
  );

  assert.equal(listing.slug, "listing-w1234567");
  assert.equal(listing.address, "");
  assert.equal(listing.postalCode, undefined);
  assert.equal(listing.latitude, null);
  assert.equal(listing.longitude, null);
  assert.equal(listing.addressSuppressed, true);
  assert.ok(!listing.slug.includes("main"));
  assert.ok(!listing.slug.includes("street"));
});

test("mapAmpreToListing uses opaque safe slugs for displayable listings", () => {
  const listing = mapAmpreToListing(makeProperty());

  assert.equal(listing.slug, "listing-w1234567");
  assert.equal(listing.address, "123 Main Street");
  assert.equal(listing.postalCode, "M5V 2T6");
  assert.equal(listing.latitude, 43.6426);
  assert.equal(listing.longitude, -79.3871);
});

test("filterPermittedProperties removes listings that cannot be advertised", () => {
  const allowed = makeProperty({ ListingKey: "allowed" });
  const ddfBlocked = makeProperty({ ListingKey: "ddf-blocked", DDFYN: false });
  const internetBlocked = makeProperty({
    ListingKey: "internet-blocked",
    InternetEntireListingDisplayYN: false,
  });

  const result = filterPermittedProperties([
    allowed,
    ddfBlocked,
    internetBlocked,
  ]);

  assert.deepEqual(
    result.permitted.map((property) => property.ListingKey),
    ["allowed"]
  );
  assert.equal(result.filteredCount, 2);
});
