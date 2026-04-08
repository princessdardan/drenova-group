<!-- Context: operations/guides/sanity-studio-sop | Priority: critical | Version: 1.0 | Updated: 2026-04-08 -->

# Guide: Sanity Studio Content Management

**Core Idea**: Sanity Studio at `https://drenova-group.sanity.studio` is the CMS for all non-listing content. Changes publish automatically to the live site via webhook.

**Key Points**:
- **Studio URL**: https://drenova-group.sanity.studio
- **Publishing workflow**: Edit → Review → Click "Publish" → Live within seconds
- **Drafts**: Unpublished changes show blue "Edited" badge; only visible in Studio
- **Validation**: Red outlines indicate errors (required fields, invalid email, missing slug)
- **Structure**: Site Settings (global) → Pages (9 singletons) → Collections (multiple entries)

**Quick Reference by Page**:

| Website Page | Edit In | Collections Used |
|--------------|---------|------------------|
| Homepage | Pages > Home Page | Value Propositions |
| About | Pages > About Page | Company Stats, Values, Coverage Areas |
| Buy | Pages > Buy Page | FAQs (Buyer), Coverage Areas |
| Sell | Pages > Sell Page | FAQs (Seller), Testimonials |
| Team | Pages > Team Page | Team Members |
| Listings | Pages > Listings Page | External AMPRE feed |

**Common Tasks**:

**Add a team member**:
1. Click **Team Members** in sidebar → compose icon
2. Fill name, click "Generate" for slug
3. Upload headshot (600×600 min), set hotspot on face
4. Add role, optional bio/phone/email
5. Publish

**Add a video hero**:
1. Open page (e.g., Home Page)
2. Upload background image (fallback/poster)
3. Set Background Type to "Video"
4. Paste direct MP4 URL (public, <10MB, 1920×1080)
5. Publish

**Feature a listing**:
1. Go to **Pages > Listings Page**
2. Add AMPRE listing key to **Featured Listing Keys**
3. Publish

**Troubleshooting**:
- Changes not showing? Hard-refresh (Cmd+Shift+R) or wait 1 hour
- Red outline? Hover for error message, fix required fields
- Deleted something? Contact developer — version history may restore it

**Reference**: [Full Sanity SOP](/Users/dardan/Documents/drenova-group/docs/sanity-studio-sop.md)

**Related**:
- [content-workflow.md](../concepts/content-workflow.md) — Publishing mechanics
- [content-not-appearing.md](../errors/content-not-appearing.md) — Cache issues
