import Link from "next/link";

export function DraftBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-accent text-white text-center py-2 px-4 text-sm font-sans font-medium">
      Draft mode enabled —{" "}
      <Link href="/api/draft/disable" className="underline hover:opacity-80">
        Exit draft mode
      </Link>
    </div>
  );
}
