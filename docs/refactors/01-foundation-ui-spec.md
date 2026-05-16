# Stage 1: Foundation UI Refactor Spec

## Goal

Extract low-risk shared UI foundations that reduce repeated route markup while preserving the visual design exactly.

## Scope

- Section wrappers and page shells.
- Shared Sanity image URL resolution.
- Page metadata helper.
- Legal and state/error page shells.
- No forms, nav behavior, gallery behavior, or listing data flow changes.

## Affected Files

- `frontend/src/app/page.tsx`
- `frontend/src/app/about/page.tsx`
- `frontend/src/app/buy/page.tsx`
- `frontend/src/app/sell/page.tsx`
- `frontend/src/app/contact/page.tsx`
- `frontend/src/app/team/page.tsx`
- `frontend/src/app/home-evaluation/page.tsx`
- `frontend/src/app/buyers-guide/page.tsx`
- `frontend/src/app/sellers-guide/page.tsx`
- `frontend/src/app/privacy/page.tsx`
- `frontend/src/app/terms/page.tsx`
- `frontend/src/app/error.tsx`
- `frontend/src/app/not-found.tsx`
- `frontend/src/components/ui/section-header.tsx`
- `frontend/src/lib/sanity/image.ts`

## Proposed Abstractions

### `SectionShell`

Location: `frontend/src/components/sections/section-shell.tsx`

Candidate API:

```ts
interface SectionShellProps {
  id?: string;
  bg?: "background" | "surface" | "footer";
  container?: "none" | "sm" | "md" | "lg" | "xl";
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}
```

Requirements:

- Preserve current `py-16 px-6 lg:py-24 lg:px-8` spacing where used.
- Use existing semantic tokens and utilities only.
- Do not introduce raw color values.

### `PageIntro`

Location: `frontend/src/components/sections/page-intro.tsx`

Candidate API:

```ts
interface PageIntroProps {
  overline?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}
```

Requirements:

- Build on or replace usage gaps around `SectionHeader`.
- Keep typography consistent with current display and muted styles.

### `resolveSanityImageUrl`

Location: `frontend/src/lib/sanity/image.ts`

Candidate API:

```ts
function resolveSanityImageUrl(
  image: SanityImage | string | null | undefined,
  options: { width: number; height: number; fallback: string; fit?: "crop" }
): string;
```

Requirements:

- Preserve existing `urlFor(...).width(...).height(...).fit("crop").url()` behavior.
- Return string URLs unchanged.
- Do not change AMPRE listing image handling in `PropertyCard`; AMPRE listing images are already string URLs.

### `makeMetadata`

Location: `frontend/src/lib/seo.ts`

Candidate API:

```ts
function makeMetadata(input: { title: string; description: string }): Metadata;
```

Requirements:

- Keep layout-level title template behavior intact.
- Do not alter dynamic metadata for listing or team detail routes in this stage.

### `StatePage` and `LegalPageShell`

Locations:

- `frontend/src/components/sections/state-page.tsx`
- `frontend/src/components/sections/legal-page-shell.tsx`

Requirements:

- Preserve existing copy, CTAs, spacing, and route behavior.
- Do not alter legal content sources or Sanity legal page fetchers.

## Implementation Plan

1. Add foundation helpers with no call-site changes.
2. Convert one low-risk route to validate APIs, preferably `terms` or `privacy`.
3. Convert remaining legal/state pages.
4. Convert repeated section wrappers in marketing routes.
5. Convert repeated Sanity image resolution on non-AMPRE pages.
6. Convert static metadata objects to `makeMetadata`.

## Verification

- `npm -w frontend run lint`
- `npm -w frontend run build`
- Manual visual checks at 390px, 768px, and 1440px for changed routes.
- Confirm no AMPRE client imports were introduced outside the sync route:
  - `rg -n "from .*@/lib/ampre/client|from .*lib/ampre/client" frontend/src`
- Confirm pages still import listing reads only from `frontend/src/lib/ampre/fetch.ts` where relevant.

## Acceptance Criteria

- Repeated section wrapper code is replaced by shared shell usage.
- Static page metadata uses the helper where appropriate.
- Non-AMPRE Sanity image fallback logic is centralized.
- Legal/error/not-found pages render unchanged.
- No listing compliance behavior changes.
