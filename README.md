# Drenova Group

Real estate website for **Drenova Group** — a real estate group operating across the GTA and York Region.

## Tech Stack

- **Frontend:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4
- **CMS:** Sanity Studio v3 · GROQ · Portable Text
- **Deployment:** Vercel (ISR + webhook revalidation)
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

### Environment Variables

Create `frontend/.env.local` with the following:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token
SANITY_API_WRITE_TOKEN=your_write_token
SANITY_REVALIDATE_SECRET=your_revalidate_secret

# Email delivery (Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=Drenova Group <send.info@info.drenova.ca>
CONTACT_EMAIL=info@yourdomain.com
```

Refer to `docs/deployment-manual-steps.md` for detailed instructions on setting up external services like Sanity and Resend.

## Project Structure

```
drenova-group/
├── frontend/          # Next.js app (@drenova-group/frontend)
│   ├── src/
│   │   ├── app/       # App Router pages & API routes
│   │   ├── components/
│   │   │   ├── ui/    # Reusable primitives (button, input, accordion, etc.)
│   │   │   └── sections/  # Page sections (header, footer, hero, etc.)
│   │   ├── lib/
│   │   │   └── sanity/    # Client, queries, image helper, typed fetch
│   │   └── types/     # TypeScript type definitions
│   └── public/        # Static assets
├── backend/           # Sanity Studio (@drenova-group/backend)
│   └── schemaTypes/
│       ├── documents/ # listing, teamMember, testimonial, faq, etc.
│       ├── objects/   # blockContent, heroSettings, processStep, etc.
│       └── singletons/# homePage, aboutPage, buyPage, sellPage, siteSettings, etc.
├── scripts/           # Utility scripts (seed-sanity.ts)
├── flowchart/         # Independent Vite app (not a workspace)
└── docs/              # Business documents
```

## Pages

| Route | Description |
|---|---|
| `/` | Homepage with hero, value propositions, stats, testimonials |
| `/buy` | Buyer services and process |
| `/sell` | Seller services and home valuation |
| `/listings` | Property listings with filters |
| `/about` | Company story, values, coverage areas |
| `/team` | Team member grid |
| `/team/[slug]` | Individual agent profile |
| `/contact` | Contact form |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

## API Routes

| Route | Purpose |
|---|---|
| `/api/revalidate` | ISR on-demand revalidation webhook (triggered by Sanity) |
| `/api/draft/enable` | Enable draft mode for Sanity live preview |
| `/api/draft/disable` | Disable draft mode |
| `/api/ampre/sync` | Ampre integration sync endpoint |

## Sanity CMS

The CMS is a standalone Sanity Studio in the `backend/` workspace with 21 schema types:

- **6 objects:** blockContent, heroSettings, processStep, ctaSettings, sectionHeading, valuationSection
- **9 documents:** listing, teamMember, testimonial, faq, coverageArea, companyStat, companyValue, valueProposition, legalPage
- **8 singletons:** siteSettings, homePage, aboutPage, buyPage, sellPage, contactPage, listingsPage, teamPage

Content is fetched on the frontend via typed GROQ queries with ISR caching and tag-based revalidation.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start frontend dev server (localhost:3000) |
| `npm run build` | Frontend production build |
| `npm run start` | Start frontend production server |
| `npm run lint` | Run ESLint (frontend) |
| `npm run studio` | Start Sanity Studio (localhost:3333) |
| `npm run seed` | Seed Sanity with initial content |

## Documentation

| File | Purpose |
|---|---|
| `CLAUDE.md` | Technical implementation rules |
| `DESIGN.md` | Visual design system and philosophy |
| `prd.md` | Product requirements and roadmap |
