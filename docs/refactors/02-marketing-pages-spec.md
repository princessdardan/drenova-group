# Stage 2: Marketing Pages Refactor Spec

## Goal

Consolidate repeated marketing page sections after the foundation helpers exist.

## Scope

- Buy/sell service page sections.
- Buyer/seller guide landing pages.
- Process timelines.
- Benefit/coverage/card grids.
- CTA section action patterns where they are local to marketing pages.

## Affected Files

- `frontend/src/app/buy/page.tsx`
- `frontend/src/app/sell/page.tsx`
- `frontend/src/app/buyers-guide/page.tsx`
- `frontend/src/app/sellers-guide/page.tsx`
- `frontend/src/app/home-evaluation/page.tsx`
- `frontend/src/app/about/page.tsx`
- `frontend/src/app/contact/page.tsx`
- `frontend/src/app/page.tsx`
- `frontend/src/components/sections/cta-section.tsx`
- `frontend/src/components/ui/accordion.tsx`
- `frontend/src/components/ui/section-header.tsx`
- `frontend/src/components/ui/stagger-children.tsx`

## Proposed Abstractions

### `BenefitsSection`

Location: `frontend/src/components/sections/benefits-section.tsx`

Candidate API:

```ts
interface BenefitsSectionProps {
  heading?: SectionHeading;
  fallback: { overline: string; title: string; description?: string };
  benefits: Array<{ _key: string; title: string; description: string }>;
  bg?: "background" | "surface";
}
```

### `ProcessTimeline`

Location: `frontend/src/components/sections/process-timeline.tsx`

Candidate API:

```ts
interface ProcessTimelineProps {
  heading?: SectionHeading;
  fallback: { overline: string; title: string; description?: string };
  steps: Array<{ _key: string; stepNumber: string; title: string; description: string }>;
  columns?: "four" | "five";
  bg?: "background" | "surface";
}
```

### `CoverageAreaGrid`

Location: `frontend/src/components/sections/coverage-area-grid.tsx`

Candidate API:

```ts
interface CoverageAreaGridProps {
  heading?: SectionHeading;
  fallback: { overline: string; title: string; description?: string };
  areas: CoverageArea[];
  bg?: "background" | "surface";
}
```

### `GuideDownloadPage`

Location: `frontend/src/components/sections/guide-download-page.tsx`

Candidate API:

```ts
interface GuideDownloadPageProps {
  page: BuyersGuidePage | SellersGuidePage | null;
  source: "buyers-guide" | "sellers-guide";
  defaults: {
    heroImage: string;
    heroAlt: string;
    overline: string;
    title: string;
    subtitle: string;
    guideAlt: string;
    guidePlaceholderTitle: string;
    guideDescription: string;
    ctaTitle: string;
    ctaSubtitle: string;
    primaryHref: string;
    primaryText: string;
    secondaryHref: string;
    secondaryText: string;
  };
}
```

Requirements:

- Keep `LeadForm` behavior untouched in this stage.
- Preserve CTA fallbacks exactly.
- Preserve guide image dimensions and placeholder presentation.

## Implementation Plan

1. Extract and test `BenefitsSection` using buy page first.
2. Convert sell page benefits using the same component.
3. Extract `ProcessTimeline` and convert buy/sell.
4. Extract `CoverageAreaGrid` and convert about/buy coverage areas.
5. Extract `GuideDownloadPage` and convert buyer/seller guide pages.
6. Evaluate whether `home-evaluation` should use a lighter `LeadGenSection` or remain bespoke.
7. Convert homepage work-with-us cards only if a clean `LinkCard` API exists from Stage 3; otherwise leave them for Stage 3.

## Verification

- `npm -w frontend run lint`
- `npm -w frontend run build`
- `npm -w frontend run test:e2e` if page behavior or forms are touched.
- Manual checks for `/buy`, `/sell`, `/buyers-guide`, `/sellers-guide`, `/about`.
- Confirm no changed marketing page imports `frontend/src/lib/ampre/client.ts`.

## Acceptance Criteria

- Buy and sell pages share benefits and process components.
- Buyer and seller guide pages share one shell component.
- Coverage area cards are no longer duplicated.
- No copy, fallback, route, metadata, or form behavior changes.
