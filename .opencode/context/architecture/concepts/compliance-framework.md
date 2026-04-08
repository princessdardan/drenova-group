<!-- Context: architecture/concepts/compliance-framework | Priority: critical | Version: 1.0 | Updated: 2026-04-08 -->

# Concept: Compliance Framework

**Core Idea**: The PropTx Data License governs all MLS data handling with strict rules on retrieval frequency, display control, retention limits, and AI/ML prohibitions. Compliance is enforced at multiple architectural layers.

**Key Points**:
- **C1 — Retrieval limit**: Max 1 AMPRE API call per 24 hours (enforced by daily cron)
- **C2 — Display control**: `perm_adv=N` listings excluded entirely; `disp_addr=N` suppresses address/coordinates
- **C3 — Retention**: Data must be refreshed or purged within 60 days of last retrieval
- **M1 — Audit logging**: All sync events logged to Redis with 90-day TTL
- **M2 — AI isolation**: MLS data must not be used for AI/ML training or inference

**Enforcement Layers**:
| Rule | Enforced In | How |
|------|-------------|-----|
| C1 | `vercel.json` cron schedule | Daily at 06:00 UTC only |
| C2 | `mapper.ts` | `filterPermittedProperties()` + `mapAmpreToListing()` |
| C3 | `sync/route.ts` step 8 | Filters `lastSeen > 60 days` |
| M1 | `sync/route.ts` | Writes `SyncLogEntry` with TTL |
| M2 | `compliance.ts` | `AI_PROHIBITION_NOTICE` constant |

**Reference**: [AMPRE Compliance Implementation](/Users/dardan/Documents/drenova-group/docs/ampre-compliance-implementation.md)

**Related**:
- [data-flow.md](data-flow.md) — Architecture overview
- [compliance-violations.md](../errors/compliance-violations.md) — Common mistakes
