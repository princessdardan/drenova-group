# AMPRE Sync API

## OVERVIEW

Route subtree for the daily AMPRE/PropTx sync. This is the only frontend code path allowed to call AMPRE directly.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Sync route | `sync/route.ts` | GET/POST handler, cron auth, AMPRE calls, Redis writes, ISR revalidation |
| Retention helpers | `sync/sync-helpers.ts` | 24-hour retrieval lock and 60-day listing retention |
| Helper tests | `sync/sync-helpers.test.ts` | Node `node:test` coverage for lock/retention behavior |
| AMPRE client | `../../../lib/ampre/client.ts` | Sync-only OData client; never use from UI/pages |
| Compliance constants | `../../../lib/ampre/compliance.ts` | Redis keys, TTLs, required fields, AI prohibition |

## CONVENTIONS

- Validate `CRON_SECRET` before sync work; Vercel Cron calls with a bearer token.
- Acquire `sync:ampre-retrieval-lock` before any AMPRE request and skip when the lock exists.
- Build queries through `buildSyncQuery()` so required display-control fields stay selected.
- Filter with `filterPermittedProperties()` before mapping or storage.
- Store public listing reads only in Redis key `listings:all`; user-facing pages read through `src/lib/ampre/fetch.ts`.
- Revalidate `ampre-listings` after successful writes.
- Tests use Node `node:test` with small fake Redis seams; keep helpers pure enough to test without network calls.

## ANTI-PATTERNS

- Do not add ad hoc AMPRE calls outside this subtree.
- Do not log AMPRE response bodies, MLS payloads, or suppressed address data.
- Do not bypass the retrieval lock, even for retries or manual syncs.
- Do not return raw MLS data from route responses.
- Do not remove `maxDuration = 120` without checking Vercel plan/runtime assumptions.
