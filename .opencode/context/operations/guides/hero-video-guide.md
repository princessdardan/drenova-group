<!-- Context: operations/guides/hero-video-guide | Priority: medium | Version: 1.0 | Updated: 2026-04-08 -->

# Guide: Hero Video Backgrounds

**Core Idea**: Hero sections support video backgrounds via external URL (CDN-hosted MP4) with image fallback. Video is referenced in Sanity, not uploaded.

**Supported Pages**: All pages with hero sections:
- Home (`/`)
- About (`/about`)
- Buy (`/buy`)
- Sell (`/sell`)
- Contact (`/contact`)
- Team (`/team`)
- Buyers Guide (`/buyers-guide`)
- Sellers Guide (`/sell`)

**Video Requirements**:
| Property | Requirement |
|----------|-------------|
| Format | MP4 |
| Codec | H.264 |
| Resolution | 1920×1080 |
| Duration | 10–30 seconds (looping) |
| File size | Under 10MB |
| Audio | Strip audio track |

**Compression Command**:
```bash
ffmpeg -i input.mov -c:v libx264 -crf 28 -preset slow -an -movflags +faststart output.mp4
```

**Setup Steps**:

1. **Prepare video** (see requirements above)

2. **Upload to CDN**:
   - Cloudflare R2, AWS S3, Bunny CDN, or Vercel Blob
   - Must be publicly accessible HTTPS URL
   - Test: paste URL in browser, should play inline

3. **Prepare poster image**:
   - Still frame from video or complementary image
   - 1920×1080 minimum
   - Serves as fallback for reduced-motion users

4. **Configure in Sanity Studio**:
   - Open page (e.g., Home Page)
   - Upload poster to **Background Image**
   - Set **Background Type** to "Video"
   - Paste MP4 URL into **Video URL**
   - Publish

5. **Verify**:
   - Image appears immediately
   - Video autoplays after loading
   - Loops continuously
   - Respects `prefers-reduced-motion`

**Switch Back to Image**:
1. Set **Background Type** to "Image"
2. Video URL hidden but retained
3. Publish

**Troubleshooting**:
| Issue | Fix |
|-------|-----|
| Video doesn't play | Check URL is direct MP4, publicly accessible |
| Black frame on load | Ensure Background Image is populated |
| Video too large | Re-compress with higher CRF (e.g., 30) |
| Not appearing on prod | Wait for ISR cache (1 hour) or trigger `/api/revalidate` |

**Reference**: [Hero Video Guide](/Users/dardan/Documents/drenova-group/docs/hero-video-guide.md)

**Related**:
- [sanity-studio-sop.md](sanity-studio-sop.md) — Studio usage
- [content-not-appearing.md](../errors/content-not-appearing.md) — Cache issues
