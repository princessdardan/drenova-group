# AMPRE Listing Pipeline

## OVERVIEW

Compliance-sensitive AMPRE/PropTx MLS integration. Only the daily sync calls AMPRE; all user-facing listing reads use Redis.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Data-license constants | `compliance.ts` | 24-hour retrieval, 60-day retention, AI prohibition, required fields |
| OData client | `client.ts` | Sync-only HTTP client; strips response bodies from errors |
| Query builders | `queries.ts` | `$select`, `$filter`, media batch queries |
| Mapping | `mapper.ts` | RESO fields to `Listing`, slug/address suppression, permitted filtering |
| Redis reads | `fetch.ts` | Pages/components call this only |
| Sync endpoint | `../../app/api/ampre/sync/route.ts` | Vercel Cron job, Redis write, sync logs, revalidation |
| Types | `types.ts`, `../../types/listing.ts` | External AMPRE shape vs internal listing shape |

## CONVENTIONS

- `client.ts` is exclusive to `/api/ampre/sync`; never import it into UI/page code.
- `fetch.ts` is the public read layer for listings and must read from Upstash Redis only.
- Default listing filters show `Sale`; `Lease` appears only when explicitly selected.
- Every AMPRE property query must include `DDFYN`, `InternetEntireListingDisplayYN`, and `InternetAddressDisplayYN`.
- `filterPermittedProperties()` removes non-displayable listings before mapping/storage.
- AMPRE listing slugs must be derived from `ListingKey`, never from street address fields.
- `mapAmpreToListing()` must preserve `addressSuppressed` and avoid exposing address, postal code, latitude, or longitude when display is disabled.
- Listing detail metadata, breadcrumbs, alt text, and visible content must respect `addressSuppressed`.
- Sync logs use `sync:log:*` with 90-day TTL; listings array uses `listings:all` with a 60-day TTL.
- `/api/ampre/sync` must acquire `sync:ampre-retrieval-lock` before any AMPRE call and skip when the lock already exists.

## ANTI-PATTERNS

- Do not call AMPRE more than the daily sync path; failed/400 requests can still count against retrieval limits.
- Do not bypass the Redis retrieval lock or call AMPRE when Redis is unavailable.
- Do not log AMPRE response bodies or MLS payloads.
- Do not store or display records where DDF/display flags disallow advertising.
- Do not show suppressed addresses in page source, metadata, alt text, breadcrumbs, JSON, API responses, or maps.
- Do not feed AMPRE/MLS data into AI, ML, RAG, prompts, valuations, or predictive analytics.
- Do not remove Redis fallback behavior that returns empty results when local Redis env vars are absent.

## COMMANDS

```bash
npm -w frontend run build
npm -w frontend run lint
npm -w frontend run test:e2e
```

## NOTES

- `/api/ampre/sync` requires `CRON_SECRET`, AMPRE env vars, and Upstash Redis env vars.
- `maxDuration = 120` on the sync route assumes Vercel support for long-running functions.
- Related docs: `docs/ampre-data-license-guidelines.md`, `docs/ampre-compliance-implementation.md`, `docs/listings-implementation.md`.
