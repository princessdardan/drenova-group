<!-- Context: operations/guides/deployment-checklist | Priority: critical | Version: 1.0 | Updated: 2026-04-08 -->

# Guide: Deployment Checklist

**Core Idea**: Manual steps required before/after first Vercel deployment — accounts, secrets, assets, and external service configuration.

**Pre-Deployment**:

**1. Environment Variables** (Vercel Project Settings):
| Variable | Source |
|----------|--------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity dashboard |
| `SANITY_API_READ_TOKEN` | Sanity → API → Tokens (viewer role) |
| `SANITY_REVALIDATE_SECRET` | `openssl rand -base64 32` |
| `SANITY_PREVIEW_SECRET` | `openssl rand -base64 32` |
| `AMPRE_API_BASE_URL` | AMPRE OData endpoint |
| `AMPRE_API_TOKEN` | AMPRE bearer token |
| `UPSTASH_REDIS_REST_URL` | Upstash dashboard |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash dashboard |
| `RESEND_API_KEY` | resend.com → API Keys |
| `RESEND_FROM_EMAIL` | Verified sender address |
| `CONTACT_EMAIL` | Inbox for form submissions |

**2. Resend Email Setup**:
- Create account at resend.com
- Verify sending domain
- Create API key
- Set env vars (above)

**3. Brand Assets** (add to `frontend/public/`):
- [ ] `favicon.ico` (or `frontend/src/app/icon.ico`)
- [ ] `apple-touch-icon.png` (180×180)
- [ ] `og-image.png` (1200×630)
- [ ] Delete placeholder SVGs (next.svg, vercel.svg, etc.)

**Post-Deployment**:

**4. Sanity Webhook** (ISR revalidation):
- Go to sanity.io/manage → API → Webhooks
- URL: `https://<your-domain>/api/revalidate`
- Secret: Same as `SANITY_REVALIDATE_SECRET`
- Trigger: Create, Update, Delete

**5. Sanity CORS Origins**:
- Add `https://<your-domain>` to CORS origins

**6. Deploy Sanity Studio**:
```bash
npm -w backend run deploy
```

**7. Seed Content**:
```bash
npm run seed
```

**8. Verification**:
- [ ] Visit all pages render correctly
- [ ] Trigger AMPRE sync: `curl -X POST https://<domain>/api/ampre/sync -H "Authorization: Bearer <CRON_SECRET>"`
- [ ] Test draft mode: `/api/draft/enable?secret=<SANITY_PREVIEW_SECRET>`
- [ ] Test contact form submission
- [ ] Check `/sitemap.xml` and `/robots.txt`
- [ ] Test OG preview with opengraph.xyz

**Reference**: [Deployment Manual](/Users/dardan/Documents/drenova-group/docs/deployment-manual-steps.md)

**Related**:
- [environment-setup.md](../examples/environment-setup.md) — Detailed env var guide
- [sync-failures.md](../errors/sync-failures.md) — Troubleshooting
