import type { Metadata } from "next";
import Image from "next/image";
import { Hero } from "@/components/sections/hero";
import { CtaSection } from "@/components/sections/cta-section";
import { ButtonLink } from "@/components/ui/button";
import { LeadForm } from "@/components/sections/lead-form";
import { getSellersGuidePage } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/image";
import { isSanityImage } from "@/types/sanity";

export const metadata: Metadata = {
  title: "Seller's Guide",
  description:
    "Download the Drenova Group Seller's Guide. Learn pricing strategies, home staging tips, and how to maximize your home's value.",
};

export default async function SellersGuidePage() {
  const page = await getSellersGuidePage();

  const heroImage =
    page?.hero?.image && isSanityImage(page.hero.image)
      ? urlFor(page.hero.image).width(1920).height(1080).fit("crop").url()
      : "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80";

  const guideImage =
    page?.guideImage && isSanityImage(page.guideImage)
      ? urlFor(page.guideImage).width(600).height(800).fit("crop").url()
      : null;

  const guideImageAlt =
    page?.guideImage?.alt ?? "Drenova Group Seller's Guide";
  const cta = page?.cta;

  return (
    <>
      {/* ─── Hero ─── */}
      <Hero
        image={heroImage}
        imageAlt={page?.hero?.image?.alt ?? "Modern kitchen with pendant lighting"}
        overline={page?.hero?.overline ?? "For Sellers"}
        title={page?.hero?.title ?? "Your Guide to Sold"}
        subtitle={
          page?.hero?.subtitle ??
          "Download our guide to sold, which maps you with some essential steps and puts you in the best position to sell your home."
        }
      />

      {/* ─── Guide Section with Form ─── */}
      <section className="bg-background py-16 px-6 lg:py-24 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Book mockup image */}
          <div className="flex justify-center lg:justify-start">
            {guideImage ? (
              <Image
                src={guideImage}
                alt={guideImageAlt}
                width={400}
                height={533}
                className="rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-[300px] h-[400px] bg-surface border border-border rounded-lg flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest text-muted mb-2">
                    Drenova Group
                  </p>
                  <p className="font-display text-2xl font-bold tracking-tight">
                    Seller&apos;s Guide
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description + Form */}
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight mb-6">
              {page?.guideTitle ?? "Your Guide to Sold"}
            </h2>
            <div className="text-muted leading-7 space-y-4 mb-8">
              <p>
                {page?.guideDescription ??
                  "Selling your home is one of the most important financial decisions you can make. It can be a tough decision as it's likely you have an emotional investment in your home and selling involves a lot of moving parts. However, if you know what to expect you can avoid a lot of common mistakes and ensure that things go as smoothly as possible. In this guide, we will cover what to consider when selling real estate in a step-by-step process."}
              </p>
            </div>
            <LeadForm source="sellers-guide" />
          </div>
        </div>
      </section>

      {/* ─── Optional CTA ─── */}
      {cta && (
        <CtaSection
          title={cta.title ?? "Thinking of Selling?"}
          subtitle={
            cta.subtitle ??
            "Connect with an agent to get a free valuation of your property."
          }
        >
          <ButtonLink href={cta.primaryButtonHref ?? "/sell"}>
            {cta.primaryButtonText ?? "Get Your Home's Value"}
          </ButtonLink>
          <ButtonLink href={cta.secondaryButtonHref ?? "/contact"} variant="minimal">
            {cta.secondaryButtonText ?? "Talk to an Agent"}
          </ButtonLink>
        </CtaSection>
      )}
    </>
  );
}
