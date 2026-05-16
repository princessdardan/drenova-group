import Image from "next/image";
import { cn } from "@/lib/cn";
import type { SanityImage } from "@/types/sanity";
import { isSanityImage } from "@/types/sanity";
import { resolveSanityImageUrl } from "@/lib/sanity/image";
import { HeroContent } from "./hero-content";
import { type ActionGroupAction } from "./action-group";

interface HeroProps {
  image: string | SanityImage;
  imageAlt: string;
  backgroundType?: "image" | "video";
  videoUrl?: string;
  overline?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  size?: "full" | "short";
  headingLevel?: "h1" | "h2";
  actions?: ActionGroupAction[];
}

export function Hero({
  image,
  imageAlt,
  backgroundType = "image",
  videoUrl,
  overline,
  title,
  subtitle,
  children,
  size = "full",
  headingLevel = "h1",
  actions,
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        size === "full" ? "min-h-[70vh] lg:min-h-screen" : "min-h-[50vh]"
      )}
    >
      {/* Image — always rendered as poster/fallback */}
      <Image
        src={resolveSanityImageUrl(image, { width: 1920, height: 1080, fallback: typeof image === "string" ? image : "", fit: "crop" })}
        alt={
          isSanityImage(image) && image.alt ? image.alt : imageAlt
        }
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Video — overlays image when backgroundType is video */}
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

      <div className="absolute inset-0 bg-overlay" />
      <HeroContent
        overline={overline}
        title={title}
        subtitle={subtitle}
        headingLevel={headingLevel}
        actions={actions}
      >
        {children}
      </HeroContent>
    </section>
  );
}
