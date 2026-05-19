# Sanity Frontend Reads

## OVERVIEW

Typed Sanity read layer for the frontend. Keeps GROQ projections, TypeScript content types, draft preview, and ISR tags aligned.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Sanity clients | `client.ts` | Public client, preview client, write client |
| GROQ queries | `queries.ts`, `query-fragments.ts` | Singleton/page projections and reusable fragments |
| Fetch wrappers | `fetch.ts` | Draft-mode aware reads with `next.tags` revalidation |
| Image URLs | `image.ts` | Sanity image builder and fallback resolution |
| Content types | `../../types/sanity.ts` | Must match projections and schema fields |

## CONVENTIONS

- Add public content reads as fetch wrappers in `fetch.ts`; pages should not call `client.fetch` directly.
- Keep singleton fetch tags identical to schema type names where possible (`homePage`, `siteSettings`, etc.).
- If a GROQ projection changes, update `frontend/src/types/sanity.ts` and any consuming page/component in the same change.
- `sanityFetch()` uses preview client only when draft mode is enabled; otherwise it attaches ISR tags and `DEFAULT_REVALIDATE`.
- Use `isSanityImage()` and `resolveSanityImageUrl()` / `urlFor()` before assuming an image shape.

## ANTI-PATTERNS

- Do not bypass this directory for page content reads.
- Do not add fields to GROQ without reflecting them in TypeScript types.
- Do not make fetch wrappers return `any` or untyped Sanity payloads.
- Do not put AMPRE listing reads here; those belong in `../ampre/`.
