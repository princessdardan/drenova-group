# Refactor Verification Matrix

## Commands by Stage

| Stage | Frontend lint | Frontend build | E2E | Backend build | Extra checks |
|---|---|---|---|---|---|
| 1 Foundation UI | Required | Required | Optional, route smoke | Not required | Visual checks at 390/768/1440 |
| 2 Marketing pages | Required | Required | Required if forms/routes affected | Not required | `/buy`, `/sell`, guide pages, `/about` smoke |
| 3 Forms/nav/cards | Required | Required | Required | Not required | Keyboard nav, mobile menu, form validation |
| 4 Sanity schema | Optional if frontend untouched | Required if query/types touched | Optional | Required | Studio singleton/create-new checks |
| 5 Data/API/AMPRE | Required | Required | Required for listing/page changes | Required if schema paired | AMPRE compliance grep checks |

## Core Commands

```bash
npm -w frontend run lint
npm -w frontend run build
npm -w frontend run test:e2e
npm -w backend run build
```

## Manual QA Surfaces

- Browser routes: `/`, `/about`, `/buy`, `/sell`, `/buyers-guide`, `/sellers-guide`, `/home-evaluation`, `/contact`, `/team`, `/listings`, listing detail route, `/privacy`, `/terms`.
- Header and mobile menu keyboard behavior.
- Footer links and contact details.
- Contact form and lead forms validation states.
- Listing cards and listing detail metadata for address-suppressed listings.
- Sanity Studio build and singleton desk structure after schema helper work.

## AMPRE Compliance Checks

Run for any stage that touches AMPRE, listing pages, listing cards, sitemap, API routes, scripts, or shared data helpers.

```bash
rg -n "fetchAmpreProperties|fetchAmpreMedia|from .*@/lib/ampre/client|from .*lib/ampre/client" frontend/src scripts
rg -n "getAmpreListings|getAmpreListingBySlug|getAmpreListingByKey" frontend/src/app frontend/src/components
rg -n "DDFYN|InternetEntireListingDisplayYN|InternetAddressDisplayYN|REQUIRED_SELECT_FIELDS|filterPermittedProperties|addressSuppressed" frontend/src/lib/ampre frontend/src/app/listings frontend/src/components/ui/property-card.tsx
rg -n "response\.text\(|response\.json\(|console\.(log|error).*raw|console\.(log|error).*payload" frontend/src/lib/ampre frontend/src/app/api/ampre scripts
```

Expected results:

- AMPRE client imports appear only in the sync route and approved diagnostic scripts.
- Pages/components use `frontend/src/lib/ampre/fetch.ts`, not the AMPRE client.
- Display-control fields remain selected and enforced.
- No raw AMPRE response body logging is introduced.

## Sanity Schema Checks

- Confirm `SINGLETON_TYPES` remains one source of truth after Stage 4.
- Confirm singleton document IDs match schema names.
- Confirm singletons remain hidden from create-new templates.
- Confirm `frontend/src/types/sanity.ts`, `queries.ts`, and schema fields stay aligned.
- If any field shape changes, write a separate migration plan before implementation.

## Acceptance Gate Template

Before marking a stage complete, record:

- Stage spec followed.
- Files changed.
- Behavior-preservation notes.
- Commands run and outcomes.
- Manual QA surfaces checked.
- AMPRE compliance grep results if applicable.
- Known pre-existing failures, if any.
