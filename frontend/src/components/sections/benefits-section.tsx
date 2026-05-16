import { SectionShell } from "@/components/sections/section-shell";
import { SectionHeader } from "@/components/ui/section-header";
import { StaggerChildren } from "@/components/ui/stagger-children";
import type { Benefit, SectionHeading } from "@/types/sanity";

interface BenefitsSectionProps {
  heading?: SectionHeading;
  fallback: { overline: string; title: string; description?: string };
  benefits: Benefit[];
  bg?: "background" | "surface";
}

export function BenefitsSection({ heading, fallback, benefits, bg = "surface" }: BenefitsSectionProps) {
  if (!benefits || benefits.length === 0) return null;

  return (
    <SectionShell bg={bg} container="lg">
      <SectionHeader
        overline={heading?.overline ?? fallback.overline}
        title={heading?.title ?? fallback.title}
        description={heading?.description ?? fallback.description}
        className="mb-12"
      />
      <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit) => (
          <div key={benefit._key} className="bg-surface-alt p-6 lg:p-8 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
            <p className="text-muted leading-7">{benefit.description}</p>
          </div>
        ))}
      </StaggerChildren>
    </SectionShell>
  );
}
