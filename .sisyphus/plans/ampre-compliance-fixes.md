# AMPRE Compliance Fix Plan

## Goal

Resolve the AMPRE compliance findings without relying on UI-only hiding:

1. Suppressed-address listings must not leak street address through slugs, URLs, metadata, page source, sitemap, or cached Redis records.
2. Suppressed-address listings must not expose postal code, latitude, or longitude to public reads.
3. `listings:all` must have a retention fallback so stale MLS data cannot persist indefinitely if sync stops.
4. `/api/ampre/sync` must not call AMPRE more than once per 24 hours, even with a valid `CRON_SECRET`.

Source-of-truth docs:

- `docs/ampre-compliance-implementation.md`
- `docs/ampre-data-license-guidelines.md`
- `frontend/src/lib/ampre/AGENTS.md`

## Scope

Primary files to change:

- `frontend/src/lib/ampre/mapper.ts`
- `frontend/src/lib/ampre/fetch.ts`
- `frontend/src/lib/ampre/compliance.ts`
- `frontend/src/types/listing.ts`
- `frontend/src/components/ui/property-card.tsx`
- `frontend/src/app/listings/[slug]/page.tsx`
- `frontend/src/app/sitemap.ts`
- `frontend/src/app/api/ampre/sync/route.ts`
- `docs/ampre-compliance-implementation.md`
- `docs/listings-implementation.md`

Potential verification-only files:

- `frontend/vercel.json`
- `frontend/src/lib/ampre/client.ts`
- `frontend/src/lib/ampre/queries.ts`
- `frontend/e2e/navigation.spec.ts`
- `frontend/e2e/responsive.spec.ts`
- `frontend/e2e/contact.spec.ts`

## Non-Goals

- Do not implement redirects from old address-bearing slugs.
- Do not preserve address-derived slugs for SEO.
- Do not add a public deletion endpoint.
- Do not call AMPRE during tests or verification.
- Do not weaken existing compliance controls or logging hygiene.

## Implementation Order

### 1. Add Focused Regression Coverage

Add lightweight unit coverage before changing behavior. The project currently has Playwright e2e tests but no unit runner, so introduce the smallest suitable TypeScript test command for pure AMPRE logic.

Recommended coverage:

- `frontend/src/lib/ampre/mapper.test.ts`
  - `InternetAddressDisplayYN === false` produces no street address, no postal code, no latitude, no longitude, and no address-derived slug.
  - Displayable listings still map required listing fields.
  - `DDFYN === false` and `InternetEntireListingDisplayYN === false` records are filtered.
- `frontend/src/lib/ampre/fetch.test.ts`
  - Legacy Redis records with `addressSuppressed: true` are sanitized before public return.
  - Old address-bearing slugs do not resolve through `getAmpreListingBySlug` after sanitization.
- Sync helper tests, preferably after extracting pure guard/storage helpers from `route.ts`:
  - The 24-hour guard is acquired before AMPRE calls.
  - Duplicate calls within 24 hours skip before AMPRE calls.
  - `listings:all` writes include retention TTL.
  - Empty fresh listing results delete/clear stale `listings:all`.

Avoid brittle Playwright-only coverage for mapper/sync rules. Use Playwright only as browser smoke verification after unit-level behavior is covered.

### 2. Make AMPRE Slugs Compliance-Safe

In `frontend/src/lib/ampre/mapper.ts`:

- Replace address-derived `buildSlug(property)` with an opaque, stable slug based on `ListingKey`, for example `listing-${normalizedListingKey}`.
- Apply this safe slug to all AMPRE listings, not only suppressed listings, so a later `disp_addr` change cannot leave an old address slug attached to a newly suppressed listing.
- Ensure slug normalization cannot produce an empty or colliding slug for valid `ListingKey` values.

In `frontend/src/lib/ampre/fetch.ts`:

- Add a defensive public-read sanitizer for legacy Redis records.
- For `addressSuppressed` records, clear address-like fields and rewrite any old address-derived slug to the safe key-derived slug before returning data to pages, cards, sitemap, or metadata.
- Do not support old address-bearing slug fallback lookup.

In consumers:

- `property-card.tsx`, `[slug]/page.tsx`, and `sitemap.ts` should continue using `listing.slug`, but only after data is sanitized centrally.
- Verify `/listings/{old-address-slug}` returns 404 rather than redirecting.

### 3. Suppress Postal Code At The Data Boundary

In `frontend/src/lib/ampre/mapper.ts`:

- When `InternetAddressDisplayYN === false`, set `postalCode` to `undefined` or omit it.
- Continue setting `address` to `""` and `latitude` / `longitude` to `null` for suppressed listings.

In `frontend/src/types/listing.ts`:

- Make `postalCode` optional or nullable if omitted for suppressed listings.

In `frontend/src/lib/ampre/fetch.ts`:

- Sanitize legacy suppressed records by removing/omitting `postalCode`, even if already stored in Redis.

In UI:

