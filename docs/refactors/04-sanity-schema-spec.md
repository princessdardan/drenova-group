# Stage 4: Sanity Schema Refactor Spec

## Goal

Reduce repeated Sanity schema boilerplate while preserving editor clarity, singleton behavior, schema registration order, and frontend query contracts.

## Scope

- Schema helper functions.
- Singleton constants and Studio structure duplication.
- Repeated image-with-alt, order, preview, hero, CTA, guide, benefits, and process fields.
- No destructive schema migrations in this stage.

## Affected Files

- `backend/sanity.config.ts`
- `backend/structure.ts`
- `backend/schemaTypes/index.ts`
- `backend/schemaTypes/objects/hero-settings.ts`
- `backend/schemaTypes/objects/cta-settings.ts`
- `backend/schemaTypes/objects/section-heading.ts`
- `backend/schemaTypes/objects/process-step.ts`
- `backend/schemaTypes/objects/valuation-section.ts`
- `backend/schemaTypes/documents/company-stat.ts`
- `backend/schemaTypes/documents/company-value.ts`
- `backend/schemaTypes/documents/value-proposition.ts`
- `backend/schemaTypes/documents/coverage-area.ts`
- `backend/schemaTypes/documents/faq.ts`
- `backend/schemaTypes/documents/team-member.ts`
- `backend/schemaTypes/documents/legal-page.ts`
- `backend/schemaTypes/documents/lead-submission.ts`
- `backend/schemaTypes/singletons/home-page.ts`
- `backend/schemaTypes/singletons/about-page.ts`
- `backend/schemaTypes/singletons/buy-page.ts`
- `backend/schemaTypes/singletons/sell-page.ts`
- `backend/schemaTypes/singletons/contact-page.ts`
- `backend/schemaTypes/singletons/team-page.ts`
- `backend/schemaTypes/singletons/listings-page.ts`
- `backend/schemaTypes/singletons/buyers-guide-page.ts`
- `backend/schemaTypes/singletons/sellers-guide-page.ts`
- `backend/schemaTypes/singletons/home-evaluation-page.ts`
- `frontend/src/types/sanity.ts`
- `frontend/src/lib/sanity/queries.ts`

## Proposed Modules

### `backend/schemaTypes/constants.ts`

Exports:

```ts
export const SINGLETON_TYPES = [/* existing singleton schema names */] as const;
export type SingletonType = (typeof SINGLETON_TYPES)[number];
```

Requirements:

- Keep singleton document IDs equal to schema type names.
- Reuse in `sanity.config.ts` and `structure.ts`.

### `backend/schemaTypes/helpers/fields.ts`

Candidate helpers:

```ts
requiredStringField(name, title, options?)
requiredTextField(name, title, options?)
orderField()
slugField({ source, maxLength? })
imageWithAltField({ name, title, required?, description? })
heroField()
ctaField()
sectionHeadingField(name, title)
```

Requirements:

- Helpers must not hide non-obvious editor descriptions.
- Helpers should accept overrides for title, description, validation, and initial value.
- Do not add required fields that existing content may not satisfy.

### `backend/schemaTypes/helpers/previews.ts`

Candidate helpers:

```ts
fixedTitlePreview(title)
titlePreview(fieldName = "title")
```

### `backend/schemaTypes/objects/benefit-item.ts`

Optional reusable object if helper-only fields become too opaque.

Requirements:

- Prefer a named object type only if Studio editor experience improves.
- If introduced, register object before documents/singletons in `schemaTypes/index.ts`.

## Implementation Plan

1. Add constants and helpers without converting schemas.
2. Convert `SINGLETON_TYPES` usage in config/structure.
3. Convert the simplest documents first: company stat/value/value proposition/coverage area.
4. Convert reusable objects where helper semantics are obvious.
5. Convert guide page singletons.
6. Convert buy/sell page singletons.
7. Leave `home-page.ts` until last because its nested shape is more bespoke.
8. Update frontend types or GROQ only if a schema field name/type actually changes; helper-only refactors should not require frontend changes.

## Verification

- `npm -w backend run build`
- `npm -w frontend run build` if any schema shape, query, or type changes.
- Confirm singleton exclusion still uses the same list:
  - `rg -n "SINGLETON_TYPES|schemaType\(\".*Page\"\)|documentId\(\".*Page\"\)" backend`
- If fields are renamed or object types introduced, define a separate content migration spec before implementation.

## Acceptance Criteria

- Singleton type list has one source of truth.
- Common schema boilerplate is centralized without reducing editor clarity.
- Studio build passes.
- Schema names, singleton document IDs, and public data shapes remain unchanged unless separately approved.
