import { ImageResponse } from "next/og";
import { join } from "path";
import { readFile } from "fs/promises";

const fontDir = join(process.cwd(), "public", "fonts");

let fontsCache: { playfair: ArrayBuffer; jakarta: ArrayBuffer } | null = null;

async function loadFonts() {
  if (fontsCache) return fontsCache;

  const [playfairBuf, jakartaBuf] = await Promise.all([
    readFile(join(fontDir, "PlayfairDisplay-Bold.ttf")),
    readFile(join(fontDir, "PlusJakartaSans-SemiBold.ttf")),
  ]);

  fontsCache = {
    playfair: playfairBuf.buffer.slice(
      playfairBuf.byteOffset,
      playfairBuf.byteOffset + playfairBuf.byteLength
    ),
    jakarta: jakartaBuf.buffer.slice(
      jakartaBuf.byteOffset,
      jakartaBuf.byteOffset + jakartaBuf.byteLength
    ),
  };

  return fontsCache;
}

interface OgLayoutProps {
  title: string;
  subtitle?: string;
}

export async function generateOgImage({ title, subtitle }: OgLayoutProps) {
  const { playfair, jakarta } = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px 80px",
          background: "#030910",
          position: "relative",
        }}
      >
        {/* Accent strip */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "6px",
            background: "linear-gradient(90deg, #C4622A 0%, #C4622A 40%, transparent 100%)",
          }}
        />

        {/* Brand name */}
        <div
          style={{
            position: "absolute",
            top: "52px",
            left: "80px",
            display: "flex",
            alignItems: "center",
            fontFamily: "Plus Jakarta Sans",
            fontSize: "16px",
            letterSpacing: "4px",
            color: "rgba(240, 243, 245, 0.6)",
            textTransform: "uppercase" as const,
          }}
        >
          DRENOVA GROUP
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              fontFamily: "Playfair Display",
              fontSize: title.length > 30 ? "56px" : "72px",
              fontWeight: 700,
              color: "#F0F3F5",
              lineHeight: 1.1,
              margin: 0,
              maxWidth: "900px",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontSize: "22px",
                color: "rgba(240, 243, 245, 0.6)",
                lineHeight: 1.4,
                margin: 0,
                maxWidth: "700px",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Site URL */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            right: "80px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontFamily: "Plus Jakarta Sans",
            fontSize: "14px",
            color: "rgba(240, 243, 245, 0.4)",
          }}
        >
          drenovagroup.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Playfair Display",
          data: playfair,
          weight: 700 as const,
          style: "normal" as const,
        },
        {
          name: "Plus Jakarta Sans",
          data: jakarta,
          weight: 600 as const,
          style: "normal" as const,
        },
      ],
    }
  );
}
