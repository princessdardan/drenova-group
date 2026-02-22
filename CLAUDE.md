# Drenova Group — Design System & Project Rules

> **Project:** Drenova Group Real Estate Website
> **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4
> **Deployment:** Vercel

---

## 0. Document Hierarchy

| Document | Purpose | Location |
|---|---|---|
| `CLAUDE.md` (this file) | Technical implementation rules — how to build | Project root |
| `DESIGN.md` | Visual design system — what to build visually | Project root |
| `prd.md` | Product requirements — what features to build | Project root |

**When implementing any page or component:**
1. Check `DESIGN.md` for visual direction (colors, typography, layout patterns, component styles)
2. Check `CLAUDE.md` for technical rules (file structure, coding patterns, Tailwind conventions)
3. Check `prd.md` for feature requirements (content blocks, functionality, SEO)

---

## 1. Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, Header, Footer, metadata)
│   ├── page.tsx                # Homepage (/)
│   ├── globals.css             # Design tokens, Tailwind @theme, base styles
│   ├── favicon.ico
│   ├── about/page.tsx          # About page (/about)
│   ├── buy/page.tsx            # Buy page (/buy)
│   ├── sell/page.tsx           # Sell page (/sell)
│   ├── listings/page.tsx       # Listings search page (/listings)
│   ├── contact/page.tsx        # Contact page (/contact)
│   ├── team/
│   │   ├── page.tsx            # Team directory (/team)
│   │   └── [slug]/page.tsx     # Individual agent page (/team/semir-drenova)
│   ├── privacy/page.tsx        # Privacy policy (/privacy)
│   └── terms/page.tsx          # Terms of service (/terms)
├── components/
│   ├── ui/                     # Primitive components
│   │   ├── button.tsx          # Button & ButtonLink (primary, accent, minimal)
│   │   ├── section-header.tsx  # Reusable overline + title + description
│   │   ├── property-card.tsx   # Listing card (image, price, address, details)
│   │   ├── team-member-card.tsx # Agent card (headshot, name, role, CTA)
│   │   ├── input.tsx           # Form input with label & error
│   │   ├── textarea.tsx        # Form textarea with label & error
│   │   ├── select.tsx          # Form select dropdown with label & error
│   │   └── accordion.tsx       # Expandable FAQ items (client component)
│   └── sections/               # Page section components
│       ├── header.tsx          # Navigation bar (scroll-aware, client component)
│       ├── footer.tsx          # Site footer (always-dark background)
│       ├── hero.tsx            # Full-bleed hero with overlay (full/short sizes)
│       ├── cta-section.tsx     # Call-to-action section
│       ├── contact-form.tsx    # Contact form with validation (client component)
│       └── mobile-menu.tsx     # Fullscreen slide-out mobile menu (client component)
├── lib/
│   ├── cn.ts                   # Class name utility (filters falsy, joins with space)
│   ├── format.ts               # formatPrice() and formatNumber() utilities
│   └── dummy-data.ts           # Mock data (listings, team, testimonials, FAQs, etc.)
└── types/
    ├── listing.ts              # Listing interface
    ├── team.ts                 # TeamMember interface
    └── testimonial.ts          # Testimonial interface
public/                         # Static assets (default Next.js SVGs only)
docs/                           # Business documents (PDF presentations)
DESIGN.md                       # Visual design system (colors, typography, patterns)
prd.md                          # Product Requirements Document (source of truth)
```

**Path alias:** `@/*` maps to `./src/*` — always use `@/` imports for project files.

---

## 2. Design Tokens

> **Full color palette, typography, and visual patterns are defined in `DESIGN.md` (Sections B, C, J).**
> This section covers the *technical mechanism* for how tokens are implemented.

### 2.1 Token System

Tokens are defined as **CSS custom properties** in `src/app/globals.css` using Tailwind CSS 4's `@theme inline` block. All semantic tokens from `DESIGN.md` Section B are fully implemented.

```css
/* src/app/globals.css — ACTUAL IMPLEMENTATION */
@import "tailwindcss";

