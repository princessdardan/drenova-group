"use client";

import { Button, ButtonLink } from "@/components/ui/button";
import { StatePage } from "@/components/sections/state-page";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StatePage
      overline="Something Went Wrong"
      title="Unexpected Error"
      description="We apologize for the inconvenience. Please try again or return to the homepage."
    >
      <Button onClick={reset} variant="accent">
        Try Again
      </Button>
      <ButtonLink href="/">Go Home</ButtonLink>
    </StatePage>
  );
}
