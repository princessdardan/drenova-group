# Drenova Group — Design System

> **Version:** 1.0
> **Status:** Active — Single source of truth for all visual decisions
> **References:** Denova Group Listing Presentation (PDF), SoldBySemir.ca, PRD Section 5

This document defines visual design direction. For technical implementation, see `CLAUDE.md`. For feature requirements, see `prd.md`.

---

## A. Design Philosophy & Mood

### Core Aesthetic: Warm Luxury

Drenova Group's visual identity sits at the intersection of **warmth** and **sophistication** — professional without being cold, luxurious without being pretentious. The design draws from two reference points:

1. **Denova Group Listing Presentation** — Warm interiors, Didone serif typography, cream/dark dual-tone palette, lifestyle photography with text overlays
2. **SoldBySemir.ca** — Dark navy dominant palette, clean sans-serif UI, ghost buttons, fullscreen hero sections, dramatic photography

### Design Principles

| Principle | Description | What It Looks Like |
|---|---|---|
| **Photography-driven** | Real estate photography is the primary visual element, not illustrations or graphics | Full-bleed hero images, large photo cards, lifestyle imagery in every section |
| **Warm over cool** | Warm whites (cream), warm grays, copper accents — never pure white or cool blue-grays | `#FAFAF7` backgrounds instead of `#FFFFFF`, `#F0EBE3` surfaces instead of `#F5F5F5` |
| **Generous whitespace** | Content breathes — sections have large vertical padding, elements don't feel cramped | `py-20 lg:py-32` section padding, `gap-8 lg:gap-12` between content blocks |
| **Dark/light rhythm** | Alternate between light (cream) and dark (navy) sections for visual hierarchy | Hero (dark) → Features (cream) → Testimonials (dark) → CTA (cream) |
| **Typography hierarchy** | Clear distinction between display headings (serif) and body text (sans-serif) | Playfair Display for emotional impact, Plus Jakarta Sans for readability |
| **Subtle motion** | Animation enhances comprehension, never distracts | Scroll-triggered reveals at 300ms, hover transitions at 200ms |

### Mood Keywords

`warm` · `sophisticated` · `inviting` · `confident` · `modern` · `clean` · `editorial` · `aspirational`

### Anti-Patterns (What to Avoid)

- Pure white (`#FFFFFF`) backgrounds on main page sections — always use warm whites
- Cool gray text or borders — use warm grays with slight brown undertone
- Busy, cluttered layouts — every element needs breathing room
- Generic stock photography — all images should feel curated, warm, real
- Overly playful or casual typography/iconography — maintain professional tone
- Flat, lifeless sections — use photography and dark/light alternation for depth

---

## B. Color Palette

### B.1 Semantic Tokens

All colors are defined as CSS custom properties in `globals.css` and registered with Tailwind via `@theme inline`. Every token has both light and dark mode values.

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `--background` | `#FAFAF7` (warm white) | `#030910` (deep navy-black) | Page background |
| `--foreground` | `#1A1A1A` (near-black) | `#F0F3F5` (soft white) | Primary text |
| `--surface` | `#F0EBE3` (warm cream) | `#0E1921` (dark navy) | Cards, alternate sections |
| `--surface-alt` | `#FFFFFF` (pure white) | `#172029` (lighter navy) | Elevated surfaces, modals |
| `--muted` | `#6B6560` (warm gray) | `#8B8E92` (cool gray) | Secondary text, captions |
| `--muted-foreground` | `#8A8580` (lighter warm gray) | `#6B6E72` (darker gray) | Placeholder text, disabled states |
| `--border` | `#E0D9CF` (warm border) | `#2A3440` (dark border) | Borders, dividers, separators |
| `--ring` | `#A94310` (copper) | `#C4622A` (lighter copper) | Focus rings |
| `--accent` | `#A94310` (copper) | `#C4622A` (lighter copper) | CTAs, highlights, active states |
| `--accent-hover` | `#8E3710` (darker copper) | `#D4723A` (brighter copper) | Hover state on accent elements |
| `--accent-foreground` | `#FFFFFF` | `#FFFFFF` | Text on accent backgrounds |
| `--overlay` | `rgba(3,9,16,0.65)` | `rgba(3,9,16,0.75)` | Dark overlay on hero images |

### B.2 Color Usage Rules