/* ─── Light Mode Tokens ─── */
:root {
  --background: #FAFAF7;
  --foreground: #1A1A1A;
  --surface: #F0EBE3;
  --surface-alt: #FFFFFF;
  --muted: #6B6560;
  --muted-foreground: #8A8580;
  --border: #E0D9CF;
  --ring: #A94310;
  --accent: #A94310;
  --accent-hover: #8E3710;
  --accent-foreground: #FFFFFF;
  --overlay: rgba(3, 9, 16, 0.65);
}

/* ─── Dark Mode Tokens ─── */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #030910;
    --foreground: #F0F3F5;
    --surface: #0E1921;
    --surface-alt: #172029;
    --muted: #8B8E92;
    --muted-foreground: #6B6E72;
    --border: #2A3440;
    --ring: #C4622A;
    --accent: #C4622A;
    --accent-hover: #D4723A;
    --accent-foreground: #FFFFFF;
    --overlay: rgba(3, 9, 16, 0.75);
  }
}

/* ─── Register Tokens with Tailwind CSS 4 ─── */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-surface: var(--surface);
  --color-surface-alt: var(--surface-alt);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-accent-foreground: var(--accent-foreground);
  --color-overlay: var(--overlay);
  --font-sans: var(--font-plus-jakarta-sans);
  --font-display: var(--font-playfair-display);
  --font-mono: var(--font-geist-mono);
}

