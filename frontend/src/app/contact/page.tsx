import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/sections/hero";
import { ContactForm } from "@/components/sections/contact-form";
import { getContactPage, getSiteSettings } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Drenova Group. Reach out for buying, selling, or general real estate inquiries.",
};

export default async function ContactPage() {
  const [contactPage, siteSettings] = await Promise.all([
    getContactPage(),
    getSiteSettings(),
  ]);

  const hero = contactPage?.hero;
  const quickLinks = contactPage?.quickLinks;
  const address = siteSettings?.address ?? "123 Main Street, Suite 200\nChicago, IL 60601";
  const phone = siteSettings?.phone ?? "(555) 123-4567";
  const email = siteSettings?.email ?? "info@drenovagroup.com";
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
      />

      {/* ─── Form + Office Info ─── */}
      <section className="bg-background py-16 px-6 lg:py-24 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <h2 className="font-display text-2xl lg:text-4xl font-bold tracking-tight mb-6">
              Send Us a Message
            </h2>
            <ContactForm />
          </div>

          <div>
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
          </div>
        </div>
      </section>

      {/* ─── Quick Links ─── */}
      <section className="bg-surface py-16 px-6 lg:py-24 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(quickLinks && quickLinks.length > 0 ? quickLinks : defaultQuickLinks).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group block bg-surface-alt p-8 rounded-lg border border-border hover:shadow-lg transition-shadow"
            >
              {link.overline && (
                <p className="text-xs uppercase tracking-widest font-medium text-accent mb-2">
                  {link.overline}
                </p>
              )}
              <h3 className="font-display text-xl font-bold tracking-tight mb-2">
                {link.title}
              </h3>
              {link.description && (
                <p className="text-sm text-muted">{link.description}</p>
              )}
            </Link>
          ))}
        </div>
      </section>
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
