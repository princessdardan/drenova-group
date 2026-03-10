# Drenova Group

Real estate website for **Drenova Group** — a multi-state brokerage operating across the US.

## Tech Stack

- **Frontend:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4
- **CMS:** Sanity Studio (v3)
- **Deployment:** Vercel
- **Monorepo:** npm workspaces

## Prerequisites

- Node.js 20+
- npm 10+

## Getting Started

```bash
# Install dependencies (all workspaces)
npm install

# Start the frontend dev server (localhost:3000)
npm run dev

# Start Sanity Studio (localhost:3333)
npm run studio
```

## Project Structure

```
drenova-group/
├── frontend/     # Next.js app (@drenova-group/frontend)
├── backend/      # Sanity Studio (@drenova-group/backend)
├── flowchart/    # Independent Vite app (not a workspace)
├── scripts/      # Utility scripts
└── docs/         # Business documents
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start frontend dev server |
| `npm run build` | Frontend production build |
| `npm run start` | Start frontend production server |
| `npm run lint` | Run ESLint (frontend) |
| `npm run studio` | Start Sanity Studio |

## Documentation

| File | Purpose |
|---|---|
| `CLAUDE.md` | Technical implementation rules |
| `DESIGN.md` | Visual design system |
| `prd.md` | Product requirements |
