import type { Metadata } from "next";
import { getLegalPageBySlug } from "@/lib/sanity/fetch";
import { PortableTextRenderer } from "@/components/ui/portable-text";
import { LegalPageShell } from "@/components/sections/legal-page-shell";
import { makeMetadata } from "@/lib/seo";

export const metadata: Metadata = makeMetadata({
  title: "Terms of Service",
  description: "Drenova Group terms of service — the terms and conditions governing use of our website.",
  path: "/terms",
});

export default async function TermsPage() {
  const page = await getLegalPageBySlug("terms");

  if (!page) {
    return <TermsFallback />;
  }

  return (
    <LegalPageShell title={page.title} lastUpdated={page.lastUpdated}>
      <PortableTextRenderer value={page.body} />
    </LegalPageShell>
  );
}

function TermsFallback() {
  return (
    <LegalPageShell title="Terms of Service" lastUpdated="February 19, 2026">
      <div className="space-y-8">
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
            For questions about these terms, please contact us at semir@drenova.ca.
          </p>
        </div>
      </div>
    </LegalPageShell>
  );
}
