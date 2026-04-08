<!-- Context: business/lookup/sitemap | Priority: medium | Version: 1.0 | Updated: 2026-04-08 -->

# Lookup: Sitemap

**Core Idea**: All website routes, their purposes, and data sources.

## Marketing Pages

| Route | Purpose | Data Source |
|-------|---------|-------------|
| `/` | Homepage with hero, value props, stats, testimonials | Sanity |
| `/buy` | Buyer services and process guide | Sanity |
| `/sell` | Seller services and home valuation | Sanity |
| `/about` | Company story, values, coverage areas | Sanity |
| `/team` | Team member grid | Sanity (Team Members collection) |
| `/team/[slug]` | Individual agent profile | Sanity |
| `/contact` | Contact form and office info | Sanity (Site Settings) |

## Transactional Pages

| Route | Purpose | Data Source |
|-------|---------|-------------|
| `/listings` | Property search with filters | AMPRE/Redis + Sanity (page header) |
| `/listings/[slug]` | Property detail page | AMPRE/Redis |

## Guide Pages

| Route | Purpose | Data Source |
|-------|---------|-------------|
| `/buyers-guide` | Buyer guide download/lead capture | Sanity |
| `/sellers-guide` | Seller guide download/lead capture | Sanity |

## Legal Pages

| Route | Purpose | Data Source |
|-------|---------|-------------|
| `/privacy` | Privacy policy | Sanity (Legal Pages collection) |
| `/terms` | Terms of service | Sanity (Legal Pages collection) |

## API Routes

| Route | Purpose | Auth |
|-------|---------|------|
| `/api/revalidate` | ISR cache revalidation (Sanity webhook) | `SANITY_REVALIDATE_SECRET` |
| `/api/draft/enable` | Enable draft mode preview | `SANITY_PREVIEW_SECRET` |
| `/api/draft/disable` | Disable draft mode | None |
| `/api/ampre/sync` | Daily AMPRE sync (cron job) | `CRON_SECRET` |

## Studio

| Route | Purpose |
|-------|---------|
| `/studio` | Sanity Studio (when embedded) or `https://drenova-group.sanity.studio` |

**Reference**: [Product PRD](/Users/dardan/Documents/drenova-group/docs/prd.md)

**Related**:
- [product-overview.md](../concepts/product-overview.md) — Goals and scope
- [sanity-studio-sop.md](../../operations/guides/sanity-studio-sop.md) — Content management
