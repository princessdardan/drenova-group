# PRD: Sanity CMS Frontend Integration

## Introduction

Replace all hardcoded dummy data in the Next.js frontend with live content from Sanity CMS. This connects the existing 16-schema Sanity backend (project `apggi8zn`, dataset `production`) to the 10-page frontend using `next-sanity`, Sanity's image pipeline, and live preview/draft mode — making the site fully content-managed.

## Goals

- Every page that currently imports from `dummy-data.ts` fetches from Sanity instead
- Content editors can publish changes in Sanity Studio and see them reflected on the frontend without code deploys
- Draft/preview mode lets editors see unpublished changes on the frontend in real-time
- All images use Sanity's CDN with hotspot/crop support via `@sanity/image-url`
- Seed Sanity with the existing dummy data so the site works immediately after integration
- Type-safe GROQ queries with generated TypeScript types

## User Stories

### US-001: Install and configure `next-sanity` and `@sanity/image-url`
**Description:** As a developer, I need the Sanity client libraries installed and configured in the frontend workspace so all pages can query Sanity.

**Acceptance Criteria:**
- [ ] `next-sanity` and `@sanity/image-url` are installed in the `frontend` workspace
- [ ] `frontend/src/lib/sanity/client.ts` exports a configured Sanity client with `projectId`, `dataset`, `apiVersion`, and `useCdn`
- [ ] `frontend/src/lib/sanity/image.ts` exports an `urlFor()` helper that wraps `@sanity/image-url` for the configured client
- [ ] Environment variables `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_API_READ_TOKEN` are defined in `.env.local` (gitignored)
- [ ] `next.config.ts` allows Sanity CDN image domain (`cdn.sanity.io`)
- [ ] Typecheck passes (`npm run build`)

---

### US-002: Create typed GROQ query functions for document types
**Description:** As a developer, I need a centralized data-access layer with typed query functions so every page fetches data consistently.

**Acceptance Criteria:**
- [ ] `frontend/src/lib/sanity/queries.ts` exports GROQ query strings for: listings, teamMembers, testimonials, FAQs, coverageAreas, companyStats, companyValues, valuePropositions
- [ ] `frontend/src/lib/sanity/queries.ts` exports GROQ query strings for singletons: siteSettings, homePage, aboutPage, buyPage, sellPage
- [ ] `frontend/src/lib/sanity/fetch.ts` exports typed async fetch functions (e.g., `getListings()`, `getTeamMembers()`, `getHomePage()`, etc.) that call `sanityFetch()` with the correct query and return typed results
- [ ] GROQ projections match the shape of existing TypeScript interfaces (`Listing`, `TeamMember`, `Testimonial`) so downstream components don't break
- [ ] Sanity image references are resolved via projection (returning asset URL or `_ref` for `urlFor()`)
- [ ] Typecheck passes

---

### US-003: Update TypeScript types for Sanity data shapes
**Description:** As a developer, I need the existing types updated to accommodate Sanity's data format (e.g., `slug` becomes `{ current: string }`, `image` becomes a Sanity image reference, `bio` becomes Portable Text).

**Acceptance Criteria:**
- [ ] `frontend/src/types/listing.ts` — `image` field type updated for Sanity image reference; `slug` field supports `string` or `{ current: string }` as needed
- [ ] `frontend/src/types/team.ts` — `bio` field type updated from `string` to Portable Text array; `image` field updated for Sanity image reference
- [ ] `frontend/src/types/testimonial.ts` — No changes expected (plain text fields)
- [ ] New types added for singleton pages (`HomePage`, `AboutPage`, `BuyPage`, `SellPage`, `SiteSettings`) in `frontend/src/types/`
- [ ] New types added for supporting documents (`FAQ`, `CoverageArea`, `CompanyStat`, `CompanyValue`, `ValueProposition`)
- [ ] All existing components still typecheck after type changes
- [ ] Typecheck passes

---

### US-004: Integrate Homepage (`/`) with Sanity
**Description:** As a content editor, I want the homepage to display content from Sanity so I can update the hero, featured listings, value propositions, and testimonial without code changes.

**Acceptance Criteria:**
- [ ] Hero section pulls `image`, `overline`, `title`, `subtitle` from `homePage.hero` singleton
- [ ] Featured listings section pulls from `homePage.featuredListings` references (up to 6), falling back to 6 active listings if no references are set
- [ ] Value propositions section pulls from `valueProposition` documents ordered by `order`
- [ ] Testimonial section pulls from `testimonial` documents (first one)
- [ ] `aboutSectionTitle` and `aboutSectionContent` from `homePage` singleton render in the about preview section
- [ ] Images use `urlFor()` helper with Sanity CDN
- [ ] No imports from `dummy-data.ts` remain on this page
- [ ] Typecheck passes
- [ ] Verify in browser using dev server

---

