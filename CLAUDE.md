# Drenova Group — Technical Rules

> **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4
> **Deployment:** Vercel
> **Structure:** npm workspaces monorepo (`frontend/`, `backend/`)

---

## 0. Document Roles

- **`CLAUDE.md`** (this file) — Technical implementation rules: how to build
- **`DESIGN.md`** — Visual design philosophy: colors, typography rationale, layout patterns, photography direction
- **`prd.md`** — Product requirements: what features to build, page wireframes, roadmap

---

## 1. Project Structure

npm workspaces monorepo. All commands work from the project root.

```
drenova-group/
├── package.json
├── node_modules/
├── CLAUDE.md / DESIGN.md / prd.md
├── docs/
├── flowchart/                  # Independent Vite app (NOT a workspace)
├── scripts/
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── postcss.config.mjs
│   ├── eslint.config.mjs
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── globals.css
│   │   │   ├── about/page.tsx
│   │   │   ├── buy/page.tsx
│   │   │   ├── sell/page.tsx
│   │   │   ├── listings/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── team/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── privacy/page.tsx
│   │   │   └── terms/page.tsx
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   └── sections/
│   │   ├── lib/
│   │   │   ├── cn.ts
│   │   │   ├── format.ts
│   │   │   └── sanity/
│   │   │       ├── client.ts
│   │   │       ├── image.ts
│   │   │       ├── queries.ts
│   │   │       └── fetch.ts
│   │   └── types/
│   └── public/
└── backend/
    ├── package.json
    ├── sanity.config.ts
    ├── sanity.cli.ts
    ├── structure.ts
    ├── tsconfig.json
    └── schemaTypes/
        ├── index.ts
        ├── objects/
        ├── documents/
        └── singletons/
```

**Path alias:** `@/*` maps to `./src/*` inside `frontend/`.

**Vercel deployment:** Set "Root Directory" to `frontend/`.

---

## 2. Design Tokens

Tokens are CSS custom properties in `frontend/src/app/globals.css`, registered via Tailwind CSS 4's `@theme inline` block. See the file for all current values.

### Extending Tokens

1. Add the CSS variable to `:root` (light) and `@media (prefers-color-scheme: dark)` (dark)
2. Register with Tailwind: `--color-{name}: var(--{name})` in the `@theme inline` block
3. Use semantic names (`--primary`, `--muted`), not raw color names

**Rules:**
- Do NOT create a `tailwind.config.js` — Tailwind CSS 4 uses CSS-based configuration
- All colors must have dark mode variants
- Never use raw hex values in components — use semantic tokens (`bg-background`, `text-accent`, etc.)

---

## 3. Typography

Three fonts loaded via `next/font/google` in `frontend/src/app/layout.tsx`:

| Role | Font | Weights | Tailwind | Usage |
|---|---|---|---|---|
| **Display** | Playfair Display | 400, 700 | `font-display` | Hero headings, section titles, pull quotes |
| **Body / UI** | Plus Jakarta Sans | 400, 500, 600, 700 | `font-sans` | Body text, buttons, navigation, all UI |
| **Monospace** | Geist Mono | 400 | `font-mono` | MLS numbers, data tables |

---

## 4. Component Rules

- **Server Components by default** — Only add `"use client"` for interactivity (event handlers, hooks, browser APIs)
- **Colocation:** Page-specific components near their page; shared components in `frontend/src/components/`
- **No component library:** Build primitives as needed. Do not install shadcn/ui, Radix, etc. unless explicitly requested
- **Export pattern:** `export default function` for pages; named exports for shared components
- **Client components in use:** `accordion.tsx`, `header.tsx`, `mobile-menu.tsx`, `contact-form.tsx`

Read the source files in `frontend/src/components/` for current component APIs and implementations.

---

## 5. Styling Rules

- **Utility-first CSS** with Tailwind CSS 4
- **No CSS-in-JS** — No styled-components, Emotion, or CSS Modules
- **No custom CSS classes** unless absolutely necessary — prefer Tailwind utilities
- **No `@apply`** — Use utility classes directly in JSX
- **Global styles only** in `frontend/src/app/globals.css` for CSS variables and base element styles

### Spacing Conventions

