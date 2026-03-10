import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Drenova Group privacy policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
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
        <div className="max-w-3xl mx-auto prose-custom space-y-8">
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
              3. Information Sharing
            </h2>
            <p className="text-muted leading-7">
              We may share your information with our agents and team members to provide you with
              real estate services, with service providers who assist in operating our website and
              business, and when required by law or to protect our rights.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold tracking-tight mb-3">
              4. Cookies and Tracking
            </h2>
            <p className="text-muted leading-7">
              Our website uses cookies and similar technologies to enhance your browsing experience,
              analyze site traffic, and understand usage patterns. You can control cookie preferences
              through your browser settings.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold tracking-tight mb-3">
              5. Data Security
            </h2>
            <p className="text-muted leading-7">
              We implement reasonable security measures to protect your personal information from
              unauthorized access, alteration, or destruction. However, no method of electronic
              transmission or storage is completely secure.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold tracking-tight mb-3">
              6. Your Rights
            </h2>
            <p className="text-muted leading-7">
              You have the right to access, correct, or delete your personal information. You may
              also opt out of marketing communications at any time. To exercise these rights,
              please contact us at info@drenovagroup.com.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold tracking-tight mb-3">
              7. Changes to This Policy
            </h2>
            <p className="text-muted leading-7">
              We may update this privacy policy from time to time. We will notify you of any
              material changes by posting the updated policy on our website with a revised
              effective date.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold tracking-tight mb-3">
              8. Contact Us
            </h2>
            <p className="text-muted leading-7">
              If you have questions about this privacy policy or our data practices, please
              contact us at info@drenovagroup.com or call (555) 123-4567.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
