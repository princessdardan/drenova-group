# PRD: AMPRE API Listings Integration

> **Version:** 1.0
> **Date:** March 10, 2026
> **Status:** Draft — Pending Implementation
> **Parent PRD:** `prd.md` (Drenova Group — Real Estate Website)

---

## Context

Listings are currently manually managed in Sanity CMS. The final product needs to display real MLS listings from the **AMPRE API** (OData v4.0, RESO Web API) at `https://query.ampre.ca/odata/`. AMPRE becomes the sole listing data source. Sanity retains control over editorial content (page headers, featured listing keys). The Sanity `listing` document type will be deprecated. Since this is a Canadian MLS, we use Canadian terminology (`province`, `postalCode`).

**Approach:** Hybrid — AMPRE for listing data (with Next.js ISR caching), Sanity for editorial content. No sync pipeline; direct API calls with 5-minute cache.

---

## User Stories

### US-030: AMPRE API Client Library
**As a** developer
**I want** a reusable AMPRE API client module
**So that** the frontend can fetch real MLS listings from the AMPRE OData endpoint

**Acceptance Criteria:**
- HTTP client with Bearer token auth reads from `AMPRE_API_BASE_URL` and `AMPRE_API_TOKEN` env vars (server-only, no `NEXT_PUBLIC_` prefix)
- Custom `AmpreError` class handles 401/429/5xx with graceful degradation (log + return empty, never crash)
- Rate-limit header (`X-Rate-Limit-Remaining`) is logged for observability
- Raw OData response types: `ODataResponse<T>` with `@odata.count`, `@odata.nextLink`, `value: T[]`
- `AmpreProperty` and `AmpreMedia` interfaces for raw RESO fields

**Files to create:**
- `frontend/src/lib/ampre/client.ts`
- `frontend/src/lib/ampre/types.ts`

---

### US-031: OData Query Builder
**As a** developer
**I want** a query builder that translates filter parameters into OData query strings
**So that** listing filters and pagination work against the AMPRE API

**Acceptance Criteria:**
- `ListingFilters` interface: `propertyType?`, `minBeds?`, `minPrice?`, `maxPrice?`, `sort?`, `page?`
- `buildPropertyQuery(filters)` returns OData query string with `$filter`, `$orderby`, `$top`, `$skip`, `$select`, `$count=true`
- List-view `$select`: `ListingKey,ListingId,ListPrice,StreetNumber,StreetName,StreetSuffix,City,StateOrProvince,PostalCode,BedroomsTotal,BathroomsTotalInteger,LivingArea,StandardStatus,PropertyType,ListingContractDate,ModificationTimestamp`
- Detail-view `$select`: adds `PublicRemarks,LotSizeArea,YearBuilt,Latitude,Longitude`
- Default `$top=50`, default `$orderby=ListingContractDate desc`
- Filter mapping: `type=condo` → `PropertyType eq 'Condominium'`, `beds=3` → `BedroomsTotal ge 3`, price range → `ListPrice ge X and ListPrice le Y`

**File to create:**
- `frontend/src/lib/ampre/queries.ts`

---

### US-032: RESO-to-Listing Data Mapper
**As a** developer
**I want** a mapper that transforms raw RESO API responses into our `Listing` type
**So that** the frontend components receive a consistent, typed data shape

**Acceptance Criteria:**
- `mapAmpreToListing(property, imageUrl?)` returns a `Listing` object
- Address: concatenate `StreetNumber + StreetName + StreetSuffix`
- Status mapping: `Active`/`Active Under Contract` → `"Active"`, `Pending` → `"Pending"`, `Closed` → `"Sold"`
- PropertyType mapping: `Residential` → `"Single Family"`, `Condominium` → `"Condo"`, etc. with sensible fallback
- Null safety for all optional RESO fields (default 0 for numbers, empty string for strings)
- `slug` derived from `ListingKey`

**File to create:**
- `frontend/src/lib/ampre/mapper.ts`

