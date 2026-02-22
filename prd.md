# Drenova Group — Real Estate Website PRD

> **Version:** 1.0
> **Date:** February 19, 2026
> **Status:** Draft — Pending Stakeholder Review

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Overview](#2-project-overview)
3. [Sitemap & Page Specifications](#3-sitemap--page-specifications)
4. [Technical Architecture](#4-technical-architecture)
5. [Design & UX Requirements](#5-design--ux-requirements)
6. [SEO & Performance](#6-seo--performance)
7. [Infrastructure & DevOps](#7-infrastructure--devops)
8. [Phased Delivery Roadmap](#8-phased-delivery-roadmap)
9. [Open Decisions](#9-open-decisions)

---

## 1. Executive Summary

Drenova Group is building a modern, high-performance real estate website to serve buyers and sellers across multiple states and regions. The site will combine marketing-driven content pages (Buy, Sell, About, Team, Contact) with live MLS-powered property listings, interactive map search, and a visually distinctive design featuring Three.js 3D animations.

### Goals

- **Establish digital presence** — Position Drenova Group as a modern, tech-forward brokerage
- **Generate leads** — Capture buyer and seller leads through CTAs, forms, and listing engagement
- **Showcase listings** — Provide a fast, filterable, map-integrated property search experience
- **Educate and convert** — Use marketing content (Buy/Sell pages) to guide users through the real estate process
- **Scale across regions** — Support multi-state/regional MLS coverage with a single platform

### High-Level Scope

| In Scope | Out of Scope (v1) |
|---|---|
| Marketing pages (Home, Buy, Sell, About, Team, Contact) | CRM integration |
| Property listings with IDX/MLS feed | User accounts / saved searches |
| Interactive map-based search | Mortgage calculator / financing tools |
| 3D homepage animation (Three.js) | Blog / content hub |
| Headless CMS for marketing content | Multi-language support |
| Lead capture forms | Agent-specific portals |
| Mobile-responsive design | Native mobile apps |

---

## 2. Project Overview

### Company Context

Drenova Group is a real estate brokerage operating across multiple states/regions. The website is the primary digital touchpoint for prospective buyers and sellers researching properties and agents.

### Target Audience

| Segment | Description | Primary Goals |
|---|---|---|
| **Buyers** | Individuals and families searching for residential properties across Drenova Group's coverage areas | Browse listings, filter by criteria, view property details, contact agents |
| **Sellers** | Homeowners considering listing their property | Understand the selling process, request a valuation, connect with an agent |
| **Agents/Team** | Drenova Group's internal agents | Have a professional online presence with bio pages and contact information |

### Success Metrics

| Metric | Target | Measurement |
|---|---|---|
| Organic search traffic | 50% growth within 6 months of launch | Google Analytics |
| Lead form submissions | 20+ qualified leads/month by month 3 | Form analytics / CRM |
| Listing page engagement | Avg. session > 2 min on listing pages | Google Analytics |
| Core Web Vitals | All "Good" thresholds (LCP < 2.5s, INP < 200ms, CLS < 0.1) | PageSpeed Insights / CrUX |
| Bounce rate | < 40% on landing pages | Google Analytics |
| Mobile usage | Fully functional with > 50% mobile traffic expected | Analytics / device breakdown |

---

## 3. Sitemap & Page Specifications

### 3.1 Sitemap Overview

```
/                       → Homepage
/buy                    → Buy Page (marketing)
/sell                   → Sell Page (marketing)
/listings               → Listings Search Page
/listings/[slug]        → Property Detail Page
/about                  → About Page
/team                   → Team Page
/team/[slug]            → Individual Agent Page
/contact                → Contact Page
/privacy                → Privacy Policy
/terms                  → Terms of Service
```

---

### 3.2 Homepage (`/`)

The homepage is the primary entry point and brand statement. It should immediately communicate professionalism, regional expertise, and a modern aesthetic.

#### Hero Section
- **Three.js 3D animation** as the background/visual — architectural or abstract real estate motif (e.g., wireframe buildings, terrain mesh, or particle-based cityscape)
- Headline overlay with tagline and primary CTA ("Browse Listings" / "Sell Your Home")
- Animation must respect `prefers-reduced-motion` — fall back to a static gradient or image

#### Featured Listings
- Grid of 4–6 featured/promoted properties pulled from MLS feed
- Each card: hero image, price, address, beds/baths/sqft, "View Details" link
- CMS toggle to pin specific listings or auto-populate from MLS query (e.g., newest, highest price)

#### Value Propositions
- 3–4 concise selling points (e.g., "Multi-State Coverage", "Local Expertise", "Modern Approach")
- Icon + short copy format
- CMS-managed content

#### Additional Sections
- Testimonials carousel (CMS-managed)
- Coverage area map or region highlights
- Secondary CTA block ("Ready to get started?")
- Footer with navigation, contact info, social links, legal

---

### 3.3 Buy Page (`/buy`)

Marketing-focused content page for buyers. All content CMS-managed.

#### Content Blocks (CMS-driven)
- **Hero banner** — Headline, subheadline, CTA to listings
- **Why Buy with Drenova** — Value propositions for buyers
- **Market Trends** — Regional market data, stats, or infographics (CMS-editable)
- **Buying Process Guide** — Step-by-step timeline/process (e.g., "Search → Tour → Offer → Close")
- **Neighborhood/Area Highlights** — Cards linking to filtered listing searches by region
- **FAQ Section** — Accordion-style buyer FAQs
- **CTA Block** — "Start Your Search" / "Talk to an Agent"

#### Animations
- Subtle scroll-triggered section reveals (motion.dev)
- Optional reactbits components for interactive elements (e.g., animated cards, text effects)

---

### 3.4 Sell Page (`/sell`)

Marketing-focused content page for sellers. All content CMS-managed.

#### Content Blocks (CMS-driven)
- **Hero banner** — Headline, subheadline, CTA to contact/valuation form
- **Why Sell with Drenova** — Differentiators (marketing reach, agent expertise, market knowledge)
- **Home Valuation CTA** — Prominent card/section prompting sellers to request a valuation (leads to contact form or embedded form)
- **Selling Process Guide** — Step-by-step timeline (e.g., "Prepare → List → Market → Negotiate → Close")
- **Recent Sales / Success Stories** — Showcase sold properties or testimonials (CMS-managed)
- **FAQ Section** — Accordion-style seller FAQs
- **CTA Block** — "Get Your Home's Value" / "Connect with an Agent"

---

### 3.5 Listings Page (`/listings`)

The core transactional page. Provides a full search experience for browsing MLS-connected property listings.

#### Search & Filters
- **Search bar** — Address, city, ZIP, or MLS# input with autocomplete
- **Filter panel** (collapsible sidebar or top bar):
  - Price range (min/max sliders or inputs)
  - Bedrooms (1, 2, 3, 4, 5+)
  - Bathrooms (1, 1.5, 2, 3+)
  - Property type (Single Family, Condo, Townhouse, Multi-Family, Land)
  - Square footage range
  - Area / Region (multi-select for coverage areas)
  - Listing status (Active, Pending, Sold)
  - Sort by (Price, Date Listed, Sqft)
- URL-based filter state (querystring) for shareability and SEO

#### Map View
- **Interactive map** (Mapbox or Google Maps) showing property markers
- Map/list split-panel layout (similar to Zillow/Redfin)
- Clicking a marker shows a preview card; clicking the card navigates to the detail page
- Map bounds update as user pans/zooms; results re-query accordingly
- Cluster markers when zoomed out

#### Results Display
- **Grid/List toggle** — Grid view (cards) and list view (rows)
- Property cards: primary photo, price, address, beds/baths/sqft, days on market
- Pagination or infinite scroll
- Results count indicator (e.g., "Showing 1–24 of 312 listings")

#### Mobile Behavior
- Filters collapse into a bottom sheet or modal
- Map toggles between fullscreen map and list view (not split-panel on mobile)

---

### 3.6 Property Detail Page (`/listings/[slug]`)

Individual listing pages are critical for SEO and user engagement.

#### Content
- **Photo gallery** — Full-width carousel or lightbox with all listing photos
- **Key details header** — Price, address, beds/baths/sqft/lot size, MLS#, listing status, days on market
- **Description** — Full listing description from MLS
- **Property features** — Structured list (appliances, flooring, parking, heating/cooling, etc.)
- **Map** — Embedded map with property pin and nearby amenities
- **Neighborhood info** — Area name, school district (if available via MLS)
- **Agent contact card** — Listing agent info with contact form or CTA
- **Similar listings** — 3–4 related properties (same area, similar price)

#### SEO
- Dynamic `<title>` and `<meta description>` from listing data
- Structured data: `schema.org/RealEstateListing`
- OG image from primary listing photo

---

### 3.7 About Page (`/about`)

#### Content (CMS-managed)
- **Company story** — Founding narrative, growth, mission
- **Mission & Values** — Core values with visual treatment
- **Coverage areas** — Map or visual showing states/regions served
- **Company stats** — Key numbers (years in business, homes sold, agents, regions)
- **CTA** — "Meet Our Team" / "Get in Touch"

---

### 3.8 Team Page (`/team`)

#### Team Directory
- Grid of agent/team member cards
- Each card: headshot, name, title/role, brief tagline, contact button
- Filterable by office/region (if applicable)

#### Individual Agent Page (`/team/[slug]`)
- Full bio and headshot
- Contact information (phone, email)
- Embedded contact form (pre-filled with agent name)
- Active listings by this agent (if available from MLS)
- Testimonials (CMS-managed)

---

### 3.9 Contact Page (`/contact`)

#### Contact Form
- Fields: Name, Email, Phone, Subject (dropdown: Buying, Selling, General), Message
- Form submission sends notification email and stores lead data
- Success confirmation message

#### Office Information
- Office location(s) with address, phone, email, hours
- Embedded map with office pin(s)

#### Additional
- Quick-link CTAs ("Looking to Buy?" → /buy, "Ready to Sell?" → /sell)
- Social media links

---

## 4. Technical Architecture

### 4.1 Core Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | SSR/ISR for SEO, React Server Components, file-based routing, image optimization |
| **Language** | TypeScript | Type safety, better DX, reduced runtime errors |
| **Styling** | Tailwind CSS 4 | Utility-first, rapid development, consistent design tokens |
| **3D Graphics** | Three.js + React Three Fiber | Homepage hero and marketing page 3D animations |
| **UI Animation** | motion.dev (Motion for React) | Production-grade, React-native animation primitives |
| **UI Components** | reactbits | Pre-built animated components for visual flair (used sparingly) |
| **Headless CMS** | Sanity (recommended — see 4.3) | Marketing page content management |
| **IDX/MLS** | See comparison (4.4) | Live property listing data |
| **Maps** | Mapbox GL JS (recommended — see 4.5) | Interactive map search for listings |
| **Deployment** | Vercel | Native Next.js hosting, edge functions, preview deployments |
| **Analytics** | Google Analytics 4 + Vercel Analytics | Traffic, engagement, Core Web Vitals |

### 4.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Vercel Edge                         │
│                  (CDN, Edge Functions, ISR)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Next.js 15 App Router                                     │
│   ├── Server Components (default)                           │
│   ├── Client Components (interactive elements)              │
│   ├── API Routes (/api/*)                                   │
│   │   ├── /api/contact    → Lead capture                    │
│   │   ├── /api/revalidate → On-demand ISR webhook           │
│   │   └── /api/listings   → Proxy/cache for MLS queries     │
│   └── Middleware (redirects, geo, A/B)                      │
│                                                             │
├──────────────┬──────────────┬───────────────────────────────┤
│              │              │                               │
│   Sanity     │   MLS/IDX    │   Mapbox                      │
│   (CMS)      │   (Listings) │   (Maps)                      │
│              │              │                               │
│  Marketing   │  Property    │  Interactive                  │
│  content,    │  data, photos│  listing map,                 │
│  team bios,  │  via API     │  geocoding,                   │
│  testimonials│              │  address search               │
└──────────────┴──────────────┴───────────────────────────────┘
```

### 4.3 Headless CMS Comparison

The CMS manages all non-listing content: Buy/Sell page blocks, About, Team bios, testimonials, and homepage sections.

| Criteria | Strapi | Contentful | Sanity |
|---|---|---|---|
| **Hosting** | Self-hosted or Strapi Cloud | SaaS (hosted) | SaaS (hosted) |
| **Pricing** | Free (self-hosted); Cloud from $29/mo | Free tier; Paid from $300/mo | Free tier (generous); Pay-as-you-go |
| **Content Modeling** | GUI-based, flexible | GUI-based, structured | Code-defined schemas (max flexibility) |
| **Real-Time Editing** | Limited | Supported | Best-in-class (Google Docs-style) |
| **Query Language** | REST / GraphQL | REST / GraphQL | GROQ (powerful, custom query language) + GraphQL |
| **Next.js Integration** | Good (REST/GraphQL) | Excellent (official SDK) | Excellent (official Next.js toolkit, live preview) |
| **Media Handling** | Built-in upload | Built-in CDN | Built-in CDN + image transformations |
| **Learning Curve** | Low (familiar admin panel) | Low-Medium | Medium (code-first schemas) |
| **Vendor Lock-in** | Low (open source) | High (proprietary) | Medium (proprietary but portable data) |
| **Live Preview** | Community plugins | Supported | First-class support with Next.js |

#### Recommendation: **Sanity**

- **Generous free tier** — Sufficient for a site of this scale without upfront cost
- **Best developer experience with Next.js** — Official toolkit, live preview, real-time editing
- **GROQ query language** — More expressive than REST for complex content queries
- **Code-defined schemas** — Content models live in the codebase alongside the site, enabling version control
- **Real-time collaboration** — Content editors can work simultaneously
- **Sanity Studio** — Embeddable, customizable admin UI that can be hosted at `/studio` within the Next.js app

Strapi is a strong alternative if self-hosting and full data ownership are priorities. Contentful's pricing makes it less attractive for a project of this scale.

### 4.4 IDX / MLS Integration Comparison

The real estate industry is transitioning from legacy RETS feeds to modern RESO Web API standards. The choice of IDX integration determines how property data flows into the site.

| Provider | Type | Coverage | Developer Experience | Pricing Model | Key Consideration |
|---|---|---|---|---|---|
| **Repliers** | API-first platform | 500+ MLS systems (US & Canada) | REST API, well-documented, handles DLA/compliance | Subscription-based | Handles MLS licensing/compliance on your behalf; modern DX |
| **IDX Broker** | Widget/iFrame + API | 600+ MLS systems (US) | Widgets (quick) or API (custom); less developer control | Monthly subscription | Easier setup; less design flexibility with widget approach |
| **Spark API (FBS)** | Direct RESO Web API | FBS/Flexmls MLS systems | Modern RESTful API | Per-MLS licensing | Direct MLS access; requires MLS-specific agreements |
| **SimplyRETS** | Abstraction layer over RETS/RESO | Varies by MLS | Simple REST API, good docs | Monthly subscription | Simplifies RETS complexity; limited to supported MLSs |
| **MLS Grid / Bridge / Trestle** | RESO Web API platforms | Regional MLS coverage | Standardized RESO Web API | MLS-specific | Industry standard but requires direct MLS relationships |

#### Recommendation: Evaluate **Repliers** and **IDX Broker**

The best choice depends on Drenova Group's specific MLS coverage requirements:

- **Repliers** is the top choice for a fully custom-built experience. It provides a clean REST API, handles MLS licensing/compliance, and supports both US and Canadian markets. The API-first approach gives full design control over how listings are displayed.
- **IDX Broker** is the fastest path to launch. Their widget-based approach can get listings on the site quickly, with an API available for custom integration later. The trade-off is less design control.

**Action required:** Identify which MLS systems cover Drenova Group's regions, then confirm provider coverage and pricing.

### 4.5 Map Integration Comparison

| Criteria | Mapbox GL JS | Google Maps Platform |
|---|---|---|
| **Customization** | Fully customizable styles (Mapbox Studio) | Limited styling options |
| **3D Support** | Built-in 3D terrain and buildings | Limited 3D (WebGL overlay) |
| **Pricing** | 50K free map loads/mo; ~$3K/mo at 1M loads | 28.5K free loads/mo; ~$4.8K/mo at 1M loads |
| **Real Estate Fit** | Purpose-built real estate map solutions | General-purpose, widely recognized |
| **Geocoding** | Mapbox Search API (375M+ addresses) | Google Geocoding API (industry standard) |
| **Clustering** | Native support via Supercluster | MarkerClusterer library |
| **React Support** | react-map-gl (Vis.gl) | @vis.gl/react-google-maps |
| **Offline Support** | Yes (download regions) | Limited |

#### Recommendation: **Mapbox GL JS**

- **Better real estate fit** — Purpose-built tooling for property listing maps
- **Superior customization** — Mapbox Studio allows branded map styles that align with Drenova Group's visual identity
- **Cost-effective at scale** — ~37% cheaper than Google Maps at high traffic
- **3D capabilities** — Pairs well with the site's Three.js aesthetic
- **react-map-gl** — Mature React wrapper with excellent DX

### 4.6 Animation Strategy

The site uses a **layered animation approach**:

| Layer | Technology | Use Cases |
|---|---|---|
| **3D scenes** | Three.js + React Three Fiber | Homepage hero, marketing page visuals |
| **UI transitions** | motion.dev (Motion for React) | Page transitions, scroll-triggered reveals, hover effects, layout animations |
| **Decorative components** | reactbits | Text effects, background animations, interactive cards (used sparingly for visual impact) |
| **CSS** | Tailwind CSS transitions/animations | Micro-interactions (button hovers, focus states, loading states) |

**Key principle:** Animations should enhance — not distract. Marketing pages (Home, Buy, Sell) use more visual flair; transactional pages (Listings, Detail) prioritize speed and clarity.

---

## 5. Design & UX Requirements

### 5.1 Visual Identity

- **Aesthetic:** Clean, professional, modern — with subtle 3D/animated touches that differentiate from generic real estate sites
- **Typography:** Sans-serif primary (e.g., Inter, Plus Jakarta Sans); clean hierarchy for headings, body, and data
- **Color palette:** To be defined by design phase — recommend a neutral base (whites, grays) with a bold accent color
- **Photography:** High-quality property photos from MLS; styled photography for marketing pages

### 5.2 Responsive Design

- **Mobile-first** approach — design for mobile breakpoints first, progressively enhance for tablet and desktop
- **Breakpoints:** `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px) — Tailwind defaults
- **Critical mobile considerations:**
  - Listings map: Toggle between map and list (not split-panel)
  - Filters: Bottom sheet or fullscreen modal
  - Navigation: Hamburger menu with slide-out drawer
  - Property photos: Swipeable gallery
  - Contact forms: Full-width, touch-friendly inputs

### 5.3 Accessibility

| Requirement | Implementation |
|---|---|
| **WCAG 2.1 AA** | Minimum compliance level for all pages |
| **Reduced motion** | `prefers-reduced-motion` media query — disable Three.js scenes, replace motion.dev animations with instant transitions, disable reactbits effects |
| **Keyboard navigation** | All interactive elements focusable and operable via keyboard |
| **Screen readers** | Semantic HTML, ARIA labels for interactive components, alt text for all images |
| **Color contrast** | Minimum 4.5:1 for body text, 3:1 for large text |
| **Focus indicators** | Visible focus rings on all interactive elements |
| **Form accessibility** | Labels associated with inputs, error messages linked to fields, required field indicators |

### 5.4 Animation Guidelines

1. **Purpose over decoration** — Every animation should serve a UX purpose (guide attention, provide feedback, establish hierarchy)
2. **Performance budget** — Animations must not degrade Core Web Vitals; Three.js scenes lazy-loaded and off-main-thread where possible
3. **Duration limits** — Transitions: 150–300ms; Reveals: 300–500ms; 3D scenes: continuous but subtle
4. **Reduced motion fallback** — All animated content must have a meaningful static alternative
5. **Sparingly on transactional pages** — Listings search and property detail pages should prioritize speed; reserve visual flair for marketing pages

---

## 6. SEO & Performance

### 6.1 Rendering Strategy

| Page Type | Rendering | Revalidation | Rationale |
|---|---|---|---|
| Homepage | ISR | 60 minutes | Featured listings update periodically; marketing content changes infrequently |
| Buy / Sell | ISR | 24 hours | CMS content changes infrequently |
| Listings Search | SSR (dynamic) | — | Filters/queries are dynamic; server-render for SEO with client-side updates |
| Property Detail | ISR | 30 minutes + on-demand | Balance freshness (price/status changes) with performance; webhook triggers on-demand revalidation |
| About / Team | ISR | 24 hours | Rarely changes |
| Contact | Static (SSG) | Build-time | Content is static |

### 6.2 Core Web Vitals Targets

| Metric | Target | Strategy |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s | `next/image` with `priority` for hero images; ISR for pre-rendered pages; lazy-load Three.js |
| **INP** (Interaction to Next Paint) | < 200ms | Keep client-side JS minimal; use Server Components by default; optimize event handlers |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Explicit `width`/`height` on images; skeleton loaders for dynamic content; font `display: swap` with size-adjust |

### 6.3 Structured Data

```jsonc
// Property Detail Pages — schema.org/RealEstateListing
{
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "name": "123 Main St, Springfield, IL",
  "description": "Beautiful 3-bed, 2-bath home...",
  "url": "https://drenovagroup.com/listings/123-main-st-springfield-il",
  "datePosted": "2026-02-01",
  "image": ["https://..."],
  "offers": {
    "@type": "Offer",
    "price": "350000",
    "priceCurrency": "USD"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "Springfield",
    "addressRegion": "IL",
    "postalCode": "62701"
  }
}
```

Additional structured data:
- `Organization` schema on About page
- `Person` schema on Team/Agent pages
- `ContactPage` schema on Contact page
- `BreadcrumbList` on all pages

### 6.4 Meta & OG Tags

All pages must include:

- Dynamic `<title>` — e.g., `"3 Bed, 2 Bath in Springfield, IL — $350,000 | Drenova Group"`
- Dynamic `<meta name="description">` — Unique per page, drawn from content/listing data
- `og:title`, `og:description`, `og:image`, `og:url` — For social sharing
- `twitter:card` (`summary_large_image` for listings), `twitter:title`, `twitter:description`, `twitter:image`
- Canonical URLs on all pages
- `robots` directives (noindex pagination pages, expired listings)

### 6.5 Additional SEO

- **XML Sitemap** — Auto-generated, includes all listing pages, submitted to Google Search Console
- **Robots.txt** — Allow all public pages; disallow `/studio`, `/api`
- **Clean URLs** — Descriptive slugs (e.g., `/listings/123-main-st-springfield-il`)
- **Internal linking** — Listings link to area pages, team pages link to their listings
- **Image optimization** — `next/image` with WebP/AVIF, descriptive alt text from listing data
- **Page speed** — Target 90+ Lighthouse performance score

---

## 7. Infrastructure & DevOps

### 7.1 Hosting & Deployment

| Component | Service | Notes |
|---|---|---|
| **Application Hosting** | Vercel | Native Next.js support, automatic ISR, edge network |
| **CMS Hosting** | Sanity (managed) | Hosted by Sanity — no infrastructure to manage |
| **Domain & DNS** | Vercel DNS or Cloudflare | SSL auto-provisioned by Vercel |
| **Media/Assets** | Sanity CDN + MLS photo URLs | Marketing images via Sanity; listing photos from MLS CDN |
| **Email (transact.)** | Resend or SendGrid | Contact form notifications, lead alerts |

### 7.2 Environment Strategy

| Environment | Branch | URL | Purpose |
|---|---|---|---|
| **Production** | `main` | `drenovagroup.com` | Live site |
| **Staging** | `staging` | `staging.drenovagroup.com` | Pre-release QA |
| **Preview** | Feature branches | `*.vercel.app` (auto) | PR previews — auto-deployed by Vercel |
| **Local** | — | `localhost:3000` | Development |

### 7.3 CI/CD Pipeline

```
Push to branch
  → Vercel auto-build
  → TypeScript type checking
  → ESLint + Prettier
  → Unit tests (Vitest)
  → E2E tests (Playwright) — on staging/main
  → Preview deployment (branches) or Production deployment (main)
```

### 7.4 Monitoring & Error Tracking

| Tool | Purpose |
|---|---|
| **Vercel Analytics** | Core Web Vitals, real-user monitoring |
| **Google Analytics 4** | Traffic, conversions, audience insights |
| **Sentry** | Error tracking, performance monitoring |
| **Uptime monitoring** | Vercel or BetterStack for uptime alerts |

---

## 8. Phased Delivery Roadmap

### Phase 1 — Foundation & Marketing Pages

**Goal:** Launch the marketing site with static/CMS content — no listings yet.

- Project scaffolding (Next.js 15, TypeScript, Tailwind CSS 4, Sanity)
- Homepage with Three.js hero animation
- Buy page (CMS content)
- Sell page (CMS content)
- About page
- Team page with agent profiles
- Contact page with lead capture form
- Global layout (header, footer, navigation)
- Responsive design across all pages
- SEO fundamentals (meta tags, structured data, sitemap)
- Vercel deployment pipeline
- Analytics setup (GA4, Vercel Analytics)

**Deliverable:** Live marketing site at `drenovagroup.com`

---

### Phase 2 — Listings & IDX Integration

**Goal:** Add live property listings with search and map.

- IDX/MLS provider integration (API connection, data mapping)
- Listings search page with filters
- Mapbox map integration (markers, clustering, search-by-area)
- Grid/list toggle view
- Property detail pages with photo gallery
- ISR + on-demand revalidation for listing pages
- Listing-specific SEO (structured data, dynamic meta tags)
- Similar listings component
- Mobile optimization for map/filter experience

**Deliverable:** Full listing search experience live

---

### Phase 3 — Polish & Optimization

**Goal:** Refine UX, performance, and lead capture.

- Animation polish (motion.dev page transitions, scroll reveals)
- reactbits component integration for marketing pages
- Performance optimization (Lighthouse 90+, Core Web Vitals)
- Accessibility audit and WCAG 2.1 AA compliance
- E2E test coverage (Playwright)
- Error tracking (Sentry)
- Lead form enhancements (email notifications, validation)
- Cross-browser and device testing

**Deliverable:** Production-ready, optimized site

---

### Phase 4 — Enhancements (Post-Launch)

**Goal:** Iterate based on user feedback and analytics.

- Blog / content hub (SEO-driven content marketing)
- Saved searches / email alerts (user accounts)
- CRM integration for lead management
- Mortgage calculator or financing tools
- Agent-specific listing pages
- A/B testing on CTAs and landing pages
- Performance monitoring and iteration

---

## 9. Open Decisions

The following items require further research, stakeholder input, or vendor evaluation before development begins.

| Decision | Options | Owner | Deadline | Notes |
|---|---|---|---|---|
| **IDX/MLS Provider** | Repliers, IDX Broker, SimplyRETS, direct RESO API | Engineering + Business | Before Phase 2 | Depends on which MLS systems cover Drenova Group's regions; need to confirm pricing and data access |
| **CMS Confirmation** | Sanity (recommended), Strapi, Contentful | Engineering | Before Phase 1 | Sanity recommended; stakeholders to confirm comfort with code-defined schemas |
| **Map Provider** | Mapbox (recommended), Google Maps | Engineering | Before Phase 2 | Mapbox recommended for cost, customization, and real estate fit |
| **Domain & Branding** | `drenovagroup.com` or alternative | Business | Before Phase 1 | Confirm domain ownership and DNS configuration |
| **Email Service** | Resend, SendGrid | Engineering | Before Phase 1 | For transactional emails (contact form submissions, lead notifications) |
| **Design System** | Custom, based on Tailwind + custom tokens | Design + Engineering | Before Phase 1 | Color palette, typography scale, component library scope |
| **MLS Coverage Areas** | Specific states/regions | Business | Before Phase 2 | Determines IDX provider selection and listing page structure |
| **Analytics & Privacy** | GA4, cookie consent, privacy policy scope | Business + Legal | Before Phase 1 | CCPA/GDPR considerations for lead capture forms |
| **Three.js Scene Concept** | Architectural, abstract, terrain-based | Design | Before Phase 1 | Define the 3D visual direction for homepage hero |

---

*This document should be treated as a living artifact. Update it as decisions are made and requirements evolve.*