| Context | Value |
|---|---|
| Section padding | `py-20 lg:py-32 px-6 lg:px-8` |
| Hero section | `min-h-[70vh] lg:min-h-screen px-6 lg:px-8` |
| Content max-width | `max-w-7xl mx-auto` |
| Text max-width | `max-w-2xl` |
| Card grids gap | `gap-6 lg:gap-8` |
| Content sections gap | `gap-12 lg:gap-16` |
| Form fields gap | `gap-4` |
| Button groups gap | `gap-3 sm:gap-4` |

---

## 6. Utilities

- **`cn()`** — `@/lib/cn` — Filters falsy values, joins class names with space
- **`formatPrice()`** / **`formatNumber()`** — `@/lib/format` — Currency and number formatting
- **Sanity client** — `@/lib/sanity/client` — Configured Sanity client and preview client
- **Sanity image** — `@/lib/sanity/image` — `urlFor()` helper for Sanity image pipeline
- **Sanity queries** — `@/lib/sanity/queries` — GROQ query constants for all document types
- **Sanity fetch** — `@/lib/sanity/fetch` — Typed async fetch functions with ISR cache tags

Types are defined in `frontend/src/types/` (`listing.ts`, `team.ts`, `testimonial.ts`).

---

## 7. Assets

- Static assets in `frontend/public/` — currently default Next.js SVGs only
- No custom icons yet — create `frontend/public/icons/` when needed
- Brand assets (logo, favicons, OG images) not yet added
- All images use Unsplash URLs (configured in `frontend/next.config.ts`)

---

## 8. Animation Strategy

### Technology Layers

| Layer | Technology | Pages | Status |
|---|---|---|---|
| 3D scenes | Three.js + React Three Fiber | Homepage hero | Planned |
| UI transitions | motion.dev | All pages | Planned |
| Decorative | reactbits | Marketing pages only | Planned |
| Micro-interactions | Tailwind CSS transitions | All pages | **Available now** |

### Guidelines

- All animations must respect `prefers-reduced-motion`
- Duration limits: Transitions 150–300ms, Reveals 300–500ms
- Transactional pages (Listings, Detail): Minimal animation, prioritize speed
- Marketing pages (Home, Buy, Sell): More visual flair permitted

---

## 9. SEO Metadata

Every page exports metadata using the template from `layout.tsx`:

```tsx
// Each page:
export const metadata: Metadata = {
  title: "Page Title",  // Renders as: "Page Title | Drenova Group"
  description: "Unique page description under 160 characters.",
};
```

---

## 10. Development Commands

```bash
npm run dev      # Frontend dev server (localhost:3000)
npm run build    # Frontend production build
npm run start    # Frontend production server
npm run lint     # ESLint (frontend)
npm run studio   # Sanity Studio (localhost:3333)
```

Target a specific workspace: `npm -w frontend run dev` / `npm -w backend run <script>`

---

## 11. Project Status

### Built (Phase 1)

| Area | Notes |
|---|---|
| Monorepo structure | npm workspaces: `frontend/` + `backend/` |
| All 10 pages | /, /buy, /sell, /listings, /about, /team, /team/[slug], /contact, /privacy, /terms |
| Design tokens | Full light/dark mode in `globals.css` |
| Font loading | 3 fonts via `next/font/google` |
| 8 UI + 6 section components | See `frontend/src/components/` |
| Types, utilities, Sanity lib | See `frontend/src/types/` and `frontend/src/lib/sanity/` |
| SEO metadata | Title template + per-page metadata |
| Responsive design | Mobile-first across all pages |
| Sanity Studio | `backend/` workspace, 16 schema types (3 objects, 8 documents, 5 singletons) |
| Sanity frontend integration | `next-sanity`, `@sanity/image-url`, `@portabletext/react`, typed fetch functions, ISR + webhook revalidation, draft mode preview |
| Seed script | `scripts/seed-sanity.ts` — seeds all documents and singletons into Sanity (`npm run seed`) |

### Not Built Yet

| Area | Phase |
|---|---|
| API routes, form submission (server-side) | 2 |
| MLS/IDX integration, property detail pages (`/listings/[slug]`), search/filter state | 2 |
| Mapbox interactive map | 2 |
| Email service (Resend/SendGrid) | 2 |
| Three.js hero animation | 1 |
| Custom brand assets (logo, favicon, OG images) | 1 |
| motion.dev animations, reactbits effects | 3 |
| Sentry error tracking | 3 |
