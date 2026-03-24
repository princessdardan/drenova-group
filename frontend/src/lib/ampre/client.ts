import type {
  AmpreODataResponse,
  AmpreProperty,
  AmpreMedia,
  BatchError,
} from "./types";
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
 *
 * When `partial` is true, pagination errors return whatever was collected
 * so far instead of throwing. This is used for media fetches where partial
 * images are better than none. Property fetches use `partial: false` (default)
 * to fail hard — we need all properties or the sync is invalid.
 *
 * When `label` is provided, logs progress per page for observability.
 */
async function fetchAmpreResource<T>(
  resource: string,
  query: string,
  partial: boolean = false,
  label?: string
): Promise<T[]> {
  const baseUrl = getBaseUrl();
  const token = getToken();
  const results: T[] = [];
  let page = 0;

  let url: string | null = `${baseUrl}/${resource}?${query}`;

  while (url) {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        if (partial) break; // stop paginating, keep what we have
        // Do NOT log response body — may contain MLS data (§4)
        throw new AmpreError(
          `AMPRE API returned ${response.status} ${response.statusText}`,
          response.status
        );
      }

      const data: AmpreODataResponse<T> = await response.json();
      results.push(...data.value);
      page++;

      if (label) {
        console.log(
          `[ampre] ${label} page ${page}: +${data.value.length} (${results.length} total)`
        );
      }

      url = data["@odata.nextLink"] ?? null;
    } catch (error) {
      if (partial) break; // network error — keep partial results
      throw error;
    }
  }

  return results;
}

/**
 * Execute async tasks with bounded concurrency (worker-pool pattern).
 *
 * Maintains up to `concurrency` in-flight promises at all times.
 * Uses `Promise.allSettled` so one failure doesn't abort the rest.
 */
async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = [];
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      const result = await fn(items[index], index).then(
        (value) => ({ status: "fulfilled" as const, value }),
        (reason) => ({ status: "rejected" as const, reason })
      );
      results[index] = result;
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker()
  );
  await Promise.all(workers);

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
  return fetchAmpreResource<AmpreProperty>("Property", query, false, "Property");
}

/** Default batch size for media requests (keeps OData URLs under ~2000 chars) */
const MEDIA_BATCH_SIZE = 25;

/** Number of media batches to fetch concurrently */
const MEDIA_CONCURRENCY = 3;

/**
 * Fetch media records for a set of listing keys.
 *
 * Splits keys into batches to stay within OData URL length limits,
 * fetches batches concurrently (up to MEDIA_CONCURRENCY workers) with
 * full pagination per batch. Per-batch errors are counted but do not
 * abort the overall fetch — property data without images is better
 * than no sync at all.
 *
 * Uses `partial: true` for pagination so a mid-page failure returns
 * whatever was collected rather than losing the entire batch.
 */
export async function fetchAmpreMedia(
  listingKeys: string[],
  batchSize: number = MEDIA_BATCH_SIZE
): Promise<{ media: AmpreMedia[]; errors: number; batchErrors: BatchError[] }> {
  if (listingKeys.length === 0) return { media: [], errors: 0, batchErrors: [] };

  // Split listing keys into batch arrays upfront
  const batches: string[][] = [];
  for (let i = 0; i < listingKeys.length; i += batchSize) {
    batches.push(listingKeys.slice(i, i + batchSize));
  }

  const totalBatches = batches.length;

  // Fetch batches concurrently with bounded concurrency
  const settled = await mapWithConcurrency(
    batches,
    MEDIA_CONCURRENCY,
    async (batch, index) => {
      const batchNumber = index + 1;
      const query = buildMediaBatchQuery(batch);
      return fetchAmpreResource<AmpreMedia>(
        "Media",
        query,
        true, // partial: return whatever was fetched before failure
        `Media batch ${batchNumber}/${totalBatches}`
      );
    }
  );

  // Collect results and errors
  const allMedia: AmpreMedia[] = [];
  const batchErrors: BatchError[] = [];
  let errorCount = 0;

  for (let i = 0; i < settled.length; i++) {
    const result = settled[i];
    if (result.status === "fulfilled") {
      allMedia.push(...result.value);
    } else {
      const msg =
        result.reason instanceof Error
          ? result.reason.message
          : "Unknown error";
      console.error(
        `[ampre] Media batch ${i + 1} failed (${batches[i].length} listings): ${msg}`
      );
      batchErrors.push({
        batch: i + 1,
        listingCount: batches[i].length,
        error: msg,
      });
      errorCount++;
    }
  }

  return { media: allMedia, errors: errorCount, batchErrors };
}
