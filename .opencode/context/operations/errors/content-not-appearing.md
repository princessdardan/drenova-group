<!-- Context: operations/errors/content-not-appearing | Priority: high | Version: 1.0 | Updated: 2026-04-08 -->

# Errors: Content Not Appearing

**Core Idea**: Troubleshooting guide for when Sanity Studio changes don't reflect on the live site immediately.

**Symptom**: Published changes in Sanity Studio not visible on website.

**Diagnostic Steps** (in order):

**1. Hard-refresh browser** (30 seconds)
```
Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

**2. Try incognito/private window** (1 minute)
- Rules out browser cache
- If works in incognito → local cache issue

**3. Check for validation errors** (2 minutes)
- In Sanity Studio: look for red outlines on fields
- Red = validation error blocking publish
- Fix errors, then publish

**4. Verify ISR tag in TAG_MAP** (5 minutes)
- Some singletons not in webhook revalidation map
- Known gaps: `listingsPage`, `contactPage`, `teamPage`
- See [cache-gaps.md](../../architecture/errors/cache-gaps.md)

**5. Wait for TTL expiration** (up to 1 hour)
- Default ISR revalidation: 3600 seconds (1 hour)
- Changes will appear automatically

**6. Manual revalidation** (immediate fix)
```bash
curl -X POST https://<your-domain>/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"tags": ["listingsPage"]}'
```

**Common Causes**:

| Cause | Solution |
|-------|----------|
| Browser cache | Hard-refresh or incognito |
| Validation errors | Fix red-outlined fields, publish |
| Missing TAG_MAP entry | Wait 1 hour or manual revalidation |
| Webhook not configured | Set up Sanity webhook (see deployment checklist) |
| Draft not published | Click green "Publish" button |

**When to Contact Developer**:
- Changes still not visible after 1 hour
- Webhook returning errors
- Multiple pages affected

**Reference**: [Sanity SOP](/Users/dardan/Documents/drenova-group/docs/sanity-studio-sop.md)

**Related**:
- [cache-gaps.md](../../architecture/errors/cache-gaps.md) — Known ISR issues
- [deployment-checklist.md](../guides/deployment-checklist.md) — Webhook setup
