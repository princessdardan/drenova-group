import type { Metadata } from "next";
import Image from "next/image";
import { Hero } from "@/components/sections/hero";
import { CtaSection } from "@/components/sections/cta-section";
import { ButtonLink } from "@/components/ui/button";
import { LeadForm } from "@/components/sections/lead-form";
import { getBuyersGuidePage } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/image";
import { isSanityImage } from "@/types/sanity";

export const metadata: Metadata = {
  title: "Buyer's Guide",
  description:
    "Download the Drenova Group Buyer's Guide. Get expert insights on the home buying process, market trends, and negotiation strategies.",
};

export default async function BuyersGuidePage() {
  const page = await getBuyersGuidePage();

  const heroImage =
    page?.hero?.image && isSanityImage(page.hero.image)
      ? urlFor(page.hero.image).width(1920).height(1080).fit("crop").url()
      : "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80";

  const guideImage =
    page?.guideImage && isSanityImage(page.guideImage)
      ? urlFor(page.guideImage).width(600).height(800).fit("crop").url()
      : null;

  const guideImageAlt = page?.guideImage?.alt ?? "Drenova Group Buyer's Guide";
  const cta = page?.cta;

  return (
    <>
      {/* ─── Hero ─── */}
      <Hero
        image={heroImage}
        imageAlt={page?.hero?.image?.alt ?? "Beautiful living room interior"}
        overline={page?.hero?.overline ?? "For Buyers"}
        title={page?.hero?.title ?? "Your Guide to Buying"}
        subtitle={
          page?.hero?.subtitle ??
          "Download our guide to buying, which helps you with some essential steps and puts you in the correct position and mindset for purchasing your home."
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
                    Buyer&apos;s Guide
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description + Form */}
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight mb-6">
              {page?.guideTitle ?? "Your Guide to Buying"}
            </h2>
            <div className="text-muted leading-7 space-y-4 mb-8">
              <p>
                {page?.guideDescription ??
                  "Buying a home is often a stressful process. However, if you know what to expect you can avoid a lot of common mistakes and ensure that things go as smoothly as possible. In this guide, we'll cover what to consider when buying real estate, including how to find the perfect home for you and your family and how much it will all cost in the long run!"}
              </p>
            </div>
            <LeadForm source="buyers-guide" />
          </div>
        </div>
      </section>

      {/* ─── Optional CTA ─── */}
      {cta && (
        <CtaSection
          title={cta.title ?? "Ready to Start Your Search?"}
          subtitle={
            cta.subtitle ??
            "Browse our listings or connect with an agent to begin your home buying journey."
          }
        >
          <ButtonLink href={cta.primaryButtonHref ?? "/listings"}>
            {cta.primaryButtonText ?? "Browse Listings"}
          </ButtonLink>
          <ButtonLink href={cta.secondaryButtonHref ?? "/contact"} variant="minimal">
            {cta.secondaryButtonText ?? "Talk to an Agent"}
          </ButtonLink>
        </CtaSection>
      )}
    </>
  );
}
