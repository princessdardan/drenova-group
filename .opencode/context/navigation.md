# Context Index

**Purpose**: Master navigation for all project context organized by function.

---

## Categories

### [Architecture](architecture/navigation.md)
System design, data flow patterns, integration architecture, and infrastructure decisions.

**When to use**: Understanding how AMPRE, Redis, Sanity, and Next.js work together; compliance requirements; caching strategy.

**Key files**:
- [Data Flow](architecture/concepts/data-flow.md) — AMPRE → Redis → Frontend pipeline
- [Compliance Framework](architecture/concepts/compliance-framework.md) — PropTx Data License rules
- [KV Migration Guide](architecture/guides/kv-migration.md) — Vercel KV → Upstash Redis
- [Environment Variables](architecture/lookup/environment-variables.md) — Required env vars

---

### [Development](development/navigation.md)
Coding patterns, implementation details, TypeScript types, and development workflows.

**When to use**: Writing code for AMPRE integration, listing filters, data mapping; understanding type definitions.

**Key files**:
- [Type Definitions](development/lookup/type-definitions.md) — Listing, AmpreProperty interfaces
- [Creating AMPRE Client](development/guides/creating-ampre-client.md) — HTTP client implementation
- [Filtering Pattern](development/concepts/filtering-pattern.md) — In-memory filter/sort/paginate
- [Select Fields](development/lookup/select-fields.md) — OData $select field list

---

### [Operations](operations/navigation.md)
Deployment procedures, content management guides, troubleshooting, and runbooks.

**When to use**: Deploying to production, managing content in Sanity Studio, troubleshooting issues.

**Key files**:
- [Sanity Studio SOP](operations/guides/sanity-studio-sop.md) — Content editor handbook
- [Deployment Checklist](operations/guides/deployment-checklist.md) — Pre-launch steps
- [Hero Video Guide](operations/guides/hero-video-guide.md) — Video background setup
- [Content Not Appearing](operations/errors/content-not-appearing.md) — Troubleshooting

---

### [Business](business/navigation.md)
Product requirements, business logic, domain knowledge, and feature roadmap.

**When to use**: Understanding product goals, user personas, success metrics; planning new features.

**Key files**:
- [Product Overview](business/concepts/product-overview.md) — Goals and scope
- [Sitemap](business/lookup/sitemap.md) — All routes and purposes

---

## Quick Reference

**I need to...** | **Go to**
---|---
Understand the data pipeline | [Architecture → Data Flow](architecture/concepts/data-flow.md)
Set up environment variables | [Architecture → Environment Variables](architecture/lookup/environment-variables.md)
Migrate from Vercel KV | [Architecture → KV Migration](architecture/guides/kv-migration.md)
Learn Sanity Studio | [Operations → Sanity SOP](operations/guides/sanity-studio-sop.md)
Deploy to production | [Operations → Deployment Checklist](operations/guides/deployment-checklist.md)
Fix content not appearing | [Operations → Content Not Appearing](operations/errors/content-not-appearing.md)
Build AMPRE client | [Development → Creating AMPRE Client](development/guides/creating-ampre-client.md)
Understand Listing types | [Development → Type Definitions](development/lookup/type-definitions.md)
See all routes | [Business → Sitemap](business/lookup/sitemap.md)

---

## Source Documentation

All context extracted from:
- `docs/prd.md` — Product requirements
- `docs/listings-implementation.md` — Technical implementation
- `docs/ampre-integration-prd.md` — AMPRE integration specs
- `docs/kv-migration-prd.md` — Storage migration
- `docs/sanity-studio-sop.md` — Content management
- `docs/deployment-manual-steps.md` — Deployment procedures
- `docs/hero-video-guide.md` — Video backgrounds

---

*Last updated: 2026-04-08*
