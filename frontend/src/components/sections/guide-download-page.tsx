import Image from "next/image";
import { Hero } from "@/components/sections/hero";
import { SectionShell } from "@/components/sections/section-shell";
import { LeadForm } from "@/components/sections/lead-form";
import type { BuyersGuidePage, SellersGuidePage } from "@/types/sanity";

interface GuideDownloadPageProps {
  page: BuyersGuidePage | SellersGuidePage | null;
  source: "buyers-guide" | "sellers-guide";
  defaults: {
    heroImage: string;
    heroAlt: string;
    overline: string;
    title: string;
    subtitle: string;
    guideImage: string;
    guideAlt: string;
    guidePlaceholderTitle: string;
    guideDescription: string;
  };
}

export function GuideDownloadPage({ page, source, defaults }: GuideDownloadPageProps) {
  return (
    <>
      {/* ─── Hero ─── */}
      <Hero
        image={defaults.heroImage}
        imageAlt={page?.hero?.image?.alt ?? defaults.heroAlt}
        overline={page?.hero?.overline ?? defaults.overline}
        title={page?.hero?.title ?? defaults.title}
        subtitle={page?.hero?.subtitle ?? defaults.subtitle}
      />

      {/* ─── Guide Section with Form ─── */}
      <SectionShell id="contact" bg="background" container="md" containerClassName="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Book mockup image */}
        <div className="flex justify-center lg:justify-start">
          {defaults.guideImage ? (
            <Image
              src={defaults.guideImage}
              alt={page?.guideImage?.alt ?? defaults.guideAlt}
              width={400}
              height={533}
              className="rounded-lg shadow-lg max-w-full h-auto"
            />
          ) : (
            <div className="w-full max-w-[300px] aspect-[3/4] bg-surface border border-border rounded-lg flex items-center justify-center p-8">
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-muted mb-2">
                  Drenova Group
                </p>
                <p className="font-display text-2xl font-bold tracking-tight">
                  {defaults.guidePlaceholderTitle}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Description + Form */}
        <div>
          <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight mb-6">
            {page?.guideTitle ?? defaults.title}
          </h2>
          <div className="text-muted leading-7 space-y-4 mb-8">
            <p>
              {page?.guideDescription ?? defaults.guideDescription}
            </p>
          </div>
          <LeadForm source={source} />
        </div>
      </SectionShell>
    </>
  );
}
