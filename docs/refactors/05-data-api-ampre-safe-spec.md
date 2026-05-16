# Stage 5: Data, API, and AMPRE-Safe Refactor Spec

## Goal

Consolidate data-access and API boilerplate while preserving Sanity behavior and AMPRE compliance boundaries.

## Scope

- Sanity fetch wrapper and GROQ projection repetition.
- API route authentication and JSON response helpers.
- Seed script helper extraction.
- AMPRE query/script consolidation only when compliance-neutral.

## Affected Files

- `frontend/src/lib/sanity/client.ts`
- `frontend/src/lib/sanity/queries.ts`
- `frontend/src/lib/sanity/fetch.ts`
- `frontend/src/types/sanity.ts`
- `frontend/src/app/api/revalidate/route.ts`
- `frontend/src/app/api/deploy/route.ts`
- `frontend/src/app/api/draft/enable/route.ts`
- `frontend/src/app/api/draft/disable/route.ts`
- `frontend/src/app/api/ampre/sync/route.ts`
- `frontend/src/lib/ampre/client.ts`
- `frontend/src/lib/ampre/queries.ts`
- `frontend/src/lib/ampre/mapper.ts`
- `frontend/src/lib/ampre/fetch.ts`
- `frontend/src/lib/ampre/compliance.ts`
- `frontend/src/lib/ampre/types.ts`
- `frontend/src/app/listings/page.tsx`
- `frontend/src/app/listings/[slug]/page.tsx`
- `frontend/src/app/sitemap.ts`
- `scripts/seed-sanity.ts`
- `scripts/fetch-ampre-sample.mjs`
- `scripts/diagnose-media.mjs`

## AMPRE Compliance Boundary

This stage must not start until the implementation PR includes a compliance checklist copied into the PR description or task notes.

Required invariants:

- `fetchAmpreProperties` and `fetchAmpreMedia` are imported only by `frontend/src/app/api/ampre/sync/route.ts`.
- No page, component, sitemap helper, or public API route imports `frontend/src/lib/ampre/client.ts`.
- User-facing listing reads stay in `frontend/src/lib/ampre/fetch.ts` and read Redis/Upstash data only.
- `filterPermittedProperties()` runs before mapping/storage.
- `mapAmpreToListing()` preserves address and coordinate suppression.
- `frontend/src/app/listings/[slug]/page.tsx` metadata continues to suppress addresses when `addressSuppressed` is true.
- `PropertyCard` continues to avoid street address display when `addressSuppressed` is true.
- Sync logs continue to write `SyncLogEntry` data with 90-day retention.
- Stale listing replacement/purge behavior remains intact.
- AMPRE response bodies and raw MLS payloads are not logged.
- AMPRE/MLS data is not sent to AI/ML/RAG/prompt/embedding/valuation/analytics systems.

## Proposed Abstractions

### Sanity Query Fragments

Location: `frontend/src/lib/sanity/query-fragments.ts`

Candidate exports:

```ts
heroProjection
ctaProjection
sectionHeadingProjection
guidePageProjection
orderedDocumentProjection
```

Requirements:

- Keep `frontend/src/types/sanity.ts` aligned.
- Do not remove fields from current projections unless all call sites are updated.

### Sanity Fetch Descriptors

Location: `frontend/src/lib/sanity/fetch.ts` or `frontend/src/lib/sanity/fetchers.ts`

Candidate API:

```ts
function singletonFetcher<T>(query: string, tag: string): () => Promise<T | null>;
function collectionFetcher<T>(query: string, tag: string): () => Promise<T[]>;
```

Requirements:

- Preserve draft-mode behavior in `sanityFetch`.
- Preserve ISR tag names.
- Preserve typed exported function names for route call sites.

### API Route Helpers

Location: `frontend/src/app/api/_lib/`

Candidate helpers:

```ts
requireHeaderSecret(request, headerName, envName)
jsonError(message, status)
jsonOk(body)
```

Requirements:

- Preserve current status codes and response body shapes unless explicitly changed.
- Keep `CRON_SECRET` auth for AMPRE sync route distinct from Sanity/deploy secrets.

### Seed Helpers

Location: `scripts/seed/` or local helpers inside `scripts/seed-sanity.ts`

Candidate helpers:

```ts
createOrReplaceMany(client, docs)
portableTextBlock(text)
headingBlock(text, level)
stableKey(prefix, value)
```

Requirements:

- Preserve deterministic `_id` and `_key` values.
- Preserve singleton document IDs.
- Do not run seed scripts as part of helper extraction unless explicitly requested.

### AMPRE Script Constants

Candidate approach:

- Move duplicated AMPRE field lists into a non-request helper if it does not create new runtime imports from pages/components.
- Keep compliance comments near field lists.
- Do not merge diagnostics scripts into production sync code.

## Implementation Plan

1. Add Sanity query fragments and convert projections one group at a time.
2. Add typed fetch factory helpers and convert fetch wrappers without changing exported names.
3. Add API response/auth helpers and convert non-AMPRE routes first.
4. Convert AMPRE sync route only after verifying response/status behavior and compliance invariants.
5. Extract seed helpers without running the seed script.
6. Consolidate AMPRE script constants only if the import graph remains compliance-safe.

## Verification

- `npm -w frontend run lint`
- `npm -w frontend run build`
- `npm -w backend run build` if schema/query contracts are paired with backend changes.
- AMPRE import invariant:
  - `rg -n "fetchAmpreProperties|fetchAmpreMedia|from .*@/lib/ampre/client|from .*lib/ampre/client" frontend/src scripts`
- AMPRE read invariant:
  - `rg -n "getAmpreListings|getAmpreListingBySlug|getAmpreListingByKey" frontend/src/app frontend/src/components`
- Display-control invariant:
  - `rg -n "DDFYN|InternetEntireListingDisplayYN|InternetAddressDisplayYN|REQUIRED_SELECT_FIELDS|filterPermittedProperties|addressSuppressed" frontend/src/lib/ampre frontend/src/app/listings frontend/src/components/ui/property-card.tsx`
- Logging invariant:
  - `rg -n "response\.text\(|response\.json\(|console\.(log|error).*raw|console\.(log|error).*payload" frontend/src/lib/ampre frontend/src/app/api/ampre scripts`
- Manual route checks for `/listings`, `/listings/[slug]`, `/sitemap.xml`, and sync route auth behavior in a safe non-production environment.

## Acceptance Criteria

- Sanity query/fetch boilerplate is reduced with unchanged exported fetch APIs.
- API helpers reduce duplication without changing response semantics.
- Seed helper extraction is docs/code-safe and does not execute external side effects.
- AMPRE compliance invariants are documented and pass grep checks.
- No user-facing path calls AMPRE directly.
