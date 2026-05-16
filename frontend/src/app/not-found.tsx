import { ButtonLink } from "@/components/ui/button";
import { StatePage } from "@/components/sections/state-page";

export default function NotFound() {
  return (
    <StatePage
      overline="404 — Page Not Found"
      title="This Page Doesn't Exist"
      description="The page you're looking for may have been moved or no longer exists. Let's get you back on track."
    >
      <ButtonLink href="/">Go Home</ButtonLink>
      <ButtonLink href="/listings" variant="minimal">
        Browse Listings
      </ButtonLink>
    </StatePage>
  );
}
