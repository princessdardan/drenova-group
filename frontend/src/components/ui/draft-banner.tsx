"use client";

import { useIsPresentationTool } from "next-sanity/hooks";

export function DraftBanner() {
  const isPresentationTool = useIsPresentationTool();

  if (isPresentationTool !== false) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-accent text-white text-center py-2 px-4 text-sm font-sans font-medium">
      Draft mode enabled —{" "}
      <button
        type="button"
        onClick={() => window.location.assign("/api/draft/disable")}
        className="underline hover:opacity-80"
      >
        Exit draft mode
      </button>
    </div>
  );
}
