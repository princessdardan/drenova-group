# Ralph — Autonomous Agent Loop for Drenova Group

Ralph runs Claude Code (or Amp) repeatedly until all PRD stories are complete. Each iteration is a fresh instance implementing one user story at a time.

## Commands

```bash
./ralph.sh --tool claude [max_iterations]  # Run with Claude Code
./ralph.sh [max_iterations]                # Run with Amp (default)
./ralph.sh                                 # Default: 10 iterations with Amp
```

## Key Files

| File | Purpose |
|---|---|
| `ralph.sh` | Bash loop that spawns fresh AI instances per iteration |
| `CLAUDE.md` | Instructions given to each instance |
| `prd.json` | Current batch of user stories (you create this) |
| `progress.txt` | Accumulated progress log and codebase patterns (auto-created) |
| `.last-branch` | Tracks the last branch for archive detection (auto-created) |
| `archive/` | Archived PRD + progress files from previous runs (auto-created) |

## Setting Up a New Batch

Create a `prd.json` in this directory:

```json
{
  "branchName": "ralph/feature-name",
  "stories": [
    {
      "id": "S1",
      "title": "Short description",
      "description": "Detailed requirements. Reference specific components/pages from root prd.md.",
      "priority": 1,
      "passes": false
    }
  ]
}
```

- Keep stories small enough for one context window
- Order by priority (1 = highest) — Ralph picks the highest priority `passes: false` story
- Ralph sets `passes: true` after implementing and committing each story

## Archive System

When you start a new batch with a different `branchName`, Ralph auto-archives the previous `prd.json` and `progress.txt` to `archive/{date}-{branch-name}/` and resets `progress.txt`.

## How It Works

1. `ralph.sh` spawns a fresh instance with `CLAUDE.md` as input
2. The instance reads `prd.json`, picks the next story, implements it
3. Runs `npm run lint` and `npm run build` to verify quality
4. On success: commits, marks story as passing, logs progress
5. Checks for the `<promise>COMPLETE</promise>` signal — if not complete, spawns a new iteration
6. `progress.txt` codebase patterns section serves as inter-iteration memory; git history provides additional context

The `flowchart/` directory contains an interactive React Flow visualization of this process.