- `property-card.tsx` should compose location as `city, province` when postal code is absent or `addressSuppressed` is true.
- `[slug]/page.tsx` should do the same in metadata, page header, breadcrumbs, image alt text, and mobile sticky CTA.
- Avoid trailing whitespace or punctuation when postal code is omitted.

### 4. Add Redis Retention Fallback For `listings:all`

In `frontend/src/lib/ampre/compliance.ts`:

- Add a listings TTL constant derived from `MAX_RETENTION_DAYS`, e.g. `KV_LISTINGS_TTL_SECONDS`.

In `frontend/src/app/api/ampre/sync/route.ts`:

- Compute `freshListings` before writing to Redis.
- Write `KV_LISTINGS_KEY` with `{ ex: KV_LISTINGS_TTL_SECONDS }`.
- If there are no fresh listings, explicitly delete `KV_LISTINGS_KEY` instead of leaving stale data intact.
- Treat Redis write/delete failure as sync failure because stale data persistence is the unsafe outcome.
- Preserve `sync:log:*` 90-day TTL behavior.

In `frontend/src/lib/ampre/fetch.ts`:

- Preserve the current missing-Redis/missing-key fallback behavior that returns empty results.

### 5. Add A 24-Hour AMPRE Retrieval Guard

In `frontend/src/lib/ampre/compliance.ts`:

- Add constants for retrieval guard keys and TTL, e.g. `KV_SYNC_RETRIEVAL_LOCK_KEY` and `KV_SYNC_RETRIEVAL_LOCK_SECONDS`.

In `frontend/src/app/api/ampre/sync/route.ts`:

- Authenticate the caller first.
- Before `fetchAmpreProperties` or `fetchAmpreMedia`, acquire a Redis lock atomically with `NX` and `EX` for 24 hours.
- If the lock already exists, return a skipped response and log/record that no AMPRE retrieval occurred.
- If Redis is unavailable and the lock cannot be checked, fail closed and do not call AMPRE.
- Do not release the 24-hour lock after AMPRE API errors unless compliance/legal confirms failed retrieval attempts do not count.
- Keep both `GET` and `POST` only if needed for Vercel Cron compatibility, but both methods must go through the same guard.

### 6. Update Docs

After implementation and verification:

- Update `docs/ampre-compliance-implementation.md` with safe slug, postal suppression, TTL retention fallback, and sync guard behavior.
- Update `docs/listings-implementation.md` if it still documents address-derived slugs or postal-code display for AMPRE listings.
- Update `frontend/src/lib/ampre/AGENTS.md` if new constants or guard rules become required local knowledge.

## Verification Checklist

Run targeted and broad checks:

```bash
npm -w frontend run lint
npm -w frontend run build
npm -w frontend run test:e2e
```

If a unit test command is added, run it before lint/build.

Search checks:

```bash
rg -n "fetchAmpreProperties|fetchAmpreMedia" frontend/src
rg -n "postalCode" frontend/src/lib/ampre frontend/src/app/listings frontend/src/components/ui/property-card.tsx frontend/src/app/sitemap.ts
rg -n "buildAddress\(|UnparsedAddress|StreetNumber|StreetName|StreetSuffix" frontend/src/lib/ampre frontend/src/app/listings frontend/src/components/ui/property-card.tsx frontend/src/app/sitemap.ts
```

Manual or mocked verification:

- Suppressed listing output has no street address, no postal code, no latitude, no longitude, and no address-derived slug.
- `/listings` page source does not contain suppressed street or postal data.
- `/listings/{safe-slug}` works.
- `/listings/{old-address-slug}` returns 404 and does not redirect.
- `/sitemap.xml` contains only safe listing URLs.
- First authorized sync calls AMPRE only after acquiring the retrieval lock.
- Second authorized sync within 24 hours skips before any AMPRE call.
- `listings:all` has a TTL after successful sync.
- `listings:all` is deleted or absent when there are zero fresh listings.
- `sync:log:*` entries still use 90-day TTL and do not contain raw MLS payloads.

## Edge Cases

- Existing Redis records may already contain address-derived slugs and postal codes; sanitize public reads until the next sync rewrites Redis.
- Search engines or logs may already contain leaked old URLs; do not redirect them. Handle external URL removal/cache purge separately.
- If `disp_addr` flips from true to false, the next sync must remove postal/location precision immediately.
- If two sync requests arrive at the same time, only one may acquire the retrieval lock.
- If Redis is down, do not call AMPRE because cadence cannot be enforced and data cannot be safely written.
- If media fetch partially fails after property retrieval, keep the retrieval lock and continue existing partial-media behavior.
- If `PublicRemarks` can contain street/postal data for suppressed listings, either suppress descriptions for those listings or add a separate compliance-approved sanitizer. Do not attempt brittle UI-only redaction.

## Weak Fixes To Reject

- JSX-only hiding of postal code or address data.
- Address-derived slugs for any AMPRE listing.
- Redirects or fallback lookups from old leaked address slugs.
- Cron-only retrieval control without a Redis guard.
- Redis overwrite-only retention without TTL/delete fallback.
- Releasing the 24-hour retrieval lock after AMPRE errors without explicit compliance approval.
