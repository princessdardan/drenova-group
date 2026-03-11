# PRD: Vercel KV Deprecation — Storage Migration

> **Date:** 2026-03-11
> **Status:** Draft
> **Related:** `ampre-compliance-implementation.md` · `ampre-data-license-guidelines.md`

---

## 1. Problem Statement

The AMPRE integration uses `@vercel/kv` as a persistent key-value store for MLS listing data. **Vercel KV was deprecated in December 2024** and is no longer available for new projects. Vercel now recommends Redis providers from the Vercel Marketplace, with Upstash Redis as the primary replacement (Vercel KV was built on Upstash internally).

The storage layer must be replaced before the AMPRE integration can be deployed.

---

## 2. Current KV Usage Analysis

### How KV is used

The integration stores and reads a **single JSON array** of listings under one key, plus timestamped audit logs:

| KV Key | Written By | Read By | Purpose |
|--------|-----------|---------|---------|
| `listings:all` | `/api/ampre/sync` (daily cron) | `lib/ampre/fetch.ts` (every page request) | Full array of compliant listings |
| `sync:log:{timestamp}` | `/api/ampre/sync` | Admin/audit (future) | Sync audit logs with 90-day TTL |

### Files that use KV (2 total)

| File | Usage | Import Style |
|------|-------|-------------|
| `frontend/src/app/api/ampre/sync/route.ts` | **Write** — stores listings + audit logs | `import { kv } from "@vercel/kv"` |
| `frontend/src/lib/ampre/fetch.ts` | **Read** — fetches listings for pages | Dynamic: `await import("@vercel/kv")` |

### Data flow

```
Daily Cron (6 AM UTC)
  → POST /api/ampre/sync
    → fetchAmpreProperties()           ← Only AMPRE API call
    → filterPermittedProperties()      ← perm_adv=N removed
    → mapAmpreToListing()              ← disp_addr=N suppressed
    → kv.set("listings:all", [...])    ← Write to KV
    → kv.set("sync:log:...", {...})    ← Audit log
    → revalidateTag("ampre-listings")  ← Bust ISR cache

Page Request (any time)
  → getAmpreListings() / getAmpreListingBySlug()
    → kv.get("listings:all")           ← Read from KV
    → in-memory filter/sort/paginate
    → return to component
```

### Dataset characteristics

- **Size:** One brokerage's listings (estimated <500 properties, <2MB JSON)
- **Write frequency:** Once per 24 hours (compliance hard limit)
- **Read frequency:** Every page request that shows listings
- **TTL needs:** Audit logs need 90-day TTL; listings replaced daily (no TTL needed)

---

## 3. Is a Persistent Store Necessary?

**Yes.** A shared persistent store is required for this architecture. Here's why:

### Why in-process memory won't work
Vercel serverless functions are stateless — each invocation runs in an isolated container. The sync job and page-rendering functions cannot share memory. Data written by the cron job must be readable by unrelated page requests.

### Why Next.js data cache alone is insufficient
- `unstable_cache` is tied to the deployment and can be evicted unpredictably
- No programmatic write API from a cron job context
- No TTL control for audit logs
- Not designed as a primary data store — it's a cache, not storage
- Compliance requires auditable, deletable data (§1.d, §5.c) — cache eviction is not "deletion"

