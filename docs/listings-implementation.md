# Listings System — Implementation Reference

> **Audience:** Developers who need to understand, debug, or extend the listings data pipeline.
>
> **Related docs:**
> - [`ampre-integration-prd.md`](ampre-integration-prd.md) — Product requirements for AMPRE integration
> - [`ampre-data-license-guidelines.md`](ampre-data-license-guidelines.md) — PropTx Data License rules and restrictions
> - [`ampre-compliance-implementation.md`](ampre-compliance-implementation.md) — Compliance rule mapping and enforcement details
>
> This document explains **how the system works end-to-end** — from AMPRE API to rendered page — as a single reference. The docs above cover *why* and *what*; this doc covers *how*.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [AMPRE MLS API](#3-ampre-mls-api)
4. [OData Query Builder](#4-odata-query-builder)
5. [Daily Sync Pipeline](#5-daily-sync-pipeline)
6. [Data Transformation (Mapper)](#6-data-transformation-mapper)
7. [Compliance Framework](#7-compliance-framework)
8. [Redis Data Layer](#8-redis-data-layer)
9. [Fetch Layer](#9-fetch-layer)
10. [Type Definitions](#10-type-definitions)
11. [Listings Page (`/listings`)](#11-listings-page-listings)
12. [Listing Detail Page (`/listings/[slug]`)](#12-listing-detail-page-listingsslug)
13. [Components](#13-components)
14. [Sanity CMS Integration](#14-sanity-cms-integration)
15. [ISR & Caching Strategy](#15-isr--caching-strategy)
16. [Environment Variables](#16-environment-variables)
17. [Known Gaps & Technical Debt](#17-known-gaps--technical-debt)

---

## 1. Overview

The listings system displays real estate listings sourced from AMPRE, an MLS (Multiple Listing Service) OData API. Listings are **never fetched on user request** — they follow a daily sync pattern:

```
AMPRE API  →  Cron Sync Job  →  Upstash Redis  →  Fetch Layer  →  Next.js Pages
  (write path, once/day)          (data store)     (read path, every request)
```

**Key architectural decisions:**

- **Write path** — A Vercel Cron job (`POST /api/ampre/sync`) runs once daily at 06:00 UTC. It fetches all active listings from AMPRE, filters and maps them, and stores the result in Redis as a single JSON array.
- **Read path** — Page requests read from Redis only. Filtering, sorting, and pagination happen in-memory on the server.
- **Compliance** — The PropTx Data License governs data retrieval frequency, display rules, retention limits, and AI/ML prohibitions. Compliance is enforced at multiple layers.
- **Sanity CMS** — Provides editorial metadata only (page titles, overlines, featured listing keys). Listing data itself lives exclusively in Redis.

---

## 2. Architecture Diagram

### Write Path (Daily Sync)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Vercel Cron (06:00 UTC daily)                                           │
│ vercel.json: { "path": "/api/ampre/sync", "schedule": "0 6 * * *" }    │
└──────────────┬───────────────────────────────────────────────────────────┘
               │ POST /api/ampre/sync
               │ Authorization: Bearer $CRON_SECRET
               ▼
┌──────────────────────────────┐
│ Sync Route Handler           │
│ app/api/ampre/sync/route.ts  │
└──────────────┬───────────────┘
               │
    ┌──────────┼────────────────────────────────────────────┐
    │          ▼                                            │
    │  ┌───────────────┐   OData v4.0                      │
    │  │ AMPRE API     │◄─── $select (27 fields)           │
    │  │ /Property     │     $filter (StandardStatus=Active)│
    │  └───────┬───────┘     $orderby (ModificationTimestamp│
    │          │              desc)                         │
    │          │ paginate via @odata.nextLink               │
    │          ▼                                            │
    │  ┌───────────────────────┐                            │
    │  │ filterPermittedProps  │ perm_adv=N → discard       │
    │  └───────┬───────────────┘                            │
    │          ▼                                            │
    │  ┌───────────────────────┐                            │
    │  │ mapAmpreToListing     │ disp_addr=N → suppress addr│
    │  └───────┬───────────────┘                            │
    │          ▼                                            │
    │  ┌───────────────────────┐                            │
    │  │ Upstash Redis         │                            │
    │  │ SET listings:all      │ Full Listing[] array       │
    │  │ SET sync:log:{ts}     │ Audit log (90-day TTL)     │
    │  └───────┬───────────────┘                            │
    │          ▼                                            │
    │  revalidateTag("ampre-listings")                      │
    │                                                       │
    └───────────────────────────────────────────────────────┘
```

### Read Path (Page Requests)

```
┌─────────────┐   GET /listings?city=Toronto&minBeds=3
│  Browser    │──────────────────────────────────────────┐
└─────────────┘                                          │
                                                         ▼
                                              ┌──────────────────┐
                                              │ /listings page   │
                                              │ (Server Component)│
                                              └────────┬─────────┘
                                                       │
                                 ┌─────────────────────┼────────────────┐
                                 │                     │                │
                                 ▼                     ▼                ▼
                          ┌────────────┐     ┌──────────────┐   ┌───────────┐
                          │ getAmpre   │     │ getAmpre     │   │ Sanity    │
                          │ Listings() │     │ ListingCities│   │ getList   │
                          │            │     │ () / Types() │   │ ingsPage()│
                          └─────┬──────┘     └──────┬───────┘   └───────────┘
                                │                   │
                                ▼                   ▼
                          ┌──────────────────────────────────┐
                          │ Upstash Redis                    │
                          │ GET listings:all → Listing[]     │
                          │                                  │
                          │ In-memory:                       │
                          │   filter → sort → paginate       │
                          └──────────────────────────────────┘
```

---

## 3. AMPRE MLS API

**File:** `frontend/src/lib/ampre/client.ts`

AMPRE exposes an OData v4.0 REST API for property data. The client is intentionally minimal — it exists only to serve the daily sync job.

### Authentication

```
Authorization: Bearer $AMPRE_API_TOKEN
Accept: application/json
```

### Endpoint

```
GET {AMPRE_API_BASE_URL}/Property?{OData query}
```

### Pagination

AMPRE paginates responses using the `@odata.nextLink` field. The client follows next-links until exhausted:

```typescript
export async function fetchAmpreProperties(
  query: string
): Promise<AmpreResponse["value"]>
```

Each page response has the shape:

```typescript
interface AmpreResponse {
  "@odata.context"?: string;
  "@odata.count"?: number;
  "@odata.nextLink"?: string;   // Follow this for next page
  value: AmpreProperty[];
}
```

### Error Handling

Errors throw `AmpreError` with the HTTP status code. Response bodies are intentionally **not logged** to prevent MLS data from leaking into logs (§4 confidentiality):

```typescript
class AmpreError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) { ... }
}
```

### Security Constraints

- This client is used **exclusively** by the sync route — never imported by pages or components
- All user-facing reads go through Redis via `@/lib/ampre/fetch`
- `cache: "no-store"` is set on every fetch to prevent Next.js caching of API responses

---

## 4. OData Query Builder

**File:** `frontend/src/lib/ampre/queries.ts`

The query builder creates a single "fetch all brokerage listings" query. User-facing filters are applied in-memory after reading from Redis — **not** as OData query parameters.

### Function Signature

```typescript
export function buildSyncQuery(): string
```

Returns a URL-encoded query string with three parameters:

| Parameter    | Value                                   | Purpose                         |
|-------------|------------------------------------------|----------------------------------|
| `$select`   | 27 fields (see below)                    | Fetch only needed fields         |
| `$filter`   | `StandardStatus eq 'Active'`             | Active listings only             |
| `$orderby`  | `ModificationTimestamp desc`             | Consistent pagination ordering   |

### Selected Fields (27)

The `PROPERTY_SELECT_FIELDS` array includes fields from the `AmpreProperty` interface plus three compliance-required fields from `REQUIRED_SELECT_FIELDS`:

| Category     | Fields |
|-------------|--------|
| Identity     | `ListingKey`, `ListingId` |
| Price        | `ListPrice`, `OriginalListPrice` |
| Address      | `UnparsedAddress`, `StreetNumber`, `StreetName`, `StreetSuffix`, `City`, `StateOrProvince`, `PostalCode`, `Country` |
| Location     | `Latitude`, `Longitude` |
| Details      | `BedroomsTotal`, `BathroomsTotalInteger`, `LivingArea`, `LotSizeArea`, `PropertyType`, `PropertySubType`, `YearBuilt`, `PublicRemarks` |
| Status       | `StandardStatus`, `MlsStatus`, `ListingContractDate`, `ModificationTimestamp` |
| Media        | `Media` (nested array of `AmpreMedia`) |
| Brokerage    | `ListOfficeName`, `ListAgentFullName` |
| Compliance   | `perm_adv`, `disp_addr`, `ModificationTimestamp` (via `REQUIRED_SELECT_FIELDS`) |

> **Note:** `ModificationTimestamp` appears in both the Status and Compliance categories. It's deduplicated in the OData query since it's the same field.

---

## 5. Daily Sync Pipeline

**File:** `frontend/src/app/api/ampre/sync/route.ts`

The sync job is a `POST` route triggered by Vercel Cron. It is the **only code path** that calls the AMPRE API.

### Cron Configuration

**File:** `frontend/vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/ampre/sync",
      "schedule": "0 6 * * *"
    }
  ]
}
```

Schedule: Daily at 06:00 UTC.

### Authentication

Vercel Cron sends the `CRON_SECRET` automatically as a Bearer token:

```typescript
const authHeader = request.headers.get("authorization");
const cronSecret = process.env.CRON_SECRET;

if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### Pipeline Steps

| Step | Action | Compliance Rule |
|------|--------|----------------|
| 1 | Build OData query via `buildSyncQuery()` | — |
| 2 | Fetch all pages from AMPRE via `fetchAmpreProperties()` | C1 (single daily retrieval) |
| 3 | Filter out `perm_adv === "N"` via `filterPermittedProperties()` | C2 (display control) |
| 4 | Map to `Listing[]` via `mapAmpreToListing()` (handles `disp_addr` suppression) | C2 (address suppression) |
| 5 | Load existing listings from Redis for stale-data comparison | — |
| 6 | Store mapped listings in Redis (`listings:all`) | — |
| 7 | Count purged entries (in Redis but not in AMPRE response) | C3 (retention) |
| 8 | Secondary retention safety net — filter out listings with `lastSeen` > 60 days | C3 (retention) |
| 9 | Log sync event to Redis (`sync:log:{timestamp}`, 90-day TTL) | M1 (audit) |
| 10 | Bust ISR cache via `revalidateTag("ampre-listings")` | — |

### Success Response

```json
{
  "success": true,
  "fetched": 150,
  "stored": 148,
  "purged": 2,
  "filteredPermAdv": 3,
  "durationMs": 4521
}
```

### Error Handling

On failure, the route **always attempts to write a sync log** — even if Redis itself is down (that failure is silently caught):

```typescript
catch (error) {
  // Log failure to Redis
  const logKey = `${KV_SYNC_LOG_PREFIX}${Date.now()}`;
  try {
    await redis.set(logKey, logEntry, { ex: 90 * 24 * 60 * 60 });
  } catch {
    // If Redis itself is down — fail gracefully
  }

  return NextResponse.json(
    { error: "Sync failed", message: errorMessage },
    { status: 500 }
  );
}
```

### Redis Client Note

The sync route instantiates `Redis.fromEnv()` at **module scope** (top of file), unlike the fetch layer which checks `isKvConfigured()` first. This means the sync route will throw at import time if Redis env vars are missing.

---

## 6. Data Transformation (Mapper)

**File:** `frontend/src/lib/ampre/mapper.ts`

### `mapAmpreToListing(property: AmpreProperty): Listing`

Maps a raw AMPRE property to the internal `Listing` type. This function handles address suppression inline.

#### Field Mapping

| AMPRE Field | Listing Field | Transformation |
|------------|---------------|----------------|
| `ListingKey` | `id`, `listingKey` | Direct copy (used as both ID and key) |
| Computed | `slug` | See [Slug Generation](#slug-generation) below |
| `ListPrice` | `price` | Direct copy |
| `OriginalListPrice` | `originalListPrice` | Direct copy (optional) |
| `UnparsedAddress` / `StreetNumber+Name+Suffix` | `address` | See [Address Building](#address-building) below; empty string if `disp_addr === "N"` |
| `City` | `city` | Direct copy |
| `StateOrProvince` | `province` | Direct copy |
| `PostalCode` | `postalCode` | Direct copy |
| `BedroomsTotal` | `beds` | Default `0` |
| `BathroomsTotalInteger` | `baths` | Default `0` |
| `LivingArea` | `sqft` | Default `0` |
| `LotSizeArea` | `lotSize` | Direct copy (optional) |
| `Media[0].MediaURL` | `image` | Primary image sorted by `Order` |
| `Media[*].MediaURL` | `images` | All images sorted by `Order` |
| `StandardStatus` | `status` | Direct copy |
| `PropertyType` | `propertyType` | Default `"Residential"` |
| `PropertySubType` | `propertySubType` | Direct copy (optional) |
| `YearBuilt` | `yearBuilt` | Direct copy (optional) |
| `PublicRemarks` | `description` | Direct copy (optional) |
| `ListOfficeName` | `listOfficeName` | Direct copy (optional) |
| `ListAgentFullName` | `listAgentName` | Direct copy (optional) |
| `Latitude` | `latitude` | `null` if `disp_addr === "N"` |
| `Longitude` | `longitude` | `null` if `disp_addr === "N"` |
| `ModificationTimestamp` | `modificationTimestamp` | Direct copy |
| Computed | `lastSeen` | `new Date().toISOString()` at sync time |
| `disp_addr` | `addressSuppressed` | `true` if `disp_addr === "N"`, otherwise `undefined` |

### Address Building

```typescript
function buildAddress(property: AmpreProperty): string {
  if (property.UnparsedAddress) return property.UnparsedAddress;

  const parts = [
    property.StreetNumber,
    property.StreetName,
    property.StreetSuffix,
  ].filter(Boolean);

  return parts.join(" ");
}
```

Prefers `UnparsedAddress` (the full address as a single string). Falls back to concatenating `StreetNumber`, `StreetName`, `StreetSuffix`.

### Slug Generation

```typescript
function buildSlug(property: AmpreProperty): string {
  const address = buildAddress(property);
  const parts = [address, property.City, property.StateOrProvince].filter(Boolean);
  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")   // Non-alphanumeric → hyphens
    .replace(/^-|-$/g, "");          // Trim leading/trailing hyphens
}
```

Example: `"123 Maple Drive"` + `"Toronto"` + `"ON"` → `"123-maple-drive-toronto-on"`

### Image Extraction

Images are sorted by the `Order` field (ascending, defaulting to `999` when undefined). The primary image is `sorted[0].MediaURL`; the full array is all `MediaURL` values after sorting.

### Address Suppression Logic

When `disp_addr === "N"`:
- `address` → empty string `""`
- `latitude` → `null`
- `longitude` → `null`
- `addressSuppressed` → `true`

This happens at the mapping layer (server-side), so suppressed addresses never reach the client, page source, or meta tags.

### `filterPermittedProperties(properties: AmpreProperty[])`

Called **before** mapping. Filters out any property where `perm_adv === "N"` — these must not be stored or displayed at all:

```typescript
export function filterPermittedProperties(
  properties: AmpreProperty[]
): { permitted: AmpreProperty[]; filteredCount: number }
```

---

## 7. Compliance Framework

**File:** `frontend/src/lib/ampre/compliance.ts`

All compliance rules derive from the PropTx Data License Agreement. See [`ampre-compliance-implementation.md`](ampre-compliance-implementation.md) for the full rule-by-rule mapping and [`ampre-data-license-guidelines.md`](ampre-data-license-guidelines.md) for the license text.

### Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `MAX_RETRIEVAL_INTERVAL_HOURS` | `24` | Maximum hours between AMPRE API calls (§3.a) |
| `MAX_RETENTION_DAYS` | `60` | Maximum days to retain data after last sync (§1.d) |
| `AI_PROHIBITION_NOTICE` | String | Warning that MLS data must not be used for AI/ML (§1.e) |
| `REQUIRED_SELECT_FIELDS` | `["perm_adv", "disp_addr", "ModificationTimestamp"]` | Must be in every `$select` |
| `KV_LISTINGS_KEY` | `"listings:all"` | Redis key for the listings array |
| `KV_SYNC_LOG_PREFIX` | `"sync:log:"` | Redis key prefix for audit log entries |

### Rule Summary

| Rule | Description | Where Enforced | How to Verify |
|------|------------|----------------|---------------|
| **C1** — Retrieval limit | Max 1 AMPRE API call per 24 hours | Cron schedule in `vercel.json` (daily at 06:00 UTC); `fetchAmpreProperties()` is only called from sync route | Check cron schedule; grep for imports of `client.ts` |
| **C2** — Display fields | `perm_adv=N` → exclude entirely; `disp_addr=N` → suppress address/coords | `filterPermittedProperties()` in `mapper.ts`; `mapAmpreToListing()` address suppression; `PropertyCard` and detail page UI | Run sync, check that perm_adv=N listings are absent from Redis; check that disp_addr=N listings have empty addresses |
| **C3** — Retention | Data must be refreshed or purged within 60 days of last retrieval | Sync route step 8: filters listings with `lastSeen` > `MAX_RETENTION_DAYS` | Check `lastSeen` timestamps in Redis data |
| **M1** — Audit | All sync events must be logged with timestamps and counts | Sync route writes `SyncLogEntry` to Redis with 90-day TTL | Query Redis for `sync:log:*` keys |
| **M2** — AI isolation | MLS data must not be used for AI/ML training or inference | `AI_PROHIBITION_NOTICE` constant; documented in `compliance.ts` | Code review — ensure no ML pipelines consume Redis listing data |
| **M3** — Error logging | Errors must be logged even when sync fails | Sync route try/catch always attempts to write log entry | Trigger a sync failure, verify log entry exists |

---

## 8. Redis Data Layer

**File:** `frontend/src/lib/ampre/fetch.ts` (consumer), `frontend/src/lib/ampre/compliance.ts` (key constants), `frontend/src/app/api/ampre/sync/route.ts` (producer)

### Client Setup

The fetch layer creates a Redis client per-request via `Redis.fromEnv()`:

```typescript
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
```

Required environment variables:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### Data Keys

| Key Pattern | Type | TTL | Purpose | Producer | Consumer |
|------------|------|-----|---------|----------|----------|
| `listings:all` | `Listing[]` (JSON) | None | Full listing dataset | Sync route | Fetch layer |
| `sync:log:{timestamp}` | `SyncLogEntry` (JSON) | 90 days | Audit log entry | Sync route | Monitoring |

### Graceful Degradation

When Redis env vars aren't configured (e.g., local development without Redis), the fetch layer returns empty results instead of crashing:

```typescript
function isKvConfigured(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function getAllListingsFromKV(): Promise<Listing[]> {
  if (!isKvConfigured()) return [];
  const redis = Redis.fromEnv();
  return (await redis.get<Listing[]>(KV_LISTINGS_KEY)) ?? [];
}
```

### Performance Characteristics

- **No secondary indexes** — All lookups (by slug, by key, cities, property types) deserialize the full `listings:all` array and perform linear scans
- **Single key** — The entire dataset is stored as one JSON value, read in full on every request
- This is efficient because the dataset is small (a single brokerage's listings, typically <500 properties)

---

## 9. Fetch Layer

**File:** `frontend/src/lib/ampre/fetch.ts`

All functions read from Upstash Redis. None call the AMPRE API. This is the **only module** that pages and components should import for listing data.

### Functions

#### `getAmpreListings(filters?: ListingFilters): Promise<PaginatedListings>`

The primary query function. Reads all listings from Redis, then applies in-memory filtering, sorting, and pagination.

```
Redis GET → applyFilters() → applySort() → slice for page → return
```

#### `getAmpreListingBySlug(slug: string): Promise<Listing | null>`

Single-listing lookup by slug. Used by the detail page.

#### `getAmpreListingByKey(key: string): Promise<Listing | null>`

Single-listing lookup by AMPRE `ListingKey`. Used for featured listings.

#### `getAmpreListingCities(): Promise<string[]>`

Returns sorted, unique city names from current listings. Used to populate the city filter dropdown.

#### `getAmpreListingPropertyTypes(): Promise<string[]>`

Returns sorted, unique property types from current listings. Used to populate the property type filter dropdown.

### Interfaces

```typescript
export interface ListingFilters {
  propertyType?: string;      // Exact match (case-insensitive)
  minBeds?: number;            // listings.beds >= minBeds
  minPrice?: number;           // listings.price >= minPrice
  maxPrice?: number;           // listings.price <= maxPrice
  city?: string;               // Exact match (case-insensitive)
  sort?: "price-asc" | "price-desc" | "newest";
  page?: number;               // 1-indexed, default 1
  pageSize?: number;           // Default 12
}

export interface PaginatedListings {
  listings: Listing[];         // Current page's listings
  total: number;               // Total after filtering (before pagination)
  page: number;                // Current page number
  pageSize: number;            // Items per page
  totalPages: number;          // ceil(total / pageSize), minimum 1
}
```

### In-Memory Filtering Logic

Filters are applied sequentially. All string comparisons are case-insensitive:

```typescript
function applyFilters(listings: Listing[], filters: ListingFilters): Listing[] {
  let result = listings;

  if (filters.propertyType)
    result = result.filter(l => l.propertyType.toLowerCase() === filters.propertyType!.toLowerCase());

  if (filters.minBeds)
    result = result.filter(l => l.beds >= filters.minBeds!);

  if (filters.minPrice)
    result = result.filter(l => l.price >= filters.minPrice!);

  if (filters.maxPrice)
    result = result.filter(l => l.price <= filters.maxPrice!);

  if (filters.city)
    result = result.filter(l => l.city.toLowerCase() === filters.city!.toLowerCase());

  return result;
}
```

### Sorting

```typescript
function applySort(listings: Listing[], sort?: ListingFilters["sort"]): Listing[] {
  switch (sort) {
    case "price-asc":  sorted.sort((a, b) => a.price - b.price); break;
    case "price-desc": sorted.sort((a, b) => b.price - a.price); break;
    case "newest":     sorted.sort((a, b) =>
      new Date(b.modificationTimestamp).getTime() - new Date(a.modificationTimestamp).getTime()
    ); break;
  }
}
```

### Pagination

Slice-based with a default page size of 12:

```typescript
const DEFAULT_PAGE_SIZE = 12;

const page = filters.page ?? 1;
const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
const start = (page - 1) * pageSize;
const listings = sorted.slice(start, start + pageSize);
```

---

## 10. Type Definitions

### `Listing` (29 fields)

**File:** `frontend/src/types/listing.ts`

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| `id` | `string` | `ListingKey` | Same as `listingKey` |
| `slug` | `string` | Computed | Address + city + province, slugified |
| `price` | `number` | `ListPrice` | |
| `address` | `string` | `UnparsedAddress` or parts | Empty string when address suppressed |
| `city` | `string` | `City` | |
| `province` | `string` | `StateOrProvince` | |
| `postalCode` | `string` | `PostalCode` | |
| `beds` | `number` | `BedroomsTotal` | Default `0` |
| `baths` | `number` | `BathroomsTotalInteger` | Default `0` |
| `sqft` | `number` | `LivingArea` | Default `0` |
| `image` | `string` | `Media[0].MediaURL` | Primary image (sorted by `Order`) |
| `images` | `string[]` (optional) | `Media[*].MediaURL` | All images sorted |
| `status` | `string` | `StandardStatus` | |
| `propertyType` | `string` | `PropertyType` | Default `"Residential"` |
| `propertySubType` | `string` (optional) | `PropertySubType` | |
| `yearBuilt` | `number` (optional) | `YearBuilt` | |
| `lotSize` | `number` (optional) | `LotSizeArea` | |
| `description` | `string` (optional) | `PublicRemarks` | |
| `listOfficeName` | `string` (optional) | `ListOfficeName` | |
| `listAgentName` | `string` (optional) | `ListAgentFullName` | |
| `originalListPrice` | `number` (optional) | `OriginalListPrice` | |
| `latitude` | `number \| null` (optional) | `Latitude` | `null` when address suppressed |
| `longitude` | `number \| null` (optional) | `Longitude` | `null` when address suppressed |
| `listingKey` | `string` | `ListingKey` | AMPRE's unique identifier |
| `modificationTimestamp` | `string` | `ModificationTimestamp` | ISO 8601 |
| `lastSeen` | `string` | Computed | Set to current time at sync |
| `addressSuppressed` | `boolean` (optional) | `disp_addr` | `true` when `disp_addr === "N"` |

### `AmpreProperty`

**File:** `frontend/src/lib/ampre/types.ts`

Raw OData representation. 28 fields following CREA DDF / RESO standard. See [Section 3](#3-ampre-mls-api) for the interface definition.

### `AmpreMedia`

**File:** `frontend/src/lib/ampre/types.ts`

```typescript
export interface AmpreMedia {
  MediaURL: string;
  MediaCategory?: string;
  Order?: number;
  ShortDescription?: string;
}
```

### `SyncLogEntry`

**File:** `frontend/src/lib/ampre/types.ts`

```typescript
export interface SyncLogEntry {
  timestamp: string;       // ISO 8601
  durationMs: number;      // Sync execution time
  fetched: number;         // Raw properties from AMPRE
  stored: number;          // Properties saved to Redis
  purged: number;          // Properties removed (in Redis but not in AMPRE)
  filteredPermAdv: number; // Properties excluded (perm_adv=N)
  success: boolean;
  error?: string;          // Present on failure
}
```

### `ListingFilters` and `PaginatedListings`

**File:** `frontend/src/lib/ampre/fetch.ts`

See [Section 9](#9-fetch-layer) for full definitions.

---

## 11. Listings Page (`/listings`)

**File:** `frontend/src/app/listings/page.tsx`

### Data Flow

```
URL search params
    │
    ▼
parseFilters() → ListingFilters
    │
    ▼
Promise.all([
  getAmpreListings(filters),     // AMPRE listings from Redis
  getAmpreListingCities(),       // City dropdown options
  getAmpreListingPropertyTypes(),// Property type dropdown options
  getListingsPage(),             // Sanity editorial metadata
])
    │
    ▼
Render: Header (from Sanity) + ListingFilters + ListingsGrid + Pagination
```

### `parseFilters(params): ListingFilters`

Converts URL search params to the `ListingFilters` interface. All values come from query strings:

| URL Param | ListingFilters Field | Conversion |
|-----------|---------------------|------------|
| `propertyType` | `propertyType` | String direct |
| `minBeds` | `minBeds` | `Number()` |
| `minPrice` | `minPrice` | `Number()` |
| `maxPrice` | `maxPrice` | `Number()` |
| `city` | `city` | String direct |
| `sort` | `sort` | Cast to `"price-asc" \| "price-desc" \| "newest"` |
| `page` | `page` | `Number()`, default `1` |

### Component Structure

```
ListingsPage (Server Component — default export)
├── Section: Page header
│   ├── Overline (from Sanity: listingsPage.overline ?? "Properties")
│   └── Title (from Sanity: listingsPage.title ?? "All Listings")
└── Suspense boundary ("Loading listings...")
    └── ListingsGrid (async Server Component)
        ├── ListingFilters (Client Component)
        ├── Property cards grid (or empty state)
        └── Pagination nav
```

### Pagination UI

Pagination links preserve all active filters by reconstructing the query string:

```typescript
href={`/listings?${new URLSearchParams({
  ...(filters.propertyType ? { propertyType: filters.propertyType } : {}),
  ...(filters.minBeds ? { minBeds: String(filters.minBeds) } : {}),
  ...(filters.maxPrice ? { maxPrice: String(filters.maxPrice) } : {}),
  ...(filters.city ? { city: filters.city } : {}),
  ...(filters.sort ? { sort: filters.sort } : {}),
  page: String(pageNum),
}).toString()}`}
```

### Empty State

When no listings match filters, shows a message and a "Clear all filters" link to `/listings`.

---

## 12. Listing Detail Page (`/listings/[slug]`)

**File:** `frontend/src/app/listings/[slug]/page.tsx`

### Route Params

```typescript
interface ListingDetailProps {
  params: Promise<{ slug: string }>;
}
```

### `generateMetadata()` — SEO

Generates title and description based on listing data. **Respects address suppression:**

| Condition | Title | Description |
|-----------|-------|-------------|
| Address visible | `"123 Maple Dr, Toronto, ON"` | `"3 bed, 2 bath at 123 Maple Dr, Toronto, ON. $500,000."` |
| Address suppressed | `"Property in Toronto, ON"` | `"3 bed, 2 bath property in Toronto, ON. $500,000."` |
| Not found | `"Listing Not Found"` | — |

### Content Sections

1. **Hero Gallery** — Full-width primary image (`aspect-[16/9] lg:aspect-[21/9]`)
2. **Key Stats** — Beds, baths, sqft in a 3-column grid
3. **Property Details** — Property type, sub-type, year built, lot size, MLS # (in `font-mono`)
4. **Description** — `PublicRemarks` text
5. **Agent Info** — Sidebar with agent name, office, and "Request Information" CTA linking to `/contact`
6. **Gallery** — Additional images (all except the first) in a responsive grid

### Address Suppression Display

When `addressSuppressed === true`:
- Hero image alt: `"Property in {city}, {province}"` (no street address)
- Title: Shows price only (`formatPrice(listing.price)`)
- Location line: `"{city}, {province} {postalCode}"` (no street address)
- Normal display: `"{address} — {price}"` for title, full address for location

---

## 13. Components

### ListingFilters

**File:** `frontend/src/components/ui/listing-filters.tsx`

A `"use client"` component that manages filter state via URL search params.

**Props:**

```typescript
interface ListingFiltersProps {
  cities: string[];          // From getAmpreListingCities()
  propertyTypes: string[];   // From getAmpreListingPropertyTypes()
  total: number;             // Total listings matching current filters
}
```

**State management:** Uses `useRouter()` and `useSearchParams()` from `next/navigation`. When a filter changes, it updates the URL query string and navigates — triggering a server-side re-render with new data.

**Filter controls:**

| Control | Type | Options |
|---------|------|---------|
| Property Type | Dropdown | Dynamic from `propertyTypes` prop |
| Bedrooms | Dropdown | Static: 1+, 2+, 3+, 4+ |
| Price | Dropdown | Static: Under $300k, $500k, $750k, $1M |
| City | Dropdown | Dynamic from `cities` prop |
| Sort | Dropdown | Price Low→High, Price High→Low, Newest |
| Clear | Button | Shown when `activeFilterCount > 0`, navigates to `/listings` |

**Behavior:**
- Changing any filter (except page) resets `page` to 1
- Active filter count badge excludes `sort` from the count
- Total listings display: `"{total} property"` / `"{total} properties"`

### PropertyCard

**File:** `frontend/src/components/ui/property-card.tsx`

Server component that renders a single listing card.

**Props:**

```typescript
interface PropertyCardProps {
  listing: Listing;
}
```

**Content:**
- Image with hover zoom (`group-hover:scale-105`)
- Status badge (if not "Active")
- Price (via `formatPrice()`)
- Address or "Address withheld" (italic, muted) when suppressed
- City, province, postal code
- Beds, baths, sqft stats

**Image handling:**
- Shows listing image via `next/image` with responsive `sizes`
- Falls back to "No image available" placeholder when `listing.image` is empty

**Links to:** `/listings/{listing.slug}`

---

## 14. Sanity CMS Integration

### Role

Sanity provides **editorial metadata only** for listings pages. Listing data itself comes exclusively from Redis (sourced from AMPRE).

Sanity content used:
- `listingsPage` singleton: `overline`, `title`, `featuredListingKeys`
- `homePage` singleton: `featuredListingKeys` (planned, not implemented)

### GROQ Query

**File:** `frontend/src/lib/sanity/queries.ts`

```groq
*[_type == "listingsPage"][0] {
  _id,
  _type,
  overline,
  title,
  featuredListingKeys
}
```

### Fetch Function

**File:** `frontend/src/lib/sanity/fetch.ts`

```typescript
export function getListingsPage(): Promise<ListingsPage | null> {
  return sanityFetch<ListingsPage | null>(listingsPageQuery, ["listingsPage"]);
}
```

Uses ISR tag `"listingsPage"` with a default revalidation of 3600 seconds.

### TypeScript Interface

**File:** `frontend/src/types/sanity.ts`

```typescript
export interface ListingsPage {
  _id: string;
  _type: "listingsPage";
  overline?: string;
  title?: string;
  featuredListingKeys?: string[];
}
```

### Sanity Schema

**File:** `backend/schemaTypes/singletons/listings-page.ts`

Defines the `listingsPage` document type with fields: `overline` (string), `title` (string), `featuredListingKeys` (array of strings).

### Deregistered Listing Schema

**File:** `backend/schemaTypes/documents/listing.ts` (exists but **not imported**)

A Sanity document schema for listings was originally created but is **not registered** in `backend/schemaTypes/index.ts`. The file exists on disk but is not imported or included in the `schemaTypes` array. Listings are stored in Redis, not Sanity.

---

## 15. ISR & Caching Strategy

### Sanity Fetches — ISR with Tags

**File:** `frontend/src/lib/sanity/fetch.ts`

All Sanity fetches use a default revalidation of **3600 seconds** (1 hour):

```typescript
const DEFAULT_REVALIDATE = 3600;

return client.fetch<T>(query, params ?? {}, {
  next: { tags, revalidate: DEFAULT_REVALIDATE },
});
```

### Webhook Revalidation

**File:** `frontend/src/app/api/revalidate/route.ts`

When content changes in Sanity, a webhook sends a POST with the document type. The route maps types to ISR cache tags:

```typescript
const TAG_MAP: Record<string, string[]> = {
  listing: ["listing"],
  teamMember: ["teamMember"],
  testimonial: ["testimonial"],
  faq: ["faq"],
  coverageArea: ["coverageArea"],
  companyStat: ["companyStat"],
  companyValue: ["companyValue"],
  valueProposition: ["valueProposition"],
  siteSettings: ["siteSettings"],
  homePage: ["homePage"],
  aboutPage: ["aboutPage"],
  buyPage: ["buyPage"],
  sellPage: ["sellPage"],
};
```

Authenticated via `x-sanity-revalidate-secret` header matching `SANITY_REVALIDATE_SECRET` env var.

### AMPRE Listings Revalidation

The sync route calls `revalidateTag("ampre-listings")` after storing new data. However, no `fetch()` call in the codebase uses this tag — AMPRE listing data is read via `Redis.fromEnv().get()`, which doesn't participate in Next.js ISR caching.

### Draft Mode

**Enable:** `GET /api/draft/enable?secret=$SANITY_PREVIEW_SECRET&redirect=/path`
**Disable:** `GET /api/draft/disable`

When draft mode is enabled, Sanity fetches use `previewClient` (no CDN, `perspective: "drafts"`, authenticated with `SANITY_API_READ_TOKEN`).

### Known Cache Gaps

| Gap | Impact |
|-----|--------|
| `listingsPage` not in `TAG_MAP` | Editing the listings page singleton in Sanity won't trigger revalidation. Must wait for 3600s TTL. |
| `contactPage` not in `TAG_MAP` | Same issue for the contact page singleton. |
| `teamPage` not in `TAG_MAP` | Same issue for the team page singleton. |
| `ampre-listings` tag not used by any `fetch()` | The `revalidateTag("ampre-listings")` call in the sync route has no effect since no Next.js fetch call uses this tag. |

---

## 16. Environment Variables

| Variable | Required? | Used By | Description |
|----------|-----------|---------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | No (defaults to `apggi8zn`) | Sanity client | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | No (defaults to `production`) | Sanity client | Sanity dataset name |
| `SANITY_API_READ_TOKEN` | For preview | Sanity preview client | Read token for draft mode |
| `SANITY_REVALIDATE_SECRET` | For webhooks | Revalidate route | Shared secret for Sanity webhook |
| `SANITY_PREVIEW_SECRET` | For preview | Draft enable route | Shared secret for draft mode |
| `AMPRE_API_BASE_URL` | Yes (for sync) | AMPRE client | OData API base URL |
| `AMPRE_API_TOKEN` | Yes (for sync) | AMPRE client | Bearer token for AMPRE API |
| `UPSTASH_REDIS_REST_URL` | Yes (for prod) | Redis client | Upstash Redis HTTP endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Yes (for prod) | Redis client | Upstash Redis auth token |
| `CRON_SECRET` | Yes (for sync) | Sync route | Vercel Cron authentication |

---

## 17. Known Gaps & Technical Debt

### Unused Code

| Item | Location | Issue |
|------|----------|-------|
| Sanity `listing` schema | `backend/schemaTypes/documents/listing.ts` | File exists but is deregistered (not imported in `index.ts`). Listings use Redis, not Sanity. Can be deleted. |
| `featuredListingKeys` on `homePage` | `frontend/src/types/sanity.ts` | Defined in TypeScript interface and Sanity schema but never consumed by any page component. |
| `featuredListingKeys` on `listingsPage` | `frontend/src/types/sanity.ts` | Fetched from Sanity but never used to filter or pin listings. |

### Missing TAG_MAP Entries

| Sanity Type | ISR Tag | In TAG_MAP? |
|-------------|---------|-------------|
| `listingsPage` | `"listingsPage"` | No |
| `contactPage` | `"contactPage"` | No |
| `teamPage` | `"teamPage"` | No |

These singletons use ISR cache tags in `sanityFetch()` but aren't included in the webhook revalidation `TAG_MAP`. Edits in Sanity Studio won't revalidate until the 3600s TTL expires.

### Cache Disconnect

The sync route calls `revalidateTag("ampre-listings")` but no Next.js `fetch()` call uses the `"ampre-listings"` tag. AMPRE data is read from Redis via `@upstash/redis` (not via `fetch()` with `next: { tags: [...] }`), so the ISR invalidation has no effect. Listing data updates immediately on Redis write regardless.

### Performance

The full `listings:all` JSON array is deserialized from Redis on **every request** that touches listings — including city/type dropdown helpers. For a small brokerage this is fine (<500 listings), but would need secondary indexes (or individual keys) at scale.

### Formatting

`formatPrice()` in `frontend/src/lib/format.ts` uses `"en-US"` locale and `"USD"` currency. Since this is a Canadian brokerage, it should use `"en-CA"` and `"CAD"`.

### Seed Script Mismatch

The seed script references `featuredListingIds` but the Sanity schema and TypeScript types use `featuredListingKeys`. These names are inconsistent.
