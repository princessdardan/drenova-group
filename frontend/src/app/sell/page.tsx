import type { Metadata } from "next";
import Image from "next/image";
import { Hero } from "@/components/sections/hero";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { CtaSection } from "@/components/sections/cta-section";
import { SectionShell } from "@/components/sections/section-shell";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { getSellPage } from "@/lib/sanity/fetch";
import { resolveSanityImageUrl } from "@/lib/sanity/image";
import { makeMetadata } from "@/lib/seo";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { PageContactSection } from "@/components/sections/page-contact-section";

export const metadata: Metadata = makeMetadata({
  title: "Sell",
  description:
    "Sell your home with confidence. Drenova Group delivers expert pricing, professional marketing, and skilled negotiation to maximize your return.",
});

export default async function SellPage() {
  const sellPage = await getSellPage();

  const heroImage = resolveSanityImageUrl(sellPage?.hero?.image, {
    width: 1920,
    height: 1080,
    fallback:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
    fit: "crop",
  });

  const benefits = sellPage?.benefits ?? [];
  const processSteps = sellPage?.processSteps ?? [];
  const successStories = sellPage?.testimonials ?? [];
  const sellerFaqs = sellPage?.faqs ?? [];
  const bh = sellPage?.benefitsHeading;
  const ph = sellPage?.processHeading;
  const val = sellPage?.valuation;
  const sh = sellPage?.storiesHeading;
  const fh = sellPage?.faqHeading;
  const cta = sellPage?.cta;

  return (
    <>
      {/* ─── Hero ─── */}
      <Hero
        image={heroImage}
        imageAlt={sellPage?.hero?.image?.alt ?? "Luxury home exterior at golden hour"}
        overline={sellPage?.hero?.overline ?? "For Sellers"}
        title={sellPage?.hero?.title ?? "Sell with Confidence"}
        subtitle={sellPage?.hero?.subtitle ?? "Expert pricing, professional marketing, and skilled negotiation — we handle every detail."}
        actions={[
          {
            href: sellPage?.hero?.buttonHref ?? "#contact",
            label: sellPage?.hero?.buttonText ?? "Get a Valuation",
            className: "border-white text-white hover:bg-white hover:text-black",
          }
        ]}
      />

      {/* ─── Why Sell With Us ─── */}
      <BenefitsSection
        heading={bh}
        fallback={{
          overline: "Why Choose Us",
          title: "The Drenova Difference",
        }}
        benefits={benefits}
        bg="surface"
      />

      {/* ─── Selling Process ─── */}
      <ProcessTimeline
        heading={ph}
        fallback={{
          overline: "The Process",
          title: "How Selling Works",
          description: "A proven, step-by-step approach to getting top dollar for your home.",
        }}
        steps={processSteps}
        columns="five"
        bg="background"
      />

      {/* ─── Valuation CTA Split Panel ─── */}
      <section className="bg-surface">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          <div className="relative min-h-[400px] lg:min-h-0">
            <Image
              src={resolveSanityImageUrl(val?.image, {
                width: 1200,
                height: 800,
                fallback:
                  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
                fit: "crop",
              })}
              alt={val?.image?.alt ?? "Beautiful home exterior"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <Reveal className="flex flex-col justify-center px-8 lg:px-16 py-16">
            <p className="text-xs uppercase tracking-widest font-medium text-accent mb-4">
              {val?.overline ?? "Free Home Valuation"}
            </p>
            <h2 className="font-display text-3xl lg:text-5xl font-bold tracking-tight mb-6">
              {val?.title ?? "What's Your Home Worth?"}
            </h2>
            <p className="text-muted leading-7 mb-8">
              {val?.description ?? "Get a complimentary market analysis from our team. We'll evaluate recent comparable sales, current market conditions, and your home's unique features to provide an accurate valuation."}
            </p>
            <div>
              <ButtonLink href="#contact" variant="accent">
                {val?.ctaText ?? "Request Valuation"}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Success Stories ─── */}
      {successStories.length > 0 && (
        <SectionShell bg="background" container="sm">
          <SectionHeader
            overline={sh?.overline ?? "Success Stories"}
            title={sh?.title ?? "Results That Speak"}
            description={sh?.description}
            className="mb-12"
          />
          <div className="space-y-8">
            {successStories.map((story) => (
              <blockquote key={story._key} className="border-l-2 border-accent pl-6">
                <p className="font-display text-lg italic leading-8">&ldquo;{story.quote}&rdquo;</p>
                <footer className="mt-3 text-sm text-muted">
                  {story.name} — {story.detail}
                </footer>
              </blockquote>
            ))}
          </div>
        </SectionShell>
      )}

      {/* ─── FAQ ─── */}
      {sellerFaqs.length > 0 && (
        <SectionShell bg="surface" container="sm">
          <SectionHeader
            overline={fh?.overline ?? "FAQs"}
            title={fh?.title ?? "Common Seller Questions"}
            description={fh?.description}
            className="mb-12"
          />
          <Reveal>
            <Accordion items={sellerFaqs} />
          </Reveal>
        </SectionShell>
      )}

      {/* ─── CTA ─── */}
      <CtaSection
        title={cta?.title ?? "Ready to Sell?"}
        subtitle={cta?.subtitle ?? "Connect with an agent today and take the first step toward a successful sale."}
        bg="background"
        actions={[
          {
            href: cta?.primaryButtonHref ?? "#contact",
            label: cta?.primaryButtonText ?? "Get Your Home's Value",
            variant: "accent",
          },
          {
            href: cta?.secondaryButtonHref ?? "#contact",
            label: cta?.secondaryButtonText ?? "Connect with an Agent",
            variant: "minimal",
          }
        ]}
      />

      {/* ─── Contact Form ─── */}
      <PageContactSection leadSource="sell" />
    </>
  );
}
