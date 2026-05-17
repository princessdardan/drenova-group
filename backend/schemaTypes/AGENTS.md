# Sanity Schema Types

## OVERVIEW

Code-defined Sanity schema layer split into reusable objects, collection documents, and singleton page/settings documents.

## STRUCTURE

```text
schemaTypes/
├── index.ts       # central ordered registry
├── objects/       # nested/reusable object types
├── documents/     # collection documents editors can create
└── singletons/    # one-document page/settings schemas
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Register schema | `index.ts` | Objects first, then documents, then singletons |
| Reusable blocks | `objects/` | `heroSettings`, `ctaSettings`, `sectionHeading`, etc. |
| CMS collections | `documents/` | Team, testimonials, FAQs, listings, lead submissions |
| Page content | `singletons/` | Home/about/buy/sell/contact/team/listings/guide pages |
| Studio singleton nav | `../structure.ts` | Must be kept in sync with singleton schemas |

## CONVENTIONS

- Use `defineType` and `defineField`; export one named const per file.
- File names are kebab-case; exported schema constants and `name` values are camelCase.
- Put reusable nested shapes in `objects/`, then reference by `type` from documents/singletons.
- Register objects before any schema that references them.
- Keep field validation inline with `validation: (Rule) => ...`.
- Use `preview.select` for normal documents; use `preview.prepare` for fixed-title singletons.
- Slugs use `type: "slug"` with `options.source` where public routes depend on them.
- Array item objects need stable `_type` names and clear field titles/descriptions for Studio editors.
- If frontend content type changes, update matching TypeScript interfaces in `frontend/src/types/sanity.ts` and GROQ projections in `frontend/src/lib/sanity/queries.ts`.

## ANTI-PATTERNS

- Do not add anonymous complex inline objects when a reusable object type already exists.
- Do not add required fields without checking seed data and existing Studio content impact.
- Do not rename singleton schema names or document IDs without coordinating frontend fetchers and seed script.
- Do not add new document types without considering Studio desk placement in `structure.ts`.
- Do not forget editor-facing `description` text for non-obvious fields such as listing keys, hero media, or guide downloads.

## COMMANDS

```bash
npm -w backend run build
npm run seed
```

## NOTES

- `leadSubmission` exists as a document type for captured form submissions.
- Some README counts are stale; trust `schemaTypes/index.ts` for the current schema inventory.
