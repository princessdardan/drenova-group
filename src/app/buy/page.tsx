import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { SectionHeader } from "@/components/ui/section-header";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { CtaSection } from "@/components/sections/cta-section";
import { buyingSteps, buyerFaqs, coverageAreas } from "@/lib/dummy-data";

export const metadata: Metadata = {
  title: "Buy",
  description:
    "Find your next home with Drenova Group. Expert guidance through every step of the home buying process across multiple states.",
};

const buyerBenefits = [
  {
    title: "Expert Local Knowledge",
    description:
      "Our agents live and work in the communities they serve. You'll get insider knowledge on neighborhoods, schools, market trends, and hidden opportunities.",
  },
  {
    title: "Data-Driven Search",
    description:
      "We leverage real-time MLS data and market analytics to identify properties that match your criteria and help you make informed decisions.",
  },
  {
    title: "Full-Service Support",
    description:
      "From mortgage pre-approval guidance to closing coordination, we manage every detail so you can focus on finding the right home.",
  },
];

export default function BuyPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <Hero
        image="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1600&q=80"
        imageAlt="Beautiful home exterior with warm lighting"
        overline="For Buyers"
        title="Find Your Next Home"
        subtitle="Let our experienced agents guide you through every step — from search to closing."
      >
        <ButtonLink href="/listings" className="border-white text-white hover:bg-white hover:text-black">
          Browse Listings
        </ButtonLink>
      </Hero>

      {/* ─── Why Buy With Us ─── */}
      <section className="bg-surface py-16 px-6 lg:py-24 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            overline="Why Choose Us"
            title="Buy With Confidence"
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {buyerBenefits.map((benefit) => (
              <div key={benefit.title} className="bg-surface-alt p-6 lg:p-8 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted leading-7">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Buying Process ─── */}
      <section className="bg-background py-16 px-6 lg:py-24 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            overline="The Process"
            title="How Buying Works"
            description="A clear, transparent process from start to finish."
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {buyingSteps.map((step) => (
              <div key={step.number}>
                <span className="font-display text-6xl lg:text-8xl font-bold text-accent/20">
                  {step.number}
                </span>
                <div className="w-12 h-px bg-border mt-4 mb-6" />
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-base text-muted leading-7">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Area Highlights ─── */}
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
                key={area.name}
                className="bg-surface-alt p-6 rounded-lg border border-border text-center hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-1">{area.name}</h3>
                <p className="text-sm text-muted">{area.cities}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
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
