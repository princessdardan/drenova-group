# Frontend Components

## OVERVIEW

Shared UI and section components for the Next.js app. This directory owns component APIs, client islands, and visual primitives.

## STRUCTURE

```text
components/
├── sections/   # page-scale sections: header, footer, hero, forms, CTA, nav
└── ui/         # reusable primitives: buttons, cards, filters, carousel, reveal
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Buttons/links | `ui/button.tsx` | Variants: `primary`, `accent`, `minimal`, `glass` |
| Listing cards/filters | `ui/property-card.tsx`, `ui/listing-filters.tsx` | Respect AMPRE address suppression and query params |
| Header/nav | `sections/header.tsx`, `sections/mobile-menu.tsx`, `sections/nav-link-list.tsx` | Client state, focus trap, scroll behavior |
| Hero rendering | `sections/hero.tsx`, `sections/hero-content.tsx` | Sanity image fallback, optional video, reduced motion |
| Forms | `sections/contact-form.tsx`, `sections/lead-form.tsx` | Client forms submit to server actions |

## CONVENTIONS

- Shared components use named exports and local prop interfaces.
- Keep components Server Components unless they need hooks, browser APIs, or event handlers.
- Client components should stay narrow: forms, menu state, filters, carousel/lightbox, reveal/stagger motion.
- Use `cn()` for conditional class composition.
- Use semantic Tailwind tokens and global utilities from `src/app/globals.css`; do not introduce raw component colors.
- `property-card.tsx` must never expose suppressed listing addresses in visible text, alt text, or links.

## ANTI-PATTERNS

- Do not add a component library wrapper here; primitives are local.
- Do not move page-specific data fetching into components.
- Do not add broad animation to listing/detail transactional components.
- Do not duplicate button styles outside `ui/button.tsx` when a variant belongs there.
