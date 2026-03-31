# Hero Video Guide

How hero background videos are stored, served, and configured across the Sanity Studio and Next.js frontend.

---

## Architecture Overview

Hero videos use a **URL-based** approach — videos are hosted externally (CDN, S3, etc.) and referenced by URL in Sanity, not uploaded to Sanity's asset pipeline. This keeps storage costs low and gives full control over video delivery.

### Data flow

```
External CDN (MP4 file)
        ↑ referenced by URL
Sanity Studio → heroSettings.videoUrl (url field)
        ↓ fetched via GROQ query
Next.js page (server component) → Hero component
        ↓ renders
HTML5 <video> element (autoplay, loop, muted)
```

### Rendering layers (front to back)

| Layer | Element | Purpose |
|-------|---------|---------|
| 1 (top) | Text overlay | Title, subtitle, overline, CTA buttons |
| 2 | `bg-overlay` div | Semi-transparent dark tint for text readability |
| 3 | `<video>` | Background video (only when `backgroundType === "video"`) |
| 4 (bottom) | `<Image>` | Poster/fallback — always rendered |

The image layer is **always present**. It displays while the video downloads and remains visible if the video fails to load or the user has `prefers-reduced-motion` enabled.

### Key files

| File | Role |
|------|------|
| `backend/schemaTypes/objects/hero-settings.ts` | Sanity schema — defines `backgroundType` and `videoUrl` fields |
| `frontend/src/components/sections/hero.tsx` | Hero component — renders video with HTML5 `<video>` |
| `frontend/src/types/sanity.ts` | TypeScript `HeroSettings` interface |
| `frontend/src/lib/sanity/queries.ts` | GROQ queries that fetch hero data |
| `frontend/src/app/globals.css` | `--overlay` CSS variable for the dark tint |

---

## Pages That Support Video

Every page with a hero section uses the same `heroSettings` object type, so **all of these pages support video**:

- Home (`/`)
- About (`/about`)
- Buy (`/buy`)
- Sell (`/sell`)
- Contact (`/contact`)
- Team (`/team`)
- Buyers Guide (`/buyers-guide`)
- Sellers Guide (`/sellers-guide`)

---

## Step-by-Step: Adding a Video to a Hero Section

### Step 1: Prepare the video file

**Format requirements:**
- **Container:** MP4
- **Codec:** H.264 (widest browser support)
- **Resolution:** 1920×1080 recommended (matches the image pipeline)
- **Duration:** 10–30 seconds works well for looping backgrounds
- **File size:** Aim for under 10MB — compress aggressively since it plays muted behind an overlay
- **Audio:** Strip the audio track entirely (the `<video>` element is muted, but removing audio reduces file size)

**Compression tips:**
```bash
# Using ffmpeg to compress and strip audio
ffmpeg -i input.mov -c:v libx264 -crf 28 -preset slow -an -movflags +faststart output.mp4
```

- `-crf 28` — quality level (higher = smaller file, 23–30 is the sweet spot for backgrounds)
- `-an` — removes audio track
- `-movflags +faststart` — moves metadata to the start of the file so the browser can begin playback before the full download completes

### Step 2: Upload to your CDN / hosting

Upload the MP4 file to your hosting provider and get a direct URL. The URL must:
- Be publicly accessible (no authentication)
- Serve the file with `Content-Type: video/mp4`
- Support HTTPS (required for production)
- Ideally support CORS headers if served from a different domain

Examples of suitable hosting:
- Cloudflare R2
- AWS S3 + CloudFront
- Bunny CDN
- Vercel Blob Storage
- Any static file host that serves MP4 files

**Test the URL** by pasting it directly into a browser — the video should play inline.

### Step 3: Prepare a poster/fallback image

Choose or create a still frame from the video (or a complementary image) to use as the background image. This image:
- Displays immediately while the video loads
- Remains visible if the video fails
- Shows for users with `prefers-reduced-motion` enabled
- Is used by search engines and social media previews