/* ─── Base Styles ─── */
body {
  background: var(--background);
  color: var(--foreground);
}
```

### 2.2 Extending Tokens

When adding new design tokens, follow the existing pattern in `globals.css`:

1. Add the CSS variable to `:root` (light mode) and the `@media (prefers-color-scheme: dark)` block (dark mode)
2. Register it with Tailwind in the `@theme inline` block using `--color-{name}: var(--{name})` pattern
3. Use semantic names (e.g., `--primary`, `--muted`) not raw color names

**Rules:**
- Do NOT create a `tailwind.config.js` — Tailwind CSS 4 uses CSS-based configuration
- All colors must have dark mode variants in the `@media (prefers-color-scheme: dark)` block
- Never use raw hex values in components — always use semantic tokens via Tailwind classes (`bg-background`, `text-accent`, etc.)

### 2.3 Figma Token Mapping

When translating Figma design tokens to code:

| Figma Token Category | CSS Variable Pattern | Tailwind Usage |
|---|---|---|
| Fill colors | `--color-{name}` | `bg-{name}`, `text-{name}` |
| Border colors | `--color-border` | `border-border` |
| Text colors | `--color-foreground` / `--color-{name}` | `text-foreground` |
| Font family | `--font-sans` / `--font-display` / `--font-mono` | `font-sans` / `font-display` / `font-mono` |
| Border radius | `--radius-{size}` | `rounded-{size}` |
| Spacing | Use Tailwind's default scale | `p-4`, `gap-6`, `m-8`, etc. |
| Shadows | Use Tailwind's default scale | `shadow-sm`, `shadow-md`, etc. |

---

## 3. Typography

> **Full typography system (font pairing, scale, letter-spacing) is defined in `DESIGN.md` Section C.**
> This section covers the technical font loading mechanism.

### 3.1 Font Stack

Three fonts are loaded via `next/font/google` in `layout.tsx`:

| Role | Font | Weights | CSS Variable | Usage |
|---|---|---|---|---|
| **Display** (serif) | Playfair Display | 400, 700 | `--font-playfair-display` → `--font-display` | Hero headings, section titles, pull quotes |
| **Body / UI** (sans-serif) | Plus Jakarta Sans | 400, 500, 600, 700 | `--font-plus-jakarta-sans` → `--font-sans` | Body text, buttons, navigation, all UI |
| **Monospace** | Geist Mono | 400 | `--font-geist-mono` → `--font-mono` | MLS numbers, data tables, code references |

Fonts are applied via CSS variable injection on `<body>`:
```tsx
<body className={`${playfairDisplay.variable} ${plusJakartaSans.variable} ${geistMono.variable} font-sans antialiased`}>
```

### 3.2 Typography Scale

See `DESIGN.md` Section C.3 for the complete responsive typography scale. Key patterns:

| Element | Font | Tailwind Classes |
|---|---|---|
| Hero heading | Display | `font-display text-4xl lg:text-6xl font-bold tracking-tight` |
| Section heading | Display | `font-display text-3xl lg:text-5xl font-bold tracking-tight` |
| Body | Sans | `text-base leading-7` |
| Button text | Sans | `text-sm uppercase tracking-wider font-semibold` |
| Overline/label | Sans | `text-xs uppercase tracking-widest font-medium text-accent` |
| Code/data | Mono | `font-mono text-sm` |

---

## 4. Component Architecture

### 4.1 Component Rules

- **Server Components by default** — Only add `"use client"` when the component needs interactivity (event handlers, hooks, browser APIs)
- **Colocation:** Place page-specific components near their page file; shared components go in `src/components/`
- **No component library (yet):** Build primitive components as needed. Do not install shadcn/ui, Radix, or other component libraries unless explicitly requested
- **Export pattern:** Use `export default function` for pages; use named exports for shared components
- **Client components in use:** `accordion.tsx`, `header.tsx`, `mobile-menu.tsx`, `contact-form.tsx`

### 4.2 Existing Components

#### UI Components (`src/components/ui/`)

| Component | File | Type | Props | Notes |
|---|---|---|---|---|
| `Button` | `button.tsx` | Server | `variant`, `size`, `className`, `...button props` | Ghost (primary), accent (solid), minimal (text) |
| `ButtonLink` | `button.tsx` | Server | `variant`, `size`, `className`, `...Link props` | Same styling as Button, wraps `next/link` |
| `SectionHeader` | `section-header.tsx` | Server | `overline`, `title`, `description`, `align`, `className` | Overline + serif title + description pattern |
| `PropertyCard` | `property-card.tsx` | Server | `listing: Listing` | 4:3 image, price, address, beds/baths/sqft, status badge |
| `TeamMemberCard` | `team-member-card.tsx` | Server | `member: TeamMember` | 3:4 headshot, name, role, contact CTA |
| `Input` | `input.tsx` | Server | `label`, `error`, `...input props` | Labeled input with error state |
| `Textarea` | `textarea.tsx` | Server | `label`, `error`, `...textarea props` | Labeled textarea with error state |
| `Select` | `select.tsx` | Server | `label`, `error`, `options`, `placeholder` | Labeled select with error state |
| `Accordion` | `accordion.tsx` | Client | `items: { question, answer }[]` | Expandable Q&A, smooth height animation |

**Button variants and sizes:**

| Variant | Appearance | Classes |
|---|---|---|
| `primary` | Ghost/outline | `border border-foreground bg-transparent hover:bg-foreground hover:text-background` |
| `accent` | Solid filled | `bg-accent text-accent-foreground hover:bg-accent-hover` |
| `minimal` | Text with underline | `underline underline-offset-4 hover:text-accent` |

| Size | Height | Padding | Text |
|---|---|---|---|
| `sm` | `h-9` | `px-4` | `text-xs` |
| `md` | `h-12` | `px-8` | `text-sm` |
| `lg` | `h-14` | `px-10` | `text-sm` |

#### Section Components (`src/components/sections/`)

| Component | File | Type | Key Props | Notes |
|---|---|---|---|---|
| `Header` | `header.tsx` | Client | — | Fixed nav, scroll-aware bg, hamburger menu, links: Buy, Sell, Listings |
| `Footer` | `footer.tsx` | Server | — | Always-dark bg, 3-col grid (nav, contact, social), copyright |
| `Hero` | `hero.tsx` | Server | `image`, `imageAlt`, `overline`, `title`, `subtitle`, `children`, `size` | Full-bleed image with dark overlay; `size`: "full" or "short" |
| `CTASection` | `cta-section.tsx` | Server | — | "Ready to Get Started?" with contact CTA |
| `ContactForm` | `contact-form.tsx` | Client | `prefilledSubject?` | Validated form: name, email, phone, subject, message |
| `MobileMenu` | `mobile-menu.tsx` | Client | `isOpen`, `onClose` | Fullscreen slide-out menu, ESC to close, scroll lock |

### 4.3 Component File Structure

```tsx
// src/components/ui/button.tsx — ACTUAL PATTERN
import { type ComponentProps } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "minimal";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], variant !== "minimal" && sizes[size], className)}
      {...props}
    />
  );
}
```

### 4.4 Component Patterns from Figma

When implementing components from Figma designs:

1. **Match the visual hierarchy exactly** — spacing, sizing, typography
2. **Use Tailwind utility classes** — do not create CSS modules or styled-components
3. **Responsive implementation:** Mobile-first with `sm:`, `md:`, `lg:`, `xl:` breakpoints
4. **Dark mode:** Use `dark:` prefix classes alongside light mode styles
5. **Images:** Always use `next/image` (`<Image>`) with explicit `width`/`height` or `fill` prop
6. **Links:** Use `next/link` (`<Link>`) for internal navigation
7. **Icons:** Use inline SVG components or import from `/public`

---

## 5. Styling Rules

### 5.1 Methodology

- **Utility-first CSS** with Tailwind CSS 4
- **No CSS-in-JS** — No styled-components, Emotion, or CSS Modules
- **No custom CSS classes** unless absolutely necessary — prefer Tailwind utilities
- **Global styles only** in `src/app/globals.css` for CSS variables and base element styles
- **`@apply` usage:** Avoid. Use utility classes directly in JSX

### 5.2 Responsive Breakpoints

Mobile-first approach using Tailwind's default breakpoints:

| Breakpoint | Min Width | Usage |
|---|---|---|
| (default) | 0px | Mobile phones |
| `sm` | 640px | Large phones / small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops / desktops |
| `xl` | 1280px | Large desktops |
| `2xl` | 1536px | Extra large screens |

**Pattern:** Always write mobile styles first, then add responsive variants:
```tsx
<div className="flex flex-col gap-4 sm:flex-row sm:gap-6 lg:gap-8">
```

### 5.3 Dark Mode

- Using `@media (prefers-color-scheme: dark)` for automatic system preference
- Apply dark mode styles via Tailwind's `dark:` prefix
- Every visible element must have appropriate dark mode styling
- Token-based: use `bg-background`, `text-foreground`, `bg-surface`, etc. — these automatically switch in dark mode
- For elements that don't use tokens, add explicit `dark:` variants

### 5.4 Color Usage from Figma

When translating Figma fills to Tailwind:

| Figma Property | Tailwind Pattern |
|---|---|
| Background fill | `bg-{color}` |
| Text fill | `text-{color}` |
| Border/stroke | `border border-{color}` |
| Opacity | `bg-{color}/{opacity}` (e.g., `bg-black/[.08]`) |
| Gradient | `bg-gradient-to-{dir} from-{color} to-{color}` |
| Blur/backdrop | `backdrop-blur-{size}` |

---

## 6. Utility Functions

### 6.1 `cn()` — Class Name Helper

Located at `src/lib/cn.ts`. Filters falsy values and joins with space:

```tsx
import { cn } from "@/lib/cn";

