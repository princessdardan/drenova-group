# Sanity Content Rewrite Checklist: Lead Capture Anchors

> **Purpose:** Instructions for operators to update Sanity CTA content from `/contact` to `#contact` for eligible lead-capture points.
>
> **Context:** To improve user experience and conversion, generic lead-capture CTAs on marketing pages now point to a local `#contact` anchor on the same page rather than navigating to the separate `/contact` page.

---

## ⚠️ Safety Note

**No production changes should be made by automation from this plan.** 

The `npm run seed` script has been updated to handle these rewrites for new environments, but existing production content must be updated manually by an operator in Sanity Studio or through an approved, verified migration script.

---

## 1. Affected Pages and Fields

For each of the following pages in Sanity Studio, locate the specified fields and update the link value from `/contact` to `#contact`.

### Home Page (`homePage`)
- [ ] **Hero Section** > Button Link (`hero.buttonHref`)
- [ ] **CTA Card 1 (Selling)** > Button Link (`ctaCard1.buttonHref`)
- [ ] **CTA Card 2 (Buying)** > Button Link (`ctaCard2.buttonHref`)

### About Page (`aboutPage`)
- [ ] **CTA Section** > Secondary Button Link (`cta.secondaryButtonHref`)

### Buy Page (`buyPage`)
- [ ] **CTA Section** > Secondary Button Link (`cta.secondaryButtonHref`)

### Sell Page (`sellPage`)
- [ ] **Hero Section** > Button Link (`hero.buttonHref`)
- [ ] **CTA Section** > Primary Button Link (`cta.primaryButtonHref`)
- [ ] **CTA Section** > Secondary Button Link (`cta.secondaryButtonHref`)

### Team Page (`teamPage`)
- [ ] **CTA Section** > Primary Button Link (`cta.primaryButtonHref`)

### Buyers Guide Page (`buyersGuidePage`)
- [ ] **CTA Section** > Secondary Button Link (`cta.secondaryButtonHref`)

### Sellers Guide Page (`sellersGuidePage`)
- [ ] **CTA Section** > Secondary Button Link (`cta.secondaryButtonHref`)

---

## 2. Exclusions (DO NOT CHANGE)

Do **not** update the following links to `#contact`. They must remain as `/contact`, their respective external URLs, or their specific functional anchors.

- **Legal Pages:** Privacy Policy, Terms of Service, etc.
- **Listings Page:** The main `/listings` route and its filters.
- **Listing Detail Pages:** Links should remain as they are, except for the specific `#listing-inquiry` anchor used for property-specific leads.
- **Footer Navigation:** All links in the footer menu.
- **Header Navigation:** The main "Contact" link in the header.
- **Contact Page:** Quick links and office information on the `/contact` page itself.
- **Phone/Email Links:** Any `tel:` or `mailto:` links.
- **Social Links:** Instagram, Facebook, LinkedIn, etc.
- **Team Profiles:** Individual agent mailto/tel links.
- **Property Search:** Any links leading back to the listings search.

---

## 3. Verification Steps

After publishing your changes in Sanity Studio, perform the following checks on the live website:

1. **Visit Eligible Pages:** Go to `/`, `/buy`, `/sell`, `/about`, `/team`, `/buyers-guide`, and `/sellers-guide`.
2. **Test CTAs:** Click the updated buttons. They should scroll you down to the "Start Your Journey" (or similar) form on the **same page**.
3. **Check URL:** The browser URL should end in `#contact` (e.g., `drenovagroup.com/buy#contact`).
4. **Verify Exclusions:** 
   - Go to `/listings`, `/privacy`, and `/terms`. Confirm there is **no** generic lead form at the bottom.
   - On a listing detail page, confirm the inquiry form uses `#listing-inquiry`.
   - Confirm the header "Contact" link still takes you to the full `/contact` page.

---

## 4. Troubleshooting

If a button stops working or leads to a 404:
1. Ensure the link is exactly `#contact` (including the hash).
2. Ensure you clicked **Publish** in Sanity Studio.
3. Hard-refresh your browser (**Cmd+Shift+R** or **Ctrl+Shift+R**).
