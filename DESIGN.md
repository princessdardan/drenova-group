# Drenova Group — Design System

> **Version:** 1.0
> **Status:** Active — Single source of truth for all visual decisions
> **References:** Denova Group Listing Presentation (PDF), SoldBySemir.ca, PRD Section 5

This document defines every visual decision for the Drenova Group website. It complements `CLAUDE.md` (technical implementation rules) and `prd.md` (feature requirements). When implementing any page or component, consult this file first for design direction.

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

### B.2 Extended Palette (Reference Only)

These are the full color ramps used to derive the semantic tokens above. Use the semantic tokens in code, not these raw values.

**Warm Neutrals (Cream family):**
```
50:  #FAFAF7   ← --background (light)
100: #F5F0EB
200: #F0EBE3   ← --surface (light)
300: #E0D9CF   ← --border (light)
400: #C5BBB0
500: #8A8580   ← --muted-foreground (light)
600: #6B6560   ← --muted (light)
700: #4A4540
800: #2D2925
900: #1A1A1A   ← --foreground (light)
```

**Navy (Dark mode family):**
```
50:  #F0F3F5   ← --foreground (dark)
100: #C5CCD3
200: #8B8E92   ← --muted (dark)
300: #6B6E72   ← --muted-foreground (dark)
400: #2A3440   ← --border (dark)
500: #172029   ← --surface-alt (dark)
600: #0E1921   ← --surface (dark)
700: #030910   ← --background (dark)
```

**Copper (Accent family):**
```
300: #D4723A   ← --accent-hover (dark)
400: #C4622A   ← --accent (dark)
500: #A94310   ← --accent (light)
600: #8E3710   ← --accent-hover (light)
700: #6E2A0C
```

### B.3 Color Usage Rules