// Usage:
cn("base-class", isActive && "active-class", className)
// Handles: string | boolean | undefined | null
```

### 6.2 `formatPrice()` and `formatNumber()`

Located at `src/lib/format.ts`:

```tsx
import { formatPrice, formatNumber } from "@/lib/format";

formatPrice(425000)  // → "$425,000"
formatNumber(1850)   // → "1,850"
```

### 6.3 Dummy Data

Located at `src/lib/dummy-data.ts`. Provides mock data for all entities:

| Export | Type | Count | Description |
|---|---|---|---|
| `listings` | `Listing[]` | 12 | Properties across 5 states, mixed statuses |
| `teamMembers` | `TeamMember[]` | 5 | Agents with bios, photos, contact info |
| `testimonials` | `Testimonial[]` | 5 | Client quotes with details |
| `companyStats` | `object[]` | 4 | Years, homes sold, agents, states |
| `valuePropositions` | `object[]` | 3 | Marketing value props |
| `buyingSteps` | `object[]` | 4 | Buying process steps |
| `sellingSteps` | `object[]` | 5 | Selling process steps |
| `buyerFaqs` | `object[]` | 5 | Buyer FAQ questions & answers |
| `sellerFaqs` | `object[]` | 5 | Seller FAQ questions & answers |
| `coverageAreas` | `object[]` | 5 | States with city lists |
| `companyValues` | `object[]` | 4 | Company values with descriptions |

---

## 7. Type Definitions

Located in `src/types/`:

```tsx
// types/listing.ts
interface Listing {
  id: string;
  slug: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  status: "Active" | "Pending" | "Sold";
  propertyType: "Single Family" | "Condo" | "Townhouse" | "Multi-Family" | "Land";
}

