import type { Metadata } from "next";
import Image from "next/image";
import { Hero } from "@/components/sections/hero";
import { SectionHeader } from "@/components/ui/section-header";
import { ButtonLink } from "@/components/ui/button";
import { CtaSection } from "@/components/sections/cta-section";
import { PortableTextRenderer } from "@/components/ui/portable-text";
import {
  getAboutPage,
  getCompanyStats,
  getCompanyValues,
  getCoverageAreas,
} from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/image";
import { isSanityImage } from "@/types/sanity";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Drenova Group — our story, mission, values, and the team behind our multi-state real estate brokerage.",
};

export default async function AboutPage() {
  const [aboutPage, companyStats, companyValues, coverageAreas] =
    await Promise.all([
      getAboutPage(),
      getCompanyStats(),
      getCompanyValues(),
      getCoverageAreas(),
    ]);

  const hero = aboutPage?.hero;

  return (
    <>
      {/* ─── Hero ─── */}
      <Hero
        image={hero?.image ?? "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80"}
        imageAlt={hero?.image?.alt ?? "Drenova Group office and team"}
        overline={hero?.overline ?? "Our Story"}
        title={hero?.title ?? "About Drenova Group"}
        subtitle={hero?.subtitle ?? "A modern brokerage built on integrity, innovation, and an unwavering commitment to our clients."}
      />

      {/* ─── Company Story ─── */}
      <section className="bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[8rem] lg:text-[14rem] font-bold text-foreground/[0.03] uppercase whitespace-nowrap pointer-events-none select-none">
          About
        </div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          <div className="flex flex-col justify-center px-8 lg:px-16 py-16">
            <p className="text-xs uppercase tracking-widest font-medium text-accent mb-4">
              Founded 2011
            </p>
            <h2 className="font-display text-3xl lg:text-5xl font-bold tracking-tight mb-6">
              Built on Relationships, Driven by Results
            </h2>
            {aboutPage?.storyContent ? (
              <div className="text-muted leading-7">
                <PortableTextRenderer value={aboutPage.storyContent} />
              </div>
            ) : (
              <>
                <p className="text-muted leading-7 mb-4">
                  Drenova Group was founded with a simple belief: that real estate
                  should be personal, transparent, and driven by what&apos;s best for the
                  client. What started as a single agent with a passion for helping
                  families find their homes has grown into a multi-state brokerage
                  serving hundreds of clients every year.
                </p>
                <p className="text-muted leading-7">
                  Today, our team of experienced agents operates across five states,
                  bringing local expertise and a modern approach to every transaction.
                  We combine data-driven market analysis with genuine care for our
                  clients&apos; goals — because buying or selling a home is more than a
                  transaction, it&apos;s a life milestone.
                </p>
              </>
            )}
          </div>
          <div className="relative min-h-[400px] lg:min-h-0">
            <Image
              src={
                aboutPage?.storyImage && isSanityImage(aboutPage.storyImage)
                  ? urlFor(aboutPage.storyImage).width(1200).height(800).fit("crop").url()
                  : "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80"
              }
              alt={aboutPage?.storyImage?.alt ?? "Modern home interior"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ─── Mission & Values ─── */}
      <section className="bg-surface py-16 px-6 lg:py-24 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            overline="Our Values"
            title="What We Stand For"
            description="The principles that guide every interaction, negotiation, and decision we make."
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value) => (
              <div key={value._id} className="bg-surface-alt p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted leading-6">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Coverage Areas ─── */}
      <section className="bg-background py-16 px-6 lg:py-24 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            overline="Where We Serve"
            title="Multi-State Coverage"
            description="Local expertise across five states and growing."
            className="mb-12"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {coverageAreas.map((area) => (
              <div key={area._id} className="bg-surface-alt p-6 rounded-lg border border-border text-center">
                <h3 className="font-semibold text-lg mb-1">{area.state}</h3>
                <p className="text-sm text-muted">{area.cities.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="bg-surface py-16 px-6 lg:py-24 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {companyStats.map((stat) => (
            <div key={stat._id}>
              <p className="font-display text-4xl lg:text-6xl font-bold tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm text-muted mt-2 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <CtaSection title="Meet Our Team" subtitle="The people behind Drenova Group are what make us different.">
        <ButtonLink href="/team">View Team</ButtonLink>
        <ButtonLink href="/contact" variant="minimal">
          Get in Touch
        </ButtonLink>
      </CtaSection>
    </>
  );
}
