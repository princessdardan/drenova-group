# Frontend Workspace

## OVERVIEW

Next.js 16 App Router app deployed from `frontend/`; owns public pages, API routes, UI, Sanity reads, AMPRE Redis reads, unit tests, and e2e tests.

## STRUCTURE

```text
frontend/
├── src/app/          # pages, metadata, OG images, actions, API routes
├── src/components/   # ui primitives + section components; nested AGENTS.md
├── src/lib/sanity/   # client, image helper, GROQ, typed fetch wrappers; nested AGENTS.md
├── src/lib/ampre/    # compliance-sensitive listing pipeline
├── src/types/        # Listing, Sanity, team, testimonial types
├── e2e/              # Playwright specs
└── public/           # static assets and fonts
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| App shell | `src/app/layout.tsx` | Fonts, metadata template, draft banner, header/footer |
| Marketing pages | `src/app/*/page.tsx` | Mostly async Server Components using Sanity fetchers |
| Dynamic listings | `src/app/listings/` | Search params, AMPRE Redis reads, detail metadata suppression |
| Forms | `src/app/actions/`, `src/components/sections/*form.tsx` | Server actions + client form components |
| API routes | `src/app/api/` | Draft mode, revalidation, deploy hook, AMPRE sync |
| UI primitives | `src/components/ui/` | Named exports, semantic Tailwind tokens |
| Shared sections | `src/components/sections/` | Header/footer/hero/forms/CTA |
| Sanity integration | `src/lib/sanity/` | `queries.ts` projections must match `src/types/sanity.ts` |
| Unit tests | `src/**/*.test.ts` | Node built-in test runner via `tsx`; colocated with implementation |
| Browser tests | `e2e/` | Playwright desktop and mobile Chrome projects |

## CONVENTIONS

- Keep pages as Server Components unless interactivity requires a client component.
- Use `Promise.all` for independent Sanity fetches in async Server Components.
- Pages export `metadata: Metadata`; dynamic details use `generateMetadata` where data changes title/description.
- For Sanity images, guard with `isSanityImage()` then build URLs through `urlFor()`.
- Shared components use named exports and typed prop interfaces near the component.
- Styling is utility-first Tailwind plus existing global utilities from `globals.css` (`swiss-container`, `glass`, `dimensional-card`, etc.).
- `Button` / `ButtonLink` variants are `primary`, `accent`, `minimal`, `glass`; extend there before ad-hoc button styling.
- Motion components must respect reduced motion; hero video already uses `motion-reduce:hidden` with image fallback.
- Contact/lead submissions go through server actions, not client-side API calls.

## ANTI-PATTERNS

- Do not add broad `"use client"` to pages/layouts.
- Do not create new global CSS except tokens/base utilities in `src/app/globals.css`.
- Do not use raw colors in JSX; semantic tokens and existing globals first.
- Do not bypass `src/lib/sanity/fetch.ts` for content reads unless adding a new fetch wrapper there.
- Do not import `src/lib/ampre/client.ts` from UI, pages, or components.
- Do not add Jest, Vitest, or Cypress config; the existing unit path is Node `node:test` and e2e is Playwright.

## COMMANDS

```bash
npm -w frontend run dev
npm -w frontend run build
npm -w frontend run lint
npm -w frontend run test:unit
npm -w frontend run test:e2e
npm -w frontend run test:e2e:ui
```

## NOTES

- `next.config.ts` enables React Compiler and allows images only from Unsplash, Sanity CDN, and AMPRE image host.
- Playwright starts/reuses `npm run dev` at `http://localhost:3000` and runs Desktop Chrome plus a 390x844 mobile viewport.
- `tsconfig.json` excludes `e2e` and `playwright.config.ts` from app compilation.
- Fixture behavior is inline: AMPRE/listing e2e seams live in `src/lib/ampre/fetch.ts` and `src/app/api/e2e/`, not a standalone fixtures directory.
