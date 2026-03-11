import type { Metadata } from "next";
import { getLegalPageBySlug } from "@/lib/sanity/fetch";
import { PortableTextRenderer } from "@/components/ui/portable-text";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Drenova Group privacy policy — how we collect, use, and protect your personal information.",
};

export default async function PrivacyPage() {
  const page = await getLegalPageBySlug("privacy");

  if (!page) {
    return <PrivacyFallback />;
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

function PrivacyFallback() {
  return (
    <div className="pt-20 lg:pt-24">
      <section className="bg-surface py-12 px-6 lg:py-16 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-3xl lg:text-5xl font-bold tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted">Last updated: February 19, 2026</p>
        </div>
      </section>

      <section className="bg-background py-12 px-6 lg:py-16 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
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
      </section>
    </div>
  );
}
