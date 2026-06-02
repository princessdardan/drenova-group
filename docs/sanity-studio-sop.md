# Sanity Studio Content Management Guide

> Standard operating procedures for Drenova Group website administrators and content editors.
>
> **Last Updated:** March 2026

Sanity Studio is the content management system (CMS) for the Drenova Group website. It is where you create, edit, and publish all the text, images, and settings that appear on the live site at [drenovagroup.com](https://drenovagroup.com). No coding knowledge is required — this guide covers everything you need to manage every piece of content on the website.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
   - [Accessing the Studio](#11-accessing-the-studio)
   - [Understanding the Studio Layout](#12-understanding-the-studio-layout)
   - [Editing and Publishing Content](#13-editing-and-publishing-content)
   - [Understanding Validation Errors](#14-understanding-validation-errors)
2. [Shared Building Blocks](#2-shared-building-blocks)
   - [Hero Section](#21-hero-section)
   - [Call-to-Action (CTA) Section](#22-call-to-action-cta-section)
   - [Section Heading](#23-section-heading)
   - [Rich Text Editor](#24-rich-text-editor)
   - [Images and the Hotspot Tool](#25-images-and-the-hotspot-tool)
3. [Site Settings](#3-site-settings)
4. [Managing Pages](#4-managing-pages)
   - [Home Page](#41-home-page)
   - [About Page](#42-about-page)
   - [Buy Page](#43-buy-page)
   - [Sell Page](#44-sell-page)
   - [Buyers Guide Page](#45-buyers-guide-page)
   - [Sellers Guide Page](#46-sellers-guide-page)
   - [Contact Page](#47-contact-page)
   - [Team Page](#48-team-page)
   - [Listings Page](#49-listings-page)
   - [Generic Pages](#410-generic-pages)
5. [Managing Collections](#5-managing-collections)
   - [General Instructions](#51-general-instructions)
   - [Team Members](#52-team-members)
   - [Testimonials](#53-testimonials)
   - [FAQs](#54-faqs)
   - [Coverage Areas](#55-coverage-areas)
   - [Company Stats](#56-company-stats)
   - [Company Values](#57-company-values)
   - [Value Propositions](#58-value-propositions)
   - [Legal Pages](#59-legal-pages)
6. [Viewing Lead Submissions](#6-viewing-lead-submissions)
7. [How Changes Go Live](#7-how-changes-go-live)
8. [Best Practices](#8-best-practices)
9. [Content-to-Page Quick Reference](#9-content-to-page-quick-reference)
10. [Troubleshooting and FAQ](#10-troubleshooting-and-faq)
11. [Glossary](#11-glossary)

---

## 1. Getting Started

### 1.1 Accessing the Studio

Open your web browser and go to:

> **https://drenova-group.sanity.studio**

Log in with your authorized account. Once signed in, you will see the Studio dashboard with the content sidebar on the left.

<!-- screenshot: Studio login screen -->

### 1.2 Understanding the Studio Layout

The Studio is organized into two main areas:

- **Left sidebar** — Your navigation panel. This lists all the content types you can manage.
- **Main editing area** — When you click an item in the sidebar, its editor opens here.

The sidebar is organized into three groups:

| Group | What It Contains |
|-------|-----------------|
| **Site Settings** (gear icon) | Global configuration — company name, phone, email, address, social links, navigation menu |
| **Pages** (document icon) | Fixed page editors plus **Generic Pages** for creating new single-page marketing pages |
| **Collections** (below the divider) | Content with multiple entries — Team Members, Testimonials, FAQs, Coverage Areas, Company Stats, Company Values, Value Propositions, Legal Pages |
| **Lead Submissions** (envelope icon) | Read-only list of form submissions from the website |

<!-- screenshot: Studio sidebar with groups labeled -->

**Pages vs. Collections:** Most named pages are unique — there is exactly one Home Page, one About Page, etc. You edit the existing document. **Generic Pages** are different: they are createable page entries for new single-slug marketing pages. Collections let you create as many entries as you need (multiple team members, multiple FAQs, etc.).

### 1.3 Editing and Publishing Content

Every piece of content in Sanity Studio follows the same workflow:

1. **Navigate** to the content you want to edit using the left sidebar.
2. **Make your changes** in the editing fields.
3. **Review** your changes — look for any red outlines indicating errors.
4. **Click the green "Publish" button** in the bottom-right corner of the screen.

<!-- screenshot: Publish button location -->

**Understanding draft states:**

- When you make changes without publishing, they exist as a **draft**. You will see a blue "Edited" badge next to the document title.
- A draft is only visible to you in the Studio — it does not appear on the live website.
- Use the **Presentation** tool in the Studio to preview supported draft pages before publishing. The preview opens the website in draft mode with visual editing overlays so you can confirm page copy, images, and layout context.
- To make your changes live, you must click **Publish**.
- If you change your mind, you can click the three-dot menu (⋯) at the top-right and select **"Discard changes"** to revert to the last published version.

### 1.4 Understanding Validation Errors

If you see a **red outline** around a field, it means there is a problem that must be fixed before you can publish. Common causes:

- A **required field** is empty (e.g., a page title).
- An **email field** does not contain a valid email address.
- A **slug** has not been generated yet.

Click or hover over the red field to see the specific error message. Fix the issue, and the red outline will disappear. You cannot publish until all validation errors are resolved.

---

## 2. Shared Building Blocks

Several field groups are reused across multiple pages. This section explains each one so you understand them before diving into individual pages.

### 2.1 Hero Section

The hero section is the large banner area at the top of a page — it includes a background image (or video), a headline, and optionally a call-to-action button.

**Pages that have a hero section:** Home, Generic Pages, About, Buy, Sell, Buyers Guide, Sellers Guide, Contact, Team.

<!-- screenshot: Hero settings panel in Studio -->

| Field | Required? | Description |
|-------|-----------|-------------|
| **Background Image** | Yes | The main visual for the hero area. Upload a high-quality landscape photo (see [Images and the Hotspot Tool](#25-images-and-the-hotspot-tool) for best practices). |
| **Background Type** | — | Choose between **Image** (default) or **Video**. Selecting Video reveals the Video URL field. |
| **Video URL** | No | Only visible when Background Type is set to Video. Paste a direct link to an MP4 video file. Requirements: MP4 format, 1920x1080 resolution, under 10 MB, hosted on a public URL. The background image above is still required as a fallback. |
| **Overline** | No | Small text displayed above the title (e.g., "Welcome to Drenova Group"). |
| **Title** | Yes | The main headline text. Keep it short and impactful — under 10 words is ideal. |
| **Subtitle** | No | Supporting text below the title. One to two sentences. |
| **Button Text** | No | Label for the call-to-action button (e.g., "Get Started", "Contact Us"). |
| **Button Link** | No | Where the button navigates to. Use a relative path for internal pages (e.g., `/contact`) or a full URL for external links. |

**To add a video background:**
1. Upload a background image first (this serves as the poster/fallback).
2. Change **Background Type** to **Video**.
3. Paste the direct MP4 URL into the **Video URL** field.
4. Publish.

**To switch back to image-only:**
1. Change **Background Type** back to **Image**.
2. The video URL is hidden but retained — it will not show on the website.
3. Publish.

### 2.2 Call-to-Action (CTA) Section

A CTA section is a banner designed to encourage visitors to take an action, like contacting the team or browsing listings.

**Pages that have a CTA section:** About, Buy, Sell, Buyers Guide, Sellers Guide, Team.

| Field | Required? | Description |
|-------|-----------|-------------|
| **Title** | Yes | The CTA headline (e.g., "Ready to Find Your Dream Home?"). |
| **Subtitle** | No | Supporting text below the title. |
| **Primary Button Text** | No | Label for the main button (e.g., "Get Started"). |
| **Primary Button Link** | No | URL the main button links to. |
| **Secondary Button Text** | No | Label for an optional second button (e.g., "Talk to an Agent"). |
| **Secondary Button Link** | No | URL the second button links to. |

### 2.3 Section Heading

Section headings control the title area above content sections (like "Our Values", "Buying Process", "Coverage Areas").

**Pages that use section headings:** About, Buy, Sell.

| Field | Required? | Description |
|-------|-----------|-------------|
| **Overline** | No | Small label text above the title (e.g., "Our Process"). |
| **Title** | Yes | The section title. |
| **Description** | No | An optional paragraph below the title for additional context. |

### 2.4 Rich Text Editor

The rich text editor is used for longer-form content like the About page story, team member biographies, and legal pages.

<!-- screenshot: Rich text editor toolbar -->

**Available formatting:**

| Tool | How to Use | When to Use |
|------|-----------|-------------|
| **Normal** | Default paragraph text | Regular body text |
| **Heading 2** | Select from the style dropdown | Major sections within the content |
| **Heading 3** | Select from the style dropdown | Subsections within a Heading 2 section |
| **Heading 4** | Select from the style dropdown | Sub-subsections (rarely needed) |
| **Quote** | Select from the style dropdown | Highlighted quotes or callouts |
| **Bullet list** | Click the bullet list icon | Unordered lists |
| **Numbered list** | Click the numbered list icon | Step-by-step or ordered items |
| **Bold** | Select text, click **B** (or Ctrl/Cmd+B) | Emphasis on key words or phrases |
| **Italic** | Select text, click *I* (or Ctrl/Cmd+I) | Titles, secondary emphasis |
| **Link** | Select text, click the link icon | Add a clickable link (see [Links best practices](#83-links-and-urls)) |
| **Image** | Click the image icon in the toolbar | Embed a photo within the text content |

**Adding a link:**
1. Highlight the text you want to make clickable.
2. Click the **link icon** in the toolbar.
3. Enter the URL.
4. Optionally check **"Open in new tab"** for external links.
5. Click the checkmark to confirm.

**Embedding an image in rich text:**
1. Place your cursor where you want the image to appear.
2. Click the **image icon** in the toolbar.
3. Upload the image or select an existing one.
4. Add **alt text** describing the image (required for accessibility).

**Tip:** Use headings to structure long content. Use Heading 2 for major sections and Heading 3 for subsections. Do not skip levels (for example, do not jump from Heading 2 to Heading 4).

### 2.5 Images and the Hotspot Tool

Images are used throughout the site — hero banners, team headshots, CTA cards, and more.

**Uploading an image:**
1. Click the image field area or the "Upload" button.
2. Select a file from your computer, or drag and drop an image onto the field.
3. Once uploaded, always fill in the **Alt Text** field — describe what the image shows (e.g., "Aerial view of lakefront properties at sunset"). This is important for accessibility and search engine optimization.

**Using the hotspot tool:**

After uploading an image, you can click on the image to open the **hotspot and crop** editor.

<!-- screenshot: Hotspot tool with focal point circle -->

- The **hotspot** is a draggable circle that marks the most important part of the image (e.g., a person's face, a building entrance).
- When the website displays the image at different sizes (desktop, tablet, phone), it uses the hotspot to determine what to keep visible.
- **Always set the hotspot** on the main subject of the image. This prevents awkward cropping on smaller screens.

**Recommended image dimensions:**

| Usage | Orientation | Minimum Size |
|-------|------------|-------------|
| Hero backgrounds | Landscape | 1920 x 1080 px |
| Team headshots | Square or portrait | 600 x 600 px |
| CTA card images | Landscape | 800 x 600 px |
| About section image | Portrait or square | 800 x 1000 px |
| Guide book mockup | Portrait | 600 x 800 px |

**Supported file formats:** JPEG (best for photos), PNG (best for graphics with transparency), WebP.

---

## 3. Site Settings

Site Settings control global information that appears across the entire website — in the header, footer, and contact areas.

**To access:** Click **Site Settings** (gear icon) at the top of the sidebar.

<!-- screenshot: Site Settings editor -->

| Field | Description |
|-------|-------------|
| **Company Name** | Appears in the browser tab title and footer. |
| **Tagline** | A short company tagline. |
| **Phone Number** | Displayed in the footer and on the contact page. Use the format `(XXX) XXX-XXXX`. |
| **Email Address** | Displayed in the footer and on the contact page. Must be a valid email format. |
| **Office Address** | Multi-line text field for the physical office address. Press Enter for new lines. |
| **Office Hours** | Multi-line text for business hours (e.g., "Mon–Fri: 9 AM – 5 PM"). |

### Navigation Links

The **Navigation Links** field controls the menu items in the website header and footer.

**To add a new link:**
1. Click **"Add item"** at the bottom of the navigation links list.
2. Fill in the **Label** (the text visitors see, e.g., "About Us").
3. Fill in the **URL Path** (where the link goes, e.g., `/about`).
4. Toggle **Show in Header** and **Show in Footer** as needed.

**To reorder links:** Drag the handle (three horizontal lines) on the left side of each link item to move it up or down.

**To remove a link:** Click the trash icon on the right side of the link item.

**URL path tips:**
- For pages on the Drenova Group site, use relative paths starting with `/` (e.g., `/about`, `/buy`, `/sell`, `/listings`, `/contact`, `/team`).
- For external sites, use the full URL (e.g., `https://www.instagram.com/drenovagroup`).

### Social Links

Fill in the full profile URLs for each social media platform:
- **Facebook** — e.g., `https://www.facebook.com/drenovagroup`
- **Instagram** — e.g., `https://www.instagram.com/drenovagroup`
- **LinkedIn** — e.g., `https://www.linkedin.com/company/drenova-group`
- **X (Twitter)** — e.g., `https://x.com/drenovagroup`

Leave a field blank if the company does not have a presence on that platform. The icon will not appear on the website if the URL is empty.

---

## 4. Managing Pages

Pages are one-of-a-kind documents. There is exactly one Home Page, one About Page, and so on. You edit them in place — you cannot create a second copy.

**To access any page:** Click **Pages** in the sidebar to expand the group, then click the page you want to edit.

### 4.1 Home Page

**Sidebar location:** Pages > Home Page

The Home Page has the most sections to manage. Here is what each section controls:

**Hero Section**
The large banner at the top of the homepage. See [Hero Section](#21-hero-section) for field details.

**About Section**
The section that introduces the company, usually with a photo and short description.

| Field | Description |
|-------|-------------|
| **Title** | Heading for this section (e.g., "Unparalleled Service"). |
| **Description** | A short paragraph about the company. |
| **Button Text** | Label for the button below the description (default: "Learn More"). |
| **Button Link** | Where the button goes (default: `/about`). |
| **Image** | A portrait photo shown alongside the text. Add alt text and set the hotspot. |

**Work With Us Heading**
A single text field that controls the heading displayed above the two CTA cards (default: "Work With Us").

**CTA Card 1 (Selling)**

| Field | Description |
|-------|-------------|
| **Image** | Background image for the selling card. |
| **Title** | Card headline (default: "The best selling experience"). |
| **Subtitle** | Short supporting text. |
| **Button Text** | Button label (default: "Get Started"). |
| **Button Link** | Button destination (default: `#contact`). |

**CTA Card 2 (Buying)**
Same fields as CTA Card 1, but for the buying card.

**Contact Form Section**

| Field | Description |
|-------|-------------|
| **Heading** | Title above the contact form (default: "Start Your Home Journey Today"). |
| **Subtitle** | Supporting text below the heading. |

> **Note:** The contact form itself is built into the website and cannot be edited here. You can only change the heading and subtitle text above it.

> **Note:** The value proposition cards that may appear on the homepage are managed separately in the [Value Propositions](#58-value-propositions) collection.

### 4.2 About Page

**Sidebar location:** Pages > About Page

**Hero Section** — See [Hero Section](#21-hero-section).

**Our Story Section**

| Field | Description |
|-------|-------------|
| **Story Overline** | Small text above the story title (e.g., "Our Story"). |
| **Story Title** | The heading for the story section. |
| **Story Content** | Rich text editor for the full company narrative. See [Rich Text Editor](#24-rich-text-editor). |
| **Story Image** | A photo beside the story text. Set the hotspot on the main subject. |

**Values Section Heading** — Controls the heading above the company values grid. See [Section Heading](#23-section-heading).

**Coverage Section Heading** — Controls the heading above the coverage area list. See [Section Heading](#23-section-heading).

**CTA Section** — See [Call-to-Action Section](#22-call-to-action-cta-section).

> **Note:** The actual company values, stats, and coverage areas displayed on this page come from their respective collections ([Company Values](#57-company-values), [Company Stats](#56-company-stats), [Coverage Areas](#55-coverage-areas)). The About Page editor only controls the page-specific content and section headings.

### 4.3 Buy Page

**Sidebar location:** Pages > Buy Page

**Hero Section** — See [Hero Section](#21-hero-section).

**Benefits Section**
A list of benefits/features shown as cards on the page.

- Click **"Add item"** to add a new benefit.
- Each benefit has a **Title** (required) and **Description** (required).
- **Drag** items to reorder them.
- Click the **trash icon** to remove a benefit.

**Benefits Section Heading** — Controls the heading above the benefits cards. See [Section Heading](#23-section-heading).

**Buying Process Steps**
An ordered list of steps in the buying process. Each step has:

| Field | Required? | Description |
|-------|-----------|-------------|
| **Step Number** | Yes | The display number (e.g., "01", "02", "03"). |
| **Title** | Yes | The step title (e.g., "Initial Consultation"). |
| **Description** | Yes | A brief explanation of what happens in this step. |

Drag items to reorder. The step number is a display value — you control what number is shown regardless of the item's position in the list.

**Process Section Heading** — See [Section Heading](#23-section-heading).

**Coverage Section Heading** — See [Section Heading](#23-section-heading).

**FAQ Section Heading** — See [Section Heading](#23-section-heading).

**CTA Section** — See [Call-to-Action Section](#22-call-to-action-cta-section).

> **Note:** The actual FAQs shown on this page come from the [FAQ collection](#54-faqs), filtered to those with the **"Buyer"** category. The coverage areas come from the [Coverage Areas collection](#55-coverage-areas).

### 4.4 Sell Page

**Sidebar location:** Pages > Sell Page

The Sell Page has a similar structure to the Buy Page, with a few additional sections.

**Hero Section** — See [Hero Section](#21-hero-section).

**Benefits Section** — Same as the Buy Page (list of title + description items).

**Benefits Section Heading** — See [Section Heading](#23-section-heading).

**Selling Process Steps** — Same structure as the Buy Page process steps.

**Process Section Heading** — See [Section Heading](#23-section-heading).

**Valuation Section**
This is the "Get a Home Valuation" block that encourages sellers to request a property valuation.

| Field | Required? | Description |
|-------|-----------|-------------|
| **Overline** | No | Small text above the title. |
| **Title** | Yes | The heading (e.g., "What's Your Home Worth?"). |
| **Description** | No | Explanatory text about the valuation service. |
| **Image** | No | A supporting image. Set the hotspot. |
| **CTA Text** | No | Label for the valuation button. |

**Success Stories Heading** — Controls the heading above the testimonials section. See [Section Heading](#23-section-heading).

**FAQ Section Heading** — See [Section Heading](#23-section-heading).

**CTA Section** — See [Call-to-Action Section](#22-call-to-action-cta-section).

> **Note:** The FAQs on this page come from the [FAQ collection](#54-faqs) with the **"Seller"** category. The success stories come from the [Testimonials collection](#53-testimonials).

### 4.5 Buyers Guide Page

**Sidebar location:** Pages > Buyers Guide Page

**Hero Section** — See [Hero Section](#21-hero-section).

**Guide Section**

| Field | Description |
|-------|-------------|
| **Guide Title** | Heading shown above the download/signup form. |
| **Guide Description** | Text explaining what the guide covers and why visitors should download it. |
| **Guide Book Image** | A book mockup or cover image shown beside the form. Set the hotspot. |

**CTA Section** — See [Call-to-Action Section](#22-call-to-action-cta-section).

### 4.6 Sellers Guide Page

**Sidebar location:** Pages > Sellers Guide Page

This page has the exact same structure as the Buyers Guide Page — a hero, guide section (title, description, book image), and a CTA section. See [Buyers Guide Page](#45-buyers-guide-page) for field details.

### 4.7 Contact Page

**Sidebar location:** Pages > Contact Page

**Hero Section** — See [Hero Section](#21-hero-section).

**Quick Links**
A list of link cards that help visitors navigate to key areas (e.g., "Looking to Buy?", "Ready to Sell?").

Each quick link has:

| Field | Required? | Description |
|-------|-----------|-------------|
| **Overline** | No | Small text above the title. |
| **Title** | Yes | The link card title. |
| **Description** | No | A short description of what the visitor will find. |
| **Link URL** | Yes | Where clicking the card takes the visitor (e.g., `/buy`, `/sell`). |

Click **"Add item"** to add a new link card. Drag to reorder. Click the trash icon to remove.

> **Important:** The office information displayed on the Contact Page (phone number, email address, office address, and office hours) comes from **Site Settings**, not from the Contact Page editor. To update office details, go to [Site Settings](#3-site-settings).

### 4.8 Team Page

**Sidebar location:** Pages > Team Page

**Hero Section** — See [Hero Section](#21-hero-section).

**CTA Section** — See [Call-to-Action Section](#22-call-to-action-cta-section).

> **Note:** The team member cards displayed on this page come from the [Team Members collection](#52-team-members). To add, edit, or remove team members, use the Team Members section in the sidebar — not the Team Page editor.

### 4.9 Listings Page

**Sidebar location:** Pages > Listings Page

This page has a simple editor because the property listings themselves come from an external data feed (AMPRE/MLS), not from Sanity.

| Field | Description |
|-------|-------------|
| **Overline** | Small text above the page title. |
| **Title** | The main page title. |
| **Featured Listing Keys** | A list of AMPRE listing key strings. Listings with these keys will be pinned to the top of the listings page. |

**To feature a listing:**
1. Click **"Add item"** in the Featured Listing Keys list.
2. Enter the AMPRE listing key (a unique identifier for the property).
3. Publish.

> **Important:** You can only feature listings that already exist in the AMPRE data sync. The listing key must match exactly. If you are unsure of a listing key, contact your developer for assistance.

> **Note:** You cannot add, edit, or remove property listings from Sanity Studio. Listings are synced automatically from the AMPRE/MLS feed.

### 4.10 Generic Pages

**Sidebar location:** Pages > Generic Pages

Generic Pages let editors create new one-page marketing pages without a developer creating a new route. Each published Generic Page appears at `/<slug>` and uses the same visual template as the Homepage: hero, about section, two CTA cards, and contact form.

**To create a Generic Page:**
1. Go to **Pages > Generic Pages**.
2. Click the **compose/pencil icon** or **+** button.
3. Add a **Title** and click **Generate** on the **Slug** field.
4. Fill in the Hero, About Section, Work With Us heading, CTA cards, Contact Form Section, and optional SEO Settings.
5. Click **Publish**. The page will be available at `/<slug>`.

**Slug rules:**
- Use lowercase letters, numbers, and hyphens only.
- Do not use existing site routes such as `about`, `buy`, `sell`, `contact`, `team`, `listings`, `privacy`, or `terms`. The Studio will block reserved slugs.
- Do not change a slug after the page is live unless a developer sets up a redirect.

**Link rules:**
- Internal links should start with `/` such as `/contact`.
- Same-page section links should use `#contact`.
- External links must start with `https://`.
- Email and phone links may use `mailto:` and `tel:`.
- Unsafe links are rejected by Studio validation and ignored by the frontend.

**SEO Settings:**
- Use **SEO Title** and **SEO Description** when the page needs search/social copy different from the visible page title.
- Use **Open Graph Image** for social sharing.
- Check **Hide from Search Engines** for temporary or private campaign pages that should not appear in search results.

---

## 5. Managing Collections

Collections are content types where you can create as many entries as needed. For example, you might have 6 team members, 15 FAQs, and 4 coverage areas.

### 5.1 General Instructions

These steps apply to all collections:

**To create a new entry:**
1. Click the collection name in the sidebar (e.g., "Team Members").
2. Click the **compose/pencil icon** at the top of the list, or the **"+"** button.
3. Fill in the fields.
4. Click **Publish**.

**To edit an existing entry:**
1. Click the collection name in the sidebar.
2. Click the entry you want to edit from the list.
3. Make your changes.
4. Click **Publish**.

**To delete an entry:**
1. Open the entry.
2. Click the **three-dot menu** (⋯) at the top-right of the editor.
3. Select **"Delete"**.
4. Confirm the deletion.

> **Warning:** Deletions cannot be easily undone. If you accidentally delete something, contact your developer — they may be able to restore it from the version history.

**To search:** Use the search bar at the top of the collection list to find entries by name or title.

**About Sort Order:** Many collections have a **Sort Order** number field. This controls the display order on the website — lower numbers appear first. **Use increments of 10** (10, 20, 30, 40...) so you can insert new items between existing ones later without renumbering everything. For example, to add an item between sort orders 20 and 30, give it a sort order of 25.

### 5.2 Team Members

**Sidebar location:** Team Members

**Where they appear:** Team Page, individual team member profile pages (e.g., `/team/jane-doe`).

| Field | Required? | Description |
|-------|-----------|-------------|
| **Full Name** | Yes | The person's display name as it should appear on the website. |
| **Slug** | Yes | The URL-friendly version of the name. **Click "Generate"** to create it automatically from the name. This determines the profile page URL (e.g., `jane-doe` → `/team/jane-doe`). |
| **Role / Title** | Yes | Job title or role (e.g., "Senior Sales Representative", "Broker of Record"). |
| **Headshot** | Yes | A professional photo. Use the **hotspot tool** to mark the person's face as the focal point. Add **alt text** (e.g., "Jane Doe, Senior Sales Representative"). |
| **Biography** | No | A rich text field for the person's professional background. See [Rich Text Editor](#24-rich-text-editor). |
| **Phone Number** | No | Direct phone number. |
| **Email Address** | No | Must be a valid email format. |

> **Important:** After a team member's profile page is live and potentially linked from external sites, do not change their slug. Changing the slug will break existing links. If you must change it, coordinate with a developer to set up a redirect.

### 5.3 Testimonials

**Sidebar location:** Testimonials

**Where they appear:** Sell Page (Success Stories section).

| Field | Required? | Description |
|-------|-----------|-------------|
| **Quote** | Yes | The client's testimonial text. Write exactly what the client said or approved. |
| **Client Name** | Yes | The name of the person providing the testimonial. |
| **Detail** | No | Additional context, such as "Sold in Naperville, IL" or "First-Time Buyer in Barrie, ON". |

### 5.4 FAQs

**Sidebar location:** FAQs

**Where they appear:** Buy Page (Buyer FAQs) and Sell Page (Seller FAQs).

| Field | Required? | Description |
|-------|-----------|-------------|
| **Question** | Yes | The question text. |
| **Answer** | Yes | The answer text. |
| **Category** | Yes | Select **"Buyer"** or **"Seller"**. This determines which page the FAQ appears on. Buyer FAQs show on the Buy Page; Seller FAQs show on the Sell Page. |
| **Sort Order** | No | Controls display order within its category. Lower numbers appear first. |

> **Important:** The category field is what controls which page an FAQ appears on. If you want the same question on both pages, you need to create two separate FAQ entries — one with the Buyer category and one with the Seller category.

### 5.5 Coverage Areas

**Sidebar location:** Coverage Areas

**Where they appear:** About Page and Buy Page (coverage sections).

| Field | Required? | Description |
|-------|-----------|-------------|
| **State** | Yes | The state or province name (e.g., "Illinois", "Ontario"). |
| **Cities** | Yes | A list of cities served in this state. Click **"Add item"** for each city. At least one city is required. |
| **Sort Order** | No | Controls display order. Lower numbers appear first. |

**To add cities:** Click "Add item" and type the city name. Repeat for each city. You can drag to reorder cities within a state.

### 5.6 Company Stats

**Sidebar location:** Company Stats

**Where they appear:** About Page (stats/metrics section).

| Field | Required? | Description |
|-------|-----------|-------------|
| **Label** | Yes | What the stat measures (e.g., "Years of Experience", "Homes Sold", "Client Satisfaction"). |
| **Value** | Yes | The number or text to display (e.g., "15+", "500+", "98%"). |
| **Sort Order** | No | Controls display order. Lower numbers appear first. |

### 5.7 Company Values

**Sidebar location:** Company Values

**Where they appear:** About Page (values section).

| Field | Required? | Description |
|-------|-----------|-------------|
| **Title** | Yes | The value name (e.g., "Integrity", "Client-First Approach"). |
| **Description** | Yes | A brief explanation of what this value means to the company. |
| **Sort Order** | No | Controls display order. Lower numbers appear first. |

### 5.8 Value Propositions

**Sidebar location:** Value Propositions

**Where they appear:** Home Page (below the hero section).

| Field | Required? | Description |
|-------|-----------|-------------|
| **Title** | Yes | The proposition headline (e.g., "Market Expertise", "Personalized Service"). |
| **Description** | Yes | A short explanation of this selling point. |
| **Sort Order** | No | Controls display order. Lower numbers appear first. |

### 5.9 Legal Pages

**Sidebar location:** Legal Pages

**Where they appear:** Linked from the footer (e.g., Privacy Policy, Terms of Service).

| Field | Required? | Description |
|-------|-----------|-------------|
| **Title** | Yes | The page title (e.g., "Privacy Policy", "Terms of Service"). |
| **Slug** | Yes | Click **"Generate"** to create from the title. This determines the page URL. |
| **Last Updated** | Yes | A date picker. **Update this date every time you revise the content.** |
| **Body** | Yes | The full legal text. Use the rich text editor (see [Rich Text Editor](#24-rich-text-editor)) to format headings, lists, and links. |

> **Important:** Do not change the slug of a legal page after it is published and linked from the footer. Changing the slug breaks the existing URL.

---

## 6. Viewing Lead Submissions

**Sidebar location:** Lead Submissions (envelope icon)

Lead submissions are **read-only** — they are automatically captured when someone fills out a form on the website. You cannot create, edit, or delete submissions.

Each submission contains:

| Field | Description |
|-------|-------------|
| **First Name** | The person's first name. |
| **Last Name** | The person's last name. |
| **Email** | Their email address. |
| **Phone** | Their phone number (if provided). |
| **Source** | Which form they submitted — "Buyers Guide", "Sellers Guide", or "Homepage". |
| **Submitted At** | The date and time the form was submitted. |

The list is sorted **newest first**, so the most recent submissions appear at the top.

**Recommendation:** Check this section regularly (e.g., daily or a few times per week) to follow up on new leads promptly. The **Source** field tells you which page the visitor was on, giving you context about their interest (buying vs. selling).

---

## 7. How Changes Go Live

When you publish content in Sanity Studio, here is what happens behind the scenes:

1. You click **Publish** in Sanity Studio.
2. Sanity automatically sends a notification to the Drenova Group website.
3. The website clears its stored copy of the changed content and fetches the updated version from Sanity.
4. **Your changes appear on the live site**, typically within a few seconds.

**You do not need to contact a developer to push changes live.** Publishing in Sanity Studio is all that is needed.

If your changes do not appear right away:
1. **Hard-refresh your browser** — press **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac).
2. Try an **incognito/private browser window** to rule out browser caching.
3. If changes still do not appear after 5 minutes, wait up to **one hour** — the website has a backup refresh cycle that runs hourly.
4. If changes still have not appeared after an hour, contact your developer.

---

## 8. Best Practices

### 8.1 Images

- **Hero images:** Landscape orientation, minimum 1920 x 1080 pixels. Larger files are fine — Sanity optimizes them automatically.
- **Team headshots:** Square or portrait orientation, minimum 600 x 600 pixels. Use a consistent style (same background, similar lighting) across all team photos.
- **Alt text:** Always describe what the image shows. Good: "Aerial view of lakefront properties at sunset." Bad: "image1" or left blank.
- **Hotspot:** Always set the hotspot on the main subject. This is especially important for hero images (where cropping varies significantly between desktop and mobile) and headshots (keep the face centered).
- **File formats:** JPEG for photographs, PNG for graphics with transparency, WebP for either.

### 8.2 Text and Copy

- **Hero titles:** Keep them short and impactful — under 10 words is ideal.
- **Subtitles:** One to two sentences of supporting text.
- **Overlines:** Short labels of 2–4 words (e.g., "About Us", "Our Process", "Get Started").
- **Rich text headings:** Use Heading 2 for major sections, Heading 3 for subsections. Do not skip levels (for example, do not go from Heading 2 directly to Heading 4).
- **Tone:** Professional but approachable — consistent with the Drenova Group brand.

### 8.3 Links and URLs

| Link Type | Format | Example |
|-----------|--------|---------|
| **Internal page** | Relative path starting with `/` | `/about`, `/buy`, `/contact` |
| **External website** | Full URL with `https://` | `https://www.instagram.com/drenovagroup` |
| **Section on same page** | Hash with section name | `#contact`, `#listings` |
| **Email address** | `mailto:` prefix | `mailto:info@drenovagroup.com` |
| **Phone number** | `tel:` prefix | `tel:+17053432552` |

### 8.4 Sort Order

Use **increments of 10** when setting sort order values (10, 20, 30, 40...). This leaves gaps so you can insert new items between existing ones without renumbering. For example, to place a new item between sort orders 20 and 30, give it a sort order of 25.

### 8.5 Slugs

- Always click **"Generate"** to auto-create slugs from the title or name.
- **Do not change a slug after the page is live** — it will break any existing links, bookmarks, or search engine results pointing to the old URL.
- If you must change a slug, coordinate with a developer to set up a redirect from the old URL to the new one.

---

## 9. Content-to-Page Quick Reference

Use this table to quickly find where to edit the content that appears on each website page.

| Website Page | Page Editor (Sidebar > Pages) | Collections Used |
|---|---|---|
| **Homepage** (`/`) | Home Page | Value Propositions |
| **Generic pages** (`/<slug>`) | Generic Pages | Value Propositions |
| **About** (`/about`) | About Page | Company Stats, Company Values, Coverage Areas |
| **Buy** (`/buy`) | Buy Page | FAQs (Buyer category), Coverage Areas |
| **Sell** (`/sell`) | Sell Page | FAQs (Seller category), Testimonials |
| **Buyers Guide** (`/buyers-guide`) | Buyers Guide Page | — |
| **Sellers Guide** (`/sellers-guide`) | Sellers Guide Page | — |
| **Contact** (`/contact`) | Contact Page | Site Settings (office info) |
| **Team** (`/team`) | Team Page | Team Members |
| **Listings** (`/listings`) | Listings Page | External AMPRE/MLS feed (not in Sanity) |
| **Privacy / Terms** | — | Legal Pages |

**How to read this table:** To update the Sell Page, for example, you would edit the **Sell Page** editor (for the hero, benefits, process steps, valuation section, and CTA), plus manage **FAQs** with the "Seller" category and **Testimonials** in their respective collections.

---

## 10. Troubleshooting and FAQ

**Q: I published changes but they are not showing on the live site.**
Check these in order:
1. Hard-refresh your browser (**Cmd+Shift+R** on Mac, **Ctrl+Shift+R** on Windows).
2. Open the page in an incognito/private browser window to rule out local caching.
3. Wait 5 minutes and check again.
4. If still not visible after one hour, contact your developer.

**Q: I see a red outline on a field and cannot publish.**
The red outline means a validation error. Click or hover over the field to see the error message. Common causes:
- A required field is empty.
- An email field has an invalid format.
- A slug has not been generated (click "Generate").

**Q: I accidentally deleted something. Can I undo it?**
Sanity does not have a simple "undo" button for deletions. However, Sanity keeps a version history of documents. Contact your developer — they may be able to restore the deleted content from the history or a backup.

**Q: How do I reorder items in a list?**
There are two methods depending on the content type:
- **Inline lists** (Benefits, Process Steps, Quick Links, Navigation Links, Cities): Drag the handle (three horizontal lines icon) on the left side of each item.
- **Collection entries** (FAQs, Stats, Values, Coverage Areas): Change the **Sort Order** number field on each entry. Lower numbers appear first.

**Q: Can I preview changes before publishing?**
Yes. Open the **Presentation** tool from the Studio to preview supported draft pages before publishing. The preview uses draft mode, so only authenticated editors see unpublished content. When you are done, use the preview controls or the website's draft banner to exit draft mode.

**Q: I want to add a new page to the website.**
For a one-page marketing page, go to **Pages > Generic Pages** and create a new entry. Generic Pages use the Homepage-style layout and publish at `/<slug>`. Contact your developer only if you need a custom layout, nested URL, redirect, or functionality beyond the Generic Page template.

**Q: How do I add a video to a hero section?**
See the [Hero Section instructions](#21-hero-section). In short: upload a background image, switch Background Type to "Video", paste a direct MP4 URL, and publish.

**Q: The video I added is not playing.**
Verify that:
1. The URL is a direct link to an MP4 file (not a YouTube or Vimeo page URL).
2. The URL is publicly accessible — paste it directly in a browser to test.
3. The file is under 10 MB.
4. The video is in MP4 format with H.264 encoding.

**Q: How do I feature specific property listings?**
Go to **Pages > Listings Page**. Add the AMPRE listing keys to the **Featured Listing Keys** field. The listing must exist in the AMPRE data sync. Contact your developer if you need help finding listing keys.

**Q: How do I update the navigation menu?**
Go to **Site Settings > Navigation Links**. You can add, remove, and reorder links there. Each link can be toggled to appear in the header, footer, or both.

**Q: How do I add a new team member?**
Click **Team Members** in the sidebar, then click the compose icon to create a new entry. Fill in the name, click "Generate" for the slug, add a role, upload a headshot with alt text and hotspot, and optionally add a biography, phone, and email. Publish when complete.

**Q: The same FAQ needs to appear on both the Buy and Sell pages. How?**
Create two separate FAQ entries with identical question and answer text, but set one to the **Buyer** category and the other to the **Seller** category.

**Q: I want to update the office phone number on the contact page.**
Office information on the Contact Page comes from **Site Settings**, not the Contact Page editor. Go to Site Settings and update the Phone Number field.

---

## 11. Glossary

| Term | Definition |
|------|-----------|
| **Alt Text** | A text description of an image used by screen readers and search engines. Helps visually impaired visitors understand the image and improves SEO. |
| **AMPRE** | The external MLS (Multiple Listing Service) data provider that supplies property listing information to the website. |
| **Cache** | A stored copy of website data that speeds up page loads. When you publish in Sanity, the cache is automatically cleared so your new content appears. |
| **Collection** | A content type with multiple entries (e.g., many Team Members, many FAQs). You can create, edit, and delete entries freely. |
| **CTA (Call to Action)** | A section designed to prompt the visitor to take an action, such as clicking a button to contact the team or browse listings. |
| **Draft** | An unpublished version of your changes. Drafts are visible only in Sanity Studio and do not appear on the live website until published. |
| **Hero Section** | The large banner area at the top of a page, featuring a background image or video, headline text, and optionally a button. |
| **Hotspot** | A tool for marking the focal point of an image. The website uses this information to crop the image intelligently at different screen sizes. |
| **Overline** | Small text displayed above a headline, used as a label or category indicator (e.g., "Our Process", "About Us"). |
| **Page (Singleton)** | A one-of-a-kind document in Sanity. There is exactly one Home Page, one About Page, etc. You edit the existing document rather than creating new ones. |
| **Portable Text / Rich Text** | An advanced text editor that supports formatting (bold, italic, headings, lists, links, and embedded images). |
| **Publish** | The action of making your edits visible on the live website. Click the green Publish button in the bottom-right of the Studio. |
| **Slug** | A URL-friendly version of a title or name (e.g., "Privacy Policy" becomes `privacy-policy`). Used in web addresses. Always auto-generated — click "Generate". |
| **Sort Order** | A number that controls the display order of items on the website. Lower numbers appear first. Use increments of 10 for flexibility. |
| **Validation Error** | A red outline on a field indicating a problem (missing required content, invalid format) that must be fixed before publishing. |
| **Webhook** | An automatic notification sent from Sanity to the website whenever content is published, triggering the site to update. |
