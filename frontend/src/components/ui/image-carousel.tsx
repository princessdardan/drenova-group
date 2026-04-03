"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { ImageLightbox } from "./image-lightbox";

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasMultiple = images.length > 1;

  const goToPrev = useCallback(() => {
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    },
    [goToPrev, goToNext]
  );

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] lg:aspect-[16/9] xl:aspect-[21/9] bg-surface flex items-center justify-center">
        <p className="text-muted">No photos available</p>
      </div>
    );
  }

  return (
    <>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Property photos"
        tabIndex={0}
        onKeyDown={hasMultiple ? handleKeyDown : undefined}
        className="relative outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        {/* Hero image area */}
        <div className="relative aspect-[4/3] lg:aspect-[16/9] xl:aspect-[21/9] bg-surface overflow-hidden">
          {images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={`${alt} — photo ${i + 1} of ${images.length}`}
              fill
              className={cn(
                "object-cover transition-opacity duration-300",
                i === currentIndex ? "opacity-100" : "opacity-0"
              )}
              sizes="100vw"
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              aria-hidden={i !== currentIndex}
            />
          ))}

          {/* Previous arrow */}
          {hasMultiple && (
            <button
              type="button"
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
              aria-label="Previous image"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M12.5 15l-5-5 5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* Next arrow */}
          {hasMultiple && (
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
              aria-label="Next image"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 5l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* Fullscreen expand icon */}
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
            aria-label="View fullscreen"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M2 7V2h5M16 7V2h-5M2 11v5h5M16 11v5h-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Thumbnail strip */}
        {hasMultiple && (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3">
            <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`View image ${i + 1} of ${images.length}`}
                  aria-current={i === currentIndex ? "true" : undefined}
                  className={cn(
                    "relative w-16 h-12 lg:w-24 lg:h-16 flex-shrink-0 rounded overflow-hidden transition-all cursor-pointer",
                    i === currentIndex
                      ? "ring-2 ring-accent opacity-100"
                      : "opacity-60 hover:opacity-100"
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={images}
          alt={alt}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
