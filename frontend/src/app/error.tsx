"use client";

import { Button, ButtonLink } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-widest font-medium text-accent mb-4">
        Something Went Wrong
      </p>
      <h1 className="font-display text-4xl lg:text-6xl font-bold tracking-tight mb-4">
        Unexpected Error
      </h1>
      <p className="text-muted leading-7 max-w-md mb-8">
        We apologize for the inconvenience. Please try again or return to the
        homepage.
      </p>
      <div className="flex flex-wrap gap-3 sm:gap-4">
        <Button onClick={reset} variant="accent">
          Try Again
        </Button>
        <ButtonLink href="/">Go Home</ButtonLink>
      </div>
    </section>
  );
}