1. **Never use raw hex values in components** — always reference semantic tokens via Tailwind classes (`bg-background`, `text-foreground`, `border-border`)
2. **Warm cream (#F0EBE3) is the key differentiator** — it replaces generic white/gray across the site and gives the warm, editorial feeling
3. **Copper accent is used sparingly** — only for primary CTAs, active navigation, key highlights, and focus rings
4. **Dark overlays on photography** — always use `--overlay` (65% opacity) for text readability over hero images
5. **Contrast ratios must pass WCAG AA** — `--foreground` on `--background` (light: 16.5:1, dark: 15.8:1), `--muted` on `--background` (light: 4.8:1, dark: 4.5:1)

---

## C. Typography

### C.1 Font Stack

| Role | Font | Weight Range | CSS Variable | Usage |
|---|---|---|---|---|
| **Display** | Playfair Display | 400, 700 | `--font-display` | Hero headings, section titles, pull quotes, large feature text |
| **Body / UI** | Plus Jakarta Sans | 400, 500, 600, 700 | `--font-sans` | Body text, buttons, navigation, form labels, all UI text |
| **Monospace** | Geist Mono | 400 | `--font-mono` | MLS numbers, data tables, code references |

### C.2 Why This Pairing

**Playfair Display** is a Didone serif — high contrast thick/thin strokes, elegant and editorial. It matches the bold serif typography used extensively in the Denova Group Listing Presentation for dramatic headings ("AN ELEVATED APPROACH", "YOUR HOME'S STORY"). The Didone classification signals luxury and sophistication.

**Plus Jakarta Sans** is the PRD's recommended sans-serif. It's geometric but friendly, with slightly rounded terminals that complement Playfair's formality without being too casual. It reads well at small sizes for UI text and body copy.

### C.3 Typography Scale

Mobile-first responsive scale. All display headings use `font-display` (Playfair Display), all other text uses `font-sans` (Plus Jakarta Sans).

#### Display Headings (Playfair Display)

| Element | Mobile | Desktop (`lg:`) | Properties |
|---|---|---|---|
| Hero heading | `text-4xl` (36px) | `text-6xl` (60px) | `font-display font-bold tracking-tight leading-[1.1]` |
| Section heading | `text-3xl` (30px) | `text-5xl` (48px) | `font-display font-bold tracking-tight leading-[1.15]` |
| Feature heading | `text-2xl` (24px) | `text-4xl` (36px) | `font-display font-bold tracking-tight leading-[1.2]` |
| Pull quote | `text-xl` (20px) | `text-2xl` (24px) | `font-display font-normal italic leading-relaxed` |

#### Body & UI Text (Plus Jakarta Sans)

| Element | Size | Properties |
|---|---|---|
| Body large | `text-lg` (18px) | `leading-8` (32px line-height) |
| Body | `text-base` (16px) | `leading-7` (28px line-height) |
| Body small | `text-sm` (14px) | `leading-6` (24px line-height) |
| Caption / label | `text-xs` (12px) | `uppercase tracking-widest font-medium text-muted` |
| Button text | `text-sm` (14px) | `uppercase tracking-wider font-semibold` |
| Nav link | `text-sm` (14px) | `uppercase tracking-wider font-medium` |

### C.4 Letter-Spacing Rules

| Context | Tailwind Class | Value | Why |
|---|---|---|---|
| Display headings | `tracking-tight` | -0.025em | Tightens serifs for a cohesive, elegant look at large sizes |
| Body text | (default) | 0 | Natural spacing for readability |
| Uppercase text | `tracking-wider` | 0.05em | Opens up uppercase for legibility (buttons, labels, nav) |
| Overline/caption | `tracking-widest` | 0.1em | Maximum openness for small all-caps text |

### C.5 Typography Hierarchy Example

```
OVERLINE LABEL               ← text-xs uppercase tracking-widest font-medium text-muted font-sans
Section Heading              ← text-3xl lg:text-5xl font-bold tracking-tight font-display
Subtitle or description      ← text-lg leading-8 text-muted font-sans
Body paragraph text          ← text-base leading-7 font-sans
BUTTON TEXT                  ← text-sm uppercase tracking-wider font-semibold font-sans
```

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
- Overlay: `absolute inset-0 bg-overlay` (where `--overlay` = `rgba(3,9,16,0.65)`)
- Content: `relative z-10 text-center text-white max-w-3xl px-6`
- Heading: `font-display text-4xl lg:text-6xl font-bold tracking-tight`
- Buttons: Ghost style (see Component Patterns)

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

**Implementation:**
- Container: `relative py-24 lg:py-32`
- Overlay: `bg-black/40`
- Text: `font-display text-xl lg:text-3xl italic text-white text-center max-w-2xl mx-auto`

### D.4 Alternating Content Sections

The backbone of marketing pages. Cream and dark sections alternate for visual rhythm.

```
┌──────────────────────────────────────────────┐
│  [bg-surface / cream]                        │
│  Section with content block A                │
└──────────────────────────────────────────────┘
┌──────────────────────────────────────────────┐
│  [bg-background / dark navy in dark mode]    │
│  Section with content block B                │
└──────────────────────────────────────────────┘
┌──────────────────────────────────────────────┐
│  [bg-surface / cream]                        │
│  Section with content block C                │
└──────────────────────────────────────────────┘
```

**Implementation:**
- Even sections: `bg-surface py-20 lg:py-32`
- Odd sections: `bg-background py-20 lg:py-32`
- Content wrapper: `max-w-7xl mx-auto px-6 lg:px-8`

### D.5 Numbered Steps

Large decorative serif numbers with description text. Used for process flows (Buy, Sell pages).

```
01                02                03
───────           ───────           ───────
Step Title        Step Title        Step Title
Description       Description       Description
text here.        text here.        text here.
```

**Implementation:**
- Grid: `grid grid-cols-1 md:grid-cols-3 gap-12`
- Number: `font-display text-6xl lg:text-8xl font-bold text-accent/20` (faded accent)
- Divider: `w-12 h-px bg-border mt-4 mb-6`
- Title: `text-lg font-semibold mb-2`
- Description: `text-base text-muted leading-7`

### D.6 Watermark / Background Text

Large faded text behind a section (e.g., "ABOUT", "APPROACH"). Borrowed from SoldBySemir's decorative treatment.

**Implementation:**
- Container: `relative overflow-hidden`
- Watermark: `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[8rem] lg:text-[14rem] font-bold text-foreground/[0.03] uppercase whitespace-nowrap pointer-events-none select-none`
- Content: `relative z-10` (sits above the watermark)

Use sparingly — maximum one watermark section per page.

---

## E. Component Patterns

### E.1 Buttons

Three button variants derived from the references. The ghost/outline style is the primary CTA pattern (consistent with both the PDF and SoldBySemir).

#### Primary (Ghost/Outline)
The signature button — transparent background with a visible border.

```
┌─────────────────────────────┐
│    GET STARTED              │
└─────────────────────────────┘
```

- Default: `border border-foreground bg-transparent text-foreground`
- Hover: `bg-foreground text-background`
- Classes: `inline-flex items-center justify-center h-12 px-8 text-sm uppercase tracking-wider font-semibold border transition-colors duration-200`

#### Accent (Solid)
For high-priority CTAs where the ghost button doesn't provide enough emphasis.

- Default: `bg-accent text-accent-foreground`
- Hover: `bg-accent-hover`
- Same sizing as ghost button

#### Minimal (Text Only)
For secondary actions, links within content.

- Default: `text-foreground underline underline-offset-4`
- Hover: `text-accent`
- Classes: `text-sm font-medium transition-colors`

#### Button Sizes

| Size | Height | Padding | Text |
|---|---|---|---|
| `sm` | `h-9` | `px-4` | `text-xs` |
| `md` | `h-12` | `px-8` | `text-sm` |
| `lg` | `h-14` | `px-10` | `text-sm` |

### E.2 Navigation

**Desktop:** Minimal horizontal top bar.

```
┌──────────────────────────────────────────────┐
│  DRENOVA GROUP     Buy  Sell  Listings  ☰    │
└──────────────────────────────────────────────┘
```

- Fixed position, transparent over hero, solid background on scroll
- Logo: Left-aligned, all-caps, `font-display text-lg tracking-wider font-bold`
- Nav links: `text-sm uppercase tracking-wider font-medium`
- Hamburger icon on all breakpoints (SoldBySemir pattern) — full nav is in the slide-out menu

**Mobile / Slide-Out Menu:** Fullscreen overlay menu triggered by hamburger.

```
┌──────────────────────────────────────────────┐
│                                         ✕    │
│                                              │
│              BUY                              │
│              SELL                             │
│              LISTINGS                         │
│              ABOUT                            │
│              TEAM                             │
│              CONTACT                          │
│                                              │
│         info@drenovagroup.com                 │
│         (555) 123-4567                        │
└──────────────────────────────────────────────┘
```

- Background: `bg-background` (dark navy in dark mode)
- Menu items: `font-display text-3xl lg:text-4xl font-bold tracking-tight`
- Animation: Slide from right, 300ms ease-out
- Contact info at bottom: `text-sm text-muted`

### E.3 Property Listing Card

```
┌──────────────────────────────────┐
│                                  │
│         [Property Photo]         │
│                                  │
├──────────────────────────────────┤
│  $425,000                        │
│  123 Main Street                 │
│  Springfield, IL 62701           │
│  3 bed · 2 bath · 1,850 sqft    │
└──────────────────────────────────┘
```

- Container: `bg-surface-alt rounded-lg overflow-hidden border border-border transition-shadow hover:shadow-lg`
- Image: `aspect-[4/3] relative` with `<Image fill className="object-cover" />`
- Price: `text-xl font-semibold`
- Address: `text-base font-medium`
- City/State: `text-sm text-muted`
- Details: `text-sm text-muted` with middle-dot separators

### E.4 Team Member Card

```
┌──────────────────────────────────┐
│                                  │
│       [Headshot Photo]           │
│                                  │
├──────────────────────────────────┤
│  Agent Name                      │
│  TITLE / ROLE                    │
│  [ CONTACT ]                     │
└──────────────────────────────────┘
```

- Container: `bg-surface-alt overflow-hidden`
- Image: `aspect-[3/4] relative` with `<Image fill className="object-cover" />`
- Name: `text-lg font-semibold font-display`
- Role: `text-xs uppercase tracking-widest text-muted`
- Contact: Ghost button (sm size)

### E.5 Section Header

The standard pattern for introducing a content section.

```
         OVERLINE LABEL
    Section Title in Serif
   A brief description of what
   this section covers.
```

- Overline: `text-xs uppercase tracking-widest font-medium text-accent mb-4`
- Title: `font-display text-3xl lg:text-5xl font-bold tracking-tight mb-4`
- Description: `text-lg text-muted leading-8 max-w-2xl`
- Alignment: Center for standalone sections, left for split panels

### E.6 Footer

Dark background, multi-column layout.

```
┌──────────────────────────────────────────────┐
│  DRENOVA GROUP                               │
│                                              │
│  Navigation     Contact        Follow Us     │
│  ─────────     ─────────      ──────────     │
│  Buy           123 Main St    Instagram      │
│  Sell          Springfield    LinkedIn       │
│  Listings      (555) 123-4567 Facebook       │
│  About         info@drenova                  │
│  Team          group.com                     │
│  Contact                                     │
│                                              │
│  ─────────────────────────────────────────── │
│  © 2026 Drenova Group. All rights reserved.  │
│  Privacy Policy  ·  Terms of Service         │
└──────────────────────────────────────────────┘
```

- Background: Dark — `bg-[#0E1921]` in light mode, `bg-[#030910]` in dark mode (always dark)
- Text: `text-[#F0F3F5]` (always light text regardless of mode)
- Grid: `grid grid-cols-1 md:grid-cols-3 gap-8`
- Column headers: `text-xs uppercase tracking-widest font-medium text-[#8B8E92] mb-4`
- Links: `text-sm text-[#C5CCD3] hover:text-white transition-colors`
- Divider: `border-t border-[#2A3440]`
- Bottom bar: `text-xs text-[#6B6E72]`

### E.7 Form Inputs

```
Label Text
┌──────────────────────────────────┐
│  Placeholder text                │
└──────────────────────────────────┘
```

- Container: `flex flex-col gap-1.5`
- Label: `text-sm font-medium`
- Input: `h-12 px-4 bg-surface-alt border border-border rounded-lg text-base transition-colors focus:border-accent focus:ring-1 focus:ring-ring outline-none`
- Placeholder: `text-muted-foreground`
- Error: `text-sm text-red-600 dark:text-red-400 mt-1`

---

## F. Photography & Image Treatment

### F.1 Photography Direction

All photography should align with these qualities:

| Quality | Description | Example |
|---|---|---|
| **Warm lighting** | Natural light, golden hour, warm interior lighting | Sunlit living rooms, morning kitchen scenes |
| **Earth tones** | Brown, tan, warm wood, stone, greenery | Hardwood floors, stone countertops, garden views |
| **Aspirational but real** | High-end but not sterile — spaces feel livable | Styled but not over-staged homes |
| **Architectural interest** | Show interesting details — arches, molding, textures | Close-ups of finishes alongside wide shots |
| **Warm color grading** | Slight warm shift in post-processing | Avoid cool/blue-tinted photos |

### F.2 Image Treatments

| Treatment | When | Implementation |
|---|---|---|
| **Dark overlay** | Hero images with text overlay | `bg-black/65` absolute overlay |
| **Gradient overlay** | Bottom text on images | `bg-gradient-to-t from-black/80 to-transparent` |
| **Full bleed** | Hero sections, statement sections | `<Image fill className="object-cover" priority />` |
| **Contained** | Cards, grid items | `aspect-[4/3]` or `aspect-[3/4]` with `object-cover` |
| **Rounded** | Team headshots, thumbnails | `rounded-lg overflow-hidden` |

### F.3 Aspect Ratios

| Component | Ratio | Tailwind |
|---|---|---|
| Hero background | 16:9 (fill viewport) | `min-h-[70vh] lg:min-h-screen` |
| Property card image | 4:3 | `aspect-[4/3]` |
| Team member headshot | 3:4 | `aspect-[3/4]` |
| Gallery thumbnail | 1:1 | `aspect-square` |
| Split panel image | Natural (fill panel) | `<Image fill />` in relative container |

### F.4 Image Performance

- Always use `next/image` with `priority` on above-the-fold hero images
- Use `fill` + `sizes` attribute for responsive images
- Listing photos: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
- Hero images: `sizes="100vw"`

---

## G. Animation Guidelines

### G.1 Animation Philosophy

Animations serve three purposes: **guide attention** (direct the eye to important content), **provide feedback** (confirm user actions), and **establish hierarchy** (reveal content in meaningful order). They should never exist purely for decoration.

### G.2 Technology Layers

| Layer | Technology | Pages | Status |
|---|---|---|---|
| 3D scenes | Three.js + React Three Fiber | Homepage hero | Planned (Phase 1) |
| UI transitions | motion.dev (Motion for React) | All pages | Planned (Phase 1) |
| Decorative | reactbits | Marketing pages only | Planned (Phase 3) |
| Micro-interactions | Tailwind CSS transitions | All pages | Available now |

### G.3 Duration & Easing

| Animation Type | Duration | Easing | Example |
|---|---|---|---|
| Hover/focus state | 150–200ms | `ease-in-out` | Button hover fill, link underline |
| Small transition | 200–300ms | `ease-out` | Dropdown open, accordion expand |
| Section reveal | 300–500ms | `ease-out` | Fade-up on scroll enter |
| Page transition | 300–400ms | `ease-in-out` | Route change crossfade |
| 3D scene | Continuous | Linear/spring | Hero background animation |

### G.4 Scroll-Triggered Reveals

Sections fade up as they enter the viewport. Standard reveal pattern:

- **Initial state:** `opacity: 0; transform: translateY(20px);`
- **Revealed state:** `opacity: 1; transform: translateY(0);`
- **Duration:** 400ms, `ease-out`
- **Stagger:** When revealing multiple items (cards, steps), stagger by 100ms each
- **Trigger:** When element is 20% visible in viewport (`threshold: 0.2`)

### G.5 Reduced Motion

All animations MUST respect `prefers-reduced-motion`:
- Three.js scenes: Fall back to a static gradient or image
- motion.dev animations: Replace with instant transitions (`duration: 0`)
- Scroll reveals: Content appears immediately without animation
- CSS transitions: Use `@media (prefers-reduced-motion: reduce) { transition: none; }`

### G.6 Page-Type Animation Budget

| Page Type | Animation Level | Allowed |
|---|---|---|
| Homepage | Rich | 3D hero, scroll reveals, hover effects, decorative elements |
| Buy / Sell | Moderate | Scroll reveals, hover effects, step animations |
| About / Team | Moderate | Scroll reveals, hover effects, stats counter |
| Listings | Minimal | Card hover, filter transitions, map interactions only |
| Property Detail | Minimal | Gallery transitions, tab switches only |
| Contact | Minimal | Form focus states, submit feedback only |

---

## H. Page-by-Page Design Direction

Wireframe-level direction for each route, mapping the layout patterns from Section D to specific pages.

### H.1 Homepage (`/`)

```
┌────────────────────────────────────────────────────┐
│ HEADER (transparent, over hero)                    │
├────────────────────────────────────────────────────┤
│ HERO — Full-bleed (D.1)                            │
│ Three.js 3D scene background (or hero photo)       │
│ "Your Home's Story Starts Here"                    │
│ [ BROWSE LISTINGS ]  [ SELL YOUR HOME ]            │
├────────────────────────────────────────────────────┤
│ FEATURED LISTINGS — bg-surface (cream)             │
│ Section header: "Featured Properties"              │
│ Grid of 4-6 property cards (E.3)                   │
│ [ VIEW ALL LISTINGS ] ghost button                 │
├────────────────────────────────────────────────────┤
│ ABOUT SPLIT — Split panel (D.2)                    │
│ Text left: "An Elevated Approach"                  │
│ Image right: warm interior photo                   │
│ Brief company description + CTA                    │
├────────────────────────────────────────────────────┤
│ VALUE PROPS — bg-background                        │
│ 3 numbered steps (D.5) or icon grid                │
│ "Multi-State Coverage" / "Local Expertise" / etc.  │
├────────────────────────────────────────────────────┤
│ TESTIMONIAL — Text over image (D.3)                │
│ Client quote in serif italic                       │
│ Client name + property sold                        │
├────────────────────────────────────────────────────┤
│ CTA SECTION — bg-surface (cream)                   │
│ "Ready to Get Started?"                            │
│ [ CONTACT US ] ghost button                        │
├────────────────────────────────────────────────────┤
│ FOOTER (E.6)                                       │
└────────────────────────────────────────────────────┘
```

### H.2 Buy Page (`/buy`)

```
┌────────────────────────────────────────────────────┐
│ HERO — Full-bleed (D.1) with warm home photo       │
│ "Find Your Next Home"                              │
│ [ BROWSE LISTINGS ]                                │
├────────────────────────────────────────────────────┤
│ WHY BUY WITH US — bg-surface                       │
│ 3 value prop cards (icon + heading + text)          │
├────────────────────────────────────────────────────┤
│ BUYING PROCESS — bg-background                     │
│ Numbered steps (D.5): Search → Tour → Offer → Close│
├────────────────────────────────────────────────────┤
│ AREA HIGHLIGHTS — bg-surface                       │
│ Grid of area cards with photos + names             │
│ Click → filtered /listings?area=...                │
├────────────────────────────────────────────────────┤
│ FAQ — bg-background                                │
│ Accordion-style buyer FAQs                         │
├────────────────────────────────────────────────────┤
│ CTA — bg-surface                                   │
│ "Start Your Search Today"                          │
│ [ BROWSE LISTINGS ]  [ TALK TO AN AGENT ]          │
├────────────────────────────────────────────────────┤
│ FOOTER                                             │
└────────────────────────────────────────────────────┘
```

### H.3 Sell Page (`/sell`)

```
┌────────────────────────────────────────────────────┐
│ HERO — Full-bleed (D.1) with luxury exterior       │
│ "Sell with Confidence"                             │
│ [ GET A VALUATION ]                                │
├────────────────────────────────────────────────────┤
│ WHY SELL WITH US — bg-surface                      │
│ 3 differentiator cards                             │
├────────────────────────────────────────────────────┤
│ SELLING PROCESS — bg-background                    │
│ Numbered steps (D.5): Prepare → List → Market →   │
│ Negotiate → Close                                  │
├────────────────────────────────────────────────────┤
│ VALUATION CTA — Split panel (D.2)                  │
│ Text: "What's Your Home Worth?"                    │
│ Image: Beautiful exterior + [ REQUEST VALUATION ]  │
├────────────────────────────────────────────────────┤
│ SUCCESS STORIES — bg-surface                       │
│ Sold properties grid or testimonials               │
├────────────────────────────────────────────────────┤
│ FAQ — bg-background                                │
│ Accordion-style seller FAQs                        │
├────────────────────────────────────────────────────┤
│ CTA + FOOTER                                       │
└────────────────────────────────────────────────────┘
```

### H.4 Listings Page (`/listings`)

```
┌────────────────────────────────────────────────────┐
│ HEADER (solid background)                          │
├────────────────────────────────────────────────────┤
│ SEARCH BAR — sticky top, bg-surface-alt            │
│ [🔍 Search address, city, ZIP...]  [Filters ▾]    │
├────────────────────────┬──────────────────────────┤
│                        │                          │
│  RESULTS LIST          │    INTERACTIVE MAP       │
│                        │    (Mapbox)              │
│  Property card (E.3)   │                          │
│  Property card (E.3)   │    Markers + clusters    │
│  Property card (E.3)   │                          │
│  Property card (E.3)   │                          │
│                        │                          │
│  Pagination            │                          │
├────────────────────────┴──────────────────────────┤
│ FOOTER                                             │
└────────────────────────────────────────────────────┘
```

- **Minimal animation** — this is a transactional page
- Split panel: `grid grid-cols-1 lg:grid-cols-2`
- Mobile: Full-width list with map toggle button
- Filters: Bottom sheet on mobile, dropdown/sidebar on desktop

### H.5 Property Detail (`/listings/[slug]`)

```
┌────────────────────────────────────────────────────┐
│ PHOTO GALLERY — Full-width carousel/lightbox       │
├────────────────────────────────────────────────────┤
│ KEY DETAILS HEADER                                 │
│ $425,000  ·  123 Main St, Springfield, IL          │
│ 3 bed  ·  2 bath  ·  1,850 sqft  ·  MLS# 12345   │
├────────────────────────────────────────────────────┤
│ DESCRIPTION — bg-background                        │
│ Full listing description from MLS                  │
├──────────────────────┬─────────────────────────────┤
│ PROPERTY FEATURES    │  AGENT CARD (E.4 variant)   │
│ Grid of features     │  Photo, name, phone, email  │
│                      │  [ CONTACT AGENT ] button    │
├──────────────────────┴─────────────────────────────┤
│ MAP — Embedded Mapbox with property pin             │
├────────────────────────────────────────────────────┤
│ SIMILAR LISTINGS — 3-4 property cards (E.3)        │
├────────────────────────────────────────────────────┤
│ FOOTER                                             │
└────────────────────────────────────────────────────┘
```

### H.6 About Page (`/about`)

```
┌────────────────────────────────────────────────────┐
│ HERO — Full-bleed (D.1) with team/office photo     │
│ "About Drenova Group"                              │
├────────────────────────────────────────────────────┤
│ STORY — Split panel (D.2) with watermark (D.6)     │
│ Company founding narrative + mission               │
├────────────────────────────────────────────────────┤
│ VALUES — bg-surface                                │
│ 3-4 value cards (icon + heading + description)     │
├────────────────────────────────────────────────────┤
│ COVERAGE — bg-background                           │
│ Map graphic showing states/regions served           │
├────────────────────────────────────────────────────┤
│ STATS — bg-surface                                 │
│ Large numbers: Years, Homes Sold, Agents, Regions  │
│ Animated counter on scroll (motion.dev)            │
├────────────────────────────────────────────────────┤
│ CTA — "Meet Our Team" + FOOTER                     │
└────────────────────────────────────────────────────┘
```

### H.7 Team Page (`/team`)

```
┌────────────────────────────────────────────────────┐
│ HERO — Shorter hero, bg-surface                    │
│ "Our Team"                                         │
│ Brief description of the team                      │
├────────────────────────────────────────────────────┤
│ TEAM GRID — bg-background                          │
│ Grid of team member cards (E.4)                    │
│ 3 columns on desktop, 2 on tablet, 1 on mobile    │
├────────────────────────────────────────────────────┤
│ CTA — "Join Our Team" or "Get in Touch"            │
├────────────────────────────────────────────────────┤
│ FOOTER                                             │
└────────────────────────────────────────────────────┘
```

**Individual Agent Page (`/team/[slug]`):**
- Split panel: Photo left, bio + contact right
- Active listings by this agent (property cards)
- Testimonials section

### H.8 Contact Page (`/contact`)

```
┌────────────────────────────────────────────────────┐
│ HERO — Shorter hero, bg-surface                    │
│ "Get in Touch"                                     │
├────────────────────────────────────────────────────┤
│ FORM + INFO — Split layout                         │
│ Left: Contact form (E.7)                           │
│   Name, Email, Phone, Subject dropdown, Message    │
│   [ SEND MESSAGE ] accent button                   │
│ Right: Office info                                 │
│   Address, phone, email, hours                     │
│   Embedded map                                     │
├────────────────────────────────────────────────────┤
│ QUICK LINKS — bg-surface                           │
│ "Looking to Buy?" → /buy                           │
│ "Ready to Sell?" → /sell                           │
├────────────────────────────────────────────────────┤
│ FOOTER                                             │
└────────────────────────────────────────────────────┘
```

---

## I. Spacing & Sizing Reference

### Section Padding

| Context | Mobile | Desktop (`lg:`) |
|---|---|---|
| Full section | `py-16 px-6` | `py-24 lg:py-32 px-8` |
| Hero section | `py-20 px-6` | `min-h-screen px-8` |
| Footer | `py-12 px-6` | `py-16 px-8` |
| Card padding | `p-4` | `p-6` |

### Content Max Widths

| Context | Max Width | Tailwind |
|---|---|---|
| Page content | 1280px | `max-w-7xl mx-auto` |
| Text content | 672px | `max-w-2xl` |
| Narrow content | 448px | `max-w-md` |
| Wide content | 1024px | `max-w-5xl` |

### Grid Gaps

| Context | Gap |
|---|---|
| Card grids | `gap-6 lg:gap-8` |
| Content sections | `gap-12 lg:gap-16` |
| Form fields | `gap-4` |
| Button groups | `gap-3 sm:gap-4` |
| Text blocks | `gap-4` |

---

## J. Figma-to-Code Token Mapping

When implementing designs from Figma, use this mapping to translate design tokens to Tailwind classes.

| Figma Token | CSS Variable | Tailwind Class |
|---|---|---|
| Background fill (light) | `--background` | `bg-background` |
| Surface fill (cream) | `--surface` | `bg-surface` |
| Primary text | `--foreground` | `text-foreground` |
| Secondary text | `--muted` | `text-muted` |
| Border stroke | `--border` | `border-border` |
| Accent fill | `--accent` | `bg-accent` |
| Accent text | `--accent` | `text-accent` |
| Focus ring | `--ring` | `ring-ring` |
| Display font | `--font-display` | `font-display` |
| Body font | `--font-sans` | `font-sans` |
| Mono font | `--font-mono` | `font-mono` |

---

*This document is the single source of truth for all visual decisions. Update it when design choices evolve. For technical implementation rules, see `CLAUDE.md`. For feature requirements, see `prd.md`.*
