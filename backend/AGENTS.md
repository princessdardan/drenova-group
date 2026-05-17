# Backend Workspace

## OVERVIEW

Sanity Studio v5 workspace for Drenova content editing. Owns Studio config, desk structure, schema registration, and deploy/build commands.

## STRUCTURE

```text
backend/
├── sanity.config.ts     # project/dataset, plugins, schema templates
├── sanity.cli.ts        # CLI project binding
├── structure.ts         # custom Studio desk navigation
└── schemaTypes/         # documents, objects, singletons
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Studio project config | `sanity.config.ts` | Project `apggi8zn`, dataset `production`, plugins, singleton template filter |
| Studio navigation | `structure.ts` | Pages group, singleton IDs, collection document lists |
| Schema registry | `schemaTypes/index.ts` | Add imports and exports here after creating schema files |
| Schema conventions | `schemaTypes/AGENTS.md` | Field, preview, singleton/document/object rules |
| Studio scripts | `package.json` | `sanity dev --port 3333`, `sanity build`, `sanity deploy` |

## CONVENTIONS

- Singleton document IDs must match their schema type names (`homePage`, `siteSettings`, etc.).
- Singleton types are excluded from the create-new menu in `sanity.config.ts` and manually routed in `structure.ts`.
- If adding a singleton, update all three places: schema file, `schemaTypes/index.ts`, and `structure.ts`; also update template filtering if it should not be creatable.
- `structure.ts` is the editor-facing source of truth for grouping pages vs collections.
- Studio uses `structureTool({ structure })` and `visionTool()`.
- Backend has no lint script; use `sanity build` as the local validation gate.

## ANTI-PATTERNS

- Do not leave a singleton creatable as an arbitrary new document.
- Do not add schema files without registering them in `schemaTypes/index.ts`.
- Do not reorder object schemas after documents that reference them.
- Do not change hardcoded project ID/dataset casually; frontend defaults and docs assume the same values.

## COMMANDS

```bash
npm run studio
npm -w backend run dev
npm -w backend run build
npm -w backend run deploy
```

## NOTES

- `backend/package.json` includes `styled-components` because Sanity Studio depends on it; frontend rules against CSS-in-JS do not apply to Studio internals.
- GitHub Action `.github/workflows/deploy-studio.yml` deploys Studio from `backend/` on `clean-main` pushes.
