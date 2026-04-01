export const maxDuration = 120; // seconds — requires Vercel Pro plan

import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Redis } from "@upstash/redis";
import { fetchAmpreProperties, fetchAmpreMedia } from "@/lib/ampre/client";
import { buildSyncQuery } from "@/lib/ampre/queries";
import { mapAmpreToListing, filterPermittedProperties } from "@/lib/ampre/mapper";
import {
  KV_LISTINGS_KEY,
  KV_SYNC_LOG_PREFIX,
  MAX_RETENTION_DAYS,
  RESIDENTIAL_PROPERTY_TYPES,
} from "@/lib/ampre/compliance";
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
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let logEntry: SyncLogEntry;

  try {
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

    // Step 2b: Filter to residential property types only (defense-in-depth)
    const residential = permitted.filter(
      (p) =>
        p.PropertyType != null &&
        (RESIDENTIAL_PROPERTY_TYPES as readonly string[]).includes(p.PropertyType)
    );
    const filteredNonResidential = permitted.length - residential.length;
    if (filteredNonResidential > 0) {
      console.warn(
        `[sync] Filtered ${filteredNonResidential} non-residential listings (should be 0 — check OData filter)`
      );
    }

    // Step 3: Fetch media for permitted listings
    const listingKeys = residential.map((p) => p.ListingKey);
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
    const listings = residential.map((p) =>
      mapAmpreToListing(p, mediaMap.get(p.ListingKey) ?? [])
    );
    console.log(
      `[sync] Mapped ${listings.length} listings in ${Date.now() - startTime}ms`
    );

    // Step 5: Load existing listings from Redis for stale-data comparison
    const existingListings =
      (await getRedis().get<Listing[]>(KV_LISTINGS_KEY)) ?? [];

    // Step 6: Store mapped listings in Redis
    await getRedis().set(KV_LISTINGS_KEY, listings);

    // Step 7: Count purged entries (listings in Redis but not in response)
    const newKeys = new Set(listings.map((l) => l.listingKey));
    const purgedCount = existingListings.filter(
      (l) => !newKeys.has(l.listingKey)
    ).length;

    // Step 8: Secondary safety net — flag any listings with lastSeen > 60 days
    // (shouldn't happen since we replace the entire array, but defense-in-depth)
    const retentionCutoff = new Date();
    retentionCutoff.setDate(retentionCutoff.getDate() - MAX_RETENTION_DAYS);
    const freshListings = listings.filter(
      (l) => new Date(l.lastSeen) > retentionCutoff
    );
    if (freshListings.length < listings.length) {
      await getRedis().set(KV_LISTINGS_KEY, freshListings);
    }

    // Step 9: Log sync event to Redis (M1 fix)
    const durationMs = Date.now() - startTime;
    logEntry = {
      timestamp: new Date().toISOString(),
      durationMs,
      fetched: rawProperties.length,
      stored: freshListings.length,
      purged: purgedCount,
      filteredDdf: filteredCount,
      filteredNonResidential,
      mediaFetched,
      mediaErrors,
      listingsWithImages,
      success: true,
      ...(batchErrors.length > 0 && { batchErrors }),
    };
    const logKey = `${KV_SYNC_LOG_PREFIX}${Date.now()}`;
    await getRedis().set(logKey, logEntry, { ex: 90 * 24 * 60 * 60 }); // Retain logs 90 days

    // Step 10: Bust ISR cache
    revalidateTag("ampre-listings", { expire: 3600 });

    return NextResponse.json({
      success: true,
      fetched: rawProperties.length,
      stored: freshListings.length,
      purged: purgedCount,
      filteredDdf: filteredCount,
      filteredNonResidential,
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
      filteredNonResidential: 0,
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

    return NextResponse.json(
      { error: "Sync failed", message: errorMessage },
      { status: 500 }
    );
  }
}
