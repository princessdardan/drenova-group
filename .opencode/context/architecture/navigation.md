<!-- Context: architecture/navigation | Priority: critical | Version: 1.0 | Updated: 2026-04-08 -->

# Architecture Context

**Purpose**: System design, data flow patterns, and integration architecture for the Drenova Group real estate platform.

---

## Quick Navigation

### Concepts
| File | Description | Priority |
|------|-------------|----------|
| [data-flow.md](concepts/data-flow.md) | AMPRE → Redis → Frontend data pipeline | critical |
| [compliance-framework.md](concepts/compliance-framework.md) | PropTx Data License rules | critical |
| [isr-strategy.md](concepts/isr-strategy.md) | Next.js caching and revalidation | high |
| [cms-integration.md](concepts/cms-integration.md) | Sanity CMS role and boundaries | high |

### Examples
| File | Description | Priority |
|------|-------------|----------|
| [sync-pipeline.md](examples/sync-pipeline.md) | Daily sync job workflow | high |
| [listing-detail-flow.md](examples/listing-detail-flow.md) | Page request data flow | medium |

### Guides
| File | Description | Priority |
|------|-------------|----------|
| [kv-migration.md](guides/kv-migration.md) | Vercel KV → Upstash Redis migration | high |
| [ampre-integration.md](guides/ampre-integration.md) | AMPRE API integration steps | high |

### Lookup
| File | Description | Priority |
|------|-------------|----------|
| [environment-variables.md](lookup/environment-variables.md) | Required env vars | critical |
| [api-endpoints.md](lookup/api-endpoints.md) | Internal API routes | medium |
| [file-locations.md](lookup/file-locations.md) | Key source files | medium |

### Errors
| File | Description | Priority |
|------|-------------|----------|
| [cache-gaps.md](errors/cache-gaps.md) | Known ISR cache issues | medium |
| [compliance-violations.md](errors/compliance-violations.md) | Common compliance mistakes | high |

---

## Loading Strategy

**For AMPRE/data work**:
1. Load concepts/data-flow.md
2. Load concepts/compliance-framework.md
3. Reference guides/ampre-integration.md for implementation

**For caching issues**:
1. Load concepts/isr-strategy.md
2. Load errors/cache-gaps.md

**For migration work**:
1. Load guides/kv-migration.md
2. Load lookup/environment-variables.md
