# AMPRE PRD Compliance Audit — Implementation Summary

> **Date:** 2026-03-11
> **Related docs:** [`ampre-integration-prd.md`](./ampre-integration-prd.md) · [`ampre-data-license-guidelines.md`](./ampre-data-license-guidelines.md)

---

## Overview

The original AMPRE integration PRD proposed direct API calls with 5-minute ISR cache. Auditing against the PropTx Data License revealed **3 critical violations** and several moderate gaps. This document records the remediation architecture and all files created/modified.

---

## Critical Violations Resolved

| # | Violation | Fix |
|---|-----------|-----|
| **C1** | Data retrieval exceeds 24-hour limit (§3.a) | Replaced direct API calls with daily sync job. AMPRE is hit exactly once per day via `/api/ampre/sync`. All user-facing reads come from Vercel KV. |
| **C2** | Missing `perm_adv` / `disp_addr` enforcement (Addendum) | `perm_adv=N` listings are filtered out before storage. `disp_addr=N` listings have address/lat/lng suppressed server-side in the mapper — never reaches client, page source, or meta tags. |
| **C3** | No data retention/deletion strategy (§1.d, §5.c) | Sync job replaces entire KV dataset each run (stale listings purged automatically). Secondary 60-day `lastSeen` safety net. |

## Moderate Gaps Resolved

| # | Gap | Fix |
|---|-----|-----|
| **M1** | No retrieval audit logging (§3.a) | Every sync writes a `SyncLogEntry` to KV with timestamp, counts, and duration. Logs retained 90 days. |
| **M2** | AI isolation not documented (§1.e) | `compliance.ts` exports `AI_PROHIBITION_NOTICE` constant. Architecture ensures MLS data only flows through the sync→KV→fetch pipeline. |
| **M3** | Error logging may expose MLS data (§4) | `AmpreError` class intentionally omits response bodies from error messages. |

---

## Architecture

```
Daily cron (6 AM UTC)
  └─ POST /api/ampre/sync
       ├─ acquireRetrievalLock()          ← hard 24h AMPRE retrieval guard
       ├─ fetchAmpreProperties()          ← ONLY code path that calls AMPRE
       ├─ filterPermittedProperties()     ← perm_adv=N removed
       ├─ mapAmpreToListing()             ← disp_addr=N address/postal/lat/lng suppressed
       ├─ kv.set("listings:all", ..., TTL)← stored with 60-day retention fallback
       ├─ kv.set("sync:log:...", ...)     ← audit log
       └─ revalidateTag("ampre-listings") ← bust ISR cache

User request
  └─ getAmpreListings() / getAmpreListingBySlug()
       └─ kv.get("listings:all")          ← reads from KV, NEVER from AMPRE
            └─ in-memory filter/sort/paginate
```

---

## Files Created

| File | Purpose |
|------|---------|
| `frontend/vercel.json` | Cron schedule: `/api/ampre/sync` daily at 6 AM UTC |
| `frontend/src/lib/ampre/types.ts` | `AmpreProperty`, `AmpreResponse`, `SyncLogEntry` interfaces |
| `frontend/src/lib/ampre/client.ts` | HTTP client for AMPRE OData API (used only by sync job) |
| `frontend/src/lib/ampre/queries.ts` | OData query builder — always includes `perm_adv`, `disp_addr`, `ModificationTimestamp` |
| `frontend/src/lib/ampre/compliance.ts` | License constants: 24h retrieval limit, 60-day retention, AI prohibition, KV keys |
| `frontend/src/lib/ampre/mapper.ts` | `mapAmpreToListing()` with `disp_addr` suppression, `filterPermittedProperties()` |
| `frontend/src/lib/ampre/sanitize.ts` | Public-read sanitizer for safe slugs and legacy suppressed Redis records |
| `frontend/src/lib/ampre/fetch.ts` | KV-backed fetch layer: `getAmpreListings()`, `getAmpreListingBySlug()`, filter helpers |
| `frontend/src/app/api/ampre/sync/route.ts` | Daily sync endpoint — the only code that calls AMPRE |
| `frontend/src/app/api/ampre/sync/sync-helpers.ts` | Testable sync guard and retention helpers |
| `frontend/src/components/ui/listing-filters.tsx` | Client component with URL-based filter/sort state |
| `frontend/src/app/listings/[slug]/page.tsx` | Listing detail page with address suppression in `generateMetadata()` |

