# PROJECT KNOWLEDGE BASE

**Generated:** 2026-05-14
**Commit:** 76bd614
**Branch:** clean-main

## OVERVIEW

Drenova Group is a real estate brokerage site split into a Next.js 16 frontend and Sanity Studio backend. The root is only an npm workspace orchestrator; deploy the web app from `frontend/`.

## STRUCTURE

```text
drenova-group/
├── frontend/          # Next.js app, Vercel root, API routes, Sanity/AMPRE readers
├── backend/           # Sanity Studio v5, schemas, custom desk structure
├── scripts/           # seed-sanity plus Ralph automation support
├── scripts/ralph/     # existing autonomous-agent loop instructions
├── flowchart/         # independent Vite/React Flow app; not an npm workspace
├── docs/              # AMPRE, Sanity SOP, implementation plans
└── tasks/             # historical PRDs / implementation specs
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Run site dev/build/lint | `package.json` | Root scripts proxy to `frontend/` except `studio` and `seed` |
| Web pages and API routes | `frontend/src/app/` | App Router pages, Open Graph images, draft/revalidate/sync routes |
| Shared UI | `frontend/src/components/` | `ui/` primitives, `sections/` page sections |
| Sanity reads | `frontend/src/lib/sanity/` | GROQ queries + typed fetch wrappers with ISR tags |
| AMPRE listings | `frontend/src/lib/ampre/` | Compliance-sensitive; see nested AGENTS.md |
| Sanity Studio | `backend/` | Config, desk structure, schema registry |
| Schema authoring | `backend/schemaTypes/` | Objects before referencing documents/singletons |
| Initial content | `scripts/seed-sanity.ts` | Large seed script for documents and singletons |
| Ralph loop | `scripts/ralph/` | Existing AGENTS.md has local rules |
| Flow visualization | `flowchart/` | Standalone Vite app for Ralph process diagram |

## CODE MAP

| Symbol | Type | Location | Role |
|--------|------|----------|------|
| `RootLayout` | Server component | `frontend/src/app/layout.tsx` | Fonts, draft banner, header/footer, analytics |
| `HomePage` | Server component | `frontend/src/app/page.tsx` | Sanity-backed marketing homepage |
| `get*Page`, `get*` | Fetch wrappers | `frontend/src/lib/sanity/fetch.ts` | Typed Sanity reads with `next.tags` and draft-mode preview |
| `client`, `previewClient`, `writeClient` | Clients | `frontend/src/lib/sanity/client.ts` | Sanity read/preview/write clients |
| `getAmpreListings` | Fetch wrapper | `frontend/src/lib/ampre/fetch.ts` | Redis-backed listing reads; never calls AMPRE |
| `fetchAmpreProperties` | AMPRE client | `frontend/src/lib/ampre/client.ts` | Daily sync-only OData client |
| `mapAmpreToListing` | Mapper | `frontend/src/lib/ampre/mapper.ts` | RESO/AMPRE to internal `Listing`, including address suppression |
| `GET` / `POST` | Route handlers | `frontend/src/app/api/ampre/sync/route.ts` | Vercel Cron AMPRE sync |
| `schemaTypes` | Registry | `backend/schemaTypes/index.ts` | Studio schema registration order |
| `structure` | Desk resolver | `backend/structure.ts` | Singleton and collection navigation |

## CONVENTIONS

- npm workspaces are only `frontend` and `backend`; `flowchart/` is intentionally outside the workspace set.
- Vercel Root Directory must be `frontend/`.
- `@/*` resolves to `frontend/src/*` only inside the frontend workspace.
- Tailwind CSS 4 is CSS-first: tokens live in `frontend/src/app/globals.css` and are registered in `@theme inline`.
- Server Components by default. Add `"use client"` only for hooks, event handlers, or browser APIs.
- Shared components use named exports. Pages use default exports.
- Page metadata uses `export const metadata: Metadata` and inherits the title template from `layout.tsx`.
- Sanity singletons use fixed document IDs matching their type names and are hardcoded in `backend/structure.ts`.
- Playwright e2e is the only test suite; no Jest/Vitest unit tests are configured.

## ANTI-PATTERNS (THIS PROJECT)

- Do not add `tailwind.config.js`; Tailwind config belongs in CSS.
- Do not use raw hex values in components. Use semantic tokens such as `bg-background`, `text-accent`, `border-border`.
- Do not add CSS-in-JS, CSS Modules, component libraries, Radix, or shadcn/ui unless explicitly requested.
- Do not use `@apply`; write utilities directly in JSX.
- Do not call AMPRE from pages/components. User-facing listing reads come from Upstash Redis through `frontend/src/lib/ampre/fetch.ts`.
- Do not put AMPRE/MLS data into AI/ML prompts, RAG, training, inference, valuation, or predictive analytics.
- Do not expose Sanity singleton types in the Studio create-new menu.

## UNIQUE STYLES

- Visual direction: refined architectural luxury, Swiss Modernism 2.0, strategic glassmorphism, exaggerated minimalism.
- Typography: Playfair Display for display, Plus Jakarta Sans for UI/body, Geist Mono for MLS/data.
- Layout tokens include an 8px spacing scale, Swiss grid helpers, glass utilities, dimensional cards, and reduced-motion rules in `globals.css`.
- Marketing pages can use expressive reveal/hero motion; listings and detail pages stay transactional and fast.

## COMMANDS

```bash
npm run dev          # frontend dev server on localhost:3000
npm run build        # frontend production build
npm run start        # frontend production server
npm run lint         # frontend ESLint
npm run studio       # Sanity Studio on localhost:3333
npm run seed         # seed Sanity content from scripts/seed-sanity.ts
npm run test:e2e     # Playwright e2e in frontend/e2e
npm -w backend run build
npm -w backend run deploy
```

## NOTES

- Node 20+ and npm 10+ are expected.
- Sanity project is `apggi8zn`, dataset `production` in Studio config and client defaults.
- CI is minimal: `.github/workflows/deploy-studio.yml` deploys Sanity Studio from `backend/`; there is no frontend CI workflow.
- `frontend/vercel.json` schedules `/api/ampre/sync` daily at 06:00 UTC.
- `/api/ampre/sync` sets `maxDuration = 120`, which assumes a Vercel plan that supports it.
- README references root `DESIGN.md` and `prd.md`, but current design/product docs live under `docs/`.
