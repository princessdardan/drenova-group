import type { Metadata } from "next";
import { CtaSection } from "@/components/sections/cta-section";
import { getBuyersGuidePage } from "@/lib/sanity/fetch";
import { resolveSanityImageUrl } from "@/lib/sanity/image";
import { makeMetadata } from "@/lib/seo";
import { GuideDownloadPage } from "@/components/sections/guide-download-page";

export const metadata: Metadata = makeMetadata({
  title: "Buyer's Guide",
  description:
    "Download the Drenova Group Buyer's Guide. Get expert insights on the home buying process, market trends, and negotiation strategies.",
});

export default async function BuyersGuidePage() {
  const page = await getBuyersGuidePage();

  const heroImage = resolveSanityImageUrl(page?.hero?.image, { width: 1920, height: 1080, fallback: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80", fit: "crop" });

  const guideImage = resolveSanityImageUrl(page?.guideImage, { width: 600, height: 800, fallback: "", fit: "crop" });

  const guideImageAlt = page?.guideImage?.alt ?? "Drenova Group Buyer's Guide";
  const cta = page?.cta;

  return (
    <>
      <GuideDownloadPage
        page={page}
        source="buyers-guide"
        defaults={{
          heroImage,
          heroAlt: "Beautiful living room interior",
          overline: "For Buyers",
          title: "Your Guide to Buying",
          subtitle: "Download our guide to buying, which helps you with some essential steps and puts you in the correct position and mindset for purchasing your home.",
          guideImage,
          guideAlt: guideImageAlt,
          guidePlaceholderTitle: "Buyer's Guide",
          guideDescription: "Buying a home is often a stressful process. However, if you know what to expect you can avoid a lot of common mistakes and ensure that things go as smoothly as possible. In this guide, we'll cover what to consider when buying real estate, including how to find the perfect home for you and your family and how much it will all cost in the long run!",
        }}
      />

      {/* ─── Optional CTA ─── */}
      {cta && (
        <CtaSection
          title={cta.title ?? "Ready to Start Your Search?"}
          subtitle={
            cta.subtitle ??
            "Browse our listings or connect with an agent to begin your home buying journey."
          }
          actions={[
            {
              href: cta.primaryButtonHref ?? "/listings",
              label: cta.primaryButtonText ?? "Browse Listings",
            },
            {
              href: cta.secondaryButtonHref ?? "#contact",
              label: cta.secondaryButtonText ?? "Talk to an Agent",
              variant: "minimal",
            }
          ]}
        />
      )}
    </>
  );
}