---

### US-033: AMPRE Fetch Functions with ISR Caching
**As a** developer
**I want** typed async fetch functions for AMPRE data with ISR caching
**So that** pages render fast without hitting the API on every request

**Acceptance Criteria:**
- `getAmpreListings(filters?): Promise<{ listings: Listing[]; total: number }>` — fetches properties + first photo per listing, cached with `{ next: { revalidate: 300, tags: ["ampre-listings"] } }`
- `getAmpreListingByKey(key): Promise<Listing | null>` — single property + all media, cached with `{ next: { revalidate: 300, tags: ["ampre-listing"] } }`
- `getAmpreMedia(resourceKey): Promise<string[]>` — returns image URL array for a property
- Follows same pattern as existing `sanityFetch()` in `frontend/src/lib/sanity/fetch.ts`

**File to create:**
- `frontend/src/lib/ampre/fetch.ts`

**Existing patterns to reuse:**
- `sanityFetch()` ISR cache tag pattern from `frontend/src/lib/sanity/fetch.ts:8-30`

---

### US-034: Update Listing Type for Canadian Locale + AMPRE Fields
**As a** user viewing Canadian property listings
**I want** the site to use Canadian terminology (Province, Postal Code)
**So that** the content feels natural for the Canadian market

**Acceptance Criteria:**
- `state` → `province`, `zip` → `postalCode` across the `Listing` interface and all consuming components
- `image` type simplified to `string` (always a URL from AMPRE, no more `SanityImage` union)
- New optional fields added: `mlsNumber`, `description`, `lotSize`, `yearBuilt`, `images: string[]`, `listDate`, `latitude`, `longitude`
- All references updated in `property-card.tsx`, `listings/page.tsx`, and `sanity.ts`
- Remove `isSanityImage` guard usage from property card (no longer needed)

**Files to modify:**
- `frontend/src/types/listing.ts`
- `frontend/src/types/sanity.ts` — update `ListingsPage` type
- `frontend/src/components/ui/property-card.tsx` — field renames + simplify image handling

**Existing utilities to reuse:**
- `formatPrice()` / `formatNumber()` from `frontend/src/lib/format.ts`
- `cn()` from `frontend/src/lib/cn.ts`

---

### US-035: Functional Listing Filters via URL Search Params
**As a** home buyer
**I want** to filter listings by property type, bedrooms, price range, and sort order
**So that** I can quickly find properties matching my criteria

**Acceptance Criteria:**
- New `"use client"` component `listing-filters.tsx` with `<select>` dropdowns for: property type, beds (1+/2+/3+/4+), price range (under $300k / $300k–$500k / $500k–$750k / $750k+), sort (price asc/desc, newest)
- Filter changes call `router.replace()` with updated search params (no full page reload, shareable URLs)
- Listings page reads `searchParams` and translates to `ListingFilters` → OData query
- Display "Showing X of Y properties" using `@odata.count`
- Filters are server-side (OData `$filter`), not client-side filtering

**Files to create:**
- `frontend/src/components/ui/listing-filters.tsx`

**Files to modify:**
- `frontend/src/app/listings/page.tsx` — accept `searchParams`, pass to AMPRE fetch, render filter component

---

### US-036: Listing Detail Page
**As a** home buyer
**I want** to view full details of a property at `/listings/[slug]`
**So that** I can see photos, description, and key stats before contacting an agent