### US-005: Integrate About Page (`/about`) with Sanity
**Description:** As a content editor, I want the about page to display content from Sanity so I can update the hero, company story, stats, values, and coverage areas.

**Acceptance Criteria:**
- [ ] Hero section pulls from `aboutPage.hero` singleton
- [ ] Company story section renders `aboutPage.storyContent` (Portable Text) and `aboutPage.storyImage`
- [ ] Company stats section pulls from `companyStat` documents ordered by `order`
- [ ] Company values section pulls from `companyValue` documents ordered by `order`
- [ ] Coverage areas section pulls from `coverageArea` documents ordered by `order`
- [ ] No imports from `dummy-data.ts` remain on this page
- [ ] Typecheck passes
- [ ] Verify in browser using dev server

---

### US-006: Integrate Buy Page (`/buy`) with Sanity
**Description:** As a content editor, I want the buy page to display content from Sanity so I can update the hero, benefits, buying steps, FAQs, and coverage areas.

**Acceptance Criteria:**
- [ ] Hero section pulls from `buyPage.hero` singleton
- [ ] Benefits section pulls from `buyPage.benefits` array
- [ ] Process steps section pulls from `buyPage.processSteps` array
- [ ] FAQs section pulls from `faq` documents filtered by `category == "buyer"`, ordered by `order`
- [ ] Coverage areas section pulls from `coverageArea` documents ordered by `order`
- [ ] No imports from `dummy-data.ts` remain on this page
- [ ] Typecheck passes
- [ ] Verify in browser using dev server

---

### US-007: Integrate Sell Page (`/sell`) with Sanity
**Description:** As a content editor, I want the sell page to display content from Sanity so I can update the hero, benefits, selling steps, FAQs, and success stories.

**Acceptance Criteria:**
- [ ] Hero section pulls from `sellPage.hero` singleton
- [ ] Benefits section pulls from `sellPage.benefits` array
- [ ] Process steps section pulls from `sellPage.processSteps` array
- [ ] Success stories section pulls from `testimonial` documents whose `detail` contains "Sold" (max 3)
- [ ] FAQs section pulls from `faq` documents filtered by `category == "seller"`, ordered by `order`
- [ ] No imports from `dummy-data.ts` remain on this page
- [ ] Typecheck passes
- [ ] Verify in browser using dev server

---

### US-008: Integrate Listings Page (`/listings`) with Sanity
**Description:** As a content editor, I want the listings page to display all property listings from Sanity.

**Acceptance Criteria:**
- [ ] All listings are fetched from Sanity `listing` documents
- [ ] Listing count display reflects actual Sanity document count
- [ ] `PropertyCard` renders Sanity image via `urlFor()` with proper dimensions
- [ ] Filter UI dropdowns remain in place (non-functional is fine — state management is Phase 2)
- [ ] No imports from `dummy-data.ts` remain on this page
- [ ] Typecheck passes
- [ ] Verify in browser using dev server

---

### US-009: Integrate Team Pages (`/team` and `/team/[slug]`) with Sanity
**Description:** As a content editor, I want team pages to display agent profiles from Sanity so I can add/remove/edit team members without code changes.

**Acceptance Criteria:**
- [ ] `/team` fetches all `teamMember` documents and renders `TeamMemberCard` for each
- [ ] `/team/[slug]` fetches a single `teamMember` by slug
- [ ] `generateStaticParams` queries Sanity for all team member slugs
- [ ] `generateMetadata` uses Sanity data for dynamic meta titles/descriptions
- [ ] Agent bio renders as Portable Text (rich text with formatting) using `@portabletext/react`
- [ ] Agent images use `urlFor()` helper
- [ ] `notFound()` returned for invalid slugs
- [ ] No imports from `dummy-data.ts` remain on these pages
- [ ] Typecheck passes
- [ ] Verify in browser using dev server

---

### US-010: Integrate Header and Footer with Sanity site settings
**Description:** As a content editor, I want the site header and footer to pull company info from Sanity's `siteSettings` singleton so I can update contact details and social links globally.

**Acceptance Criteria:**
- [ ] Footer pulls `companyName`, `phone`, `email`, `address`, and `socialLinks` from `siteSettings`
- [ ] Social links in footer are conditionally rendered (only show if URL is set in Sanity)
- [ ] Header navigation links remain hardcoded (route structure is code-defined)
- [ ] Data is fetched in `layout.tsx` and passed down, or fetched directly in footer component
- [ ] Typecheck passes
- [ ] Verify in browser using dev server

---

### US-011: Update components for Sanity image pipeline
**Description:** As a developer, I need `PropertyCard`, `TeamMemberCard`, and `Hero` to accept Sanity image references and render them via `urlFor()` with proper sizing and hotspot/crop.

