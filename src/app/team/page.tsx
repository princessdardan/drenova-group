import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { TeamMemberCard } from "@/components/ui/team-member-card";
import { CtaSection } from "@/components/sections/cta-section";
import { ButtonLink } from "@/components/ui/button";
import { teamMembers } from "@/lib/dummy-data";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the experienced agents and advisors of Drenova Group. Our team brings local expertise and a client-first approach to every transaction.",
};

export default function TeamPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <Hero
        image="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1600&q=80"
        imageAlt="Drenova Group team"
        title="Our Team"
        subtitle="Experienced professionals dedicated to helping you achieve your real estate goals."
        size="short"
      />

      {/* ─── Team Grid ─── */}
      <section className="bg-background py-16 px-6 lg:py-24 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.slug} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <CtaSection
        title="Get in Touch"
        subtitle="Have a question or ready to start? We'd love to hear from you."
      >
        <ButtonLink href="/contact">Contact Us</ButtonLink>
      </CtaSection>
    </>
  );
}
