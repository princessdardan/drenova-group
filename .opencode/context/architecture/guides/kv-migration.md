<!-- Context: architecture/guides/kv-migration | Priority: high | Version: 1.0 | Updated: 2026-04-08 -->

# Guide: Vercel KV → Upstash Redis Migration

**Core Idea**: Replace deprecated `@vercel/kv` with `@upstash/redis` — minimal API changes since Vercel KV was a wrapper around Upstash internally.

**Migration Steps**:

1. **Update package.json**:
   ```bash
   npm uninstall @vercel/kv
   npm install @upstash/redis
   ```

2. **Update imports** (2 files):
   ```typescript
   // BEFORE
   import { kv } from "@vercel/kv";
   
   // AFTER
   import { Redis } from "@upstash/redis";
   const redis = Redis.fromEnv();
   ```

3. **Update environment variables**:
   | Old | New |
   |-----|-----|
   | `KV_REST_API_URL` | `UPSTASH_REDIS_REST_URL` |
   | `KV_REST_API_TOKEN` | `UPSTASH_REDIS_REST_TOKEN` |

4. **Update API calls**:
   ```typescript
   // BEFORE
   await kv.set("listings:all", listings);
   const data = await kv.get("listings:all");
   
   // AFTER
   await redis.set("listings:all", listings);
   const data = await redis.get<Listing[]>("listings:all");
   ```

5. **Setup Upstash via Vercel Marketplace**:
   - Go to vercel.com/marketplace/upstash
   - Install and link to project
   - Env vars auto-injected

**Files to Modify**:
- `frontend/package.json`
- `frontend/src/app/api/ampre/sync/route.ts`
- `frontend/src/lib/ampre/fetch.ts`
- `frontend/.env.example`

**Reference**: [KV Migration PRD](/Users/dardan/Documents/drenova-group/docs/kv-migration-prd.md)

**Related**:
- [environment-variables.md](../lookup/environment-variables.md) — Full env var list
- [sync-pipeline.md](../examples/sync-pipeline.md) — How sync uses Redis
