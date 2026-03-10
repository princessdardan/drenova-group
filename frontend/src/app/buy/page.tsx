import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { SectionHeader } from "@/components/ui/section-header";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { CtaSection } from "@/components/sections/cta-section";
import { getBuyPage, getFaqsByCategory, getCoverageAreas } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/image";
import { isSanityImage } from "@/types/sanity";

export const metadata: Metadata = {
  title: "Buy",
  description:
    "Find your next home with Drenova Group. Expert guidance through every step of the home buying process across multiple states.",
};

export default async function BuyPage() {
  const [buyPage, buyerFaqs, coverageAreas] = await Promise.all([
    getBuyPage(),
    getFaqsByCategory("buyer"),
    getCoverageAreas(),
  ]);

  const heroImage = buyPage?.hero?.image && isSanityImage(buyPage.hero.image)
    ? urlFor(buyPage.hero.image).width(1920).height(1080).fit("crop").url()
    : "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1600&q=80";

  const benefits = buyPage?.benefits ?? [];
  const processSteps = buyPage?.processSteps ?? [];

  return (
    <>
      {/* ─── Hero ─── */}
      <Hero
        image={heroImage}
        imageAlt={buyPage?.hero?.image?.alt ?? "Beautiful home exterior with warm lighting"}
        overline={buyPage?.hero?.overline ?? "For Buyers"}
        title={buyPage?.hero?.title ?? "Find Your Next Home"}
        subtitle={buyPage?.hero?.subtitle ?? "Let our experienced agents guide you through every step — from search to closing."}
      >
        <ButtonLink href="/listings" className="border-white text-white hover:bg-white hover:text-black">
          Browse Listings
        </ButtonLink>
      </Hero>

      {/* ─── Why Buy With Us ─── */}
      {benefits.length > 0 && (
        <section className="bg-surface py-16 px-6 lg:py-24 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              overline="Why Choose Us"
              title="Buy With Confidence"
              className="mb-12"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit._key} className="bg-surface-alt p-6 lg:p-8 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-muted leading-7">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Buying Process ─── */}
      {processSteps.length > 0 && (
        <section className="bg-background py-16 px-6 lg:py-24 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              overline="The Process"
              title="How Buying Works"
              description="A clear, transparent process from start to finish."
              className="mb-12"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {processSteps.map((step) => (
                <div key={step._key}>
                  <span className="font-display text-6xl lg:text-8xl font-bold text-accent/20">
                    {step.stepNumber}
                  </span>
                  <div className="w-12 h-px bg-border mt-4 mb-6" />
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-base text-muted leading-7">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Area Highlights ─── */}
      {coverageAreas.length > 0 && (
        <section className="bg-surface py-16 px-6 lg:py-24 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              overline="Where We Serve"
              title="Explore Our Markets"
              description="We bring local expertise to every community across our five-state coverage area."
              className="mb-12"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {coverageAreas.map((area) => (
                <div
                  key={area._id}
                  className="bg-surface-alt p-6 rounded-lg border border-border text-center hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold text-lg mb-1">{area.state}</h3>
                  <p className="text-sm text-muted">{area.cities.join(", ")}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FAQ ─── */}
      {buyerFaqs.length > 0 && (
        <section className="bg-background py-16 px-6 lg:py-24 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              overline="FAQs"
              title="Common Buyer Questions"
              className="mb-12"
            />
            <Accordion items={buyerFaqs} />
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <CtaSection
        title="Start Your Search Today"
        subtitle="Browse our listings or connect with an agent to begin your home buying journey."
      >
        <ButtonLink href="/listings">Browse Listings</ButtonLink>
        <ButtonLink href="/contact" variant="minimal">
          Talk to an Agent
        </ButtonLink>
      </CtaSection>
    </>
  );
}