1. **Never use raw hex values in components** — always reference semantic tokens via Tailwind classes (`bg-background`, `text-foreground`, `border-border`)
2. **Warm cream (#F0EBE3) is the key differentiator** — it replaces generic white/gray across the site and gives the warm, editorial feeling
3. **Copper accent is used sparingly** — only for primary CTAs, active navigation, key highlights, and focus rings
4. **Dark overlays on photography** — always use `--overlay` (65% opacity) for text readability over hero images
5. **Contrast ratios must pass WCAG AA** — `--foreground` on `--background` (light: 16.5:1, dark: 15.8:1), `--muted` on `--background` (light: 4.8:1, dark: 4.5:1)

For full color ramps used to derive these tokens, see `globals.css`.

---

## C. Typography

### C.1 Font Stack

| Role | Font | Weight Range | Usage |
|---|---|---|---|
| **Display** | Playfair Display | 400, 700 | Hero headings, section titles, pull quotes, large feature text |
| **Body / UI** | Plus Jakarta Sans | 400, 500, 600, 700 | Body text, buttons, navigation, form labels, all UI text |
| **Monospace** | Geist Mono | 400 | MLS numbers, data tables, code references |

### C.2 Why This Pairing

**Playfair Display** is a Didone serif — high contrast thick/thin strokes, elegant and editorial. It matches the bold serif typography used extensively in the Denova Group Listing Presentation for dramatic headings ("AN ELEVATED APPROACH", "YOUR HOME'S STORY"). The Didone classification signals luxury and sophistication.

**Plus Jakarta Sans** is the PRD's recommended sans-serif. It's geometric but friendly, with slightly rounded terminals that complement Playfair's formality without being too casual. It reads well at small sizes for UI text and body copy.

---

## D. Layout Patterns

These are the recurring layout patterns derived from the two design references. Every page should be composed from these building blocks.

### D.1 Full-Bleed Hero

The primary hero pattern — used on Homepage, Buy, Sell, About, Contact.

```
┌──────────────────────────────────────────────┐
│ [Background: full-bleed photo]               │
│ [Overlay: --overlay (65% dark)]              │
│                                              │
│           OVERLINE LABEL                     │
│      Large Serif Heading                     │
│     Subtitle text (1-2 lines)                │
│                                              │
│    [ GHOST CTA 1 ]  [ GHOST CTA 2 ]         │
│                                              │
└──────────────────────────────────────────────┘
```

**Implementation:**
- Container: `relative min-h-[70vh] lg:min-h-screen flex items-center justify-center`
- Image: `<Image fill className="object-cover" priority />`
- Overlay: `absolute inset-0 bg-overlay`
- Content: `relative z-10 text-center text-white max-w-3xl px-6`

### D.2 Split Panel

Text on one half, full-height image on the other. Used for About sections, value propositions.

```
┌──────────────────┬───────────────────────────┐
│                  │                           │
│  Overline        │                           │
│  Serif Heading   │    [Full-height image]    │
│                  │                           │
│  Body text...    │                           │
│                  │                           │
│  [ CTA BUTTON ]  │                           │
│                  │                           │
└──────────────────┴───────────────────────────┘
```

**Implementation:**
- Container: `grid grid-cols-1 lg:grid-cols-2 min-h-[500px]`
- Text panel: `flex flex-col justify-center px-8 lg:px-16 py-16 bg-surface`
- Image panel: `relative` with `<Image fill className="object-cover" />`
- On mobile: Stack vertically (image on top, text below)
- Alternate direction: Even sections reverse order (`lg:order-2` on image)

### D.3 Text Over Image

Large white serif text overlaid on warm lifestyle photography. Used for transitional/statement sections.

```
┌──────────────────────────────────────────────┐
│ [Background: warm interior/exterior photo]   │
│ [Overlay: lighter, ~40%]                     │
│                                              │
│     "Large italic serif pull quote           │
│      spanning two lines"                     │
│                                              │
│             — Attribution                    │
│                                              │
└──────────────────────────────────────────────┘
```

### D.4 Alternating Content Sections

The backbone of marketing pages. Cream and dark sections alternate for visual rhythm.

```
┌──────────────────────────────────────────────┐
│  [bg-surface / cream]                        │
│  Section with content block A                │
└──────────────────────────────────────────────┘
┌──────────────────────────────────────────────┐
│  [bg-background]                             │
│  Section with content block B                │
└──────────────────────────────────────────────┘
┌──────────────────────────────────────────────┐
│  [bg-surface / cream]                        │
│  Section with content block C                │
└──────────────────────────────────────────────┘
```

### D.5 Numbered Steps

Large decorative serif numbers with description text. Used for process flows (Buy, Sell pages).

```
01                02                03
───────           ───────           ───────
Step Title        Step Title        Step Title
Description       Description       Description
text here.        text here.        text here.
```

### D.6 Watermark / Background Text

Large faded text behind a section (e.g., "ABOUT", "APPROACH"). Borrowed from SoldBySemir's decorative treatment. Use sparingly — maximum one watermark section per page.

---

## E. Component Patterns

Visual design intent for each component. For implementation details, props, and variants, read the source files in `frontend/src/components/`.

### E.1 Buttons

Three variants. The ghost/outline style is the primary CTA (consistent with both the PDF and SoldBySemir).

```
┌─────────────────────────────┐
│    GET STARTED              │  ← Primary (ghost/outline)
└─────────────────────────────┘
```

- **Primary (Ghost):** Transparent with border, inverts on hover
- **Accent (Solid):** Copper fill for high-priority CTAs
- **Minimal (Text):** Underlined text for secondary actions

### E.2 Navigation

```
┌──────────────────────────────────────────────┐
│  DRENOVA GROUP     Buy  Sell  Listings  ☰    │
└──────────────────────────────────────────────┘
```

- Fixed, transparent over hero, solid on scroll
- Hamburger on all breakpoints — full nav in slide-out menu
- Slide-out: fullscreen overlay, serif menu items, contact info at bottom

### E.3 Property Listing Card

```
┌──────────────────────────────────┐
│         [Property Photo]         │
├──────────────────────────────────┤
│  $425,000                        │
│  123 Main Street                 │
│  Springfield, IL 62701           │
│  3 bed · 2 bath · 1,850 sqft    │
└──────────────────────────────────┘
```

4:3 image ratio, warm surface background, hover shadow lift.

### E.4 Team Member Card

```
┌──────────────────────────────────┐
│       [Headshot Photo]           │
├──────────────────────────────────┤
│  Agent Name                      │
│  TITLE / ROLE                    │
│  [ CONTACT ]                     │
└──────────────────────────────────┘
```

3:4 image ratio, serif name, uppercase role.

### E.5 Section Header

```
         OVERLINE LABEL
    Section Title in Serif
   A brief description of what
   this section covers.
```

Copper overline, serif title, muted description. Center or left aligned.

### E.6 Footer

Always-dark background regardless of color mode. Three-column grid (navigation, contact, social). Dark navy background with light text.

### E.7 Form Inputs

Label above, warm surface background, border focus state with accent ring.

---

## F. Photography & Image Treatment

### F.1 Photography Direction

| Quality | Description |
|---|---|
| **Warm lighting** | Natural light, golden hour, warm interior lighting |
| **Earth tones** | Brown, tan, warm wood, stone, greenery |
| **Aspirational but real** | High-end but not sterile — spaces feel livable |
| **Architectural interest** | Show interesting details — arches, molding, textures |
| **Warm color grading** | Slight warm shift in post-processing, avoid cool/blue tints |

### F.2 Image Treatments

| Treatment | When | Implementation |
|---|---|---|
| **Dark overlay** | Hero images with text | `bg-black/65` absolute overlay |
| **Gradient overlay** | Bottom text on images | `bg-gradient-to-t from-black/80 to-transparent` |
| **Full bleed** | Hero/statement sections | `<Image fill className="object-cover" priority />` |
| **Contained** | Cards, grid items | `aspect-[4/3]` or `aspect-[3/4]` with `object-cover` |
| **Rounded** | Thumbnails | `rounded-lg overflow-hidden` |

### F.3 Aspect Ratios

| Component | Ratio |
|---|---|
| Hero background | Fill viewport (`min-h-[70vh] lg:min-h-screen`) |
| Property card image | 4:3 |
| Team member headshot | 3:4 |
| Gallery thumbnail | 1:1 |
| Split panel image | Natural (fill panel) |

---

*This document is the single source of truth for visual design decisions. For technical rules, see `CLAUDE.md`. For feature requirements, see `prd.md`.*