## Files Modified

| File | Change |
|------|--------|
| `frontend/src/types/listing.ts` | Canadian field renames (`province`, optional `postalCode`), added `addressSuppressed`, `lastSeen`, `listingKey`, removed `SanityImage` union |
| `frontend/src/components/ui/property-card.tsx` | Address suppression display, Canadian fields, removed `isSanityImage` guard |
| `frontend/src/app/listings/page.tsx` | Switched from Sanity to AMPRE fetch, integrated filters + pagination |
| `frontend/src/app/page.tsx` | Home page switched to `getAmpreListings()` |
| `frontend/src/lib/sanity/queries.ts` | Removed listing queries, updated `homePageQuery`/`listingsPageQuery` to use `featuredListingKeys` |
| `frontend/src/lib/sanity/fetch.ts` | Removed `getListings`, `getActiveListings`, `getListingBySlug` |
| `frontend/src/types/sanity.ts` | `HomePage.featuredListings` → `featuredListingKeys: string[]`, same for `ListingsPage` |
| `frontend/.env.example` | Added `AMPRE_API_BASE_URL`, `AMPRE_API_TOKEN`, `CRON_SECRET`, KV vars |
| `backend/schemaTypes/index.ts` | Removed `listing` schema import and registration |
| `backend/schemaTypes/singletons/listings-page.ts` | `featuredListings` (references) → `featuredListingKeys` (string array) |
| `backend/schemaTypes/singletons/home-page.ts` | `featuredListings` (references) → `featuredListingKeys` (string array) |
| `backend/structure.ts` | Removed `listing` document type from Studio structure |

---

## New Dependencies

| Package | Purpose |
|---------|---------|
| `@upstash/redis` | Redis-backed KV store for listing data |

## New Environment Variables

| Variable | Purpose | Set by |
|----------|---------|--------|
| `AMPRE_API_BASE_URL` | AMPRE OData endpoint | Manual |
| `AMPRE_API_TOKEN` | Bearer token for AMPRE API | Manual |
| `CRON_SECRET` | Protects sync endpoint | Vercel Cron (auto) |
| `UPSTASH_REDIS_REST_URL` | Redis connection URL | Upstash Redis integration |
| `UPSTASH_REDIS_REST_TOKEN` | Redis auth token | Upstash Redis integration |

---

## Verification Checklist

1. **Retrieval compliance:** `fetchAmpreProperties` is only imported by `sync/route.ts`, and `acquireRetrievalLock()` prevents another AMPRE retrieval inside the 24-hour window.
2. **Display field enforcement:** `perm_adv=N` filtered in `filterPermittedProperties()`. `disp_addr=N` suppresses address, postal code, latitude, longitude, and address-derived URLs at the mapper/read layer. Detail page `generateMetadata()` suppresses address in title/description.
3. **Data retention:** Sync writes `listings:all` with a 60-day TTL and deletes the key when there are zero fresh listings.
4. **Audit logging:** `SyncLogEntry` written to `sync:log:*` KV keys after every sync.
5. **AI isolation:** `compliance.ts` documents the prohibition. Architecture prevents casual access to raw MLS data.
6. **Tests/build:** `npm -w frontend run test:unit`, `npm -w frontend run lint`, and `npm -w frontend run build` pass with no type errors.

---

## PRD User Story Impact

| Story | Status |
|-------|--------|
| US-030 | Modified — client used only by sync job |
| US-031 | Significantly modified — query builder for sync only; user filters are in-memory |
| US-032 | Modified — mapper handles `perm_adv` filtering + `disp_addr` suppression |
| US-033 | Fundamentally changed — reads from Vercel KV, never AMPRE |
| US-034 | Minor additions — `addressSuppressed`, `lastSeen` fields |
| US-035 | Modified — filters are in-memory, not OData |
| US-036 | Modified — `generateMetadata()` suppresses address when needed |
| US-037 | Modified — pagination is in-memory slicing |
| US-038 | Unchanged |
| US-039 | Unchanged |
| **NEW** | Sync API route — `POST /api/ampre/sync` with cron + audit logging |
| **NEW** | Compliance module — `frontend/src/lib/ampre/compliance.ts` |
| **NEW** | Vercel config — `frontend/vercel.json` with cron schedule |
