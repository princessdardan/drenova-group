import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { LeadForm } from "@/components/sections/lead-form";
import { getHomeEvaluationPage } from "@/lib/sanity/fetch";
import { resolveSanityImageUrl } from "@/lib/sanity/image";
import { makeMetadata } from "@/lib/seo";
import { SectionShell } from "@/components/sections/section-shell";

export const metadata: Metadata = makeMetadata({
  title: "Home Evaluation",
  description:
    "Get a free, no-obligation home evaluation from Drenova Group. Discover the true value of your property in today's market.",
  path: "/home-evaluation",
});

export default async function HomeEvaluationPage() {
  const page = await getHomeEvaluationPage();

  const heroImage = resolveSanityImageUrl(page?.hero?.image, { width: 1920, height: 1080, fallback: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80", fit: "crop" });

  return (
    <>
      {/* ─── Hero ─── */}
      <Hero
        image={heroImage}
        imageAlt={page?.hero?.image?.alt ?? "Beautiful home exterior"}
        overline={page?.hero?.overline ?? "Home Evaluation"}
        title={page?.hero?.title ?? "What's Your Home Worth?"}
        subtitle={
          page?.hero?.subtitle ??
          "Get a comprehensive, data-driven valuation of your property from our local market experts."
        }
      />

      {/* ─── Form Section ─── */}
      <SectionShell id="contact" bg="background" container="sm">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight mb-6">
            {page?.formHeading ?? "Request Your Free Evaluation"}
          </h2>
          <div className="text-muted leading-7 space-y-4">
            <p>
              {page?.formDescription ??
                "Please provide us with some details about your property. One of our experienced agents will review the information and contact you shortly with a comprehensive market analysis."}
            </p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6 md:p-8 shadow-sm">
          <LeadForm source="home-evaluation" showPhone={true} />
        </div>
      </SectionShell>
    </>
  );
}
