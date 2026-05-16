import { SectionShell } from "@/components/sections/section-shell";
import { SectionHeader } from "@/components/ui/section-header";
import { StaggerChildren } from "@/components/ui/stagger-children";
import type { ProcessStep, SectionHeading } from "@/types/sanity";

interface ProcessTimelineProps {
  heading?: SectionHeading;
  fallback: { overline: string; title: string; description?: string };
  steps: ProcessStep[];
  columns?: "four" | "five";
  bg?: "background" | "surface";
}

export function ProcessTimeline({ heading, fallback, steps, columns = "four", bg = "background" }: ProcessTimelineProps) {
  if (!steps || steps.length === 0) return null;

  const gridClass = columns === "five" 
    ? "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12"
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12";

  return (
    <SectionShell bg={bg} container="lg">
      <SectionHeader
        overline={heading?.overline ?? fallback.overline}
        title={heading?.title ?? fallback.title}
        description={heading?.description ?? fallback.description}
        className="mb-12"
      />
      <StaggerChildren className={gridClass}>
        {steps.map((step) => (
          <div key={step._key}>
            <span className="font-display text-6xl lg:text-8xl font-bold text-accent/20">
              {step.stepNumber}
            </span>
            <div className="w-12 h-px bg-border mt-4 mb-6" />
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-base text-muted leading-7">{step.description}</p>
          </div>
        ))}
      </StaggerChildren>
    </SectionShell>
  );
}
