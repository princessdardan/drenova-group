import {
  KV_LISTINGS_KEY,
  KV_LISTINGS_TTL_SECONDS,
  KV_SYNC_RETRIEVAL_LOCK_KEY,
  KV_SYNC_RETRIEVAL_LOCK_SECONDS,
  MAX_RETENTION_DAYS,
} from "@/lib/ampre/compliance";
import type { Listing } from "@/types/listing";

export interface SyncRedis {
  set<TData>(
    key: string,
    value: TData,
    options?: { ex?: number; nx?: true }
  ): Promise<TData | "OK" | null>;
  del(key: string): Promise<number>;
}

export function getFreshListings(
  listings: Listing[],
  now: Date = new Date()
): Listing[] {
  const retentionCutoff = new Date(now);
  retentionCutoff.setDate(retentionCutoff.getDate() - MAX_RETENTION_DAYS);

  return listings.filter((listing) => {
    const lastSeen = new Date(listing.lastSeen);
    return !Number.isNaN(lastSeen.getTime()) && lastSeen > retentionCutoff;
  });
}

export async function writeListingsWithRetention(
  redis: SyncRedis,
  listings: Listing[]
): Promise<void> {
  if (listings.length === 0) {
    await redis.del(KV_LISTINGS_KEY);
    return;
  }

  await redis.set(KV_LISTINGS_KEY, listings, { ex: KV_LISTINGS_TTL_SECONDS });
}

export async function acquireRetrievalLock(
  redis: SyncRedis,
  timestamp: string = new Date().toISOString()
): Promise<boolean> {
  const result = await redis.set(KV_SYNC_RETRIEVAL_LOCK_KEY, timestamp, {
    ex: KV_SYNC_RETRIEVAL_LOCK_SECONDS,
    nx: true,
  });

  return result === "OK";
}
