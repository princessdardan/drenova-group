# Scripts

## OVERVIEW

Utility scripts for Sanity seeding, AMPRE diagnostics, and Ralph automation. Most scripts have external side effects; inspect env requirements before running.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Seed CMS content | `seed-sanity.ts` | 900+ line idempotent Sanity writer using deterministic IDs and image uploads |
| AMPRE media diagnostics | `diagnose-media.mjs` | Ad hoc MLS/media investigation helper |
| AMPRE sample fetch | `fetch-ampre-sample.mjs` | Direct AMPRE request helper; compliance-sensitive |
| Web API replication | `web-api-replicate.mjs` | Utility script for API replication work |
| Ralph loop | `ralph/AGENTS.md` | Nested instructions override this file for Ralph work |

## CONVENTIONS

- `npm run seed` executes `tsx scripts/seed-sanity.ts` from the repo root.
- `seed-sanity.ts` uses `createOrReplace` with deterministic `_id` values; keep it idempotent.
- Sanity write scripts need `SANITY_API_WRITE_TOKEN` and target project `apggi8zn`, dataset `production`.
- Seeded singleton IDs must match Studio singleton IDs and schema type names.
- Portable Text helper output must include `_type`, `_key`, `children`, and `markDefs`.
- Ralph-specific commands, PRD shape, progress logs, and commit behavior are governed by `scripts/ralph/AGENTS.md`.

## ANTI-PATTERNS

- Do not run write/sync scripts just to inspect them.
- Do not make seed data non-deterministic; repeated runs should converge to the same documents.
- Do not change seeded schema shapes without updating `backend/schemaTypes/` and frontend Sanity types/queries.
- Do not use AMPRE helper scripts casually; direct requests may count against retrieval limits.
- Do not duplicate Ralph instructions here; keep them in `scripts/ralph/AGENTS.md`.

## COMMANDS

```bash
npm run seed
node scripts/diagnose-media.mjs
node scripts/fetch-ampre-sample.mjs
node scripts/web-api-replicate.mjs
```

## NOTES

- `scripts/ralph/archive/` contains historical state and should not drive current implementation decisions unless explicitly requested.
- README references old root `prd.md`/`DESIGN.md`; current PRDs and docs live under `docs/` and `tasks/`.
