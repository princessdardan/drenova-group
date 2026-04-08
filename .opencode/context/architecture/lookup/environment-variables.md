<!-- Context: architecture/lookup/environment-variables | Priority: critical | Version: 1.0 | Updated: 2026-04-08 -->

# Lookup: Environment Variables

**Core Idea**: All environment variables required for production deployment, organized by service.

## Sanity CMS

| Variable | Required | Value Example | Purpose |
|----------|----------|---------------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | `apggi8zn` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | `production` | Dataset name |
| `SANITY_API_READ_TOKEN` | For preview | `sk...` | Read token for draft mode |
| `SANITY_REVALIDATE_SECRET` | For webhooks | `openssl rand -base64 32` | Webhook auth |
| `SANITY_PREVIEW_SECRET` | For preview | `openssl rand -base64 32` | Draft mode auth |

## AMPRE MLS

| Variable | Required | Value Example | Purpose |
|----------|----------|---------------|---------|
| `AMPRE_API_BASE_URL` | Yes | `https://query.ampre.ca/odata` | OData endpoint |
| `AMPRE_API_TOKEN` | Yes | `Bearer token...` | API authentication |

## Upstash Redis

| Variable | Required | Value Example | Purpose |
|----------|----------|---------------|---------|
| `UPSTASH_REDIS_REST_URL` | Yes | `https://...upstash.io` | Redis HTTP endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | `AZ...` | Redis auth token |

## Vercel Cron

| Variable | Required | Value Example | Purpose |
|----------|----------|---------------|---------|
| `CRON_SECRET` | Yes | Auto-generated | Cron job auth |

## Resend Email

| Variable | Required | Value Example | Purpose |
|----------|----------|---------------|---------|
| `RESEND_API_KEY` | Yes | `re_...` | Email API key |
| `RESEND_FROM_EMAIL` | Yes | `Drenova Group <noreply@drenovagroup.com>` | Sender address |
| `CONTACT_EMAIL` | Yes | `info@drenovagroup.com` | Inbox for submissions |

## Site Configuration

| Variable | Required | Value Example | Purpose |
|----------|----------|---------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://drenovagroup.com` | Canonical URL |

## Local Development (.env.local)

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=apggi8zn
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_token_here
SANITY_REVALIDATE_SECRET=your_secret_here
SANITY_PREVIEW_SECRET=your_secret_here

# AMPRE
AMPRE_API_BASE_URL=https://query.ampre.ca/odata
AMPRE_API_TOKEN=your_token_here

# Redis (optional for local dev)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=your_token_here

# Email (optional for local dev)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Drenova Group <noreply@drenovagroup.com>
CONTACT_EMAIL=info@drenovagroup.com

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Reference**: [Deployment Manual](/Users/dardan/Documents/drenova-group/docs/deployment-manual-steps.md)

**Related**:
- [kv-migration.md](../guides/kv-migration.md) — Redis env var changes
- [deployment-checklist.md](../../operations/guides/deployment-checklist.md) — Full deployment steps
