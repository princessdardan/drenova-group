import type { Metadata } from "next";
import { getLegalPageBySlug } from "@/lib/sanity/fetch";
import { PortableTextRenderer } from "@/components/ui/portable-text";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Drenova Group terms of service — the terms and conditions governing use of our website.",
};

export default async function TermsPage() {
  const page = await getLegalPageBySlug("terms");

  if (!page) {
    return <TermsFallback />;
  }

  return (
    <div className="pt-20 lg:pt-24">
      <section className="bg-surface py-12 px-6 lg:py-16 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-3xl lg:text-5xl font-bold tracking-tight mb-2">
            {page.title}
          </h1>
          <p className="text-sm text-muted">Last updated: {page.lastUpdated}</p>
        </div>
      </section>

      <section className="bg-background py-12 px-6 lg:py-16 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <PortableTextRenderer value={page.body} />
        </div>
      </section>
    </div>
  );
}

function TermsFallback() {
  return (
    <div className="pt-20 lg:pt-24">
      <section className="bg-surface py-12 px-6 lg:py-16 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-3xl lg:text-5xl font-bold tracking-tight mb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-muted">Last updated: February 19, 2026</p>
        </div>
      </section>

      <section className="bg-background py-12 px-6 lg:py-16 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-muted leading-7">
              By accessing and using the Drenova Group website, you accept and agree to be bound
              by these Terms of Service. If you do not agree to these terms, please do not use
              our website.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight mb-3">
              2. Contact
            </h2>
            <p className="text-muted leading-7">
              For questions about these terms, please contact us at info@drenovagroup.com.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
