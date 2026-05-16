export const maxDuration = 120; // seconds — requires Vercel Pro plan

import { revalidateTag } from "next/cache";
import { Redis } from "@upstash/redis";
import { fetchAmpreProperties, fetchAmpreMedia } from "@/lib/ampre/client";
import { buildSyncQuery } from "@/lib/ampre/queries";
import { mapAmpreToListing, filterPermittedProperties } from "@/lib/ampre/mapper";
import {
  KV_LISTINGS_KEY,
  KV_SYNC_LOG_PREFIX,
} from "@/lib/ampre/compliance";
import { jsonError, jsonOk } from "../../_lib/responses";
import { hasValidSecret } from "../../_lib/secrets";
import {
  acquireRetrievalLock,
  getFreshListings,
  writeListingsWithRetention,
} from "./sync-helpers";
import type { Listing } from "@/types/listing";
import type { AmpreMedia, SyncLogEntry, BatchError } from "@/lib/ampre/types";

/**
 * POST /api/ampre/sync
 *
 * Daily sync job — the ONLY code path that calls AMPRE (C1 fix).
 * Triggered by Vercel Cron at 6:00 AM UTC daily.
 *
 * 1. Verify CRON_SECRET
 * 2. Fetch all brokerage listings from AMPRE (single daily retrieval)
 * 3. Filter out DDFYN=false / InternetEntireListingDisplayYN=false (C2)
 * 4. Fetch media from /odata/Media, joined by ResourceRecordKey
 * 5. Map through mapper (handles address suppression + media)
 * 6. Store in Redis
 * 7. Purge stale data (C3)
 * 8. Log sync event (M1)
 * 9. Revalidate ISR cache
 */
export async function GET(request: Request) {
  return handleSync(request);
}

export async function POST(request: Request) {
  return handleSync(request);
}

let _redis: Redis | null = null;
function getRedis(): Redis {
  if (!_redis) _redis = Redis.fromEnv();
  return _redis;
}