**Acceptance Criteria:**
- Route: `frontend/src/app/listings/[slug]/page.tsx` where slug = AMPRE `ListingKey`
- Fetches single property via `getAmpreListingByKey(slug)` + all media via `getAmpreMedia(slug)`
- Returns `notFound()` if property doesn't exist
- Dynamic `generateMetadata()` for SEO: title = "Address, City | Drenova Group", description from key stats
- Page layout sections:
  - Image gallery (hero image + thumbnails/grid)
  - Price, status badge, MLS number (use `font-mono` for MLS#)
  - Full address with province + postal code
  - Key stats row: beds, baths, sqft, lot size, year built
  - Description (`PublicRemarks`)
  - Contact CTA linking to `/contact`
  - Back to listings link
- ISR cached at 5-minute intervals

**Files to create:**
- `frontend/src/app/listings/[slug]/page.tsx`

---

### US-037: Pagination for Listings
**As a** home buyer browsing many listings
**I want** pagination on the listings page
**So that** I'm not overwhelmed by hundreds of results at once

**Acceptance Criteria:**
- Default 50 listings per page
- Pagination using `$skip`/`$top` OData parameters
- "Showing X–Y of Z" count using `@odata.count`
- Page navigation (previous/next or "Load More" button)
- Page number reflected in URL search params for bookmarkability

**Files to modify:**
- `frontend/src/app/listings/page.tsx`
- `frontend/src/lib/ampre/queries.ts` (already handles `$top`/`$skip`)

---

### US-038: Update Sanity Schema — Deprecate Manual Listings
**As an** admin
**I want** the listings page header to reference AMPRE listing keys instead of Sanity documents
**So that** I can curate featured listings from the real MLS data

**Acceptance Criteria:**
- `listingsPage` singleton: change `featuredListings` from array of document references to array of strings (AMPRE `ListingKey` values)
- Update `listingsPageQuery` in GROQ — no more `->` dereferencing, return raw string array
- Listings page fetches featured listing details from AMPRE by key
- Remove Sanity `listing` document type from schema index
- Remove `getListings`, `getActiveListings`, `getListingBySlug` from `frontend/src/lib/sanity/fetch.ts`
- Remove listing GROQ queries from `frontend/src/lib/sanity/queries.ts`
- Keep `getListingsPage()` for editorial content (overline, title)

**Files to modify:**
- `backend/schemaTypes/singletons/listings-page.ts`
- `backend/schemaTypes/index.ts` — remove listing import
- `frontend/src/lib/sanity/queries.ts` — remove listing queries, update listingsPage query
- `frontend/src/lib/sanity/fetch.ts` — remove listing fetchers

**Files to deprecate:**
- `backend/schemaTypes/documents/listing.ts`

---

### US-039: Next.js Configuration for AMPRE Media
**As a** developer
**I want** AMPRE media image hostnames allowed in Next.js Image config
**So that** `next/image` can optimize listing photos from the AMPRE CDN

**Acceptance Criteria:**
- Add AMPRE media hostname(s) to `images.remotePatterns` in `next.config.ts` (exact hostname determined from first API response)
- Add env vars `AMPRE_API_BASE_URL` and `AMPRE_API_TOKEN` to `.env.local`

**Files to modify:**
- `frontend/next.config.ts`

---

## Implementation Order

| Phase | User Stories | Risk |
|-------|-------------|------|
| 1 — Client library | US-030, US-031, US-032, US-033 | Zero — additive, no existing code touched |
| 2 — Type updates | US-034 | Low — field renames across a few files |
| 3 — Pages + filters | US-035, US-036, US-037, US-039 | Medium — primary data source switches |
| 4 — Sanity cleanup | US-038 | Medium — editorial workflow changes |

---

## Verification

1. **API connectivity**: Test call to `https://query.ampre.ca/odata/Property?$top=1` with bearer token — confirm access, inspect response shape and media hostname
2. **Listings page**: `npm run dev` → `/listings` → listings render from AMPRE with Canadian field names
3. **Filters**: Apply each filter → URL params update, results change server-side
4. **Detail page**: Click a card → `/listings/[ListingKey]` renders full details + image gallery
5. **ISR caching**: Verify cached responses, revalidation after 5 minutes
6. **Error handling**: Invalid token → graceful empty state, no crash
7. **Build**: `npm run build` → no type errors
8. **Sanity Studio**: `npm run studio` → listingsPage singleton accepts string array for featured keys
