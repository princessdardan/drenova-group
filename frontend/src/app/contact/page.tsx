import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { ContactForm } from "@/components/sections/contact-form";
import { Reveal } from "@/components/ui/reveal";
import { StaggerChildren } from "@/components/ui/stagger-children";
import { getContactPage, getSiteSettings } from "@/lib/sanity/fetch";
import { SectionShell } from "@/components/sections/section-shell";
import { makeMetadata } from "@/lib/seo";
import { safeHref } from "@/lib/safe-href";
import { MediaCard } from "@/components/ui/media-card";

export const metadata: Metadata = makeMetadata({
  title: "Contact",
  description:
    "Get in touch with Drenova Group. Reach out for buying, selling, or general real estate inquiries.",
  path: "/contact",
});

export default async function ContactPage() {
  const [contactPage, siteSettings] = await Promise.all([
    getContactPage(),
    getSiteSettings(),
  ]);

  const hero = contactPage?.hero;
  const quickLinks = contactPage?.quickLinks;
  const address = siteSettings?.address ?? "Ontario, Canada";
  const phone = siteSettings?.phone ?? "(555) 123-4567";
  const email = siteSettings?.email ?? "semir@drenova.ca";
  const officeHours = siteSettings?.officeHours ?? "Monday – Friday: 9:00 AM – 6:00 PM\nSaturday: 10:00 AM – 4:00 PM\nSunday: By Appointment";

  return (
    <>
      {/* ─── Hero ─── */}
      <Hero
        image={hero?.image ?? "https://images.unsplash.com/photo-1600563438938-a9a27216b4f5?w=1600&q=80"}
        imageAlt={hero?.image?.alt ?? "Modern office interior"}
        overline={hero?.overline}
        title={hero?.title ?? "Get in Touch"}
        subtitle={hero?.subtitle ?? "Have a question or ready to get started? We'd love to hear from you."}
        size="short"
        actions={[
          {
            href: safeHref(hero?.buttonHref, "#contact"),
            label: hero?.buttonText ?? "Contact Us",
            className: "border-white text-white hover:bg-white hover:text-black",
          },
          ...(hero?.secondaryButtonText ? [{
            href: safeHref(hero?.secondaryButtonHref, "/listings"),
            label: hero.secondaryButtonText,
            className: "border-white text-white hover:bg-white hover:text-black",
          }] : []),
        ]}
      />

      {/* ─── Form + Office Info ─── */}
      <SectionShell id="contact" bg="background" container="lg" containerClassName="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <Reveal>
          <h2 className="font-display text-2xl lg:text-4xl font-bold tracking-tight mb-6">
            Send Us a Message
          </h2>
          <ContactForm
            templateKey="contact"
            sourcePath="/contact"
            consentText={siteSettings?.privacyMarketingConsentText}
          />
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-display text-2xl lg:text-4xl font-bold tracking-tight mb-6">
            Office Information
          </h2>
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest font-medium text-muted mb-2">
                Address
              </p>
              <p className="leading-7 whitespace-pre-line">{address}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-medium text-muted mb-2">
                Phone
              </p>
              <p>
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="hover:text-accent transition-colors">
                  {phone}
                </a>
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-medium text-muted mb-2">
                Email
              </p>
              <p>
                <a href={`mailto:${email}`} className="hover:text-accent transition-colors">
                  {email}
                </a>
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-medium text-muted mb-2">
                Office Hours
              </p>
              <p className="leading-7 whitespace-pre-line">{officeHours}</p>
            </div>
          </div>
        </Reveal>
      </SectionShell>

      {/* ─── Quick Links ─── */}
      <SectionShell bg="surface" container="md">
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(quickLinks && quickLinks.length > 0 ? quickLinks : defaultQuickLinks).map((link) => (
            <MediaCard
              key={link.href}
              href={safeHref(link.href, "/contact")}
              className="group rounded-lg border border-border hover:shadow-lg transition-shadow"
              contentClassName="p-8 lg:p-8"
              badge={link.overline && (
                <p className="text-xs uppercase tracking-widest font-medium text-accent mb-2">
                  {link.overline}
                </p>
              )}
              title={link.title}
              titleClassName="font-display text-xl font-bold tracking-tight mb-2"
              subtitle={link.description}
              subtitleClassName="text-sm text-muted mt-0"
            />
          ))}
        </StaggerChildren>
      </SectionShell>
    </>
  );
}

const defaultQuickLinks = [
  {
    overline: "For Buyers",
    title: "Looking to Buy?",
    description: "Explore our buying guide and browse available listings.",
    href: "/buy",
  },
  {
    overline: "For Sellers",
    title: "Ready to Sell?",
    description: "Learn about our selling process and request a free home valuation.",
    href: "/sell",
  },
];
