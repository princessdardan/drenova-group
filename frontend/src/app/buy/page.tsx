import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Accordion } from "@/components/ui/accordion";
import { CtaSection } from "@/components/sections/cta-section";
import { Reveal } from "@/components/ui/reveal";
import { getBuyPage } from "@/lib/sanity/fetch";
import { resolveSanityImageUrl } from "@/lib/sanity/image";
import { makeMetadata } from "@/lib/seo";
import { safeHref } from "@/lib/safe-href";
import { SectionShell } from "@/components/sections/section-shell";
import { SectionHeader } from "@/components/ui/section-header";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { CoverageAreaGrid } from "@/components/sections/coverage-area-grid";
import { PageContactSection } from "@/components/sections/page-contact-section";

export const metadata: Metadata = makeMetadata({
  title: "Buy",
  description:
    "Find your next home with Drenova Group. Expert guidance through every step of the home buying process across Toronto, the GTA, and surrounding Ontario communities.",
  path: "/buy",
});

export default async function BuyPage() {
  const buyPage = await getBuyPage();

  const heroImage = resolveSanityImageUrl(buyPage?.hero?.image, { width: 1920, height: 1080, fallback: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1600&q=80", fit: "crop" });

  const benefits = buyPage?.benefits ?? [];
  const processSteps = buyPage?.processSteps ?? [];
  const buyerFaqs = buyPage?.faqs ?? [];
  const coverageAreas = buyPage?.coverageAreas ?? [];
  const bh = buyPage?.benefitsHeading;
  const ph = buyPage?.processHeading;
  const ch = buyPage?.coverageHeading;
  const fh = buyPage?.faqHeading;
  const cta = buyPage?.cta;

  return (
    <>
      {/* ─── Hero ─── */}
      <Hero
        image={heroImage}
        imageAlt={buyPage?.hero?.image?.alt ?? "Beautiful home exterior with warm lighting"}
        overline={buyPage?.hero?.overline ?? "For Buyers"}
        title={buyPage?.hero?.title ?? "Find Your Next Home"}
        subtitle={buyPage?.hero?.subtitle ?? "Let our experienced agents guide you through every step — from search to closing."}
        actions={[
          {
            href: safeHref(buyPage?.hero?.buttonHref, "/listings"),
            label: buyPage?.hero?.buttonText ?? "Browse Listings",
            className: "border-white text-white hover:bg-white hover:text-black",
          },
          ...(buyPage?.hero?.secondaryButtonText ? [{
            href: safeHref(buyPage?.hero?.secondaryButtonHref, "#contact"),
            label: buyPage.hero.secondaryButtonText,
            className: "border-white text-white hover:bg-white hover:text-black",
          }] : []),
        ]}
      />

      {/* ─── Why Buy With Us ─── */}
      <BenefitsSection
        heading={bh}
        fallback={{
          overline: "Why Choose Us",
          title: "Buy With Confidence",
        }}
        benefits={benefits}
        bg="surface"
      />

      {/* ─── Buying Process ─── */}
      <ProcessTimeline
        heading={ph}
        fallback={{
          overline: "The Process",
          title: "How Buying Works",
          description: "A clear, transparent process from start to finish.",
        }}
        steps={processSteps}
        columns="four"
        bg="background"
      />

      {/* ─── Area Highlights ─── */}
      <CoverageAreaGrid
        heading={ch}
        fallback={{
          overline: "Where We Serve",
          title: "Explore Our Markets",
          description: "We bring local expertise to every community across our five-state coverage area.",
        }}
        areas={coverageAreas}
        bg="surface"
        interactive={true}
      />

      {/* ─── FAQ ─── */}
      {buyerFaqs.length > 0 && (
        <SectionShell bg="background" container="sm">
          <SectionHeader
            overline={fh?.overline ?? "FAQs"}
            title={fh?.title ?? "Common Buyer Questions"}
            description={fh?.description}
            className="mb-12"
          />
          <Reveal>
            <Accordion items={buyerFaqs} />
          </Reveal>
        </SectionShell>
      )}

      {/* ─── CTA ─── */}
      <CtaSection
        title={cta?.title ?? "Start Your Search Today"}
        subtitle={cta?.subtitle ?? "Browse our listings or connect with an agent to begin your home buying journey."}
        actions={[
          {
            href: safeHref(cta?.primaryButtonHref, "/listings"),
            label: cta?.primaryButtonText ?? "Browse Listings",
          },
          {
            href: safeHref(cta?.secondaryButtonHref, "#contact"),
            label: cta?.secondaryButtonText ?? "Talk to an Agent",
            variant: "minimal",
          }
        ]}
      />

      {/* ─── Contact Form ─── */}
      <PageContactSection leadSource="buy" />
    </>
  );
}
