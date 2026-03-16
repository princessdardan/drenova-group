import type { AmpreODataResponse, AmpreProperty, AmpreMedia } from "./types";
import { buildMediaBatchQuery } from "./queries";

/**
 * AMPRE OData HTTP client.
 *
 * This client is used EXCLUSIVELY by the daily sync job (`/api/ampre/sync`).
 * It must never be imported by pages or components — all user-facing reads
 * go through Vercel KV via `@/lib/ampre/fetch`.
 *
 * Error messages intentionally omit response bodies to prevent
 * MLS data from leaking into logs (§4 confidentiality).
 */

class AmpreError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = "AmpreError";
  }
}

function getBaseUrl(): string {
  const url = process.env.AMPRE_API_BASE_URL;
  if (!url) throw new AmpreError("AMPRE_API_BASE_URL is not configured");
  return url.replace(/\/$/, "");
}

function getToken(): string {
  const token = process.env.AMPRE_API_TOKEN;
  if (!token) throw new AmpreError("AMPRE_API_TOKEN is not configured");
  return token;
}

/**
 * Generic OData resource fetcher with pagination.
 *
 * Follows `@odata.nextLink` until exhausted, collecting all records into
 * a single array. Used by both Property and Media fetchers.
 */
async function fetchAmpreResource<T>(
  resource: string,
  query: string
): Promise<T[]> {
  const baseUrl = getBaseUrl();
  const token = getToken();
  const results: T[] = [];

  let url: string | null = `${baseUrl}/${resource}?${query}`;

  while (url) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      // Do NOT log response body — may contain MLS data (§4)
      throw new AmpreError(
        `AMPRE API returned ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data: AmpreODataResponse<T> = await response.json();
    results.push(...data.value);

    url = data["@odata.nextLink"] ?? null;
  }

  return results;
}

/**
 * Fetch properties from AMPRE OData endpoint.
 *
 * Handles pagination via `@odata.nextLink` to retrieve the full result set
 * in a single invocation. This function is called once per day by the sync job.
 */
export async function fetchAmpreProperties(
  query: string
): Promise<AmpreProperty[]> {
  return fetchAmpreResource<AmpreProperty>("Property", query);
}

/** Default batch size for media requests (keeps OData URLs under ~2000 chars) */
const MEDIA_BATCH_SIZE = 100;

/**
 * Fetch media records for a set of listing keys.
 *
 * Splits keys into batches to stay within OData URL length limits,
 * fetches each batch with full pagination, and accumulates results.
 * Per-batch errors are counted but do not abort the overall fetch —
 * property data without images is better than no sync at all.
 */
export async function fetchAmpreMedia(
  listingKeys: string[],
  batchSize: number = MEDIA_BATCH_SIZE
): Promise<{ media: AmpreMedia[]; errors: number }> {
  if (listingKeys.length === 0) return { media: [], errors: 0 };

  const allMedia: AmpreMedia[] = [];
  let errorCount = 0;

  for (let i = 0; i < listingKeys.length; i += batchSize) {
    const batch = listingKeys.slice(i, i + batchSize);
    const query = buildMediaBatchQuery(batch);

    try {
      const batchMedia = await fetchAmpreResource<AmpreMedia>("Media", query);
      allMedia.push(...batchMedia);
    } catch {
      // Count the error but continue — partial images > no images
      errorCount++;
    }
  }

  return { media: allMedia, errors: errorCount };
}
