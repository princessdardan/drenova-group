# Redundancy Refactor Roadmap

## Purpose

This roadmap turns the repository redundancy audit into staged implementation specs. The goal is to consolidate repeated code without changing user-facing behavior, CMS contracts, listing compliance, or deployment assumptions.

## Source Inputs

- Redundancy audit findings from the repo-wide review.
- AMPRE compliance architecture in `docs/ampre-compliance-implementation.md`.
- Current listing implementation notes in `docs/listings-implementation.md`.
- Existing frontend, backend, and script conventions in `AGENTS.md` files.

## Refactor Principles

- Preserve behavior first; remove duplication second.
- One stage should touch one component cluster, route cluster, schema slice, or data boundary.
- Prefer additive helper extraction before replacing call sites.
- Keep Server Components as the default in route files.
- Do not introduce UI libraries, CSS-in-JS, broad redesigns, or data-flow changes.
- Keep Tailwind utilities static and token-based.
- Treat AMPRE work as compliance-sensitive, even for docs and scripts.

## Staging Order

| Stage | Spec | Scope | Risk | Dependency |
|---|---|---|---|---|
| 1 | `01-foundation-ui-spec.md` | Shared section shells, image helper, metadata helper, legal/state shells | Low | None |
| 2 | `02-marketing-pages-spec.md` | Buy/sell pages, guide pages, process timelines, card grids | Medium | Stage 1 |
| 3 | `03-forms-navigation-cards-spec.md` | Forms, nav rendering, CTA actions, card primitives | Medium | Stage 1 |
| 4 | `04-sanity-schema-spec.md` | Schema helpers, singleton constants, editor-facing field patterns | Medium | Stages 1-2 for frontend shape awareness |
| 5 | `05-data-api-ampre-safe-spec.md` | Sanity fetch/query helpers, API route helpers, seed helpers, AMPRE-safe consolidation | High | Stage 4 for schema/query alignment |
| 6 | `verification-matrix.md` | Cross-stage gates and command checklist | Low | Updated after each stage |

## Non-Goals

- No behavior-changing redesign.
- No direct AMPRE calls from pages, components, or user-request code.
- No changes to listing compliance rules.
- No schema field removals without a separate migration plan.
- No test weakening or removal.
- No broad migration to new component, form, or validation libraries.

## AMPRE Hard Constraints

Any implementation touching listings, AMPRE modules, listing pages, sitemap listing reads, map/listing plans, scripts, API routes, metadata, or image handling must preserve these constraints:

- AMPRE API calls remain limited to `frontend/src/app/api/ampre/sync/route.ts`.
- User-facing listing reads continue through `frontend/src/lib/ampre/fetch.ts` and Redis/Upstash-backed storage.
- `fetchAmpreProperties` and `fetchAmpreMedia` remain sync-route-only imports.
- Every AMPRE property query keeps the display-control fields required by `frontend/src/lib/ampre/compliance.ts`.
- `filterPermittedProperties()` keeps non-displayable listings out before storage.
- `mapAmpreToListing()` keeps `disp_addr` address and coordinate suppression server-side.
- Listing detail metadata, breadcrumbs, cards, alt text, and map-related future code must not reveal suppressed addresses.
- Sync replacement, stale purge behavior, and 60-day retention safety remain intact.
- `SyncLogEntry` audit logging and 90-day log retention remain intact.
- Raw AMPRE payloads and response bodies are not logged.
- AMPRE/MLS data is not sent to AI, ML, RAG, prompts, embeddings, analytics enrichment, valuation, or predictive systems.

## Global Acceptance Criteria

- Every stage has a small, reviewable diff.
- Existing routes and content render the same before and after each stage.
- Lint/build gates pass after each implementation stage.
- AMPRE-sensitive stages include explicit grep-based compliance checks.
- Sanity schema stages keep Studio buildable and editor labels/descriptions clear.
- Future implementation PRs reference the relevant spec file.

## Suggested Commit/PR Slices

1. Docs-only roadmap and specs.
2. Foundation UI helpers and call-site migration.
3. Marketing page component extraction.
4. Forms/nav/card consolidation.
5. Sanity schema helper extraction.
6. Data/API helpers and AMPRE-safe script consolidation.
7. Final cleanup pass for obsolete local helpers or duplicated comments.