// types/team.ts
interface TeamMember {
  slug: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  phone: string;
  email: string;
}

// types/testimonial.ts
interface Testimonial {
  quote: string;
  name: string;
  detail: string;
}
```

---

## 8. Asset Management

### 8.1 Static Assets

- **Location:** `/public/` directory
- **Current assets:** Default Next.js SVGs only (file.svg, globe.svg, next.svg, vercel.svg, window.svg)
- **No custom icons yet** — `/public/icons/` does not exist; create when needed
- **Brand assets:** Not yet added — logo, favicons, OG images needed
- **Reference:** Use absolute paths from root: `src="/icon.svg"`

### 8.2 Images

All images currently use Unsplash URLs (configured in `next.config.ts`). Always use Next.js `<Image>` component:

```tsx
import Image from "next/image";

// Fixed size
<Image src="/logo.svg" alt="Drenova Group" width={120} height={40} priority />

// Fill container (used in Hero, PropertyCard, TeamMemberCard)
<Image src={photoUrl} alt="Property photo" fill className="object-cover" />
```

**Rules:**
- Always provide `alt` text
- Use `priority` for above-the-fold hero images (LCP optimization)
- Use `fill` + `object-cover` for dynamic/responsive images
- Always set explicit `width` and `height` for fixed-size images to prevent CLS

### 8.3 Downloading Assets from Figma

When Figma designs include assets (icons, illustrations, images):
1. Download SVGs for icons and illustrations — place in `/public/icons/` or `/public/`
2. For complex illustrations, consider inline SVG React components in `src/components/icons/`
3. Use descriptive filenames: `icon-beds.svg`, `icon-baths.svg`, `hero-illustration.svg`
4. Optimize SVGs (remove unnecessary metadata, minimize paths)

---

## 9. Icon System

### 9.1 Current State

No formal icon library is installed. No custom icons exist yet. Icons are stored as SVG files in `/public/`.

### 9.2 Implementation Pattern

When implementing icons from Figma:

**Option A — Simple SVG (preferred for static icons):**
```tsx
<Image src="/icons/icon-name.svg" alt="" width={24} height={24} aria-hidden="true" />
```

**Option B — React SVG Component (for icons needing dynamic color/size):**
```tsx
// src/components/icons/beds-icon.tsx
export function BedsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* SVG paths */}
    </svg>
  );
}
```

### 9.3 Naming Convention

- Files: `kebab-case` — e.g., `arrow-right.svg`, `icon-beds.svg`
- Components: `PascalCase` — e.g., `ArrowRightIcon`, `BedsIcon`
- Decorative icons: Add `aria-hidden="true"` and empty `alt=""`
- Meaningful icons: Provide descriptive `alt` or `aria-label`

---

## 10. Animation Strategy

### 10.1 Animation Layers (from PRD)

| Layer | Technology | Pages | Status |
|---|---|---|---|
| 3D scenes | Three.js + React Three Fiber | Homepage hero | Planned — not installed |
| UI transitions | motion.dev (Motion for React) | All pages | Planned — not installed |
| Decorative | reactbits | Marketing pages only | Planned — not installed |
| Micro-interactions | Tailwind CSS transitions | All pages | **Available now** |

### 10.2 CSS Animation Rules (Available Now)

Use Tailwind's built-in transition utilities for hover/focus states:

```tsx
// Button hover
<button className="transition-colors hover:bg-foreground hover:text-background">

