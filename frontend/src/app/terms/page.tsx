import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Drenova Group terms of service — the terms and conditions governing use of our website.",
};

export default function TermsPage() {
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
              2. Use of Website
            </h2>
            <p className="text-muted leading-7">
              This website is provided for informational purposes and to facilitate real estate
              services. You agree to use the website only for lawful purposes and in accordance
              with these terms. You may not use the website in any way that could damage, disable,
              or impair our services.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold tracking-tight mb-3">
              3. Property Listings
            </h2>
            <p className="text-muted leading-7">
              Property listings displayed on this website are provided for informational purposes
              only. While we strive to ensure accuracy, listing data is sourced from MLS systems
              and may be subject to change without notice. Drenova Group does not guarantee the
              accuracy, completeness, or availability of any listing information.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold tracking-tight mb-3">
              4. Intellectual Property
            </h2>
            <p className="text-muted leading-7">
              All content on this website, including text, graphics, logos, images, and software,
              is the property of Drenova Group or its content suppliers and is protected by
              copyright and intellectual property laws. You may not reproduce, distribute, or
              create derivative works from any content without our express written consent.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold tracking-tight mb-3">
              5. Limitation of Liability
            </h2>
            <p className="text-muted leading-7">
              Drenova Group shall not be liable for any direct, indirect, incidental, consequential,
              or punitive damages arising from your use of this website or any services provided.
              This includes, but is not limited to, damages resulting from errors, omissions, or
              interruptions in service.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold tracking-tight mb-3">
              6. Third-Party Links
            </h2>
            <p className="text-muted leading-7">
              Our website may contain links to third-party websites. These links are provided for
              your convenience and do not signify our endorsement of such websites. We are not
              responsible for the content or privacy practices of third-party sites.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold tracking-tight mb-3">
              7. Modifications
            </h2>
            <p className="text-muted leading-7">
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting to the website. Your continued use of the website
              constitutes acceptance of the modified terms.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold tracking-tight mb-3">
              8. Governing Law
            </h2>
            <p className="text-muted leading-7">
              These terms shall be governed by and construed in accordance with the laws of the
              State of Illinois, without regard to its conflict of law provisions.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold tracking-tight mb-3">
              9. Contact
            </h2>
            <p className="text-muted leading-7">
              For questions about these terms, please contact us at info@drenovagroup.com or
              call (555) 123-4567.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
