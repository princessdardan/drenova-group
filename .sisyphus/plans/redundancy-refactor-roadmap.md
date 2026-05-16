# Redundancy Refactor Execution Plan

## Objective

Implement the redundancy refactor audit in staged, behavior-preserving slices. Detailed implementation specs live in `docs/refactors/`; this file is the canonical reviewable execution plan.

## Detailed Specs

- `docs/refactors/redundancy-refactor-roadmap.md`
- `docs/refactors/01-foundation-ui-spec.md`
- `docs/refactors/02-marketing-pages-spec.md`
- `docs/refactors/03-forms-navigation-cards-spec.md`
- `docs/refactors/04-sanity-schema-spec.md`
- `docs/refactors/05-data-api-ampre-safe-spec.md`
- `docs/refactors/verification-matrix.md`

## Stage Order

1. Foundation UI: section shells, metadata helper, non-AMPRE Sanity image URL helper, legal/error state shells.
2. Marketing pages: buy/sell benefits, process timelines, coverage grids, buyer/seller guide shell.
3. Forms/navigation/cards: form field shell, form status, nav renderer, action groups, media card shell.
4. Sanity schema: singleton constants, field helpers, preview helpers, simple schema conversions first.
5. Data/API/AMPRE-safe: Sanity query fragments, fetch descriptors, API response/auth helpers, seed helpers, AMPRE-safe script constants.

## Non-Goals

- No behavior-changing redesign.
- No new UI/component libraries.
- No direct AMPRE API calls from user-facing paths.
- No schema field removals without a separate content migration plan.
- No seed execution or external side effects unless separately requested.

## AMPRE Compliance Constraints

Any stage touching listings, AMPRE modules, listing pages/cards, sitemap, API routes, scripts, metadata, image handling, or shared data helpers must preserve:

- AMPRE API calls stay limited to `frontend/src/app/api/ampre/sync/route.ts`.
- User-facing listing reads stay in `frontend/src/lib/ampre/fetch.ts` and read Redis/Upstash data only.
- `fetchAmpreProperties` and `fetchAmpreMedia` remain sync-route-only imports, except explicitly approved diagnostic scripts that are not used in runtime paths.
- `filterPermittedProperties()` continues to remove non-displayable listings before mapping/storage.
- `mapAmpreToListing()` continues to suppress address and coordinates server-side when display is disabled.
- Listing detail metadata and `PropertyCard` continue to respect `addressSuppressed`.
- Sync replacement/purge, 60-day retention safety, and `SyncLogEntry` audit logging remain intact.
- Raw AMPRE payloads/response bodies are not logged.
- AMPRE/MLS data is not sent to AI, ML, RAG, prompts, embeddings, analytics enrichment, valuation, or predictive systems.

## Verification Gates

- Frontend stages: `npm -w frontend run lint`, `npm -w frontend run build`, route smoke checks.
- Forms/navigation/cards: add `npm -w frontend run test:e2e`, keyboard and mobile navigation checks.
- Sanity schema: `npm -w backend run build`; run frontend build if query/type contracts change.
- Data/API/AMPRE-safe: frontend lint/build, backend build when relevant, e2e for listing/page changes, and AMPRE grep checks from `docs/refactors/verification-matrix.md`.

## Completion Criteria

- Every implementation stage references its detailed spec.
- Each stage has a small, reviewable diff.
- Acceptance criteria and verification outcomes are recorded before moving to the next stage.
- AMPRE-sensitive stages include grep results proving the compliance boundaries still hold.
