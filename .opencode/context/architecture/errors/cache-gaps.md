<!-- Context: architecture/errors/cache-gaps | Priority: medium | Version: 1.0 | Updated: 2026-04-08 -->

# Errors: Known Cache Gaps

**Core Idea**: Several ISR cache tags are defined but not properly connected to the revalidation webhook, causing stale content until the 1-hour TTL expires.

**Known Issues**:

| Sanity Type | ISR Tag | In TAG_MAP? | Impact |
|-------------|---------|-------------|--------|
| `listingsPage` | `"listingsPage"` | **No** | Edits to listings page don't revalidate |
| `contactPage` | `"contactPage"` | **No** | Edits to contact page don't revalidate |
| `teamPage` | `"teamPage"` | **No** | Edits to team page don't revalidate |
| `ampre-listings` | `"ampre-listings"` | N/A | Tag not used by any `fetch()` call |

**The Problem**:

**File**: `frontend/src/app/api/revalidate/route.ts`

```typescript
const TAG_MAP: Record<string, string[]> = {
  listing: ["listing"],
  teamMember: ["teamMember"],
  // ... other types
  // MISSING: listingsPage, contactPage, teamPage
};
```

**Impact**: When content is edited in Sanity Studio:
1. Webhook sends POST to `/api/revalidate`
2. Route looks up document type in TAG_MAP
3. If type not in map → no revalidation triggered
4. Changes appear only after 3600s (1 hour) TTL

**The `ampre-listings` Disconnect**:

Sync route calls `revalidateTag("ampre-listings")` but:
- No `fetch()` call uses `next: { tags: ["ampre-listings"] }`
- AMPRE data is read via `Redis.fromEnv().get()` (not `fetch()`)
- Revalidation has no effect — data updates immediately on Redis write anyway

**Fixes Needed**:

1. **Add missing TAG_MAP entries**:
```typescript
const TAG_MAP: Record<string, string[]> = {
  // ... existing entries
  listingsPage: ["listingsPage"],
  contactPage: ["contactPage"],
  teamPage: ["teamPage"],
};
```

2. **Remove or fix `ampre-listings` tag**:
   - Option A: Remove `revalidateTag()` call from sync route (no effect anyway)
   - Option B: Add tag to Redis fetch calls if ISR caching desired

**Workaround**: 
- Manual revalidation: `curl -X POST https://<domain>/api/revalidate`
- Or wait 1 hour for TTL expiration

**Reference**: [Listings Implementation](/Users/dardan/Documents/drenova-group/docs/listings-implementation.md)

**Related**:
- [isr-strategy.md](../concepts/isr-strategy.md) — Caching architecture
- [content-not-appearing.md](../../operations/errors/content-not-appearing.md) — Troubleshooting
