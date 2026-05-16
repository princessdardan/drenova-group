import type { Metadata } from "next";
import { getLegalPageBySlug } from "@/lib/sanity/fetch";
import { PortableTextRenderer } from "@/components/ui/portable-text";
import { LegalPageShell } from "@/components/sections/legal-page-shell";
import { makeMetadata } from "@/lib/seo";

export const metadata: Metadata = makeMetadata({
  title: "Privacy Policy",
  description: "Drenova Group privacy policy — how we collect, use, and protect your personal information.",
});

export default async function PrivacyPage() {
  const page = await getLegalPageBySlug("privacy");

  if (!page) {
    return <PrivacyFallback />;
  }

  return (
    <LegalPageShell title={page.title} lastUpdated={page.lastUpdated}>
      <PortableTextRenderer value={page.body} />
    </LegalPageShell>
  );
}

function PrivacyFallback() {
  return (
    <LegalPageShell title="Privacy Policy" lastUpdated="February 19, 2026">
      <div className="space-y-8">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight mb-3">
            1. Information We Collect
          </h2>
          <p className="text-muted leading-7">
            We collect information you provide directly to us, such as when you fill out a
            contact form, request a property valuation, or communicate with one of our agents.
            This may include your name, email address, phone number, and details about your
            real estate needs.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight mb-3">
            2. How We Use Your Information
          </h2>
          <p className="text-muted leading-7">
            We use the information we collect to respond to your inquiries, provide real estate
            services, send you relevant property updates, improve our website and services, and
            comply with legal obligations. We do not sell your personal information to third parties.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight mb-3">
            3. Contact Us
          </h2>
          <p className="text-muted leading-7">
            If you have questions about this privacy policy or our data practices, please
            contact us at info@drenovagroup.com.
          </p>
        </div>
      </div>
    </LegalPageShell>
  );
}
