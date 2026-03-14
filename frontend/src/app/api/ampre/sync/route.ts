import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Redis } from "@upstash/redis";
import { fetchAmpreProperties } from "@/lib/ampre/client";
import { buildSyncQuery } from "@/lib/ampre/queries";
import { mapAmpreToListing, filterPermittedProperties } from "@/lib/ampre/mapper";
import {
  KV_LISTINGS_KEY,
  KV_SYNC_LOG_PREFIX,
  MAX_RETENTION_DAYS,
} from "@/lib/ampre/compliance";
import type { Listing } from "@/types/listing";
import type { SyncLogEntry } from "@/lib/ampre/types";

/**
 * POST /api/ampre/sync
 *
 * Daily sync job — the ONLY code path that calls AMPRE (C1 fix).
 * Triggered by Vercel Cron at 6:00 AM UTC daily.
 *
 * 1. Verify CRON_SECRET
 * 2. Fetch all brokerage listings from AMPRE (single daily retrieval)
 * 3. Filter out perm_adv=N listings (C2)
 * 4. Map through mapper (handles disp_addr suppression)
 * 5. Store in Redis
 * 6. Purge stale data (C3)
 * 7. Log sync event (M1)
 * 8. Revalidate ISR cache
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

    // Step 2: Filter out perm_adv=N (C2 fix)
    const { permitted, filteredCount } =
      filterPermittedProperties(rawProperties);

    // Step 3: Map to internal Listing type (handles disp_addr suppression)
    const listings = permitted.map(mapAmpreToListing);

    // Step 4: Load existing listings from Redis for stale-data comparison
    const existingListings =
      (await getRedis().get<Listing[]>(KV_LISTINGS_KEY)) ?? [];

    // Step 5: Store mapped listings in Redis
    await getRedis().set(KV_LISTINGS_KEY, listings);

    // Step 6: Count purged entries (listings in Redis but not in response)
    const newKeys = new Set(listings.map((l) => l.listingKey));
    const purgedCount = existingListings.filter(
      (l) => !newKeys.has(l.listingKey)
    ).length;

    // Step 7: Secondary safety net — flag any listings with lastSeen > 60 days
    // (shouldn't happen since we replace the entire array, but defense-in-depth)
    const retentionCutoff = new Date();
    retentionCutoff.setDate(retentionCutoff.getDate() - MAX_RETENTION_DAYS);
    const freshListings = listings.filter(
      (l) => new Date(l.lastSeen) > retentionCutoff
    );
    if (freshListings.length < listings.length) {
      await getRedis().set(KV_LISTINGS_KEY, freshListings);
    }

    // Step 8: Log sync event to Redis (M1 fix)
    const durationMs = Date.now() - startTime;
    logEntry = {
      timestamp: new Date().toISOString(),
      durationMs,
      fetched: rawProperties.length,
      stored: freshListings.length,
      purged: purgedCount,
      filteredPermAdv: filteredCount,
      success: true,
    };
    const logKey = `${KV_SYNC_LOG_PREFIX}${Date.now()}`;
    await getRedis().set(logKey, logEntry, { ex: 90 * 24 * 60 * 60 }); // Retain logs 90 days

    // Step 9: Bust ISR cache so pages reflect new data
    revalidateTag("ampre-listings", { expire: 3600 });

    return NextResponse.json({
      success: true,
      fetched: rawProperties.length,
      stored: freshListings.length,
      purged: purgedCount,
      filteredPermAdv: filteredCount,
      durationMs,
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
      filteredPermAdv: 0,
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