**Acceptance Criteria:**
- [ ] `PropertyCard` accepts a Sanity image reference and uses `urlFor(image).width(800).height(600).url()` (or similar)
- [ ] `TeamMemberCard` accepts a Sanity image reference and uses `urlFor(image).width(600).height(800).url()`
- [ ] `Hero` accepts a Sanity image reference and uses `urlFor(image).width(1920).height(1080).url()`
- [ ] All components retain `alt` text from the Sanity image's `alt` field
- [ ] Hotspot/crop metadata from Sanity is respected via `urlFor().fit("crop")`
- [ ] `next.config.ts` includes `cdn.sanity.io` in `images.remotePatterns`
- [ ] Typecheck passes
- [ ] Verify in browser — images render correctly with no broken sources

---

### US-012: Install `@portabletext/react` and create Portable Text renderer
**Description:** As a developer, I need a Portable Text rendering component to display rich text content from Sanity (team member bios, about page story).

**Acceptance Criteria:**
- [ ] `@portabletext/react` is installed in the `frontend` workspace
- [ ] `frontend/src/components/ui/portable-text.tsx` exports a `PortableTextRenderer` component wrapping `<PortableText>` with styled block components (headings, paragraphs, links, lists, images)
- [ ] Component styles match the existing typography system (font-display for headings, font-sans for body, text-accent for links)
- [ ] Used in `/team/[slug]` for bio rendering and `/about` for story content
- [ ] Typecheck passes
- [ ] Verify in browser using dev server

---

### US-013: Set up draft mode and live preview with `next-sanity`
**Description:** As a content editor, I want to preview unpublished draft changes on the frontend in real-time so I can review content before publishing.

**Acceptance Criteria:**
- [ ] Next.js Draft Mode is enabled via API route (`/api/draft/enable` and `/api/draft/disable`)
- [ ] `next-sanity`'s `defineLive()` or equivalent live preview mechanism is configured
- [ ] When draft mode is active, pages show draft (unpublished) content from Sanity
- [ ] When draft mode is inactive, pages show only published content
- [ ] A visual indicator (banner or badge) shows when the user is viewing draft content
- [ ] Sanity Studio can open a preview of the frontend via an iframe or link (optional — can be a follow-up)
- [ ] `SANITY_API_READ_TOKEN` is used for authenticated requests in draft mode
- [ ] Typecheck passes
- [ ] Verify in browser — toggling draft mode shows draft vs. published content

---

### US-014: Configure ISR/revalidation for Sanity content
**Description:** As a developer, I need pages to revalidate when content changes in Sanity so the site stays up-to-date without full rebuilds.

**Acceptance Criteria:**
- [ ] A revalidation webhook route exists at `/api/revalidate` that accepts Sanity webhook payloads
- [ ] The webhook calls `revalidateTag()` or `revalidatePath()` for the relevant pages when documents change
- [ ] Sanity webhook is configured (documented in README or `.env.example`) to POST to the revalidation endpoint on document publish
- [ ] A shared webhook secret (`SANITY_REVALIDATE_SECRET`) is used to authenticate webhook requests
- [ ] Time-based revalidation fallback is set (e.g., `revalidate = 3600` for 1-hour stale-while-revalidate)
- [ ] Typecheck passes

---

### US-015: Seed Sanity with existing dummy data
**Description:** As a developer, I want all existing dummy data migrated into Sanity so the frontend works immediately after switching from hardcoded imports to Sanity queries.

**Acceptance Criteria:**
- [ ] A seed script exists at `scripts/seed-sanity.ts` (or `.mjs`) that creates all documents in Sanity
- [ ] Script creates: 12 listings, 5 team members, 5 testimonials, 10 FAQs (5 buyer + 5 seller), 5 coverage areas, 4 company stats, 4 company values, 3 value propositions
- [ ] Script creates singleton documents: siteSettings, homePage, aboutPage, buyPage, sellPage with hero content and references
- [ ] Images: Script downloads Unsplash images and uploads them to Sanity's asset pipeline (not stored as external URLs)
- [ ] Script is idempotent — can be run multiple times without creating duplicates (uses deterministic `_id` values)
- [ ] All seeded documents are published (not left as drafts)
- [ ] Plain text bios are converted to Portable Text block structure for the `teamMember.bio` field
- [ ] After running the script, the frontend renders identically to the current hardcoded version
- [ ] Script can be run via `npm run seed` from the project root

---

### US-016: Remove dummy data dependency and clean up
**Description:** As a developer, I want to remove the dummy data file and all references to it once Sanity integration is complete, keeping the codebase clean.

**Acceptance Criteria:**
- [ ] No page files import from `@/lib/dummy-data`
- [ ] `frontend/src/lib/dummy-data.ts` is deleted
- [ ] All pages render correctly from Sanity data
- [ ] Build succeeds with no unused import warnings
- [ ] Typecheck passes
- [ ] Verify in browser — all 10 pages render correctly

