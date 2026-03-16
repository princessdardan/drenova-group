"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ImageLightboxProps {
  images: string[];
  alt: string;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

export function ImageLightbox({
  images,
  alt,
  currentIndex,
  onIndexChange,
  onClose,
}: ImageLightboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const goToPrev = useCallback(() => {
    onIndexChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  }, [currentIndex, images.length, onIndexChange]);

  const goToNext = useCallback(() => {
    onIndexChange(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, images.length, onIndexChange]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        goToPrev();
        return;
      }
      if (e.key === "ArrowRight") {
        goToNext();
        return;
      }

      if (e.key === "Tab" && containerRef.current) {
        const focusable =
          containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose, goToPrev, goToNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Fullscreen image viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay"
    >
      {/* Close button */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
        aria-label="Close fullscreen viewer"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Previous arrow */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={goToPrev}
          className="absolute left-4 z-10 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
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

      {/* Image */}
      <div className="relative max-w-[90vw] max-h-[85vh] w-full h-full">
        <Image
          src={images[currentIndex]}
          alt={`${alt} — photo ${currentIndex + 1} of ${images.length}`}
          fill
          className="object-contain"
          sizes="90vw"
          priority
        />
      </div>

      {/* Next arrow */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={goToNext}
          className="absolute right-4 z-10 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
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

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/40 text-white text-sm px-4 py-1.5 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
