# Ampre/PropTx Data License Compliance Guidelines

> **Source:** PropTx Data License Agreement (dated March 7, 2026)
> **Purpose:** Implementation-ready rules extracted from the agreement. Every section maps to enforceable clauses.
> **Access Level:** Brokerage's Listings (not full board data)

---

## 1. AI Restrictions (§1.e)

**Rule: Complete prohibition — no MLS data may touch any AI system.**

The agreement defines "AI System" broadly (§1.a): any system incorporating artificial intelligence, including LLMs, neural networks, SaaS tools, mobile/computer applications, or databases capable of ingesting or producing content (text, images, audio, video, graphics, synthetic data).

### What is prohibited

- Feeding listing data (or any data derived from it) into any AI system
- Using any AI system to produce content for the database
- Allowing third parties to do any of the above, directly or indirectly

### Implementation constraints

- No AI-powered search, recommendations, or content generation using MLS data
- No sending listing data to OpenAI, Claude, Gemini, or any LLM API
- No AI-generated property descriptions based on MLS fields
- No vector embeddings or semantic search over listing data
- No automated image analysis/tagging of MLS photos
- If building AI features elsewhere on the site, MLS data must be strictly isolated from those pipelines

---

## 2. Data Retention & Deletion (§1.d, §5.c)

**Rule: Data has a lifecycle — delete when stale, delete when consent is rescinded, delete everything on termination.**

### Ongoing obligations (§1.d)

| Trigger | Action | Deadline |
|---------|--------|----------|
| Data is no longer current | Delete from all records and files | Within 60 days |
| Property listing expires | Delete related data | Within 60 days |
| Consent for data collection/use/disclosure is rescinded | Delete related data | As soon as possible (immediately) |
| Consent expires or is terminated | Delete related data | As soon as possible |

### Termination obligations (§5.c)

| Trigger | Action | Deadline |
|---------|--------|----------|
| Agreement terminates | Stop all use of data and proprietary information | Immediately |
| Agreement terminates | Delete all copies from all storage media | Immediately |
| Agreement terminates | Provide written certification (signed by Licensee or officer) that all copies are destroyed and none retained | Immediately after deletion |

### Implementation constraints

- ISR cache TTLs and any persistent storage must have expiry/cleanup mechanisms
- Build a process to identify and purge expired/stale listings within 60 days
- Must be able to respond to consent rescission events and delete specific listing data promptly
- On agreement termination: purge all cached data, database records, CDN caches, and any backups containing MLS data
- Maintain audit trail of deletion actions for certification purposes
- Note: Licensee may retain its own independently created data that happens to be identical or similar

---

## 3. Display Field Enforcement (Addendum)

**Rule: Two fields in the data control where and how listings can be displayed. These must be honoured.**

### `perm_adv` — Permission to Advertise

| Value | Rule |
|-------|------|
| `Y` (or not `N`) | Listing may be displayed on our website |
| `N` | Listing may **only** be displayed on the listing agent's own website — **must not appear on our site** |

### `disp_addr` — Display Address

| Value | Rule |
|-------|------|
| `Y` (or not `N`) | Full street address may be displayed |
| `N` | Street/property address **must not be displayed on the internet** — suppress address in all views (cards, detail pages, maps, meta tags, URLs) |

### Implementation constraints

- Filter out `perm_adv = N` listings before rendering (or exclude in API query)
- For `disp_addr = N` listings: show city/area only, never street number, street name, or street suffix
- Apply these checks server-side (not just UI hiding) — addresses must not appear in page source, API responses to client, or SEO metadata
- These fields must be checked on every data refresh, as permissions can change

---

## 4. Distribution Restrictions (§1.f)

**Rule: No third-party internet display without PROPTX written consent.**

### What is prohibited

- Allowing third parties to display listing data on the internet
- Distributing or otherwise displaying data to/through unauthorized parties
- Any use beyond what is expressly granted in the agreement

### Implementation constraints

- Do not expose listing data via public APIs that third parties could consume
- Do not syndicate listing data to other websites or platforms
- Do not share raw API responses or data exports with partners without PROPTX written agreement
- Ensure listing data is rendered only on our authorized website(s)

---

## 5. Data Freshness (§3.a)

**Rule: Must retrieve/update daily. Must not retrieve more than once per 24 hours.**

### Requirements

- Data must be retrieved and updated **at least once daily**
- Data must be retrieved **no more than once every 24 hours** (hard ceiling)
- Retrieval method: as specified by PROPTX (currently AMPRE OData API)

### Implementation constraints

- Schedule a single daily data sync/refresh job (e.g., cron at a fixed time)
- ISR cache revalidation does not count as "retrieval" — this refers to pulling fresh data from the AMPRE API
- Do not implement real-time polling, webhooks that trigger frequent pulls, or user-triggered refreshes that hit the API
- The 5-minute ISR cache in our architecture serves cached responses; the underlying API fetch must respect the 24-hour limit
- Log each retrieval with timestamp for compliance auditing
- If PROPTX notifies of a different retrieval schedule, update accordingly

---

## 6. Privacy / PIPEDA (§1.c)

