import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-widest font-medium text-accent mb-4">
        404 — Page Not Found
      </p>
      <h1 className="font-display text-4xl lg:text-6xl font-bold tracking-tight mb-4">
        This Page Doesn&apos;t Exist
      </h1>
      <p className="text-muted leading-7 max-w-md mb-8">
        The page you&apos;re looking for may have been moved or no longer
        exists. Let&apos;s get you back on track.
      </p>
      <div className="flex flex-wrap gap-3 sm:gap-4">
        <ButtonLink href="/">Go Home</ButtonLink>
        <ButtonLink href="/listings" variant="minimal">
          Browse Listings
        </ButtonLink>
      </div>
    </section>
  );
}
