import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { TeamMemberCard } from "@/components/ui/team-member-card";
import { CtaSection } from "@/components/sections/cta-section";
import { StaggerChildren } from "@/components/ui/stagger-children";
import { getTeamPage } from "@/lib/sanity/fetch";
import { makeMetadata } from "@/lib/seo";
import { safeHref } from "@/lib/safe-href";
import { SectionShell } from "@/components/sections/section-shell";
import { PageContactSection } from "@/components/sections/page-contact-section";

export const metadata: Metadata = makeMetadata({
  title: "Our Team",
  description:
    "Meet the experienced agents and advisors of Drenova Group. Our team brings local expertise and a client-first approach to every transaction.",
  path: "/team",
});

export default async function TeamPage() {
  const teamPage = await getTeamPage();

  const hero = teamPage?.hero;
  const cta = teamPage?.cta;
  const teamMembers = teamPage?.members ?? [];

  return (
    <>
      {/* ─── Hero ─── */}
      <Hero
        image={hero?.image ?? "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1600&q=80"}
        imageAlt={hero?.image?.alt ?? "Drenova Group team"}
        overline={hero?.overline}
        title={hero?.title ?? "Our Team"}
        subtitle={hero?.subtitle ?? "Experienced professionals dedicated to helping you achieve your real estate goals."}
        size="short"
        actions={[
          {
            href: safeHref(hero?.buttonHref, "#contact"),
            label: hero?.buttonText ?? "Contact Us",
            className: "border-white text-white hover:bg-white hover:text-black",
          },
          ...(hero?.secondaryButtonText ? [{
            href: safeHref(hero?.secondaryButtonHref, "/listings"),
            label: hero.secondaryButtonText,
            className: "border-white text-white hover:bg-white hover:text-black",
          }] : []),
        ]}
      />

      {/* ─── Team Grid ─── */}
      <SectionShell bg="background" container="lg">
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member._key} member={member} />
          ))}
        </StaggerChildren>
      </SectionShell>

      {/* ─── CTA ─── */}
      <CtaSection
        title={cta?.title ?? "Get in Touch"}
        subtitle={cta?.subtitle ?? "Have a question or ready to start? We'd love to hear from you."}
        actions={[
          {
            href: safeHref(cta?.primaryButtonHref, "#contact"),
            label: cta?.primaryButtonText ?? "Contact Us",
          },
          ...(cta?.secondaryButtonText ? [{
            href: safeHref(cta?.secondaryButtonHref, "/listings"),
            label: cta.secondaryButtonText,
            variant: "minimal" as const,
          }] : []),
        ]}
      />

      {/* ─── Contact Form ─── */}
      <PageContactSection leadSource="team" />
    </>
  );
}
