import type { Metadata } from "next";
import Image from "next/image";
import { Hero } from "@/components/sections/hero";
import { SectionHeader } from "@/components/ui/section-header";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { CtaSection } from "@/components/sections/cta-section";
import { getSellPage, getFaqsByCategory, getTestimonials } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/image";
import { isSanityImage } from "@/types/sanity";

export const metadata: Metadata = {
  title: "Sell",
  description:
    "Sell your home with confidence. Drenova Group delivers expert pricing, professional marketing, and skilled negotiation to maximize your return.",
};

export default async function SellPage() {
  const [sellPage, sellerFaqs, allTestimonials] = await Promise.all([
    getSellPage(),
    getFaqsByCategory("seller"),
    getTestimonials(),
  ]);

  const heroImage = sellPage?.hero?.image && isSanityImage(sellPage.hero.image)
    ? urlFor(sellPage.hero.image).width(1920).height(1080).fit("crop").url()
    : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80";

  const benefits = sellPage?.benefits ?? [];
  const processSteps = sellPage?.processSteps ?? [];
  const successStories = allTestimonials.filter((t) => t.detail.includes("Sold")).slice(0, 3);

  return (
    <>
      {/* ─── Hero ─── */}
      <Hero
        image={heroImage}
        imageAlt={sellPage?.hero?.image?.alt ?? "Luxury home exterior at golden hour"}
        overline={sellPage?.hero?.overline ?? "For Sellers"}
        title={sellPage?.hero?.title ?? "Sell with Confidence"}
        subtitle={sellPage?.hero?.subtitle ?? "Expert pricing, professional marketing, and skilled negotiation — we handle every detail."}
      >
        <ButtonLink href="/contact" className="border-white text-white hover:bg-white hover:text-black">
          Get a Valuation
        </ButtonLink>
      </Hero>

      {/* ─── Why Sell With Us ─── */}
      {benefits.length > 0 && (
        <section className="bg-surface py-16 px-6 lg:py-24 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              overline="Why Choose Us"
              title="The Drenova Difference"
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

      {/* ─── Selling Process ─── */}
      {processSteps.length > 0 && (
        <section className="bg-background py-16 px-6 lg:py-24 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              overline="The Process"
              title="How Selling Works"
              description="A proven, step-by-step approach to getting top dollar for your home."
              className="mb-12"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12">
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

      {/* ─── Valuation CTA Split Panel ─── */}
      <section className="bg-surface">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          <div className="relative min-h-[400px] lg:min-h-0">
            <Image
              src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80"
              alt="Beautiful home exterior"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center px-8 lg:px-16 py-16">
            <p className="text-xs uppercase tracking-widest font-medium text-accent mb-4">
              Free Home Valuation
            </p>
            <h2 className="font-display text-3xl lg:text-5xl font-bold tracking-tight mb-6">
              What&apos;s Your Home Worth?
            </h2>
            <p className="text-muted leading-7 mb-8">
              Get a complimentary market analysis from our team. We&apos;ll evaluate
              recent comparable sales, current market conditions, and your home&apos;s
              unique features to provide an accurate valuation.
            </p>
            <div>
              <ButtonLink href="/contact" variant="accent">
                Request Valuation
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Success Stories ─── */}
      {successStories.length > 0 && (
        <section className="bg-background py-16 px-6 lg:py-24 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              overline="Success Stories"
              title="Results That Speak"
              className="mb-12"
            />
            <div className="space-y-8">
              {successStories.map((story, i) => (
                <blockquote key={i} className="border-l-2 border-accent pl-6">
                  <p className="font-display text-lg italic leading-8">&ldquo;{story.quote}&rdquo;</p>
                  <footer className="mt-3 text-sm text-muted">
                    {story.name} — {story.detail}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FAQ ─── */}
      {sellerFaqs.length > 0 && (
        <section className="bg-surface py-16 px-6 lg:py-24 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              overline="FAQs"
              title="Common Seller Questions"
              className="mb-12"
            />
            <Accordion items={sellerFaqs} />
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <CtaSection
        title="Ready to Sell?"
        subtitle="Connect with an agent today and take the first step toward a successful sale."
        bg="background"
      >
        <ButtonLink href="/contact" variant="accent">
          Get Your Home&apos;s Value
        </ButtonLink>
        <ButtonLink href="/contact" variant="minimal">
          Connect with an Agent
        </ButtonLink>
      </CtaSection>
    </>
  );
}
