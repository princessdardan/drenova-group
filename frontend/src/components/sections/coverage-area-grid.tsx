import { SectionShell } from "@/components/sections/section-shell";
import { SectionHeader } from "@/components/ui/section-header";
import { StaggerChildren } from "@/components/ui/stagger-children";
import type { CoverageArea, SectionHeading } from "@/types/sanity";

interface CoverageAreaGridProps {
  heading?: SectionHeading;
  fallback: { overline: string; title: string; description?: string };
  areas: CoverageArea[];
  bg?: "background" | "surface";
  interactive?: boolean;
}

export function CoverageAreaGrid({ heading, fallback, areas, bg = "surface", interactive = false }: CoverageAreaGridProps) {
  if (!areas || areas.length === 0) return null;

  return (
    <SectionShell bg={bg} container="lg">
      <SectionHeader
        overline={heading?.overline ?? fallback.overline}
        title={heading?.title ?? fallback.title}
        description={heading?.description ?? fallback.description}
        className="mb-12"
      />
      <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {areas.map((area) => (
          <div
            key={area._key}
            className={`bg-surface-alt p-6 rounded-lg border border-border text-center ${
              interactive ? "hover:shadow-lg transition-shadow" : ""
            }`}
          >
            <h3 className="font-semibold text-lg mb-1">{area.state}</h3>
            <p className="text-sm text-muted">{area.cities.join(", ")}</p>
          </div>
        ))}
      </StaggerChildren>
    </SectionShell>
  );
}