Upload this image to Sanity in the next step.

### Step 4: Configure in Sanity Studio

1. Open Sanity Studio (`npm run studio` → `http://localhost:3333`)
2. In the left sidebar, navigate to the page you want to add video to (e.g., **Home Page**)
3. Scroll to the **Hero Settings** section
4. **Upload the poster image** to the "Background Image" field
   - Add descriptive alt text (e.g., "Aerial view of luxury lakefront properties")
   - Use the hotspot tool to set the focal point
5. **Set Background Type** to **Video** (click the "Video" radio button)
   - The "Video URL" field will appear below
6. **Paste the video URL** into the "Video URL" field
   - Example: `https://cdn.example.com/hero-background.mp4`
7. Fill in the remaining hero fields (overline, title, subtitle) as needed
8. Click **Publish**

### Step 5: Verify on the frontend

1. If running locally (`npm run dev`), the page will fetch updated content on the next request (ISR revalidation)
2. For production, either:
   - Wait for the ISR cache to expire (1 hour by default), or
   - Trigger a revalidation via the webhook endpoint at `/api/revalidate`
3. Open the page in a browser and confirm:
   - The image appears first as a poster
   - The video begins autoplaying after it loads
   - The video loops continuously
   - The dark overlay and text remain readable
   - On mobile, the video plays inline (not fullscreen)

### Step 6: Test accessibility

1. Enable "Reduce motion" in your OS settings:
   - **macOS:** System Settings → Accessibility → Display → Reduce motion
   - **Windows:** Settings → Accessibility → Visual effects → Animation effects → Off
2. Reload the page — the video should be hidden, showing only the poster image
3. Use a screen reader — the video element has `aria-hidden="true"` and should not be announced

---

## Switching Back to Image-Only

To remove the video from a page's hero:

1. Open the page in Sanity Studio
2. Set **Background Type** back to **Image**
3. The Video URL field will hide (the URL value is retained but ignored)
4. Publish

No frontend code changes needed — the Hero component only renders the `<video>` element when `backgroundType === "video"` AND `videoUrl` is present.

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Video doesn't play on mobile | Missing `playsInline` or `muted` attribute | These are already set in the Hero component — check that the video URL is accessible |
| Video shows black frame on load | No poster image set | Ensure the "Background Image" field is populated in Sanity |
| Video doesn't autoplay | Browser blocks autoplay of unmuted video | The component already uses `muted` — verify the video file doesn't have a silent audio track that tricks the browser |
| Video takes too long to load | File too large | Re-compress with higher CRF value (e.g., `-crf 30`) or lower resolution |
| Video URL field not visible in Studio | Background Type set to "Image" | Select "Video" radio button to reveal the field |
| Changes not appearing on production | ISR cache not expired | Trigger `/api/revalidate` webhook or wait up to 1 hour |
| CORS errors in browser console | Video hosted on different domain without CORS headers | Configure CORS on your CDN to allow your domain |

---

## Technical Reference

### Sanity schema (`heroSettings`)

```typescript
// backend/schemaTypes/objects/hero-settings.ts
defineField({
  name: "backgroundType",
  type: "string",
  options: {
    list: [
      { title: "Image", value: "image" },
      { title: "Video", value: "video" },
    ],
    layout: "radio",
  },
  initialValue: "image",
}),
defineField({
  name: "videoUrl",
  type: "url",
  hidden: ({ parent }) => parent?.backgroundType !== "video",
}),
```

### Frontend component (`Hero`)

```tsx
// frontend/src/components/sections/hero.tsx
{backgroundType === "video" && videoUrl && (
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover motion-reduce:hidden"
    aria-hidden="true"
  >
    <source src={videoUrl} type="video/mp4" />
  </video>
)}
```

### TypeScript type

```typescript
// frontend/src/types/sanity.ts
interface HeroSettings {
  image: SanityImage;
  backgroundType?: "image" | "video";
  videoUrl?: string;
  overline?: string;
  title: string;
  subtitle?: string;
}
```
