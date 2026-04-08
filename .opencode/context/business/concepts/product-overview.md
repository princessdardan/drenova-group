<!-- Context: business/concepts/product-overview | Priority: high | Version: 1.0 | Updated: 2026-04-08 -->

# Concept: Product Overview

**Core Idea**: Drenova Group is a modern real estate brokerage website combining marketing content (CMS-driven) with live MLS listings (AMPRE API), targeting buyers and sellers across Canadian markets.

**Key Points**:
- **Purpose**: Digital presence, lead generation, listing showcase, buyer/seller education
- **Audience**: Home buyers, sellers, and internal agents needing online profiles
- **Data sources**: Sanity CMS (content) + AMPRE API (listings) + Upstash Redis (listing cache)
- **Tech stack**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Sanity Studio, Vercel
- **Differentiator**: Three.js 3D homepage animation, modern design, fast performance

**In Scope**:
- Marketing pages (Home, Buy, Sell, About, Team, Contact)
- Property listings with search, filters, map
- 3D homepage hero animation
- Lead capture forms
- Mobile-responsive design
- SEO optimization

**Out of Scope (v1)**:
- CRM integration
- User accounts / saved searches
- Mortgage calculator
- Blog / content hub
- Multi-language support
- Native mobile apps

**Success Metrics**:
| Metric | Target |
|--------|--------|
| Organic traffic | 50% growth in 6 months |
| Lead submissions | 20+/month by month 3 |
| Core Web Vitals | All "Good" thresholds |
| Bounce rate | < 40% on landing pages |

**Phased Delivery**:
1. **Phase 1**: Marketing site (Home, Buy, Sell, About, Team, Contact)
2. **Phase 2**: Listings + AMPRE integration
3. **Phase 3**: Polish, accessibility, performance
4. **Phase 4**: Post-launch enhancements (blog, saved searches, CRM)

**Reference**: [Product PRD](/Users/dardan/Documents/drenova-group/docs/prd.md)

**Related**:
- [sitemap.md](../lookup/sitemap.md) — All routes
- [feature-roadmap.md](../guides/feature-roadmap.md) — Detailed phases
- [success-metrics.md](success-metrics.md) — KPIs