// Smooth transitions
<div className="transition-all duration-200 ease-in-out">
```

### 10.3 Animation Guidelines

- **Reduced motion:** All animations must respect `prefers-reduced-motion`
- **Duration limits:** Transitions 150–300ms, Reveals 300–500ms
- **Transactional pages** (Listings, Detail): Minimal animation, prioritize speed
- **Marketing pages** (Home, Buy, Sell): More visual flair permitted

---

## 11. Accessibility Requirements

### 11.1 Standards

- **WCAG 2.1 AA** compliance minimum
- **Color contrast:** 4.5:1 for body text, 3:1 for large text
- **Keyboard navigation:** All interactive elements must be focusable and operable
- **Focus indicators:** Visible focus rings on all interactive elements
- **Screen readers:** Semantic HTML, ARIA labels, alt text on all images
- **Forms:** Labels associated with inputs, error messages linked to fields

### 11.2 Semantic HTML

Always use appropriate HTML elements:

| Purpose | Element | NOT this |
|---|---|---|
| Navigation | `<nav>` | `<div>` |
| Main content | `<main>` | `<div>` |
| Sections | `<section>` with heading | `<div>` |
| Page header | `<header>` | `<div>` |
| Page footer | `<footer>` | `<div>` |
| Buttons | `<button>` | `<div onClick>` |
| Links | `<a>` or `<Link>` | `<span onClick>` |

---

## 12. SEO Rules

### 12.1 Metadata

Every page exports metadata using the template system defined in `layout.tsx`:

```tsx
// layout.tsx defines the template:
export const metadata: Metadata = {
  title: {
    default: "Drenova Group | Real Estate",
    template: "%s | Drenova Group",
  },
  description: "...",
};