### Why the filesystem won't work
Vercel serverless functions have ephemeral, read-only filesystems (except `/tmp` which doesn't persist across invocations).

### Compliance requirements that demand persistent storage

| Requirement | Why persistent store is needed |
|-------------|-------------------------------|
| §3.a — Daily retrieval audit | Sync logs must be stored and retained 90 days |
| §1.d — 60-day deletion | Must be able to identify and purge stale listings |
| §5.c — Termination deletion | Must be able to wipe all data on demand |
| §1.e — AI isolation | Data must flow through a controlled pipeline, not scattered across caches |

---

## 4. Alternatives Evaluation

### Option A: Upstash Redis (direct) — RECOMMENDED

| Aspect | Detail |
|--------|--------|
| **What** | Use `@upstash/redis` package directly instead of `@vercel/kv` |
| **Why** | Vercel KV was literally a wrapper around Upstash Redis. Near-identical API. |
| **Migration effort** | Minimal — package swap + minor API changes |
| **Vercel integration** | First-party Marketplace integration, auto-injects env vars |
| **Cost** | Free tier: 10K commands/day, 256MB (more than sufficient) |
| **TTL support** | Yes — native Redis TTL for audit logs |
| **Compliance fit** | Identical to current architecture. All compliance properties preserved. |

### Option B: Vercel Blob (object storage)

| Aspect | Detail |
|--------|--------|
| **What** | Store listings as a JSON file in Vercel Blob |
| **Migration effort** | Moderate — different API pattern (put/get vs set/get), no native TTL |
| **TTL support** | No — must implement manual cleanup for audit logs |
| **Compliance fit** | Workable but adds complexity for audit log retention |
| **Tradeoff** | Simpler mental model (it's just a file) but worse fit for key-value + TTL patterns |

### Option C: External database (Neon/Supabase Postgres)

| Aspect | Detail |
|--------|--------|
| **What** | Store listings in a Postgres table |
| **Migration effort** | High — need schema, ORM/query layer, connection pooling |
| **Compliance fit** | Good — SQL queries for retention/deletion, but vastly overengineered for 1 key |
| **Tradeoff** | Overkill. We're storing one JSON array and some log entries. |

### Option D: Sanity CMS (existing infrastructure)

| Aspect | Detail |
|--------|--------|
| **What** | Store listings back in Sanity as documents |
| **Migration effort** | High — re-create listing schema, sync job writes to Sanity API |
| **Compliance risk** | Sanity's AI features could access MLS data — potential §1.e violation |
| **Tradeoff** | Eliminates external dependency but introduces compliance risk and couples MLS data to CMS |

### Recommendation: Option A (Upstash Redis)

Upstash Redis is the clear choice:
- Lowest migration effort (same underlying technology)
- Full compliance preservation
- Native TTL for audit logs
- Vercel Marketplace integration (same DX as Vercel KV)
- Free tier covers this use case entirely

---

## 5. Migration Scope

### Package changes

| Action | Detail |
|--------|--------|
| Remove | `@vercel/kv` from `frontend/package.json` |
| Add | `@upstash/redis` to `frontend/package.json` |

### Environment variable changes

| Old (Vercel KV) | New (Upstash Redis) | Notes |
|-----------------|--------------------|----|
| `KV_REST_API_URL` | `UPSTASH_REDIS_REST_URL` | Auto-set by Vercel Marketplace integration |
| `KV_REST_API_TOKEN` | `UPSTASH_REDIS_REST_TOKEN` | Auto-set by Vercel Marketplace integration |

### File modifications

| File | Change |
|------|--------|
| `frontend/package.json` | Swap `@vercel/kv` → `@upstash/redis` |
| `frontend/src/app/api/ampre/sync/route.ts` | Update import: `import { Redis } from "@upstash/redis"` + instantiate client |
| `frontend/src/lib/ampre/fetch.ts` | Update dynamic import + client instantiation |
| `frontend/src/lib/ampre/compliance.ts` | Update env var names in comments (optional) |
| `frontend/.env.example` | Replace `KV_REST_API_URL`/`KV_REST_API_TOKEN` with `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` |

### API differences

```typescript
// BEFORE (@vercel/kv)
import { kv } from "@vercel/kv";
await kv.set("listings:all", listings);
await kv.set(`sync:log:${ts}`, logEntry, { ex: 90 * 86400 });
const data = await kv.get("listings:all");

// AFTER (@upstash/redis)
import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv(); // reads UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
await redis.set("listings:all", JSON.stringify(listings));
await redis.set(`sync:log:${ts}`, JSON.stringify(logEntry), { ex: 90 * 86400 });
const data = await redis.get<Listing[]>("listings:all");
```

Note: `@upstash/redis` handles JSON serialization automatically (like `@vercel/kv` did), so `JSON.stringify` may not be needed — verify during implementation.

### Infrastructure setup

1. Install Upstash Redis via Vercel Marketplace (vercel.com/marketplace/upstash)
2. Link to project — env vars auto-injected
3. No Redis configuration needed (serverless REST API, not TCP connection)

---

## 6. Compliance Verification

Every compliance requirement from the PropTx Data License remains satisfied:

| Requirement | Current (Vercel KV) | After Migration (Upstash Redis) | Status |
|-------------|---------------------|--------------------------------|--------|
| C1: 24-hour retrieval limit (§3.a) | Single daily cron | Unchanged — same cron job | Preserved |
| C2: perm_adv/disp_addr enforcement | Filter in sync route + mapper | Unchanged — same code paths | Preserved |
| C3: Data retention/deletion (§1.d) | KV replaced daily + 60-day safety net | Redis replaced daily + same safety net | Preserved |
| M1: Audit logging (§3.a) | SyncLogEntry in KV with 90-day TTL | Same entry in Redis with same TTL | Preserved |
| M2: AI isolation (§1.e) | Data only in KV, never exposed to AI | Data only in Redis, never exposed to AI | Preserved |
| M3: Error logging safety (§4) | AmpreError omits response bodies | Unchanged | Preserved |
| Termination deletion (§5.c) | Flush KV store | Flush Redis store (`FLUSHDB`) | Preserved |

---

## 7. Verification Checklist

After migration:

1. `npm run build` passes with no type errors
2. Grep for `@vercel/kv` — zero results
3. Grep for `upstash/redis` — only in `sync/route.ts` and `fetch.ts`
4. Local dev without Redis credentials returns empty listings (graceful degradation)
5. Sync endpoint (`POST /api/ampre/sync`) writes to Redis successfully
6. Listings page reads from Redis and renders correctly
7. Home page featured listings load correctly
8. Listing detail page (`/listings/[slug]`) resolves correctly
9. Audit logs written with 90-day TTL confirmed via Redis CLI
10. `FLUSHDB` capability confirmed for termination compliance

---

## 8. Out of Scope

- No changes to the AMPRE sync logic, compliance filtering, or mapper
- No changes to the cron schedule or sync endpoint authentication
- No changes to the listing type definitions
- No changes to Sanity schemas
- No new features — this is a like-for-like storage backend swap