---

## Functional Requirements

- **FR-1:** All content-driven pages (`/`, `/about`, `/buy`, `/sell`, `/listings`, `/team`, `/team/[slug]`) must fetch data from Sanity at request time (SSR) or build time (SSG) with ISR revalidation
- **FR-2:** The Sanity client must be configured once in `frontend/src/lib/sanity/client.ts` and reused across all queries
- **FR-3:** GROQ queries must use projections that match existing TypeScript interfaces to minimize component changes
- **FR-4:** All Sanity images must be served through `cdn.sanity.io` using `@sanity/image-url` with width/height/fit parameters
- **FR-5:** Draft mode must use an authenticated Sanity client (with `SANITY_API_READ_TOKEN`) to fetch unpublished content
- **FR-6:** Published mode must use the CDN-backed client (`useCdn: true`) for optimal performance
- **FR-7:** The seed script must populate Sanity with all data currently in `dummy-data.ts` plus singleton page content
- **FR-8:** Revalidation must trigger on Sanity document publish via webhook, with a time-based fallback
- **FR-9:** Portable Text fields (`teamMember.bio`, `aboutPage.storyContent`) must render with proper typography styling
- **FR-10:** The `contact` page, `privacy` page, and `terms` page remain hardcoded (no Sanity data needed)

## Non-Goals

- **Server-side form submission** — Contact form backend is a separate Phase 2 task
- **Listings search/filter state management** — Filter UI remains non-functional; backend filtering is Phase 2
- **Property detail pages (`/listings/[slug]`)** — Individual listing pages are a separate feature
- **Sanity Visual Editing / Presentation API** — Click-to-edit overlays in the frontend are out of scope
- **Content migration tooling** — One-time seed script is sufficient; no ongoing migration pipeline
- **Sanity webhook dashboard configuration** — Document the webhook URL and secret; manual Sanity dashboard setup is expected
- **Authentication/authorization** — No user login or role-based content
- **Internationalization** — English only

## Design Considerations

- Components (`PropertyCard`, `TeamMemberCard`, `Hero`) should accept both Sanity image references and plain URL strings during the transition period, if needed
- The Portable Text renderer should match the existing typography system from `DESIGN.md` — serif headings, sans body, accent-colored links
- No visual changes to the frontend are expected — the integration should produce pixel-identical output to the current hardcoded version
- Draft mode indicator should be unobtrusive (a small banner at the top of the page)

## Technical Considerations

- **`next-sanity` version:** Use the latest stable version compatible with Next.js 16 and React 19. Check `next-sanity` docs for the live preview API (it has changed between versions — `defineLive()` vs `LiveQuery` vs `useLiveQuery`)
- **Environment variables:** `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are public (used in client-side preview); `SANITY_API_READ_TOKEN` and `SANITY_REVALIDATE_SECRET` are server-only
- **Image domains:** `cdn.sanity.io` must be added to `next.config.ts` `images.remotePatterns`; keep `images.unsplash.com` during transition
- **Portable Text:** `@portabletext/react` is the standard React renderer — use custom components for styled output
- **Singleton queries:** Use `*[_type == "homePage"][0]` pattern for singleton documents
- **ISR strategy:** Use `next-sanity`'s `sanityFetch()` with tag-based revalidation (`revalidateTag`) for granular cache invalidation
- **Seed script runtime:** Use `@sanity/client` directly in the script (not `next-sanity`). Run with `tsx` or `ts-node` for TypeScript support

## Success Metrics

- All 7 content-driven pages render identically to the current hardcoded version, but from Sanity data
- Content changes published in Sanity Studio appear on the frontend within 60 seconds (webhook revalidation)
- Draft mode shows unpublished changes immediately
- `dummy-data.ts` is fully removed with no remaining imports
- Build succeeds (`npm run build`) with no type errors or warnings
- Lighthouse performance score remains above 90 (Sanity CDN images should not degrade performance)

## Resolved Questions

1. **Seed script image handling:** Upload Unsplash images to Sanity's asset pipeline. This gives full hotspot/crop, automatic format conversion, and CDN delivery from day one. The script runs once — extra upload time is acceptable.
2. **Visual Editing:** Deferred to a later phase. Draft mode (US-013) provides a sufficient preview workflow for now. Visual Editing (Presentation API, `@sanity/visual-editing`, component annotations) is a Phase 3 follow-up.
3. **Bio plain text → Portable Text:** Yes — the seed script converts plain text bios to Portable Text block structure (`[{ _type: "block", children: [{ _type: "span", text: "..." }] }]`) to match the `blockContent` schema definition.
4. **Draft mode access:** API route pattern (`/api/draft/enable` and `/api/draft/disable`). This uses Next.js's built-in `draftMode()` API with secure cookies. Sanity Studio links to the enable route with a secret token for authorized access.