async function handleSync(request: Request) {
  const startTime = Date.now();

  // Verify caller — Vercel Cron sends CRON_SECRET automatically
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!hasValidSecret(bearerToken, "CRON_SECRET")) {
    return jsonError({ error: "Unauthorized" }, 401);
  }

  let logEntry: SyncLogEntry;

  try {
    const redis = getRedis();
    const lockAcquired = await acquireRetrievalLock(redis);

    if (!lockAcquired) {
      const durationMs = Date.now() - startTime;
      logEntry = {
        timestamp: new Date().toISOString(),
        durationMs,
        fetched: 0,
        stored: 0,
        purged: 0,
        filteredDdf: 0,
        mediaFetched: 0,
        mediaErrors: 0,
        listingsWithImages: 0,
        success: true,
        skipped: true,
        skippedReason: "retrieval_recently_attempted",
      };
      const skippedLogKey = `${KV_SYNC_LOG_PREFIX}${Date.now()}`;
      await redis.set(skippedLogKey, logEntry, { ex: 90 * 24 * 60 * 60 });

      return jsonOk({
        success: true,
        skipped: true,
        reason: "retrieval_recently_attempted",
        durationMs,
      });
    }

    // Step 1: Fetch all brokerage listings from AMPRE
    const query = buildSyncQuery();
    const rawProperties = await fetchAmpreProperties(query);
    console.log(
      `[sync] Properties fetched: ${rawProperties.length} in ${Date.now() - startTime}ms`
    );

    // Step 2: Filter out non-displayable listings (C2 fix)
    const { permitted, filteredCount } =
      filterPermittedProperties(rawProperties);
    console.log(
      `[sync] After DDF filter: ${permitted.length} permitted, ${filteredCount} filtered`
    );

    // Step 3: Fetch media for permitted listings
    const listingKeys = permitted.map((p) => p.ListingKey);
    const mediaMap = new Map<string, AmpreMedia[]>();
    let mediaFetched = 0;
    let mediaErrors = 0;
    let batchErrors: BatchError[] = [];
    const mediaStart = Date.now();

    try {
      const mediaResult = await fetchAmpreMedia(listingKeys);
      mediaFetched = mediaResult.media.length;
      mediaErrors = mediaResult.errors;
      batchErrors = mediaResult.batchErrors;

      // Group media by ResourceRecordKey for O(1) lookup during mapping
      for (const m of mediaResult.media) {
        const existing = mediaMap.get(m.ResourceRecordKey);
        if (existing) {
          existing.push(m);
        } else {
          mediaMap.set(m.ResourceRecordKey, [m]);
        }
      }
    } catch {
      // Media fetch failed entirely — continue with empty images
      // Property data is more important than images
      mediaErrors = 1;
    }
    const listingsWithImages = mediaMap.size;
    console.log(
      `[sync] Media fetched: ${mediaFetched} records for ${listingsWithImages}/${listingKeys.length} listings, ${mediaErrors} errors in ${Date.now() - mediaStart}ms`
    );

    // Step 4: Map to internal Listing type (handles address suppression + media)
    const listings = permitted.map((p) =>
      mapAmpreToListing(p, mediaMap.get(p.ListingKey) ?? [])
    );
    console.log(
      `[sync] Mapped ${listings.length} listings in ${Date.now() - startTime}ms`
    );

    // Step 5: Load existing listings from Redis for stale-data comparison
    const existingListings =
      (await redis.get<Listing[]>(KV_LISTINGS_KEY)) ?? [];

    // Step 7: Count purged entries (listings in Redis but not in response)
    const newKeys = new Set(listings.map((l) => l.listingKey));
    const purgedCount = existingListings.filter(
      (l) => !newKeys.has(l.listingKey)
    ).length;

    // Step 8: Secondary safety net with storage-level retention fallback
    const freshListings = getFreshListings(listings);
    await writeListingsWithRetention(redis, freshListings);

    // Step 9: Log sync event to Redis (M1 fix)
    const durationMs = Date.now() - startTime;
    logEntry = {
      timestamp: new Date().toISOString(),
      durationMs,
      fetched: rawProperties.length,
      stored: freshListings.length,
      purged: purgedCount,
      filteredDdf: filteredCount,
      mediaFetched,
      mediaErrors,
      listingsWithImages,
      success: true,
      ...(batchErrors.length > 0 && { batchErrors }),
    };
    const logKey = `${KV_SYNC_LOG_PREFIX}${Date.now()}`;
    await redis.set(logKey, logEntry, { ex: 90 * 24 * 60 * 60 }); // Retain logs 90 days

    // Step 10: Bust ISR cache
    revalidateTag("ampre-listings", { expire: 3600 });

    return jsonOk({
      success: true,
      fetched: rawProperties.length,
      stored: freshListings.length,
      purged: purgedCount,
      filteredDdf: filteredCount,
      mediaFetched,
      mediaErrors,
      listingsWithImages,
      durationMs,
      ...(batchErrors.length > 0 && { batchErrors }),
    });
  } catch (error) {
    const durationMs = Date.now() - startTime;
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    logEntry = {
      timestamp: new Date().toISOString(),
      durationMs,
      fetched: 0,
      stored: 0,
      purged: 0,
      filteredDdf: 0,
      mediaFetched: 0,
      mediaErrors: 0,
      listingsWithImages: 0,
      success: false,
      error: errorMessage,
    };

    // Log failure
    const logKey = `${KV_SYNC_LOG_PREFIX}${Date.now()}`;
    try {
      await getRedis().set(logKey, logEntry, { ex: 90 * 24 * 60 * 60 });
    } catch {
      // If Redis itself is down, we can't log — fail gracefully
    }

    return jsonError({ error: "Sync failed", message: errorMessage }, 500);
  }
}