// Each page overrides with:
export const metadata: Metadata = {
  title: "Page Title",  // Renders as: "Page Title | Drenova Group"
  description: "Unique page description under 160 characters.",
};
```

### 12.2 Image Optimization

- Use `next/image` with WebP/AVIF automatic format selection
- Set `priority` on LCP images (hero images, above-the-fold content)
- Always provide explicit dimensions to prevent CLS

---

## 13. Key Technical Decisions

| Decision | Choice | Notes |
|---|---|---|
| Framework | Next.js 16.1.6 (App Router) | SSR/ISR, RSC, file-based routing |
| Language | TypeScript (strict mode) | All files must be `.ts`/`.tsx` |
| Styling | Tailwind CSS 4 (CSS-based config) | No `tailwind.config.js` — use `@theme inline` in `globals.css` |
| React Compiler | Enabled | `reactCompiler: true` in `next.config.ts` |
| Package manager | npm | Use `npm install`, `npm run dev`, etc. |
| Path alias | `@/*` → `./src/*` | Always use `@/` for imports |
| Components | Server Components by default | `"use client"` only when needed |
| Images | `next/image` only | Never use raw `<img>` tags |
| Links | `next/link` only | For internal navigation |
| Remote images | Unsplash | `images.unsplash.com` allowed in `next.config.ts` |
| Color scheme | System preference | `colorScheme: "light"` on `<html>`, `prefers-color-scheme` for dark |
| Layout structure | Header + main + Footer | Rendered in root `layout.tsx`, wrapping all pages |

---

## 14. Figma-to-Code Workflow

When implementing designs from Figma using MCP tools:

### Step 1: Get Design Context
Use `get_design_context` to extract component code and structure from the Figma node.

### Step 2: Map Tokens
- Consult `DESIGN.md` Section J for the full Figma-to-Tailwind token mapping table
- Map Figma fill colors → CSS custom properties in `globals.css` → Tailwind utility classes
- Map Figma text styles → Tailwind typography classes (see `DESIGN.md` Section C.3)
- Map Figma spacing → Tailwind spacing scale (4px = `1`, 8px = `2`, 16px = `4`, etc.)
- Map Figma border radius → `rounded-{size}` classes

### Step 3: Implement Component
- Create the component in the appropriate directory (`src/components/ui/` or `src/components/sections/`)
- Use TypeScript with proper interface definitions
- Apply responsive behavior with mobile-first breakpoints
- Add dark mode variants for all visual styles
- Include proper accessibility attributes

### Step 4: Download Assets
- Extract SVGs for icons → `/public/icons/`
- Extract images → `/public/` or reference external CDN URLs
- Use `next/image` for all raster images

### Figma Spacing → Tailwind Conversion Table

| Figma (px) | Tailwind | Figma (px) | Tailwind |
|---|---|---|---|
| 2 | `0.5` | 32 | `8` |
| 4 | `1` | 40 | `10` |
| 8 | `2` | 48 | `12` |
| 12 | `3` | 56 | `14` |
| 16 | `4` | 64 | `16` |
| 20 | `5` | 80 | `20` |
| 24 | `6` | 96 | `24` |

---

## 15. Development Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 16. File Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Pages | `page.tsx` (App Router) | `src/app/about/page.tsx` |
| Layouts | `layout.tsx` | `src/app/listings/layout.tsx` |
| Components | `kebab-case.tsx` | `src/components/ui/button.tsx` |
| Utilities | `kebab-case.ts` | `src/lib/format.ts` |
| Types | `kebab-case.ts` | `src/types/listing.ts` |
| Assets | `kebab-case` | `public/icons/arrow-right.svg` |

---

## 17. Current Project State

### What's Built (Phase 1 — Marketing Pages)

| Area | Status | Notes |
|---|---|---|
| **All 10 pages** | Done | /, /buy, /sell, /listings, /about, /team, /team/[slug], /contact, /privacy, /terms |
| **Design token system** | Done | Full light/dark mode tokens in `globals.css` |
| **Font loading** | Done | 3 fonts via `next/font/google` in `layout.tsx` |
| **8 UI components** | Done | Button, SectionHeader, PropertyCard, TeamMemberCard, Input, Textarea, Select, Accordion |
| **5 section components** | Done | Header, Footer, Hero, CTASection, ContactForm, MobileMenu |
| **Type definitions** | Done | Listing, TeamMember, Testimonial |
| **Utilities** | Done | cn(), formatPrice(), formatNumber() |
| **Mock data** | Done | 12 listings, 5 team members, 5 testimonials, FAQs, etc. |
| **SEO metadata** | Done | Title template + per-page metadata on all pages |
| **Responsive design** | Done | Mobile-first across all pages |

### What's Not Built Yet

| Area | Status | Phase |
|---|---|---|
| Backend / API routes | Not started | Phase 2 |
| Form submission (server-side) | Not started | Phase 2 |
| MLS/IDX integration | Not started | Phase 2 |
| Property detail pages (`/listings/[slug]`) | Not started | Phase 2 |
| Search/filter logic (UI exists but no state) | Not started | Phase 2 |
| Mapbox interactive map | Not started | Phase 2 |
| Sanity CMS integration | Not started | Phase 2 |
| Three.js hero animation | Not started | Phase 1 |
| motion.dev animations | Not started | Phase 3 |
| reactbits decorative effects | Not started | Phase 3 |
| Custom brand assets (logo, favicon, OG images) | Not started | Phase 1 |
| Sentry error tracking | Not started | Phase 3 |
| Email service (Resend/SendGrid) | Not started | Phase 2 |

---

## 18. Planned Integrations (Not Yet Installed)

These libraries are specified in the PRD but **not yet added** to the project. Do not import or reference them until they are installed:

- **Sanity CMS** — Headless CMS for marketing content
- **Three.js + React Three Fiber** — 3D homepage hero animation
- **motion.dev** — UI animation library
- **reactbits** — Pre-built animated components
- **Mapbox GL JS + react-map-gl** — Interactive listing maps
- **Sentry** — Error tracking
- **Resend or SendGrid** — Transactional email
