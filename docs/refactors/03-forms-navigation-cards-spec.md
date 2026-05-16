# Stage 3: Forms, Navigation, and Cards Refactor Spec

## Goal

Consolidate repeated interactive UI patterns after low-risk layout and marketing sections are stable.

## Scope

- Contact and lead form state patterns.
- Shared form field shells.
- Header, footer, and mobile navigation rendering.
- CTA/action groups.
- Media/card shells used by team, property, quick-link, and homepage cards.

## Affected Files

- `frontend/src/components/sections/contact-form.tsx`
- `frontend/src/components/sections/lead-form.tsx`
- `frontend/src/components/ui/input.tsx`
- `frontend/src/components/ui/select.tsx`
- `frontend/src/components/ui/textarea.tsx`
- `frontend/src/components/ui/button.tsx`
- `frontend/src/components/sections/header.tsx`
- `frontend/src/components/sections/mobile-menu.tsx`
- `frontend/src/components/sections/footer.tsx`
- `frontend/src/components/ui/property-card.tsx`
- `frontend/src/components/ui/team-member-card.tsx`
- `frontend/src/app/contact/page.tsx`
- `frontend/src/app/team/[slug]/page.tsx`
- `frontend/src/app/listings/page.tsx`
- `frontend/src/app/page.tsx`

## Proposed Abstractions

### `FormFieldShell`

Location: `frontend/src/components/ui/form-field-shell.tsx`

Candidate API:

```ts
interface FormFieldShellProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}
```

Requirements:

- Preserve accessible label association.
- Preserve error text visibility and styling.
- Keep `Input`, `Textarea`, and `Select` APIs stable unless a migration is staged.

### `FormStatus`

Location: `frontend/src/components/ui/form-status.tsx`

Candidate API:

```ts
interface FormStatusProps {
  title?: string;
  message: string;
  error?: boolean;
}
```

Requirements:

- Preserve current success copy in each form.
- Do not change server action payloads.

### `ActionGroup`

Location: `frontend/src/components/sections/action-group.tsx`

Candidate API:

```ts
interface ActionGroupProps {
  actions: Array<{
    href: string;
    label: string;
    variant?: ButtonLinkVariant;
    className?: string;
  }>;
  tone?: "default" | "hero" | "footer";
  align?: "left" | "center";
}
```

### `NavLinkList`

Location: `frontend/src/components/sections/nav-link-list.tsx`

Candidate API:

```ts
interface NavLinkListProps {
  links: Array<{ label: string; href: string }>;
  variant: "header" | "mobile" | "footer";
  onNavigate?: () => void;
}
```

### `MediaCard`

Location: `frontend/src/components/ui/media-card.tsx`

Candidate API:

```ts
interface MediaCardProps {
  href?: string;
  image?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "default" | "overlay" | "listing" | "team";
}
```

Requirements:

- Do not weaken AMPRE address suppression in `PropertyCard`.
- Keep listing status, image fallback, address suppression, and compliance comments intact.

## Implementation Plan

1. Extract `FormFieldShell` while keeping existing primitive APIs.
2. Convert `Input`, `Textarea`, and `Select` to use the shell.
3. Extract `FormStatus` and convert success/error states.
4. Extract `NavLinkList` with existing link arrays and rendering variants.
5. Extract `ActionGroup` and convert CTA rows.
6. Extract `MediaCard` only after confirming `PropertyCard` compliance behavior remains explicit.

## Verification

- `npm -w frontend run lint`
- `npm -w frontend run build`
- `npm -w frontend run test:e2e`
- Manual keyboard navigation through header/mobile menu/footer links.
- Manual contact and lead form validation checks.
- Manual property card checks for `addressSuppressed` listings if test data is available.
- Grep check: `rg -n "addressSuppressed|disp_addr|InternetAddressDisplayYN" frontend/src/components/ui/property-card.tsx frontend/src/app/listings/[slug]/page.tsx`

## Acceptance Criteria

- Form primitives share label/error shell behavior.
- Form submission payloads and server actions are unchanged.
- Header/footer/mobile nav share one renderer or constants.
- CTA row duplication is reduced without changing visible buttons.
- Property card compliance behavior remains explicit and tested by review.
