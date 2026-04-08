<!-- Context: architecture/concepts/data-flow | Priority: critical | Version: 1.0 | Updated: 2026-04-08 -->

# Concept: Data Flow Architecture

**Core Idea**: Listings follow a write-once-read-many pattern — daily sync from AMPRE API to Upstash Redis, then all page requests read from Redis only. This ensures compliance with MLS data retrieval limits while enabling fast page loads.

**Key Points**:
- **Write path**: Vercel Cron triggers `/api/ampre/sync` daily at 06:00 UTC
- **Read path**: All pages read from Redis; no direct AMPRE API calls from components
- **Data store**: Single JSON array under `listings:all` key in Upstash Redis
- **Compliance**: 24-hour retrieval limit enforced by cron schedule; 60-day retention with automatic purging
- **Cache busting**: `revalidateTag("ampre-listings")` called after each sync

**Architecture**:
```
AMPRE API → Cron Sync → Upstash Redis → Fetch Layer → Next.js Pages
  (daily)      (1x/day)     (storage)    (read)       (render)
```

**Reference**: [Listings Implementation Guide](/Users/dardan/Documents/drenova-group/docs/listings-implementation.md)

**Related**:
- [compliance-framework.md](compliance-framework.md) — PropTx rules
- [isr-strategy.md](isr-strategy.md) — Caching details
- [sync-pipeline.md](../examples/sync-pipeline.md) — Sync workflow
