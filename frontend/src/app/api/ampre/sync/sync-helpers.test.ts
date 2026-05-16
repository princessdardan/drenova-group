import test from "node:test";
import assert from "node:assert/strict";

import {
  KV_LISTINGS_KEY,
  KV_LISTINGS_TTL_SECONDS,
  KV_SYNC_RETRIEVAL_LOCK_KEY,
  KV_SYNC_RETRIEVAL_LOCK_SECONDS,
} from "@/lib/ampre/compliance";
import type { Listing } from "@/types/listing";
import {
  acquireRetrievalLock,
  getFreshListings,
  writeListingsWithRetention,
  type SyncRedis,
} from "./sync-helpers";

class FakeRedis implements SyncRedis {
  values = new Map<string, unknown>();
  setCalls: Array<{ key: string; value: unknown; options?: { ex?: number; nx?: true } }> = [];
  delCalls: string[] = [];

  async set<TData>(
    key: string,
    value: TData,
    options?: { ex?: number; nx?: true }
  ): Promise<TData | "OK" | null> {
    this.setCalls.push({ key, value, options });

    if (options?.nx && this.values.has(key)) return null;

    this.values.set(key, value);
    return "OK";
  }

  async del(key: string): Promise<number> {
    this.delCalls.push(key);
    const existed = this.values.delete(key);
    return existed ? 1 : 0;
  }
}

function makeListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "W1234567",
    listingKey: "W1234567",
    slug: "listing-w1234567",
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
    modificationTimestamp: "2026-05-01T12:00:00.000Z",
    lastSeen: "2026-05-01T12:00:00.000Z",
    ...overrides,
  };
}

test("acquireRetrievalLock writes a 24-hour NX lock", async () => {
  const redis = new FakeRedis();

  assert.equal(await acquireRetrievalLock(redis, "2026-05-01T12:00:00.000Z"), true);
  assert.deepEqual(redis.setCalls[0], {
    key: KV_SYNC_RETRIEVAL_LOCK_KEY,
    value: "2026-05-01T12:00:00.000Z",
    options: { ex: KV_SYNC_RETRIEVAL_LOCK_SECONDS, nx: true },
  });
  assert.equal(await acquireRetrievalLock(redis, "2026-05-01T13:00:00.000Z"), false);
});

test("writeListingsWithRetention writes listings with retention TTL", async () => {
  const redis = new FakeRedis();
  const listings = [makeListing()];

  await writeListingsWithRetention(redis, listings);

  assert.deepEqual(redis.setCalls[0], {
    key: KV_LISTINGS_KEY,
    value: listings,
    options: { ex: KV_LISTINGS_TTL_SECONDS },
  });
  assert.deepEqual(redis.delCalls, []);
});

test("writeListingsWithRetention deletes stale dataset when there are no fresh listings", async () => {
  const redis = new FakeRedis();

  await writeListingsWithRetention(redis, []);

  assert.deepEqual(redis.delCalls, [KV_LISTINGS_KEY]);
  assert.deepEqual(redis.setCalls, []);
});

test("getFreshListings removes listings outside the retention window", () => {
  const now = new Date("2026-05-01T12:00:00.000Z");
  const fresh = makeListing({ listingKey: "fresh", lastSeen: "2026-04-15T12:00:00.000Z" });
  const stale = makeListing({ listingKey: "stale", lastSeen: "2026-01-01T12:00:00.000Z" });

  assert.deepEqual(
    getFreshListings([fresh, stale], now).map((listing) => listing.listingKey),
    ["fresh"]
  );
});
