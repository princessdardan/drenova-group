import type { Metadata } from "next";
import Image from "next/image";
import { Hero } from "@/components/sections/hero";
import { SectionHeader } from "@/components/ui/section-header";
import { CtaSection } from "@/components/sections/cta-section";
import { PortableTextRenderer } from "@/components/ui/portable-text";
import { Reveal } from "@/components/ui/reveal";
import { StaggerChildren } from "@/components/ui/stagger-children";
import { getAboutPage } from "@/lib/sanity/fetch";
import { resolveSanityImageUrl } from "@/lib/sanity/image";
import { makeMetadata } from "@/lib/seo";
import { SectionShell } from "@/components/sections/section-shell";
import { CoverageAreaGrid } from "@/components/sections/coverage-area-grid";
import { PageContactSection } from "@/components/sections/page-contact-section";

export const metadata: Metadata = makeMetadata({
  title: "About",
  description:
    "Learn about Drenova Group — our story, mission, values, and the Ontario real estate team behind our client-first approach.",
  path: "/about",
});

export default async function AboutPage() {
  const aboutPage = await getAboutPage();

  const hero = aboutPage?.hero;
  const vh = aboutPage?.valuesHeading;
  const ch = aboutPage?.coverageHeading;
  const cta = aboutPage?.cta;
  const companyValues = aboutPage?.values ?? [];
  const coverageAreas = aboutPage?.coverageAreas ?? [];
  const companyStats = aboutPage?.stats ?? [];

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
      <SectionShell bg="background" container="none" className="relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[8rem] lg:text-[14rem] font-bold text-foreground/[0.03] uppercase whitespace-nowrap pointer-events-none select-none">
          About
        </div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          <Reveal direction="left" className="flex flex-col justify-center px-8 lg:px-16 py-16">
            <p className="text-xs uppercase tracking-widest font-medium text-accent mb-4">
              {aboutPage?.storyOverline ?? "Founded 2011"}
            </p>
            <h2 className="font-display text-3xl lg:text-5xl font-bold tracking-tight mb-6">
              {aboutPage?.storyTitle ?? "Built on Relationships, Driven by Results"}
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
                  families find their homes has grown into an Ontario real estate team
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
          </Reveal>
          <div className="relative min-h-[400px] lg:min-h-0">
            <Image
              src={resolveSanityImageUrl(aboutPage?.storyImage, { width: 1200, height: 800, fallback: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80", fit: "crop" })}
              alt={aboutPage?.storyImage?.alt ?? "Modern home interior"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </SectionShell>

      {/* ─── Mission & Values ─── */}
      <SectionShell bg="surface" container="lg">
        <SectionHeader
          overline={vh?.overline ?? "Our Values"}
          title={vh?.title ?? "What We Stand For"}
          description={vh?.description ?? "The principles that guide every interaction, negotiation, and decision we make."}
          className="mb-12"
        />
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {companyValues.map((value) => (
            <div key={value._key} className="bg-surface-alt p-6 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
              <p className="text-sm text-muted leading-6">{value.description}</p>
            </div>
          ))}
        </StaggerChildren>
      </SectionShell>

      {/* ─── Coverage Areas ─── */}
      <CoverageAreaGrid
        heading={ch}
        fallback={{
          overline: "Where We Serve",
          title: "Multi-State Coverage",
          description: "Local expertise across five states and growing.",
        }}
        areas={coverageAreas}
        bg="background"
        interactive={false}
      />

      {/* ─── Stats ─── */}
      <SectionShell bg="surface" container="md" containerClassName="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {companyStats.map((stat) => (
          <div key={stat._key}>
            <p className="font-display text-4xl lg:text-6xl font-bold tracking-tight">
              {stat.value}
            </p>
            <p className="text-sm text-muted mt-2 uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </SectionShell>

      {/* ─── CTA ─── */}
      <CtaSection
        title={cta?.title ?? "Meet Our Team"}
        subtitle={cta?.subtitle ?? "The people behind Drenova Group are what make us different."}
        actions={[
          {
            href: cta?.primaryButtonHref ?? "/team",
            label: cta?.primaryButtonText ?? "View Team",
          },
          {
            href: cta?.secondaryButtonHref ?? "#contact",
            label: cta?.secondaryButtonText ?? "Get in Touch",
            variant: "minimal",
          }
        ]}
      />

      {/* ─── Contact Form ─── */}
      <PageContactSection leadSource="about" />
    </>
  );
}