**Rule: Full compliance with PIPEDA and Ontario privacy laws. We indemnify PropTx for any failures.**

### Requirements

- Comply with the Personal Information Protection and Electronic Documents Act (Canada)
- Comply with any successor legislation and Ontario provincial privacy legislation
- Indemnify PropTx from all liability arising from privacy compliance failures

### Implementation constraints

- Listing data contains personal information (agent names, contact info, property owner details in some fields)
- Do not repurpose personal information from listings for marketing, analytics, or profiling
- Ensure data handling practices align with PIPEDA principles: consent, limiting collection, limiting use/disclosure/retention, accuracy, safeguards, openness, individual access, challenging compliance
- If storing any personal data from listings, document the purpose and ensure lawful basis
- Privacy breach notification procedures must cover MLS data

---

## 7. Confidentiality & IP (§4)

**Rule: Data is proprietary to PROPTX. Prevent theft, disclosure, copying, and distribution.**

### Obligations (§4.a)

- Data and all proprietary information are owned by PROPTX — no title or ownership transfers to us
- Maintain confidentiality; use data only for rights/obligations under the agreement
- Make **best efforts** to prevent theft, disclosure, copying, reproduction, or distribution
- No unauthorized activity unless specifically authorized by PROPTX in writing

### Exceptions (§4.b)

Confidentiality obligations do not apply to information that:
1. Becomes public through no act/omission by us
2. Is independently developed by us without use of proprietary information
3. Is disclosed by a third party not bound by confidentiality obligations to PROPTX
4. Is demanded by lawful court order (must notify PROPTX promptly and provide copy of order)

### Implementation constraints

- Store API tokens and credentials securely (environment variables, never in client-side code)
- Do not log raw listing data in application logs visible to unauthorized parties
- Restrict access to MLS data in internal systems to authorized personnel only
- Do not include raw MLS data in public Git repositories, error reports, or analytics platforms
- Implement appropriate access controls on any data storage (database, cache, CDN)

---

## 8. Trademark (§8.d)

**Rule: No use of PROPTX name or marks without written permission.**

### What is prohibited

- Using PROPTX trade-marks or name anywhere on the site
- Using PROPTX or its directors/officers as references
- Any trademark use without prior written permission

### Implementation constraints

- Do not display "PropTx", "PROPTX", or "Ampre" branding on the website unless explicitly permitted in writing
- Do not reference PROPTX as a data source in public-facing UI, footer credits, or "powered by" attributions
- If attribution is required for MLS compliance (separate from this agreement), obtain written permission for the specific wording

---

## 9. Non-compete (§8.e)

**Rule: 24-month post-termination non-compete on electronic MLS services.**

### Restriction

- During the agreement and for **24 months** after termination
- Must not directly or indirectly:
  - Engage in a business providing electronic MLS services similar to PROPTX
  - Have an interest in such a business
  - Provide advice to such a business
  - Guarantee indebtedness of such a business

### Implementation constraints

- This is a business-level constraint, not a technical one
- Ensure business leadership is aware of this restriction
- If the agreement terminates, the company cannot pivot to or invest in MLS platform services for 24 months

---

## 10. Scope of License (§1.b)

**Rule: Use is limited to coordinating publicity/marketing for authorized brokerages in Ontario real estate.**

### Permitted use

- Assisting in co-ordinating publicity and marketing operations for:
  - Broker of Record
  - Franchised Brokers
  - Brokerages that employ them
- Limited to transactions involving real estate in Ontario
- Non-exclusive and non-transferable license

### Implementation constraints

- The website must serve an authorized Ontario real estate brokerage
- Data cannot be used for purposes outside publicity/marketing (e.g., market analysis products, data resale, investment analysis tools)
- License cannot be sublicensed or transferred to another entity
- All use is subject to the restrictions in §1.c through §1.g

---

## Quick Reference: Critical Rules for Developers

| Rule | Key Constraint | Severity |
|------|---------------|----------|
| No AI | Zero MLS data in any AI system | **Absolute** |
| Display fields | Check `perm_adv` and `disp_addr` on every listing | **Absolute** |
| No 3rd-party display | Only our authorized site shows the data | **Absolute** |
| Daily refresh only | Exactly 1 API pull per 24 hours | **Hard limit** |
| 60-day deletion | Stale/expired data must be purged | **Hard deadline** |
| Consent rescission | Delete immediately when consent withdrawn | **Immediate** |
| No PROPTX branding | Don't display their name/marks | **Requires permission** |
| PIPEDA compliance | Handle personal data per Canadian privacy law | **Legal obligation** |
| Confidentiality | Secure storage, no leaking data | **Best efforts** |
| Termination deletion | Delete everything + certify in writing | **Immediate on trigger** |

---

## Third-Party Obligations (Addendum)

If we use any third-party service provider to retrieve or process data:

- They must complete PROPTX's Third Party Addendum and Broker Acknowledgement
- They act as our agent only, for our purposes only
- They must comply with all the same rules (PIPEDA, display fields, retention, etc.)
- We are **fully responsible** for their actions and omissions
- PROPTX can cut off data delivery to a non-compliant third party without notice
- If consent is rescinded, both we and the third party must cease use immediately
