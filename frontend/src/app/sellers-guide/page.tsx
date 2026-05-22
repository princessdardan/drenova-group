import type { Metadata } from "next";
import { CtaSection } from "@/components/sections/cta-section";
import { getSellersGuidePage } from "@/lib/sanity/fetch";
import { resolveSanityImageUrl } from "@/lib/sanity/image";
import { makeMetadata } from "@/lib/seo";
import { safeHref } from "@/lib/safe-href";
import { GuideDownloadPage } from "@/components/sections/guide-download-page";

export const metadata: Metadata = makeMetadata({
  title: "Seller's Guide",
  description:
    "Download the Drenova Group Seller's Guide. Learn pricing strategies, home staging tips, and how to maximize your home's value.",
  path: "/sellers-guide",
});

export default async function SellersGuidePage() {
  const page = await getSellersGuidePage();

  const heroImage = resolveSanityImageUrl(page?.hero?.image, {
    width: 1920,
    height: 1080,
    fallback:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80",
    fit: "crop",
  });

  const guideImage = resolveSanityImageUrl(page?.guideImage, {
    width: 600,
    height: 800,
    fallback: "",
    fit: "crop",
  });

  const guideImageAlt =
    page?.guideImage?.alt ?? "Drenova Group Seller's Guide";
  const cta = page?.cta;

  return (
    <>
      <GuideDownloadPage
        page={page}
        source="sellers-guide"
        defaults={{
          heroImage,
          heroAlt: "Modern kitchen with pendant lighting",
          overline: "For Sellers",
          title: "Your Guide to Sold",
          subtitle: "Download our guide to sold, which maps you with some essential steps and puts you in the best position to sell your home.",
          guideImage,
          guideAlt: guideImageAlt,
          guidePlaceholderTitle: "Seller's Guide",
          guideDescription: "Selling your home is one of the most important financial decisions you can make. It can be a tough decision as it's likely you have an emotional investment in your home and selling involves a lot of moving parts. However, if you know what to expect you can avoid a lot of common mistakes and ensure that things go as smoothly as possible. In this guide, we will cover what to consider when selling real estate in a step-by-step process.",
        }}
      />

      {/* ─── Optional CTA ─── */}
      {cta && (
        <CtaSection
          title={cta.title ?? "Thinking of Selling?"}
          subtitle={
            cta.subtitle ??
            "Connect with an agent to get a free valuation of your property."
          }
          actions={[
            {
              href: safeHref(cta.primaryButtonHref, "/sell"),
              label: cta.primaryButtonText ?? "Get Your Home's Value",
            },
            {
              href: safeHref(cta.secondaryButtonHref, "#contact"),
              label: cta.secondaryButtonText ?? "Talk to an Agent",
              variant: "minimal",
            }
          ]}
        />
      )}
    </>
  );
}
