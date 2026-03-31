import Image from "next/image";
import { cn } from "@/lib/cn";
import type { SanityImage } from "@/types/sanity";
import { isSanityImage } from "@/types/sanity";
import { urlFor } from "@/lib/sanity/image";

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
}: HeroProps) {
  const Heading = headingLevel;
  return (
    <section
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        size === "full" ? "min-h-[70vh] lg:min-h-screen" : "min-h-[50vh]"
      )}
    >
      {/* Image — always rendered as poster/fallback */}
      <Image
        src={
          isSanityImage(image)
            ? urlFor(image).width(1920).height(1080).fit("crop").url()
            : image
        }
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
      <div className="relative z-10 text-center text-white max-w-3xl px-6 py-20">
        {overline && (
          <p className="text-xs uppercase tracking-widest font-medium mb-4 text-white/80">
            {overline}
          </p>
        )}
        <Heading className="font-display text-4xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
          {title}
        </Heading>
        {subtitle && (
          <p className="text-lg leading-8 mt-4 text-white/80">{subtitle}</p>
        )}
        {children && <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8">{children}</div>}
      </div>
    </section>
  );
}
