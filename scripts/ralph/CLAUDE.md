# Ralph Agent Instructions — Drenova Group

You are an autonomous coding agent working on the **Drenova Group** real estate website.

## Project Context

- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4
- **Purpose:** Marketing website for a real estate brokerage
- **Deployment:** Vercel

Before starting any work, read these root-level documents for guidance:

| Document | Path | Purpose |
|---|---|---|
| `CLAUDE.md` | `/CLAUDE.md` | Technical rules, component catalog, file structure |
| `DESIGN.md` | `/DESIGN.md` | Visual design system (colors, typography, layout) |
| `prd.md` | `/prd.md` | Product requirements and feature specs |

Follow all conventions from root `/CLAUDE.md`. Read existing components in `src/components/` before creating new ones.

## Your Task

1. Read the PRD at `prd.json` (in the same directory as this file)
2. Read the progress log at `progress.txt` (check Codebase Patterns section first)
3. Check you're on the correct branch from PRD `branchName`. If not, check it out or create from main.
4. Pick the **highest priority** user story where `passes: false`
5. Implement that single user story
6. Run quality checks: `npm run lint` and `npm run build`
7. Update CLAUDE.md files if you discover reusable patterns (see below)
8. If checks pass, commit ALL changes with message: `feat: [Story ID] - [Story Title]`
9. Update the PRD to set `passes: true` for the completed story
10. Append your progress to `progress.txt`

## Quality Requirements

- Run `npm run lint` — must pass with no errors
- Run `npm run build` — must succeed (catches type errors and build issues)
- Do NOT commit broken code
- Keep changes focused and minimal — implement only what the story requires
- Follow existing code patterns in the codebase

## Browser Testing

For UI stories, verify in the browser using MCP Playwright tools if available (dev server on `localhost:3000`). If unavailable, note that manual verification is needed in your progress report.

## Progress Report Format

APPEND to progress.txt (never replace):
```
## [Date/Time] - [Story ID]
- What was implemented
- Files changed
- **Learnings for future iterations:**
  - Patterns discovered, gotchas encountered, useful context
---
```

## Consolidate Patterns

If you discover a **reusable pattern** that future iterations should know, add it to the `## Codebase Patterns` section at the TOP of progress.txt (create it if it doesn't exist):

```
## Codebase Patterns
- Use semantic tokens (bg-background, text-foreground) not raw colors
- SectionHeader component handles overline + title + description consistently
```

Only add patterns that are **general and reusable**, not story-specific details.

## Update CLAUDE.md Files

Before committing, check if edited directories have a nearby CLAUDE.md worth updating with:
- Component API patterns or prop conventions
- Gotchas or non-obvious requirements
- Dependencies between files

**Do NOT add:** story-specific details, temporary notes, or info already in progress.txt.

## Stop Condition

After completing a user story, check if ALL stories have `passes: true`.

If ALL stories are complete and passing, reply with:
<promise>COMPLETE</promise>

If there are still stories with `passes: false`, end your response normally (another iteration will pick up the next story).

## Important

- Work on ONE story per iteration
- Commit frequently
- Keep the build green (`npm run lint` and `npm run build` must pass)
- Read the Codebase Patterns section in progress.txt before starting
- Consult root `CLAUDE.md` and `DESIGN.md` when unsure about conventions
